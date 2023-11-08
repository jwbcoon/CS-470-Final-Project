import {useState, useEffect} from 'react';
import DropZone from '../components/DropZone.js';
import EditCanvas from '../components/EditCanvas.js';
import API from '../interfaces/API_Interface.js';
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

export default function Viewport(props) {
    const [zoom, setZoom] = useState(1);

    return (
      <main className={styles['viewport']}>
          <DropZone setImage={props.setImage} handleFiles={handleFiles} handleZoom={handleZoom}
                    zoom={zoom} setZoom={setZoom} mask={<EditCanvas src={props.image.blobURL}/>}/>
      </main>
    );
}

