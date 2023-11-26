 how import os
import io
import base64
from urllib.parse import urlparse, parse_qs
from flask import Flask, request, jsonify, abort, Response
from flask_cors import CORS
from werkzeug.utils import secure_filename
import PIL.Image as Image
from PIL import ImageDraw

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
MEGABYTES = 1024 * 1024
EDIT_PARAMS = { 'filename': '', 'params': '' }

app = Flask(__name__) 
CORS(app, supports_credentials=True, origins='http://localhost:3000')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def entry():
    return '<p>Image processing API server engine for EditEase</p>'

@app.put('/uploads')
def uploads():
    try:
        print(request.form) # print to console in debug mode
        print(request.files) # print to console in debug mode
        print(request.url)

        if request.files: 
            img_bytes = bytearray()

            for key, byte in request.files.items(): # request.files is a dict whose values are bytes of image data
                if (key != 'filename' and key != 'edit-data'):
                    img_bytes.extend(byte.read())

            image = Image.open(io.BytesIO(img_bytes))
            image.save(os.path.join(app.config['UPLOAD_FOLDER'], request.form['filename']))

            EDIT_PARAMS['filename'] = request.form['filename']
            EDIT_PARAMS['params'] = dict(request.args)
            print('EDIT_PARAMS are', EDIT_PARAMS)

            return jsonify({'message': 'Upload successful!', 'headers': { 'Access-Control-Allow-Methods': 'PUT' }})
        else:
            return jsonify({'error': 'Image data missing from request body'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.get('/downloads/<filename>')
def downloads(filename, chunk_size=MEGABYTES):
    try:
        if type(chunk_size) is str: # convert to size in megabytes
            chunk_size = int([char for char in chunk_size.split() if char.isdigit()]) * MEGABYTES
        # generate bytes of image file 1mb at a time
        img_b64_stream = read_file_in_chunks(os.path.join(app.config['UPLOAD_FOLDER'], filename), chunk_size)
        return Response(img_b64_stream, content_type='application/octet-stream')
    except:
        abort(404) # The image wasn't found in upload folder




def read_file_in_chunks(file_path, chunk_size):
    with open(file_path, 'rb') as file:
        while chunk := file.read(chunk_size):
            yield base64.b64encode(chunk).decode('utf-8')

    '''
    Down here, Matthew can write all the code for performing edits on the application using the image 
    data received in the uploads method above, since that method saves the images to the file system.
    Then we can implement a downloads() method for the client to receive edits from
    '''


def get_image(path):
    return io.imread(path)

def get_blue_image(img):
    blue_img = img.copy()
    
    blue_img[:, :, 0] = 0  # Red channel
    blue_img[:, :, 1] = 0  # Green channel
    
    return blue_img

    #return img[:,:,2]

def get_red_image(img):
    red_img = img.copy()
    
    red_img[:, :, 1] = 0  # Green channel
    red_img[:, :, 2] = 0  # Blue channel
    
    return red_img

def get_green_image(img):
    green_img = img.copy()
    
    green_img[:, :, 0] = 0  # Red channel
    green_img[:, :, 2] = 0  # Blue channel
    
    return green_img

            elif direction == "vertical":
                draw.line([(0, line_number), (im.width, line_number)], tuple(colour), width=1)
            else:
                draw.line([(line_number, 0), (0, line_number)], tuple(colour), width=1)

            line_number += 1

    return im

def draw_gradient(im, *colours, direction="diagonal"):
    def _interpolate(start, end):
        diffs = [(t - f) / lines for f, t in zip(start, end)]
        for i in range(lines):
            yield [round(value + (diff * i)) for value, diff in zip(start, diffs)]

    draw = ImageDraw.Draw(im)

    if direction == "horizontal":
        lines = im.width // (len(colours) - 1)
    elif direction == "vertical":
        lines = im.height // (len(colours) - 1)
    else:
        lines = (im.width * 2) // len(colours)

    line_number = 0

    for i in range(len(colours) - 1):
        for colour in _interpolate(colours[i], colours[i + 1]):
            if direction == "horizontal":
                draw.line([(line_number, 0), (line_number, im.height)], tuple(colour), width=1)
            elif direction == "vertical":
                draw.line([(0, line_number), (im.width, line_number)], tuple(colour), width=1)
            else:
                draw.line([(line_number, 0), (0, line_number)], tuple(colour), width=1)

            line_number += 1

    return im

def custom_still(im, red=0, green=0, blue=0, alpha=0, direction="diagonal"):
    """
    Desc: Takes in RGBA values, and applies a single color filter over the images
    Params:
        im (PIL Image): image to be edited
        red (int): representing the intensity of the red
        green (int): representing the intensity of the green
        blue (int): representing the intensity of the blue 
        alpha (int): representing the intensity of the alpha
    Retruns:
        PIL image with the filter applied
    """
    grad = Image.new("RGBA", im.size, color=(0, 0, 0, 0))
    colours = (
        (red,   green,  blue),
        (red,   green,  blue),
        (red,   green,  blue),
        (red,   green,  blue),
        (red,   green,  blue),
        (red,   green,  blue),
    )
    grad = draw_gradient(grad, *colours, direction=direction)
    grad.putalpha(alpha)
    return Image.alpha_composite(im, grad)


def greyscale(im):
    return im.convert("L")

# this is the code I used to save the image as a jpeg
#im = Image.fromarray(get_green_image(int_img)).convert('RGB') 
#    im.save("your_file_green.jpeg")
