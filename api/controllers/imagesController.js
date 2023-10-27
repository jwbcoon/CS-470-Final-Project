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

module.exports = {
    allImages,
    imagesWithUserID
};
