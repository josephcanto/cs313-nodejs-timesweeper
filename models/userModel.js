const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL || "postgres://postgres:cs313@localhost:5000/timesweeper_test_db";
const pool = new Pool({connectionString: connectionString}); //for local testing
// const pool = new Pool({connectionString: connectionString, ssl: true});

function getUserIdByUsername(username, callback) {
    console.log("Getting info from DB for user with username " + username + "...");

    // var sql = 'SELECT id FROM users WHERE username = $1';
    var sql = 'SELECT * FROM users';
    var params = [username];

    // pool.query(sql, params, (err, result) => {
    pool.query(sql, (err, result) => {
        if(err) {
            console.log("Error in query: ");
            console.log(err);
            callback(err, null);
        }

        console.log("Found result: " + JSON.stringify(result.rows[0]));

        // callback(null, result.rows[0]);
    });
}

function getUserInfoFromDb(id, callback) {
    console.log("Getting info from DB for user with id " + id + "...");

    var sql = 'SELECT username, "password", theme FROM users WHERE id = $1::int';
    var params = [id];
    
    pool.query(sql, params, (err, result) => {
        if(err) {
            console.log("Error in query: ");
            console.log(err);
            callback(err, null);
        }

        console.log("Found result: " + JSON.stringify(result.rows));

        callback(null, result.rows);
    });
}

module.exports = {
    getUserIdByUsername: getUserIdByUsername,
    getUserInfoFromDb: getUserInfoFromDb
};