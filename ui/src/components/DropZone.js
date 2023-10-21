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

  handleFiles(files);
}


export default function DropZone(props) {
	return <div className={styles['dropzone']}
              onDragEnter={e => dragEnter(e)}
              onDragOver={e => dragOver(e)}
              onDrop={e => drop(e, props.handleFiles)}>
            <input type='file' style={{ display: 'none' }}/>
         </div>;
}
