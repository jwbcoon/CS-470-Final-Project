import {useState, useEffect, useRef, forwardRef} from 'react';
import TopNav from '../components/TopNav';
import ViewPort from './Viewport';
import Gallery from './Gallery';
import MyEdits from './MyEdits';
import ToolBox from '../components/ToolBox';
import API from '../API_Interface/API_Interface.js';
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

const EditEase = forwardRef(function EditEase(props, ref) {
    const [selectedPage, setSelectedPage] = useState({ element: <ViewPort/>, name: 'viewport' });
    const [toolsOpen, setToolsOpen] = useState(false);
    const [rgbaInput, setRgbaInput] = useState({ current: {red: 0, green: 0, blue: 0, alpha: 0} });
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
    const tbRefs = useRef({red: 0, green: 0, blue: 0, alpha: 0});
  
    /*useEffect(() => {
        console.log(`RGBA update!\n${JSON.stringify(rgbaInput)}`)
    }, [rgbaInput.current.red, rgbaInput.current.green, rgbaInput.current.blue, rgbaInput.current.alpha]);*/

    return (
        <div className={styles['layout']}>
            <>
                <TopNav user={props.user} options={barOptions} dropOptions={dropOptions} current={selectedPage.name}/>
                {selectedPage.element}
                {
                    toolsOpen &&
                    <ToolBox onChange={ev => handleToolBoxInputChange(ev, tbRefs, setRgbaInput)} 
                             onApply={() => applyEditChanges()} rgbaMin={0} rgbaMax={255} ref={tbRefs}/>
                }
            </>
        </div>
    );
});

export default EditEase;
