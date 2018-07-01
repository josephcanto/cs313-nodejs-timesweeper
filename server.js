const express = require('express');
const app = express();
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || "postgres://postgres:cs313@localhost:5000/timesweeper_test_db";
const pool = new Pool({connectionString: connectionString}); //for local testing
// const pool = new Pool({connectionString: connectionString, ssl: true});

app.set('port', (process.env.PORT || 5000));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Default route
app.get('/', (req, res) => res.send('<h1>Timesweeper App coming soon!</h1>'));

// User routes
app.post('/register', registerUser);
app.get('/user/:id', getUserInfo);
app.put('/user/:id', editUserInfo);
app.delete('/user/:id', deleteUser);
app.post('/login', userLogin);
app.post('/logout', userLogout);

// Timer routes
app.post('/timer', createTimer);
app.get('/timers/:user_id', getTimers);
app.get('/timer/:id', getTimerInfo);
app.put('/timer/:id', editTimerInfo);
app.delete('/timer/:id', deleteTimer);

app.listen(app.get('port'), function() {
    console.log('Timesweeper app listening on port:', app.get('port'));
});

// User functions
function registerUser(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var theme = req.body.theme;
    console.log("Registering user " + username + "...");
    console.log("Password: " + password);
    console.log("Theme: " + theme);
    res.json({success: true});
}

function getUserInfo(req, res) {
    var id = req.params.id;
    console.log("Retrieving info for user with id: " + id + "...");
    res.json({username: 'webstudent', theme: 'green'});
}

function editUserInfo(req, res) {
    var id = req.params.id;
    var username = req.body.username;
    var password = req.body.password;
    console.log("Saving changes to info for user with id: " + id + "...");
    console.log("New username: " + username);
    console.log("New password: " + password);
    res.json({success: true});
}

function deleteUser(req, res) {
    var id = req.params.id;
    console.log("Deleting account for user with id: " + id + "...");
    res.json({success: true});
}

function userLogin(req, res) {
    var username = req.body.username;
    var password = req.body.username;
    console.log("Logging in user " + username + "...");
    console.log("Password: " + password);
    res.json({success: true});
}

function userLogout(req, res) {
    var id = req.body.id;
    console.log("Logging out user with id " + id + "...");
    res.json({success: true});
}

// Timer functions
function createTimer(req, res) {
    var label = req.body.label;
    var startTime = req.body.start;
    var user_id = req.body.user_id;
    console.log("Creating new timer for user with id " + user_id + "...");
    console.log("Label: " + label);
    console.log("Start time: " + startTime);
}

function getTimers(request, response) {
    if(request.params.user_id != null) {
        var user_id = request.params.user_id;
        getTimersFromDb(user_id, (error, result) => {
            if(error || result == null || result.length != 1) {
                response.status(500).json({success: false, data: error});
            } else {
                response.status(200).json(result);
            }
        });
    }
}

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

function getTimerInfo(req, res) {
    var id = req.params.id;
    console.log("Retrieving info for timer with id " + id + "...");
    res.json({label: 'CS 313', start: '00:00:00', current: '00:37:18', user_id: 2});
}

function editTimerInfo(req, res) {
    var id = req.params.id;
    var label = req.body.label;
    var startTime = req.body.start;
    var currentTime = req.body.current;
    console.log("Saving changes to info for timer with id " + id + "...");
    console.log("Label: " + label);
    console.log("Start time: " + startTime);
    console.log("Current time: " + currentTime);
    res.json({success: true});
}

function deleteTimer(req, res) {
    var id = req.params.id;
    console.log("Deleting timer with id " + id + "...");
    res.json({success: true});
}