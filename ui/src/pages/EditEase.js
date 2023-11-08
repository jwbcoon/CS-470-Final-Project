import {useState, useEffect, useRef} from 'react';
import TopNav from '../components/TopNav.js';
import ViewPort from './Viewport.js';
import Gallery from './Gallery.js';
import MyEdits from './MyEdits.js';
import ToolBox from '../components/ToolBox.js';
import API from '../interfaces/API_Interface.js';
import styles from './EditEase.module.css';

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

export default function EditEase(props) {
    const [toolsOpen, setToolsOpen] = useState(false);
    const [rgbaInput, setRgbaInput] = useState({ current: {red: 0, green: 0, blue: 0, alpha: 0} });
    const [saveImage, setSaveImage] = useState(false);
    const [selectedPage, setSelectedPage] = useState({ element: <ViewPort user={props.user} saveImage={saveImage => saveImage} setSaveImage={setSaveImage}/>, name: 'viewport' });
    const [barOptions, setBarOptions] = useState([{child: <p>Open Tools</p>, onClick: () => setToolsOpen(toolsOpen => !toolsOpen)}]);
    const dropOptions = [
        {
            child: <p>Editor</p>,
            pageName: 'viewport',
            onClick: () => setSelectedPage({ element: <ViewPort user={props.user} saveImage={() => saveImage} setSaveImage={setSaveImage}/>, name: 'viewport' })
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
    };
    const tbRefs = useRef({red: 0, green: 0, blue: 0, alpha: 0});
  
    /*useEffect(() => {
        console.log(`RGBA update!\n${JSON.stringify(rgbaInput)}`)
    }, [rgbaInput.current.red, rgbaInput.current.green, rgbaInput.current.blue, rgbaInput.current.alpha]);*/

    useEffect(() => {
        setBarOptions(determineBarOptions([
                {
                    child: <p>Open Tools</p>,
                    onClick: () => setToolsOpen(toolsOpen => !toolsOpen)
                }
            ],
            selectedPage.name));
    }, [selectedPage.name]);

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

