import { forwardRef } from 'react';
import styles from './DropZone.module.css';
import { useImageDataUpdate } from '../util/DataContexts.js';
import { readFile } from '../util/file_processing.js';

function dragEnter(e) {
    e.stopPropagation();
    e.preventDefault();
}

function dragOver(e) {
    e.stopPropagation();
    e.preventDefault();
}

async function drop(e, handleFiles) {
    e.stopPropagation();
    e.preventDefault();

    const dt = e.dataTransfer;
    const files = dt.files;

    handleFiles({ name: files[0].name, blob: files[0], blobURL: await readFile(files[0], 'url') });
}


export default forwardRef(function DropZone(props, ref) {

    const updateImageData = useImageDataUpdate();

    return (
        <div className={styles['dropzone']}
            onDragEnter={e => dragEnter(e)}
            onDragOver={e => dragOver(e)}
            onDrop={e => drop(e, updateImageData)}>
            <input type='file' style={{ display: 'none' }}/>
            <div id={props.maskId} className={styles['mask']} ref={ref}>
                { props.mask && props.mask /*render props.mask if it exists, or do nothing*/ }
            </div>
        </div>
    );

});

