var timerModel = require('../models/timerModel');

const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL || "postgres://postgres:cs313@localhost:5432/timesweeper_test_db";
const pool = new Pool({connectionString: connectionString}); // for local testing
// const pool = new Pool({connectionString: connectionString, ssl: true});

function validateLogin(req, res, callback, username, password) {
// function validateLogin(callback, username, password) {
    var sql = 'SELECT username, "password" FROM users WHERE username = $1';
    var params = [username];

    pool.query(sql, params, (err, result) => {
        if(err) {
            console.log("Error in query:", err);
            res.json({success: false});
            // return callback(err, null, timerModel.getTimersFromDb);
        }

        console.log("Back from db with result:", result);
        if(result.rows[0].username == username && result.rows[0].password == password) {
            console.log("User credentials match! Logging in user" + username + "...");
            callback(null, username, req, res);
            // return callback(null, username, timerModel.getTimersFromDb);
        } else {
            callback("Invalid username or password", null, req, res);
            // return callback("Invalid username or password", null, null);
        }
    });
}

// function getUserId(err, username, callback) {
function getUserId(err, username, req, res) {
    if(err) {
        console.log("Error logging in:", err);
        res.json({success: false});
        // return callback(err, null);
    }
    console.log("Getting ID from DB for user with username " + username + "...");

    var sql = 'SELECT id FROM users WHERE username = $1';
    var params = [username];

    pool.query(sql, params, (err, result) => {
        if(err) {
            console.log("Error in query:", err);
            // return callback(err, null);
            res.json({success: false});
        }
        console.log("Back from db with result:", result);
        // return callback(null, result.rows[0].id);
        res.json({success: true, data: result.rows[0].id});
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
    validateLogin: validateLogin,
    getUserId: getUserId,
    getUserInfoFromDb: getUserInfoFromDb
};