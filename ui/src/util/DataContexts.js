import React, {useState, useContext} from 'react';
import ViewPort from '../pages/Viewport.js';
import Gallery from '../pages/Gallery.js';
import MyEdits from '../pages/MyEdits.js';

/*------------------------------------- IMAGE DATA ---------------------------------------------*/ 

const ImageDataContext = React.createContext();
const ImageDataUpdateContext = React.createContext();

export function useImageData() { return useContext(ImageDataContext); }
export function useImageDataUpdate() { return useContext(ImageDataUpdateContext); }

export function ImageDataProvider({children}) {

    function initImageData() {
        return {
            name: undefined,
            blob: undefined,
            blobURL: undefined
        };
    }

    const [imageData, setImageData] = useState(initImageData);

    return (
        <ImageDataContext.Provider value={imageData}>
            <ImageDataUpdateContext.Provider value={setImageData}>
                {children}
            </ImageDataUpdateContext.Provider>
        </ImageDataContext.Provider>
    )
}

/*------------------------------------- EDIT DATA ---------------------------------------------*/ 

const EditorStateContext = React.createContext();
const EditorStateUpdateContext = React.createContext();

export function useEditorState() { return useContext(EditorStateContext); }
export function useEditorStateUpdate() { return useContext(EditorStateUpdateContext); }

export function EditorStateProvider({children}) {

    function initEditorState() {
        return {
            saveImage: true, // initially true to save new images when dropped in
            loadImage: false,
            applyChanges: false
        };
    }

    const [editorState, setEditorState] = useState(initEditorState);

    return (
        <EditorStateContext.Provider value={editorState}>
            <EditorStateUpdateContext.Provider value={change => setEditorState({ ...editorState, ...change })}>
                {children}
            </EditorStateUpdateContext.Provider>
        </EditorStateContext.Provider>
    )
}

/*------------------------------------- PAGE DATA ---------------------------------------------*/ 

const PageDataContext = React.createContext();
const PageDataUpdateContext = React.createContext();

export function usePageData() { return useContext(PageDataContext); }
export function usePageDataUpdate() { return useContext(PageDataUpdateContext); }

export function PageDataProvider({children}) {

    function initPages() {
        return {
            'viewport': { element: <ViewPort/>, name: 'viewport' },
            'gallery': { element: <Gallery/>, name: 'gallery' },
            'my-edits': { element: <MyEdits/>, name: 'my-edits' }
        };
    }

    const [pages, setPages] = useState(initPages);

    return (
        <PageDataContext.Provider value={pages}>
            <PageDataUpdateContext.Provider value={setPages}>
                {children}
            </PageDataUpdateContext.Provider>
        </PageDataContext.Provider>
    )
}

/*------------------------------------- USER DATA ---------------------------------------------*/ 

const UserDataContext = React.createContext();
const UserDataUpdateContext = React.createContext();

export function useUserData() { return useContext(UserDataContext); }
export function useUserDataUpdate() { return useContext(UserDataUpdateContext); }

export function UserDataProvider({children}) {
    const [user, setUser] = useState(undefined);

    return (
        <UserDataContext.Provider value={user}>
            <UserDataUpdateContext.Provider value={setUser}>
                {children}
            </UserDataUpdateContext.Provider>
        </UserDataContext.Provider>
    )
}

/*------------------------------------- MAIN DATA ---------------------------------------------*/ 

export default function MasterDataProvider({children}) {
    return (
        <PageDataProvider>
            <UserDataProvider>
                <EditorStateProvider>
                    <ImageDataProvider>
                        {children}
                    </ImageDataProvider>
                </EditorStateProvider>
            </UserDataProvider>
        </PageDataProvider>
    )
}
