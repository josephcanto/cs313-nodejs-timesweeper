const express = require('express');
const app = express();
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || "psql postgres://postgres:cs313@localhost:5432/";
const pool = new Pool({connectionString: connectionString, ssl: true});

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

function getTimers(request, response) {
    var id = parseInt(request.params.user_id);
    var sql = "SELECT * FROM timers WHERE user_id = $1::int";
    var params = [id];
    response.json({id: id, sql: sql, params: params});
    // console.log("Getting list of timers for user with id: " + id + "...");

    // pool.query(sql, params, (error, result) => {
    //     if(error || result == null || result.length != 1) {
    //         response.status(500).json({success: false, data: error});
    //     } else {
    //         response.status(200).json(result);
    //     }
    // });
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