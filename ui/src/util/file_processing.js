
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
            reject('An invalid format was passed to readFile method of filel_processing.js');
        }
    });
}

async function arrayBufferToFormData(arrayBuffer, sliceSize, formData=null) {

    if (!formData) {
        formData = new FormData();
    }

    const subdivision = Math.min(Number(sliceSize.replace(/mb/, '')) * 1024 * 1024, arrayBuffer.byteLength);
    let count = 0, start = 0, end = subdivision;
    do {
        let readBuffer = arrayBuffer.slice(start, end);
        formData.append(`imgchunk${count}`, new Blob([readBuffer], { type: 'application/octet-stream' }));

        count += 1;
        start = end;
        end += Math.min(subdivision, arrayBuffer.byteLength - end);
    } while (end < arrayBuffer.byteLength);
    return formData;
}

export {
    readFile,
    arrayBufferToFormData
};
