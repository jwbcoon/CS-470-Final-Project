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
                ctx.body = [];
                ctx.status = 500;
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

const imagesWithUserID = async (ctx, next) => {
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
                ctx.status = 500;
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

const insertImageWithFilename = async (ctx, next) => {
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
                ctx.status = 500;
                return reject(error);
            }
            ctx.body = tuples;
            return resolve();
        });
    }).then(next, err => { // Execute saveImageToLocal by invoking next or catch an error if dbConnection failed
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
                ctx.status = 500;
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

const saveImageToLocal = (ctx) => {
    console.log('saving image after successfully uploading to DB');
    return new Promise((resolve, reject) => {
        require('fs').promises.writeFile(`../userImages/${ctx.request.body.fileName}`, ctx.request.body.file,
            error => {
            if (error) {
                console.log(`Error saving image after successful DB upload ${JSON.stringify(error)}`);
                ctx.status = 500;
                return reject(error);
            }
            ctx.status = 200;
            return resolve();
        });
    });
}

module.exports = {
    allImages,
    imagesWithUserID,
    insertImageWithFilename,
    removeImageWithFilename,
    saveImageToLocal
};
