import {useState, useEffect} from 'react';
import TopNav from '../menu/TopNav';
import ViewPort from './Viewport';
import Gallery from './Gallery';
import MyEdits from './MyEdits';
import ToolBox from '../components/ToolBox';
import API from '../API_Interface/API_Interface.js';
import styles from './EditEase.module.css';

export default function EditEase(props) {
    const [selectedPage, setSelectedPage] = useState({ element: <ViewPort/>, name: 'viewport' });
    const [toolsOpen, setToolsOpen] = useState(false);
    const navOptions = [
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
            onClick: () => setSelectedPage({ element: <MyEdits user={props.user}/>, name: 'my_edits'})
        },
        {
            child: <p>Open Tools</p>,
            pageName: '',
            onClick: () => setToolsOpen(toolsOpen === false)
        }
    ];

    return (
        <div className={styles['layout']}>
            <>
                <TopNav options={navOptions} current={selectedPage.name}/>
                {selectedPage.element}
                {toolsOpen && <ToolBox/>}
            </>
        </div>
    );
}

