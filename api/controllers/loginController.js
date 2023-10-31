const dbConnection = require('../database/connection');
const setAccessToken = require('../config/setAccessToken');


require('dotenv').config();

const authorizeUser = async (ctx) => {
    return new Promise((resolve, reject) => {


        let query = "SELECT * FROM users WHERE username = ?";
        dbConnection.query(
            {
                sql: query,
                values: [ctx.params.username]
            }, (error, tuples) => {
                if (error) {
                    console.log("Query error.", error);
                    return reject(`Query error. Error msg: error`);
                }
                if (tuples.length === 1) {  // Did we have a matching user record?
                    setAccessToken(ctx, tuples[0]);
                    console.log('from authorizeUser. About to return ', tuples[0]);
                    ctx.body = {
                        status: "OK",
                        user: tuples[0],
                    };
                } else {
                    console.log('Not able to identify the user.');
                    ctx.body = {
                        status: "NOT OK"
                    };
                    return reject('No such user.');
                }
                return resolve();
            }
        )
    }).catch(err => {
        console.log('authorize in LoginController threw an exception. Reason...', err);
        ctx.status = 200;
        ctx.body = {
            status: "Failed",
            error: err,
            user: null
        };
    });
}

module.exports = {
    authorizeUser,
};
