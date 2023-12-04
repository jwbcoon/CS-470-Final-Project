import { useState, useEffect, useRef } from 'react';
import { readFile, arrayBufferToFormData } from '../util/file_processing.js';
import { useEditorState, useEditorStateUpdate, useImageData, useImageDataUpdate, useUserData } from '../util/DataContexts.js';
import API from '../API_Interface/API_Interface.js';

export function useStatefulRef(initialState) {

    const [state, setState] = useState(initialState);
    const ref = useRef(initialState);

    useEffect(() => {
      ref.current = state;
    }, [state]);

    return [state, setState, ref];

}


export function useImageApi(editParams, updateCanvasRef=warn('useImageApi without updateCanvasRef')) {

    const [image, editorState] = [useImageData(), useEditorState()];
    const [updateImage, updateEditorState] = [useImageDataUpdate(), useEditorStateUpdate()];
    const user = useUserData();


    // Note: console.log(JSON.stringify(data)) will always return empty even when data is there.
    // Specify a key name like "name" within a file object and the data will present itself.
    // https://stackoverflow.com/questions/11573710/event-datatransfer-files-is-empty-when-ondrop-is-fired
    async function handleFiles(data, filename=data.name) {
        console.log(`handling files! ${JSON.stringify(filename)}`);
        updateImage({ name: filename, blob: data, blobURL: await readFile(data, 'url') });
    }


    /*
    *
    * useEffect for downloading and uploading 
    * image data to the flask image processing server
    * and for sending requests to 
    * ImageController.js query methods in the 
    * Koa API
    *
    * **********************/
    useEffect(() => {

        if (!image.blob) return;

        const api = new API();

        async function putUserOriginalImage() {

            console.log(`uploading this file: ${image.name} to DB.\n Image size: ${image.blob.size}\n Image type: ${image.blob.type}`);
            api.putUserOriginalImage(user.userID, image.name)
                .then(putImageInfo => {
                    console.log(`Response from put request to database::putUserOriginalImage: ${putImageInfo.config.data}`);
                    if (putImageInfo.status === 200)
                        console.log('image save request sent!');
                    else
                        console.log('image save request failed :(');
            });
            updateEditorState({ saveImage: false });

        }


        async function uploadImageToEngine() {

            console.log(`reading ${image.name} from a blob to a file before sending to DB\nsize: ${image.blob.size}`);

            const fileArrayBuffer = await readFile(image.blob, 'buffer');
            if (!fileArrayBuffer) { console.log('failed to read image file before sending from client to server'); return; }

            const formData = await arrayBufferToFormData(fileArrayBuffer, '1mb');
            if (!formData) { console.log('failed to convert file binary into form data'); return; }

            formData.append('filename', image.name);

            console.log('uploading an image to Flask server engine');
            api.putImageToEditEngine(editParams, formData)
            .then(putImageInfo => {
                console.log(`Response from put request to engine::putImageToEditEngine: ${JSON.stringify(putImageInfo.data)}`);
                if (putImageInfo.status === 200)
                    console.log('image received by Flask server!');
                else
                    console.log('request to Flask server failed :(');
            }).catch(err => console.log(err));

        }


        async function downloadImageFromEngine() {

            console.log(`sending request to download image edits from the flask server`);
            api.getImageFromEditEngine(`tmp_edit${image.name}`) // The working copy is named tmp_edit<image.name>
            .then(getImageInfo => {

                console.log(`Response from get request to engine::getImageFromEditEngine:
                           ${JSON.stringify(getImageInfo.data)}`);
                if (getImageInfo.status === 200) {
                    console.log('image received from Flask server!\nRendering new changes');
                    // atob (ascii to binary) is an oldschool browser env method using utf-8 representation of b64
                    handleFiles(new Blob([atob(getImageInfo.data)], { type: 'image/jpeg' }), image.name);
                }
                else
                    console.log('request to Flask server failed :(');

            }).catch(err => console.log(err));
            updateEditorState({ applyChanges: false });

        }

        if (editorState.applyChanges)
            downloadImageFromEngine();
        else if (editorState.saveImage) {
            putUserOriginalImage();
            uploadImageToEngine();
        }
        else // condition when image changes and all editor states are false
            updateCanvasRef()

    }, [editorState, image]);

}
