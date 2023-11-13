import {useState, useEffect, useRef} from 'react';
import TopNav from '../components/TopNav.js';
import ToolBox from '../components/ToolBox.js';
import {useEditDataUpdate, usePageData, useUserData, useUserDataUpdate} from '../util/DataContexts.js';
import styles from './EditEase.module.css';

export default function EditEase(props) {

    function handleToolBoxInputChange(ev, tbRefs, setRgbaInput) {
        console.log('handling toolbox input change!');
        setRgbaInput({...tbRefs});
    }

    const tbRefs = useRef({red: 0, green: 0, blue: 0, alpha: 0});
    const pages = usePageData();
    const user = useUserData();
    const setUser = useUserDataUpdate();
    const updateEditData = useEditDataUpdate();

    const [toolsOpen, setToolsOpen] = useState(false);
    const [rgbaInput, setRgbaInput] = useState({ current: {red: 0, green: 0, blue: 0, alpha: 0} });
    const [selectedPage, setSelectedPage] = useState(pages['viewport']);
    const [barOptions, setBarOptions] = useState([{child: <p>Open Tools</p>, onClick: () => setToolsOpen(toolsOpen => !toolsOpen)}]);

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
                        onClick: () => updateEditData({actions: { saveImage: true }})
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
        setBarOptions(
            determineBarOptions([
                {
                    child: <p>Open Tools</p>,
                    onClick: () => setToolsOpen(toolsOpen => !toolsOpen)
                }
            ],
            selectedPage.name)
        );
    }, [selectedPage.name]);

    return (
        <div className={styles['layout']}>
            <>
                <TopNav username={user.username} options={barOptions} dropOptions={dropOptions} current={selectedPage.name}/>
                {selectedPage.element}
                {
                    toolsOpen &&
                    <ToolBox onChange={ev => handleToolBoxInputChange(ev, tbRefs, setRgbaInput)} 
                             rgbaMin={0} rgbaMax={255} ref={tbRefs}/>
                }
            </>
        </div>
    );
}

