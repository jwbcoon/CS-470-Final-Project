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
    const [selectedPage, setSelectedPage] = useState({ element: <ViewPort/>, name: 'viewport' });
    const navOptions = [{child: <p>Editor</p>,
                         pageName: 'viewport',
                         onClick: () => handleOpenPage({ element: <ViewPort/>, name: 'viewport' }, setSelectedPage)},
                        {child: <p>Gallery</p>,
                         pageName: 'gallery',
                         onClick: () => handleOpenPage({ element: <Gallery user={props.user}/>, name: 'gallery' }, setSelectedPage)},
                        {child: <p>My Edits</p>,
                         pageName: 'my_edits',
                         onClick: () => handleOpenPage(selectedPage, setSelectedPage)}];

    return (
        <div className={styles['layout']}>
            <>
                <TopNav options={navOptions} current={selectedPage.name}/>
                {selectedPage.element}
            </>
        </div>
    );
}

