var model = require('../models/userModel');

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
    console.log("Logging in user " + username + "...");
    console.log("Password: " + password);
    var user_id = model.getUserIdByUsername(username);
    res.json({success: true, user_id: user_id});
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