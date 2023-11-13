import os
import io
from flask import Flask, request, jsonify
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
                if (key != 'filename' and key != 'filetype'):
                    img_bytes.extend(byte.read())

            image = Image.open(io.BytesIO(img_bytes))
            image.save(os.path.join(app.config['UPLOAD_FOLDER'], request.form['filename']))

            return jsonify({'message': 'Upload successful!', 'headers': { 'Access-Control-Allow-Methods': 'PUT' }})
        else:
            return jsonify({'error': 'Image data missing from request body'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.get('/downloads')
def download():
    pass



    '''
    Down here, Matthew can write all the code for performing edits on the application using the image 
    data received in the uploads method above, since that method saves the images to the file system.
    Then we can implement a downloads() method for the client to receive edits from
    '''
