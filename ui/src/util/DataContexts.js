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

const EditDataContext = React.createContext();
const EditDataUpdateContext = React.createContext();

export function useEditData() { return useContext(EditDataContext); }
export function useEditDataUpdate() { return useContext(EditDataUpdateContext); }

export function EditDataProvider({children}) {

    function initEditData() {
        return {
            filters: {
                rgba: {
                    red: undefined,
                    blue: undefined,
                    green: undefined,
                    alpha: undefined
                }
            },
            dims: undefined, // Add info for cropping and resizing in future?
            actions: {
                saveImage: false,
                loadImage: false
            }
        };
    }

    function updateEditData(editData, setEditData) {
        //
        //
        //    Apply edit data into a neat package. Could be difficult
        //    with implementation of refs and useImperativeHandle in
        //    ToolBox.js
        //
        //
    }

    const [editData, setEditData] = useState(initEditData);

    return (
        <EditDataContext.Provider value={editData}>
            <EditDataUpdateContext.Provider value={() => updateEditData(editData, setEditData)}>
                {children}
            </EditDataUpdateContext.Provider>
        </EditDataContext.Provider>
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

/*------------------------------------- MAIN DATA ---------------------------------------------*/ 

export default function MasterDataProvider({children}) {
    return (
        <PageDataProvider>
            <EditDataProvider>
                <ImageDataProvider>
                    {children}
                </ImageDataProvider>
            </EditDataProvider>
        </PageDataProvider>
    )
}
