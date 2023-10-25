import {useState, useEffect} from 'react';
import DropZone from '../components/DropZone';
import SideNav from '../menu/SideNav';
import API from '../API_Interface/API_Interface.js';
import styles from './EditEase.module.css';

// Note: console.log(JSON.stringify(data)) will always return empty even when data is there.
// Specify a key name like "name" within a file object and the data will present itself.
// https://stackoverflow.com/questions/11573710/event-datatransfer-files-is-empty-when-ondrop-is-fired
const handleFiles = (data, setImage) => {
    console.log(`handling files! ${JSON.stringify(data[0].name)}`);
    setImage({file: URL.createObjectURL(data[0])});
}

export default function EditEase(props) {
  const [image, setImage] = useState({file: undefined});
  
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
        <SideNav/>
        <div className={styles['viewport']}>
            <div>
            {
              image.file ? <DropZone setImage={setImage} handleFiles={handleFiles} mask={<img src={image.file}/>}/> : <DropZone setImage={setImage} handleFiles={handleFiles}/>
            }
            </div>
        </div>
		</div>
	);
}

