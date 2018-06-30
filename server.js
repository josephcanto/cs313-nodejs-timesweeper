const express = require('express');
const app = express();
const pg = require('pg');

app.set('port', (process.env.PORT || 5000));

// Default route
app.get('/', (req, res) => res.send('<h1>Timesweeper App coming soon!</h1>'));

// User routes
// app.post('/register', registerUser);
// app.get('/user/:id', getUserInfo);
// app.put('/user/:id', editUserInfo);
// app.delete('/user/:id', deleteUser);
// app.post('/login', userLogin);
// app.post('/logout', userLogout);

// Timer routes
// app.post('/timer', createTimer);
app.get('/timers/:user_id', getTimers);
// app.get('/timer/:id', getTimerInfo);
// app.put('/timer/:id', editTimerInfo);
// app.delete('/timer/:id', deleteTimer);


app.listen(app.get('port'), function() {
    console.log('Listening on port: ', app.get('port'));
});

function getTimers(req, res) {
    console.log('Getting list of timers...');

    var result = {
        id: 1, 
        label: "CS313", 
        start: "00:00:00", 
        current: "00:50:37", 
        user_id: req.params.user_id
    };
    console.log("User ID is", result.user_id);
    res.json(result);
}