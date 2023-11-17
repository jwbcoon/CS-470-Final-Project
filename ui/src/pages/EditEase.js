import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useEditorStateUpdate, useImageData, usePageData, useUserData, useUserDataUpdate } from '../util/DataContexts.js';
import { useImageApi, useStatefulRef } from '../util/hooks.js';
import TopNav from '../components/TopNav.js';
import ToolBox from '../components/ToolBox.js';
import EditCanvas from '../components/EditCanvas.js';
import styles from './EditEase.module.css';

export default function EditEase(props) {

    function handleToolBoxInputChange(ev, editParams, setEditParams) {
        console.log('handling toolbox input change!\n', JSON.stringify(editParams));
        setEditParams(editParams);
    }

    function applyEditChanges(updateEditorState) {
        console.log('applying changes!');
        updateEditorState({ applyChanges: true });
    }

    const [innerCanvasState, setInnerCanvasState, innerCanvasRef] = useStatefulRef();

    const canvasPortal = useCallback(createPortal, [innerCanvasState, innerCanvasRef]);

    const image = useImageData();
    const pages = usePageData();
    const user = useUserData();
    const setUser = useUserDataUpdate();
    const updateEditorState = useEditorStateUpdate();

    const [editParams, setEditParams] = useState({red: 0, green: 0, blue: 0, alpha: 0});
    const [toolsOpen, setToolsOpen] = useState(false);
    const [selectedPage, setSelectedPage] = useState(pages['viewport']);
    const [barOptions, setBarOptions] = useState([{child: <p>Open Tools</p>, onClick: () => setToolsOpen(toolsOpen => !toolsOpen)}]);
    const [canvasDomNodeLoaded, setCanvasDomNodeLoaded] = useState(false);


    // Send editParams to flask server and update image state on edit download
    useImageApi(editParams, () => setInnerCanvasState(innerCanvasRef.current));


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
            onClick: () => {
                setSelectedPage(pages['gallery']);
                if (innerCanvasRef.current) setInnerCanvasState(innerCanvasRef.current);
            }
        },
        {
            child: <p>My Edits</p>,
            name: 'my-edits',
            onClick: () => {
                setSelectedPage(pages['my-edits']);
                if (innerCanvasRef.current) setInnerCanvasState(innerCanvasRef.current);
            }
        },
        {
            child: <p>Logout</p>,
            name: 'logout',
            onClick: () => setUser(undefined)
        }
    ];

    /*
     *
     *  Return the TopNav menu options associated with 
     *  each selectedPage option from pages
     *
     * ******************/
    function determineBarOptions(baseOpts, pageName) {
        switch (pageName) {
            case 'viewport':
                return [
                    ...baseOpts,
                    {
                        child: <p>Save Image</p>,
                        onClick: () => updateEditorState({ saveImage: true })
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
     *  and rendering the EditCanvas
     *
     * ******************/
    useEffect(() => {
        setBarOptions(
            determineBarOptions([
                {
                    child: <p>Open Tools</p>,
                    onClick: () => setToolsOpen(toolsOpen => !toolsOpen)
                }
            ],
            selectedPage.name)
        );
        setCanvasDomNodeLoaded(selectedPage === pages['viewport']);
    }, [selectedPage]);

    useEffect(() => {
        console.log(`RGBA update!\n${JSON.stringify(editParams)}`)
    }, [editParams]);

    return (
        <div className={styles['layout']}>
            <>
                <TopNav username={user.username} options={barOptions} dropOptions={dropOptions} current={selectedPage.name}/>
                {selectedPage.element}
                {
                    toolsOpen &&
                    <ToolBox onApply={() => applyEditChanges(updateEditorState)}
                             editParams={editParams} setEditParams={setEditParams}
                             rgbaMin={0} rgbaMax={255}/>
                }
                {
                    canvasDomNodeLoaded && 
                    canvasPortal(
                        <EditCanvas src={image.blobURL} ref={innerCanvasRef}/>,
                        document.getElementById('canvas-mask')
                    )
                }
            </>
        </div>
    );

}

