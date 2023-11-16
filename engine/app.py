import os
import io
import base64
from flask import Flask, request, jsonify, abort, Response
from flask_cors import CORS
from werkzeug.utils import secure_filename
import PIL.Image as Image

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')

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

        if request.files: 
            img_bytes = bytearray()

            for key, byte in request.files.items(): # request.files is a dict whose values are bytes of image data
                if (key != 'filename'):
                    img_bytes.extend(byte.read())

            image = Image.open(io.BytesIO(img_bytes))
            image.save(os.path.join(app.config['UPLOAD_FOLDER'], request.form['filename']))

            return jsonify({'message': 'Upload successful!', 'headers': { 'Access-Control-Allow-Methods': 'PUT' }})
        else:
            return jsonify({'error': 'Image data missing from request body'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.get('/downloads/<filename>')
def download(filename, chunk_size=1024 * 1024):
    try:
        # generate bytes of image file 1mb at a time
        img_b64_stream = read_file_in_chunks(os.path.join(app.config['UPLOAD_FOLDER'], filename), chunk_size)
        return Response(img_b64_stream, content_type='image/jpeg')
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
    
    red_img[:, :, 1] = 0  # Red channel
    red_img[:, :, 2] = 0  # Green channel
    
    return red_img

def get_green_image(img):
    green_img = img.copy()
    
    green_img[:, :, 0] = 0  # Red channel
    green_img[:, :, 2] = 0  # Green channel
    
    return green_img

# this is the code I used to save the image as a jpeg
#im = Image.fromarray(get_green_image(int_img)).convert('RGB') 
#    im.save("your_file_green.jpeg")
