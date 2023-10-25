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

function drop(e, handleFiles, setImage) {
  e.stopPropagation();
  e.preventDefault();

  const dt = e.dataTransfer;
  const files = dt.files;

  handleFiles(files, setImage);
}


export default function DropZone(props) {
  const ref = useRef();

  useEffect(() => {
      const div = ref.current;
      const onWheel = (e) => props.handleZoom(e, div, props.zoom, props.setZoom);
      if (div) {
          div.addEventListener('wheel', onWheel);
      }
      return () => div.removeEventListener('wheel', onWheel);
  }, [])

	return <div className={styles['dropzone']}
              onDragEnter={e => dragEnter(e)}
              onDragOver={e => dragOver(e)}
              onDrop={e => drop(e, props.handleFiles, props.setImage)}>
            <input type='file' style={{ display: 'none' }}/>
            <div className={styles['mask']} ref={ref}>
                { props.mask }
            </div>
         </div>;
}
