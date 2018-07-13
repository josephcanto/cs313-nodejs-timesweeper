var model = require('../models/userModel');
var timerModel = require('../models/timerModel');

function registerUser(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var theme = req.body.theme;
    console.log("Registering user " + username + "...");
    console.log("Password: " + password);
    console.log("Theme: " + theme);
    res.json({success: true});
}

function getUserInfo(request, response) {
    if(request.params.id != null) {
        var id = request.params.id;
        getUserInfoFromDb(id, (error, result) => {
            if(error || result == null || result.length < 1) {
                response.status(500).json({success: false, data: error});
            } else {
                response.status(200).json(result);
            }
        });
    }
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
    var password = req.body.password;
    console.log("Checking credentials for user " + username + "...");
    // model.validateLogin(model.getUserId, username, password);
    model.validateLogin(req, res, model.getUserId, username, password);
    
    // if(user_id) {
        // res.json({success: true, data: user_id});
        // console.log("Getting timers for user with ID:", result.rows[0].id);
        // var timersList = timerModel.getTimersFromDb(result.rows[0].id);
        // console.log("Found the following timers for user" + username + ": " + timersList);
    // } else {
    //     console.log("Error retrieving ID for user", username);
    //     res.json({success: false});
    // }
    
    // if(timersList.rows[0]) {
    //     console.log("Timers List:", timersList.rows[0]);
    //     res.json({success: true, timers: timersList.rows[0]});
    // } else {
    //     console.log("Error retrieving timers list or no timers found");
    //     res.json({success: false});
    // }
}

function userLogout(req, res) {
    var id = req.body.id;
    console.log("Logging out user with id " + id + "...");
    res.json({success: true});
}

module.exports = {
    registerUser: registerUser,
    getUserInfo: getUserInfo,
    editUserInfo: editUserInfo,
    deleteUser: deleteUser,
    userLogin: userLogin,
    userLogout: userLogout
};