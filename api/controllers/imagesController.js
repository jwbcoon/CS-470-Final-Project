const dbConnection = require('../database/connection');
const dateFormat = import('dateformat');

function now() {
    return dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
}

const allImages = async (ctx) => {
    console.log('images allImages called.');
    return new Promise((resolve, reject) => {
        const query = `
                       SELECT *
                        FROM 
                            images
                        `;
        dbConnection.query({
            sql: query,
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in imagesController::allImages", error);
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in allImages.", err);
        // The UI side will have to look for the value of status and
        // if it is not 200, act appropriately.
        ctx.body = [];
        ctx.status = 500;
    });
}

const imagesWithUserID = (ctx) => {
    console.log('images imagesWithUserName called.');
    return new Promise((resolve, reject) => {
        const query = `
                       SELECT *
                        FROM 
                            images
                        WHERE 
                            userID = ?
                        `;
        dbConnection.query({
            sql: query,
            values: [ctx.params.userID]
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in imagesController::imagesWithUserName", error);
                ctx.body = [];
                ctx.status = 200;
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in imagesWithUserName.", err);
        // The UI side will have to look for the value of status and
        // if it is not 200, act appropriately.
        ctx.body = [];
        ctx.status = 500;
    });
}

const insertImageWithFilename = (ctx) => {
    console.log('images insertImageWithFilename called.');
    return new Promise((resolve, reject) => {
        const query = `
                       INSERT INTO images
                        (userID, fileName, filePath)
                        VALUES (?, ?, ?);
                        `;
        dbConnection.query({
            sql: query,
            values: [ctx.request.body.userID, ctx.request.body.fileName, `../userImages/${ctx.request.body.fileName}`]
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in imagesController::insertImageWithFilename", error);
                ctx.body = [];
                ctx.status = 200;
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in insertImageWithFilename.", err);
        // The UI side will have to look for the value of status and
        // if it is not 200, act appropriately.
        ctx.body = [];
        ctx.status = 500;
    });
}

const removeImageWithFilename = (ctx) => {
    console.log('images removeImageWithFilename called.');
    return new Promise((resolve, reject) => {
        const query = `
                       DELETE FROM images
                WHERE fileName = ?;
                        `;
        dbConnection.query({
            sql: query,
            values: [ctx.params.fileName]
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in imagesController::removeImageWithFilename", error);
                ctx.body = [];
                ctx.status = 200;
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in removeImageWithFilename.", err);
        // The UI side will have to look for the value of status and
        // if it is not 200, act appropriately.
        ctx.body = [];
        ctx.status = 500;
    });
}

function saveImageToLocal(ctx) {
    console.log('saving image after successfully uploading to DB');
    return new Promise((resolve, reject) => {
        // Create an anchor to download the file
        const htmlAnchor = document.createElement('a');

        // Configure download location of the blob/file
        htmlAnchor.download = `../userImages/${ctx.request.body.fileName}`;
        htmlAnchor.href = ctx.request.body.file;

        // Make anchor remove itself after 10 seconds following the contrived click action
        htmlAnchor.addEventListener('click', e => {
            setTimeout(() => document.remove(htmlAnchor), 10 * 1000);
        });

        // Click the anchor to start the download
        htmlAnchor.click();
    }, error => {
        if (error) {
            console.log('Error saving image after successful DB upload', error);
            return reject(error);
        }
        return resolve();
    });
}

module.exports = {
    allImages,
    imagesWithUserID,
    insertImageWithFilename,
    removeImageWithFilename,
    saveImageToLocal
};
