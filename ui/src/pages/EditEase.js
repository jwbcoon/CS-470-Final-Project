import {useState, useEffect, forwardRef} from 'react';
import TopNav from '../components/TopNav';
import ViewPort from './Viewport';
import Gallery from './Gallery';
import MyEdits from './MyEdits';
import ToolBox from '../components/ToolBox';
import API from '../API_Interface/API_Interface.js';
import styles from './EditEase.module.css';

const EditEase = forwardRef(function EditEase(props, ref) {
    const [toolsOpen, setToolsOpen] = useState(false);
    const [saveImage, setSaveImage] = useState(false);
    const [selectedPage, setSelectedPage] = useState({ element: <ViewPort user={props.user} saveImage={saveImage => saveImage} setSaveImage={setSaveImage}/>, name: 'viewport' });
    const [barOptions, setBarOptions] = useState([{child: <p>Open Tools</p>, onClick: () => setToolsOpen(toolsOpen => !toolsOpen)}]);
    const dropOptions = [
        {
            child: <p>Editor</p>,
            pageName: 'viewport',
            onClick: () => setSelectedPage({ element: <ViewPort user={props.user} saveImage={() => saveImage}/>, name: 'viewport' })
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

    function determineBarOptions(baseOpts, pageName) {
        switch (pageName) {
            case 'viewport':
                return [
                    ...baseOpts,
                    {
                        child: <p>Save Image</p>,
                        onClick: () => setSaveImage(true)
                    },
                    {
                        child: <p>Load Image</p>,
                        onClick: () => console.log('this will do something someday!')
                    }
                ]

            default:
                return [...baseOpts];
        }
    }

    useEffect(() => {
        setBarOptions(determineBarOptions([{child: <p>Open Tools</p>, onClick: () => setToolsOpen(toolsOpen => !toolsOpen)}], selectedPage.name));
    }, [selectedPage.name]);

    return (
        <div className={styles['layout']}>
            <>
                <TopNav username={props.user.username} options={barOptions} dropOptions={dropOptions} current={selectedPage.name}/>
                {selectedPage.element}
                {toolsOpen && <ToolBox/>}
            </>
        </div>
    );
});

export default EditEase;
