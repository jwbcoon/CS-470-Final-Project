import {useState, useEffect} from 'react';
import DropZone from '../components/DropZone.js';
import EditCanvas from '../components/EditCanvas.js';
import {readFile, arrayBufferToFormData} from '../util/file_processing.js';
import API from '../API_Interface/API_Interface.js';
import {useImageData, useImageDataUpdate} from '../util/DataContexts.js';
import styles from './Viewport.module.css';

const ZOOM_BASE = 0.05;

function handleZoom(ev, element, zoom, setZoom) {
    if (ev.ctrlKey) {
        console.log('in handleZoom!');
        ev.preventDefault();

        const zoomOutBoundary = 0.01, zoomInBoundary = 1000;
        const zoomScaler = z => {
            if (z > 1) {
                if (z < 10) {
                    return ZOOM_BASE * 10;
                }
                else {
                    return Math.log10(z);
                }
            }
            else {
                return ZOOM_BASE;
            }
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
    const image = useImageData();
    const updateImage = useImageDataUpdate();

    // Note: console.log(JSON.stringify(data)) will always return empty even when data is there.
    // Specify a key name like "name" within a file object and the data will present itself.
    // https://stackoverflow.com/questions/11573710/event-datatransfer-files-is-empty-when-ondrop-is-fired
    function handleFiles(data) {
        console.log(`handling files! ${JSON.stringify(data[0].name)}`);
        updateImage({blobURL: URL.createObjectURL(data[0]), blob: data[0], name: data[0].name});
    }

    useEffect(() => {
        const api = new API();

        async function uploadImage() {
            if (image.blob) {
                console.log(`reading ${image.name} from a blob to a file before sending to DB\nsize: ${image.blob.size}`);
                const fileArrayBuffer = await readFile(image.blob, 'buffer'); // Convert file to arrayBuffer
                if (!fileArrayBuffer) { console.log('failed to read image file before sending from client to server'); return; }
                const formData = await arrayBufferToFormData(fileArrayBuffer, '1mb'); // Convert arrayBuffer to formData to accomodate size caps
                if (!formData) { console.log('failed to convert file binary into form data'); return; }
                console.log(`appending filename as ${image.name} and filetype as ${image.blob.type.replace(/.*\/(.*)$/, '$1')}`);
                formData.append('filename', image.name);
                formData.append('filetype', image.blob.type.replace(/.*\/(.*)$/, '$1')); // Remove the 'image/' portion of MIMEtype string
                console.log('formdata is ');
                for (var pair of formData.entries()) {
                    console.log(pair[0]+ ', ' + (typeof pair[1] === 'object' ? `${pair[1].size} bytes` : pair[1])); 
                }

                console.log('uploading an image to Flask server engine');
                api.putImageToEditEngine(formData)
                .then(putImageInfo => {
                    console.log(`Response from put request to engine::putImageToEditEngine: ${putImageInfo.data}`);
                    if (putImageInfo.status === 200)
                        console.log('image received by Flask server!');
                    else
                        console.log('request to Flask server failed :(');
                }).catch(err => console.log(err));
            }
        }

        uploadImage();
    }, [image])

    return (
      <main className={styles['viewport']}>
          <DropZone handleFiles={handleFiles} handleZoom={handleZoom}
                    zoom={zoom} setZoom={setZoom} mask={<EditCanvas src={image.blobURL}/>}/>
      </main>
    );
}

