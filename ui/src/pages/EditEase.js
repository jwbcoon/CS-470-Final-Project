import {useState, useEffect} from 'react';
import TopNav from '../menu/TopNav';
import ViewPort from './Viewport.js';
import Gallery from './Gallery.js';
import API from '../API_Interface/API_Interface.js';
import styles from './EditEase.module.css';

function handleOpenPage(page, setSelectedPage) {
    setSelectedPage(page);
}

export default function EditEase(props) {
    const [selectedPage, setSelectedPage] = useState(<ViewPort/>);
    const navOptions = [{child: <p>Open Tools</p>,
                         onClick: ()=>console.log('Clicked on Open Tools!')},
                        {child: <p>Save Image</p>,
                         onClick: ()=>console.log('Clicked on Save Image!')},
                        {child: <p>Import Image</p>,
                         onClick: ()=>console.log('Clicked on Import Image!')},
                        {child: <p>Upload Image</p>,
                         onClick: ()=>console.log('Clicked on Upload Image!')},
                        {child: <p>Open Gallery</p>,
                         onClick: () => handleOpenPage(<Gallery user={props.user}/>, setSelectedPage)}];

    return (
      <div className={styles['layout']}>
          <>
              <TopNav options={navOptions}/>
              {selectedPage}
          </>
      </div>
    );
}

