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
	return <div className={styles['dropzone']}
              onDragEnter={e => dragEnter(e)}
              onDragOver={e => dragOver(e)}
              onDrop={e => drop(e, props.handleFiles, props.setImage)}>
            <input type='file' style={{ display: 'none' }}/>
            { props.mask }
         </div>;
}
