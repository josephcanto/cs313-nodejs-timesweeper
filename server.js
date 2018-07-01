const express = require('express');
const app = express();
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || "psql postgres://postgres:cs313@localhost:5432/";
const pool = new Pool({connectionString: connectionString, ssl: true});

app.set('port', (process.env.PORT || 5000));

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
    console.log('Timesweeper app listening on port: ', app.get('port'));
});

// User functions
function registerUser(req, res) {
    console.log("Registering new user...");
}

function getUserInfo(req, res) {
    console.log("Retrieving user info...");
}

function editUserInfo(req, res) {
    console.log("Saving changes to user info...");
}

function deleteUser(req, res) {
    console.log("Deleting user account...");
}

function userLogin(req, res) {
    console.log("Logging user in...");
}

function userLogout(req, res) {
    console.log("Logging user out...");
}

// Timer functions
function createTimer(req, res) {
    console.log("Creating new timer...");
}

function getTimers(req, res) {
    console.log('Getting list of timers...');

    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM timers');
        res.json(result);
        client.release();
    } catch(err) {
        console.error(err);
        res.send('Error', err);
    }
    // var result = {
    //     id: 1, 
    //     label: "CS313", 
    //     start: "00:00:00", 
    //     current: "00:50:37", 
    //     user_id: req.params.user_id
    // };
    console.log("User ID is", result.user_id);
    res.json(result);
}

function getTimerInfo(req, res) {
    console.log("Retrieving timer info...");
}

function editTimerInfo(req, res) {
    console.log("Saving changes to timer info...");
}

function deleteTimer(req, res) {
    console.log("Deleting timer...");
}