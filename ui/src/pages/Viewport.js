import {useState, useEffect} from 'react';
import DropZone from '../components/DropZone.js';
import EditCanvas from '../components/EditCanvas.js';
import {readFile, arrayBufferToFormData, binaryStringToBlob} from '../util/file_processing.js';
import API from '../API_Interface/API_Interface.js';
import {useEditData, useEditDataUpdate, useImageData, useImageDataUpdate, useUserData} from '../util/DataContexts.js';
import styles from './Viewport.module.css';

const ZOOM_BASE = 0.05;

function handleZoom(ev, element, zoom, setZoom) {
    if (ev.ctrlKey) {
        console.log('in handleZoom!');
        ev.preventDefault();

        const zoomOutBoundary = 0.01, zoomInBoundary = 1000;
        const zoomScaler = z => {
            if (z > 1) {
                if (z < 10)
                    return ZOOM_BASE * 10;
                else
                    return Math.log10(z);
            }
            else
                return ZOOM_BASE;
        }
        const zoomDelta = ev.deltaY > 0 ? zoom + zoomScaler(zoom) : zoom - zoomScaler(zoom);
 
        if (zoomDelta > zoomOutBoundary && zoomDelta < zoomInBoundary) {
            element.style['transform'] = `scale(${zoomDelta})`;
            setZoom(zoomDelta);
        }
    }
}


export default function Viewport(props) {

    const [zoom, setZoom] = useState(1);
    const [image, editState] = [useImageData(), useEditData()];
    const [updateImage, updateEditState] = [useImageDataUpdate(), useEditDataUpdate()];
    const user = useUserData();

    // Note: console.log(JSON.stringify(data)) will always return empty even when data is there.
    // Specify a key name like "name" within a file object and the data will present itself.
    // https://stackoverflow.com/questions/11573710/event-datatransfer-files-is-empty-when-ondrop-is-fired
    function handleFiles(data) {
        console.log(`handling files! ${JSON.stringify(data[0].name)}`);
        updateImage({ blobURL: URL.createObjectURL(data[0]), blob: data[0], name: data[0].name });
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
            updateEditState({actions: { saveImage: false }});
        }


        async function uploadImageToEngine() {
            console.log(`reading ${image.name} from a blob to a file before sending to DB\nsize: ${image.blob.size}`);

            const fileArrayBuffer = await readFile(image.blob, 'buffer');
            if (!fileArrayBuffer) { console.log('failed to read image file before sending from client to server'); return; }

            const formData = await arrayBufferToFormData(fileArrayBuffer, '1mb');
            if (!formData) { console.log('failed to convert file binary into form data'); return; }

            formData.append('filename', image.name);

            console.log('uploading an image to Flask server engine');
            api.putImageToEditEngine(formData)
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
            api.getImageFromEditEngine(image.name)
            .then(async getImageInfo => {

                console.log(`Response from get request to engine::getImageFromEditEngine:
                           ${JSON.stringify(getImageInfo.data)}`);
                if (getImageInfo.status === 200) {
                    console.log('image received from Flask server!\nRendering new changes');
                    const imgBlob = binaryStringToBlob(getImageInfo.data);
                    updateImage({name: 'temp.jpg', blob: imgBlob, blobURL: URL.createObjectURL(imgBlob)})
                }
                else
                    console.log('request to Flask server failed :(');

            }).catch(err => console.log(err));
            updateEditState({actions: { applyChanges: false }});
        }

        if (image.blob) {
            if (editState.actions.applyChanges)
                downloadImageFromEngine();
            else if (editState.actions.saveImage) {
                putUserOriginalImage();
                uploadImageToEngine();
            }
        }
    }, [editState, image]);


    return (
      <main className={styles['viewport']}>
          <DropZone handleFiles={handleFiles} handleZoom={handleZoom}
                    zoom={zoom} setZoom={setZoom} mask={<EditCanvas src={image.blobURL}/>}/>
      </main>
    );
}

