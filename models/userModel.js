const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL || "postgres://postgres:cs313@localhost:5432/timesweeper_test_db";
const pool = new Pool({connectionString: connectionString}); // for local testing
// const pool = new Pool({connectionString: connectionString, ssl: true});

function validateLogin(res, callback, username, password) {
    var sql = 'SELECT username, "password" FROM users WHERE username = $1';
    var params = [username];

    pool.query(sql, params, (err, result) => {
        if(err) {
            console.log("Error in query:", err);
            res.json({success: false});
        }

        console.log("Back from db with result:", result);
        if(result.rowCount > 0) {
            if(result.rows[0].username == username && result.rows[0].password == password) {
                console.log("User credentials match. Logging in user" + username + "...");
                callback(null, username, res);
            } else {
                callback("Invalid username or password.", null, res);
            }
        } else {
            res.json({success: false, message: "Invalid username or password."});
        }
    });
}

function getUserId(err, username, res) {
    if(err) {
        console.log("Error logging in:", err);
        res.json({success: false});
    }
    console.log("Getting ID from DB for user with username " + username + "...");

    var sql = 'SELECT id FROM users WHERE username = $1';
    var params = [username];

    pool.query(sql, params, (err, result) => {
        if(err) {
            console.log("Error in query:", err);
            res.json({success: false});
        }
        console.log("Back from db with result:", result);
        res.json({success: true, data: result.rows[0].id});
    });
}

function checkForExistingUsernameInDb(username, password, theme, res, callback) {
    console.log("Checking for duplicate username...");

    var sql = 'SELECT username FROM users WHERE username = $1';
    var params = [username];

    pool.query(sql, params, (err, result) => {
        if(err) {
            console.log("Error in query:", err);
            res.json({success: false});
        }
        console.log("Back from db with result:", result);
        if(result.rowCount > 0) {
            console.log("The username " + username + " is already taken");
            res.json({success: false, message: "This username is already taken. Try entering a different username."});
        } else {
            callback(username, password, theme, res);
        }
    });    
}

function addNewUserToDb(username, password, theme, res) {
    console.log("Registering new user...");

    var sql = 'INSERT INTO users (username, "password", theme) VALUES ($1, $2, $3)';
    var params = [username, password, theme];

    pool.query(sql, params, (err, result) => {
        if(err) {
            console.log("Error registering user:", err);
            res.json({success: false, message: "Error registering new user. Please try again."});
        }
        console.log("Back from db with result:", result);
        res.json({success: true});
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
    checkForExistingUsernameInDb: checkForExistingUsernameInDb,
    addNewUserToDb: addNewUserToDb,
    getUserInfoFromDb: getUserInfoFromDb
};