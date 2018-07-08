const express = require('express');
const app = express();

var userController = require('./controllers/userController');
var timerController = require('./controllers/timerController');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Default route
app.get('/', (req, res) => res.send('index.html')); // working

// User routes
app.post('/register', userController.registerUser);
app.get('/user/:id', userController.getUserInfo); // working + able to retrieve info from DB
app.put('/user/:id', userController.editUserInfo);
app.delete('/user/:id', userController.deleteUser);
app.post('/login', userController.userLogin);
app.post('/logout', userController.userLogout);

// Timer routes
app.post('/timer', timerController.createTimer);
app.get('/timers/:user_id', timerController.getTimers); // working + able to retrieve info from DB
app.get('/timer/:id', timerController.getTimerInfo); // working + able to retrieve info from DB
app.put('/timer/:id', timerController.editTimerInfo);
app.delete('/timer/:id', timerController.deleteTimer);

app.listen(app.get('port'), function() {
    console.log('Timesweeper app listening on port:', app.get('port'));
});