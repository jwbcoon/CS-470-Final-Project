import {useState, useEffect} from 'react';
import DropZone from '../components/DropZone';
import TopNav from '../menu/TopNav';
import EditCanvas from '../components/EditCanvas.js';
import API from '../API_Interface/API_Interface.js';
import styles from './EditEase.module.css';

const ZOOM_BASE = 0.05;

const handleZoom = (ev, element, zoom, setZoom) => {
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
const handleFiles = (data, setImage) => {
    console.log(`handling files! ${JSON.stringify(data[0].name)}`);
    setImage({file: URL.createObjectURL(data[0])});
}

export default function EditEase(props) {
    const [image, setImage] = useState({file: undefined});
    const [zoom, setZoom] = useState(1);


    /*useEffect(() => {
        const api = new API();

        async function postUserOriginalImage() {
            const postJSONResponse = await api.postUserOriginalImage(1);
            console.log(`Response from post to database::postUserOriginalImage: ${JSON.stringify(postJSONResponse)}`);
            //setEdit(postJSONResponse.data[0]);
        }

        postUserOriginalImage();
    }, [edit])*/

    return (
      <div className={styles['layout']}>
          <TopNav/>
          <div className={styles['viewport']}>
              <DropZone setImage={setImage} handleFiles={handleFiles} handleZoom={handleZoom}
                        zoom={zoom} setZoom={setZoom} mask={<EditCanvas src={image.file}/>}/>
          </div>
      </div>
    );
}

