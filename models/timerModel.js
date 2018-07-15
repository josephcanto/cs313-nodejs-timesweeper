const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL || "postgres://postgres:cs313@localhost:5432/timesweeper_test_db";
const pool = new Pool({connectionString: connectionString}); // for local testing
// const pool = new Pool({connectionString: connectionString, ssl: true});

function addTimerToDb(label, start, current, user_id, callback) {
    console.log("Adding new timer to DB for user with id " + user_id + "...");

    var sql = 'INSERT INTO timers (label, "start", "current", user_id) VALUES ($1, $2, $3, $4)';
    var params = [label, start, current, user_id];
    
    pool.query(sql, params, (err, result) => {
        if(err) {
            console.log("Error in query: ");
            console.log(err);
            callback(err, null);
        }
        console.log("Timer creation successful. " + result.rowCount + " row was modified.");
        callback(null, result.rowCount);
    });
}

function getTimersFromDb(user_id, callback) {
    console.log("Getting timers from DB for user with ID " + user_id + "...");

    var sql = 'SELECT id, label, "start", "current" FROM timers WHERE user_id = $1';
    var params = [user_id];
    
    pool.query(sql, params, (err, result) => {
        if(err) {
            console.log("Error retrieving list of timers for user with ID " + user_id + ": " + err);
            return callback(err, null);
        }
        console.log("Found the following timers for user with ID " + user_id + ": " + JSON.stringify(result.rows));
        return callback(null, result.rows);
    });
}

function editTimerInfoInDb(id, label, start, current, callback) {
    console.log("Getting info from DB for timer with id " + id + "...");

    var sql = 'UPDATE timers SET label = $2, "start" = $3, "current" = $4 WHERE id = $1';
    var params = [id, label, start, current];
    
    pool.query(sql, params, (err, result) => {
        if(err) {
            console.log("Error in query: ");
            console.log(err);
            callback(err, null);
        }
        console.log("Update successful. " + result.rowCount + " row was modified.");
        callback(null, result.rowCount);
    });
}

function deleteTimerFromDb(id, callback) {
    console.log("Deleting timer with id " + id + " from DB...");

    var sql = 'DELETE FROM timers WHERE id = $1';
    var params = [id];
    
    pool.query(sql, params, (err, result) => {
        if(err) {
            console.log("Error in query: ");
            console.log(err);
            callback(err, null);
        }
        console.log("Delete successful. " + result.rowCount + " row was modified.");
        callback(null, result.rowCount);
    });
}

module.exports = {
    addTimerToDb: addTimerToDb,
    getTimersFromDb: getTimersFromDb,
    editTimerInfoInDb: editTimerInfoInDb,
    deleteTimerFromDb: deleteTimerFromDb
};