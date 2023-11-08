import {useState, useEffect, useRef} from 'react';
import {readFile} from '../interfaces/py_interface.js';
import TopNav from '../components/TopNav.js';
import ViewPort from './Viewport.js';
import Gallery from './Gallery.js';
import MyEdits from './MyEdits.js';
import ToolBox from '../components/ToolBox.js';
import API from '../interfaces/API_Interface.js';
import {useImageData} from '../components/ImageDataContext.js';
import styles from './EditEase.module.css';

export default function EditEase(props) {

    function handleToolBoxInputChange(ev, tbRefs, setRgbaInput) {
        console.log('handling toolbox input change!');
        setRgbaInput({...tbRefs});
    }

    function applyEditChanges(rgbaInput) {
        console.log('applying changes!');
        // Call python methods to edit image data, then send
        // edited image to the Viewport to pass to the EditCanvas
        // 
        // Something like:
        //
        // const change = await pyMethod(...rgbaInput);
        // setChange(change);
        // 
        // Perhaps a better implementation involves interacting
        // with state of image from Viewport, but unsure how best
        // to implement that, it makes sense for image to be in Viewport
    }

    function initPages() {
        return {
            'viewport': { element: <ViewPort/>, name: 'viewport' },
            'gallery': { element: <Gallery user={props.user}/>, name: 'gallery' },
            'my-edits': { element: <MyEdits user={props.user}/>, name: 'my_edits' }
        };
    }

    const [toolsOpen, setToolsOpen] = useState(false);
    const [rgbaInput, setRgbaInput] = useState({ current: {red: 0, green: 0, blue: 0, alpha: 0} });
    const [saveImage, setSaveImage] = useState(false);
    const [pages, setPages] = useState(initPages);
    const [selectedPage, setSelectedPage] = useState(pages['viewport']);
    const [barOptions, setBarOptions] = useState([{child: <p>Open Tools</p>, onClick: () => setToolsOpen(toolsOpen => !toolsOpen)}]);

    const tbRefs = useRef({red: 0, green: 0, blue: 0, alpha: 0});
    const image = useImageData();

    /*
     *
     *  Menu options for DropNav
     *
     * **************/
    const dropOptions = [
        {
            child: <p>Editor</p>,
            name: 'viewport',
            onClick: () => setSelectedPage(pages['viewport'])
        },
        {
            child: <p>Gallery</p>,
            name: 'gallery',
            onClick: () => setSelectedPage(pages['gallery'])
        },
        {
            child: <p>My Edits</p>,
            name: 'my-edits',
            onClick: () => setSelectedPage(pages['my-edits'])
        },
        {
            child: <p>Logout</p>,
            name: 'logout',
            onClick: () => props.logout()
        }
    ];

    /*
     *
     *  Return the TopNav menu associated with 
     *  each selectedPage option
     *
     * ******************/
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
    };
  

    /*
     *
     *  useEffect for updating dynamic TopNav
     *  menu according to selectedPage state
     *
     * ******************/
    useEffect(() => {
        setBarOptions(determineBarOptions([
                {
                    child: <p>Open Tools</p>,
                    onClick: () => setToolsOpen(toolsOpen => !toolsOpen)
                }
            ],
            selectedPage.name));
    }, [selectedPage.name]);

    
    /*useEffect(() => {
        setPages({ ...pages, pages: {viewport: {element: {props: {image: image}}}} });
    }, [image]);*/


    /*
    *
    * useEffect for sending requests to 
    * ImageController.js query methods in the 
    * API
    *
    * ******************/
    useEffect(() => {
        const api = new API();

        async function putUserOriginalImage() {
            if (image.blob && saveImage) {
                console.log(`reading ${image.name} from a blob to a file before sending to DB`);
                const file = await readFile(image.blob);
                if (!file) { console.log('failed to read image file before sending from client to server'); return; }

                console.log(`uploading this file: ${image.name} to DB.\n Image size: ${image.blob.size}\n Image type: ${image.blob.type}`);
                api.putUserOriginalImage(props.user.userID, image.name, file)
                    .then(putImageInfo => {
                        console.log(`Response from put request to database::putUserOriginalImage: ${putImageInfo.config.data}`);
                        if (putImageInfo.status === 200)
                            console.log('image save request sent!');
                        else
                            console.log('image save request failed :(');
                        setSaveImage(false);
                });
            }
        }

        putUserOriginalImage();
    }, [saveImage, image.blob])

    return (
        <div className={styles['layout']}>
            <>
                <TopNav username={props.user.username} options={barOptions} dropOptions={dropOptions} current={selectedPage.name}/>
                {selectedPage.element}
                {
                    toolsOpen &&
                    <ToolBox onChange={ev => handleToolBoxInputChange(ev, tbRefs, setRgbaInput)} 
                            onApply={() => applyEditChanges()} rgbaMin={0} rgbaMax={255} ref={tbRefs}/>
                }
            </>
        </div>
    );
}

