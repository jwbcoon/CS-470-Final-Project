import { useState, useEffect, useRef } from 'react';
import DropZone from '../components/DropZone.js';
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
    const ref = useRef();

    useEffect(() => {
        const div = ref.current;
        const onWheel = (e) => handleZoom(e, div, zoom, setZoom);
        if (div)
            div.addEventListener('wheel', onWheel, { passive: false });
        return () => div.removeEventListener('wheel', onWheel);
    }, [zoom])

    return (
      <main className={styles['viewport']}>
          <DropZone handleZoom={handleZoom} zoom={zoom} setZoom={setZoom} maskId='canvas-mask' ref={ref}/>
      </main>
    );

}

