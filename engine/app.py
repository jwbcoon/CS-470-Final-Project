<<<<<<< Updated upstream
from flask import Flask 

app = Flask(__name__) 

@app.route('/')
def hello_world():
    return '<p>Hello World!</p>'
=======
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import PIL.Image as Image

UPLOAD_FOLDER = os.path.dirname(__file__)

app = Flask(__name__) 
CORS(app, supports_credentials=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def entry():
    return '<p>Image processing API server engine for EditEase</p>'

@app.put('/uploads')
def uploads():
    try:
        imgBytes = bytearray()
        formkeys = request.form.keys() # request.form is a dict of k:v pairs pointing to 4mb chunks of image data, then the filename and filetype
        if len(formkeys) > 2: # The min length is 2 for the filename and type parameters in the form
            for byte_array_index, key in enumerate(formkeys):
                if (key != 'filename' and key != 'filetype'):
                    imgBytes.append(request.form[key])
            image = Image.open(io.BytesIO(imgBytes))
            Image.save(request.form['filename'], request.form['filetype']) # Save the image

            # Example: Create a response with adequate headers
            response = jsonify({'message': 'Upload successful!'})

            # Set CORS headers
            response.headers.add('Access-Control-Allow-Origin', '*')  # Set to your specific origins in production
            response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
            response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
            response.headers.add('Access-Control-Allow-Credentials', 'true')

            return response;
        else:
            return jsonify({'error': 'Error reading form data to image'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.get('/downloads')
def download():
    print('request to return an edited file received')



    '''
    Down here, Matthew can write all the code for performing edits on the application using the image 
    data received in the uploads method above, since that method saves the images to the file system.
    Then we can implement a downloads() method for the client to receive edits from
    '''
>>>>>>> Stashed changes
