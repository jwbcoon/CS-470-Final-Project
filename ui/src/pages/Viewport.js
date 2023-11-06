import {useState, useEffect} from 'react';
import DropZone from '../components/DropZone';
import EditCanvas from '../components/EditCanvas.js';
import API from '../API_Interface/API_Interface.js';
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

// Note: console.log(JSON.stringify(data)) will always return empty even when data is there.
// Specify a key name like "name" within a file object and the data will present itself.
// https://stackoverflow.com/questions/11573710/event-datatransfer-files-is-empty-when-ondrop-is-fired
function handleFiles(data, setImage) {
    console.log(`handling files! ${JSON.stringify(data[0].name)}`);
    setImage({blobURL: URL.createObjectURL(data[0]), blob: data[0], name: data[0].name});
}

async function readFile(data) {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr);
      fr.onerror = (err) => reject(err);
      fr.readAsDataURL(data);
    });
}

export default function Viewport(props) {
    const [image, setImage] = useState({blobURL: undefined, blob: undefined, name: undefined});
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        const api = new API();

        async function putUserOriginalImage() {
            if (image.blob && props.saveImage) {
                console.log(`reading ${image.name} from a blob to a file before sending to DB`);
                const file = await readFile(image.blob);
                if (!file) return;

                console.log(`uploading this file: ${image.name} to DB.\n Image size: ${image.blob.size}\n Image type: ${image.blob.type}`);
                api.putUserOriginalImage(props.user.userID, image.name, file)
                    .then(putImageInfo => {
                        console.log(`Response from put request to database::putUserOriginalImage: ${putImageInfo.config.data}`);
                        if (putImageInfo.status === 200)
                            console.log('image save request sent!');
                        else
                            console.log('image save request failed :(');
                        props.setSaveImage(false);
                });
            }
        }

        putUserOriginalImage();
    }, [props.saveImage, image.blob])

    return (
      <main className={styles['viewport']}>
          <DropZone setImage={setImage} handleFiles={handleFiles} handleZoom={handleZoom}
                    zoom={zoom} setZoom={setZoom} mask={<EditCanvas src={image.blobURL}/>}/>
      </main>
    );
}

