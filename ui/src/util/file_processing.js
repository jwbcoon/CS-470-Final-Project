
async function readFile(data, format='url') {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.onerror = (err) => reject(err);
        switch (format) {
        case 'buffer':
            fr.readAsArrayBuffer(data);
        break;
        case 'binary':
            fr.readAsBinaryString(data);
        break;
        case 'url':
            fr.readAsDataURL(data);
        break;
        case 'string':
            fr.readAsText(data);
        break;
        default:
            reject('An invalid format was passed to readFile method of py_interface.js');
        }
    });
}

async function arrayBufferToFormData(arrayBuffer, sliceSize, formData=null) {

    if (!formData) {
        formData = new FormData();
    }

    const subdivision = Number(sliceSize.replace(/mb/, '')) * 1024 * 1024;

    let start = 0;
    let end = subdivision;
    while (end < arrayBuffer.byteLength) {
        let readBuffer = arrayBuffer.slice(start, subdivision);
        start = end;
        end = Math.min(end + subdivision, arrayBuffer.byteLength);
        formData.append(`imgchunk${count}`, new Blob([readBuffer], { type: 'application/octet-stream' }))
    }
    return formData;
}

export {
    readFile,
    arrayBufferToFormData
};
