const express = require('express');
const app = express();
const session = require('express-session');

var userController = require('./controllers/userController');
var timerController = require('./controllers/timerController');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({ secret: 'super-secret', cookie: { maxAge: 3600000 }}));
app.use(logRequest);

// Default route
app.get('/', (req, res) => res.send('index.html')); // done

// User routes
app.post('/register', userController.registerUser); // done
app.get('/user/:id', userController.getUserInfo);
app.put('/user/:id', userController.editUserInfo);
app.delete('/user/:id', userController.deleteUser);
app.post('/login', userController.userLogin); // done
app.post('/logout', userController.userLogout);

// Timer routes
app.post('/timer', timerController.createTimer); // done
app.get('/timers/:user_id', storeUserId, timerController.getTimers); // done
app.put('/timer/:id', timerController.editTimerInfo); // done
app.delete('/timer/:id', timerController.deleteTimer);

app.listen(app.get('port'), function() {
    console.log('Timesweeper app listening on port:', app.get('port'));
});

function logRequest(req, res, next) {
    console.log(`Recieved a request for: ${req.url}`);
    next();
}

function storeUserId(req, res, next) {
    if(req.session.userId) {
        next();
    }
    else {
        req.session.userId = req.params.user_id;
        console.log("User id " + req.session.userId + " has been stored as a session variable for future requests");
        next();
    }
}