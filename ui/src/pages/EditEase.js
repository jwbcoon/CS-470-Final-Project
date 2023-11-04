import {useState, useEffect, forwardRef} from 'react';
import TopNav from '../components/TopNav';
import ViewPort from './Viewport';
import Gallery from './Gallery';
import MyEdits from './MyEdits';
import ToolBox from '../components/ToolBox';
import API from '../API_Interface/API_Interface.js';
import styles from './EditEase.module.css';

const EditEase = forwardRef(function EditEase(props, ref) {
    const [selectedPage, setSelectedPage] = useState({ element: <ViewPort/>, name: 'viewport' });
    const [toolsOpen, setToolsOpen] = useState(false);
    const dropOptions = [
        {
            child: <p>Editor</p>,
            pageName: 'viewport',
            onClick: () => setSelectedPage({ element: <ViewPort/>, name: 'viewport' })
        },
        {
            child: <p>Gallery</p>,
            pageName: 'gallery',
            onClick: () => setSelectedPage({ element: <Gallery user={props.user}/>, name: 'gallery' })
        },
        {
            child: <p>My Edits</p>,
            pageName: 'my_edits',
            onClick: () => setSelectedPage({ element: <MyEdits user={props.user}/>, name: 'my_edits' })
        },
        {
            child: <p>Logout</p>,
            pageName: 'logout',
            onClick: () => props.logout()
        }
    ];
    const barOptions = [
        {
            child: <p>Open Tools</p>,
            pageName: '',
            onClick: () => setToolsOpen(toolsOpen === false)
        }
    ];

    return (
        <div className={styles['layout']}>
            <>
                <TopNav options={barOptions} dropOptions={dropOptions} current={selectedPage.name}/>
                {selectedPage.element}
                {toolsOpen && <ToolBox/>}
            </>
        </div>
    );
});

export default EditEase;
