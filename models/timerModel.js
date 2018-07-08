const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL || "postgres://postgres:cs313@localhost:5000/timesweeper_test_db";
const pool = new Pool({connectionString: connectionString}); //for local testing
// const pool = new Pool({connectionString: connectionString, ssl: true});

function getTimersFromDb(user_id, callback) {
    console.log("Getting timers from DB for user with id " + user_id + "...");

    var sql = 'SELECT label, "start", "current" FROM timers WHERE user_id = $1::int';
    var params = [user_id];
    
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

function getTimerInfoFromDb(id, callback) {
    console.log("Getting info from DB for timer with id " + id + "...");

    var sql = 'SELECT label, "start", "current" FROM timers WHERE id = $1::int';
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
    getTimersFromDb: getTimersFromDb,
    getTimerInfoFromDb: getTimerInfoFromDb
};