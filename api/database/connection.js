var mysql = require('mysql');

var connection = mysql.createConnection({
//    debug: true,

    host: 'localhost',
    port: 3306,
    user: 'gsingh',
    password: '1234',
    database: 'edit_ease'
});

module.exports = connection;