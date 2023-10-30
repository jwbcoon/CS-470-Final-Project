import {useState, useEffect} from 'react';
import TopNav from '../menu/TopNav';
import ViewPort from './Viewport.js';
import Gallery from './Gallery.js';
import MyEdits from './MyEdits.js';
import API from '../API_Interface/API_Interface.js';
import styles from './EditEase.module.css';

function handleOpenTools() {
    
}

export default function EditEase(props) {
    const [selectedPage, setSelectedPage] = useState({ element: <ViewPort/>, name: 'viewport' });
    const navOptions = [
        {child: <p>Editor</p>,
          pageName: 'viewport',
          onClick: () => setSelectedPage({ element: <ViewPort/>, name: 'viewport' })},
        {child: <p>Gallery</p>,
          pageName: 'gallery',
          onClick: () => setSelectedPage({ element: <Gallery user={props.user}/>, name: 'gallery' })},
        {child: <p>My Edits</p>,
          pageName: 'my_edits',
          onClick: () => setSelectedPage({ element: <MyEdits user={props.user}/>, name: 'my_edits'})},
        {child: <p>Open Tools</p>,
          pageName: null,
          onClick: () => handleOpenTools()}
    ];

    return (
        <div className={styles['layout']}>
            <>
                <TopNav options={navOptions} current={selectedPage.name}/>
                {selectedPage.element}
            </>
        </div>
    );
}

