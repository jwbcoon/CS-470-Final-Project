import React, {useState, useContext} from 'react';

const ImageDataContext = React.createContext();
const ImageDataUpdateContext = React.createContext();

export function useImageData() { return useContext(ImageDataContext); }
export function useImageDataUpdate() { return useContext(ImageDataUpdateContext); }

export function ImageDataProvider({children}) {

    const [image, setImage] = useState({blobURL: undefined, blob: undefined, name: undefined});

    return (
        <ImageDataContext.Provider value={image}>
            <ImageDataUpdateContext.Provider value={setImage}>
                {children}
            </ImageDataUpdateContext.Provider>
        </ImageDataContext.Provider>
    )
}

