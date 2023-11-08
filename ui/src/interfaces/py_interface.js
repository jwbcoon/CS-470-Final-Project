//import python from 'pythonia';

async function readFile(data) {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.onerror = (err) => reject(err);
        fr.readAsDataURL(data);
    });
}

export {
    readFile
};
