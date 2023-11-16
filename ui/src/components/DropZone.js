import {useRef, useEffect} from 'react';
import styles from './DropZone.module.css';

function dragEnter(e) {
    e.stopPropagation();
    e.preventDefault();
}

function dragOver(e) {
    e.stopPropagation();
    e.preventDefault();
}

function drop(e, handleFiles) {
    e.stopPropagation();
    e.preventDefault();

    const dt = e.dataTransfer;
    const files = dt.files;

    handleFiles(files[0]);
}


export default function DropZone(props) {
    const ref = useRef();

    useEffect(() => {
        const div = ref.current;
        const onWheel = (e) => props.handleZoom(e, div, props.zoom, props.setZoom);
        if (div)
            div.addEventListener('wheel', onWheel, { passive: false });
        return () => div.removeEventListener('wheel', onWheel);
    }, [props.zoom])

    return <div className={styles['dropzone']}
                onDragEnter={e => dragEnter(e)}
                onDragOver={e => dragOver(e)}
                onDrop={e => drop(e, props.handleFiles)}>
              <input type='file' style={{ display: 'none' }}/>
              <div id={props.maskId} className={styles['mask']} ref={ref}>
                  { props.mask && props.mask /*render props.mask if it exists, or do nothing*/ }
              </div>
          </div>;
}
