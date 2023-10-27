const dbConnection = require('../database/connection');
const dateFormat = import('dateformat');

function now() {
    return dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
}

const allUsers = async (ctx) => {
    console.log('users allUsers called.');
    return new Promise((resolve, reject) => {
        const query = `
                       SELECT *
                        FROM 
                            users
                        `;
        dbConnection.query({
            sql: query,
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in usersController::allUsers", error);
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in allUsers.", err);
        // The UI side will have to look for the value of status and
        // if it is not 200, act appropriately.
        ctx.body = [];
        ctx.status = 500;
    });
}

const usersWithUserID = (ctx) => {
    console.log('users usersWithUserName called.');
    return new Promise((resolve, reject) => {
        const query = `
                       SELECT *
                        FROM 
                            users
                        WHERE 
                            userID = ?
                        `;
        dbConnection.query({
            sql: query,
            values: [ctx.params.userID]
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in usersController::usersWithUserName", error);
                ctx.body = [];
                ctx.status = 200;
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in usersWithUserName.", err);
        // The UI side will have to look for the value of status and
        // if it is not 200, act appropriately.
        ctx.body = [];
        ctx.status = 500;
    });
}

module.exports = {
    allUsers,
    usersWithUserID
};
