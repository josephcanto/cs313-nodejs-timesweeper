const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL || "postgres://postgres:cs313@localhost:5432/timesweeper_test_db";
const pool = new Pool({connectionString: connectionString}); // for local testing
// const pool = new Pool({connectionString: connectionString, ssl: true});

function getTimersFromDb(user_id, callback) {
    console.log("Getting timers from DB for user with ID " + user_id + "...");

    var sql = 'SELECT label, "start", "current" FROM timers WHERE user_id = $1';
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

function getTimerInfoFromDb(id, callback) {
    console.log("Getting info from DB for timer with id " + id + "...");

    var sql = 'SELECT label, "start", "current" FROM timers WHERE id = $1';
    var params = [id];
    
    pool.query(sql, params, (err, result) => {
        if(err) {
            console.log("Error in query: ");
            console.log(err);
            callback(err, null);
        }
        console.log("Found result:", JSON.stringify(result.rows[0]));
        callback(null, result.rows[0]);
    });
}

module.exports = {
    getTimersFromDb: getTimersFromDb,
    getTimerInfoFromDb: getTimerInfoFromDb
};