var model = require('../models/timerModel');

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
        model.getTimersFromDb(user_id, (error, result) => {
            if(error || result == null || result.length < 1) {
                response.status(500).json({success: false, data: error});
            } else {
                response.status(200).json(result);
            }
        });
    }
}

function getTimerInfo(request, response) {
    if(request.params.id != null) {
        var id = request.params.id;
        model.getTimerInfoFromDb(id, (error, result) => {
            if(error || result == null || result.length < 1) {
                response.status(500).json({success: false, data: error});
            } else {
                response.status(200).json(result);
            }
        });
    }
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

module.exports = {
    createTimer: createTimer,
    getTimers: getTimers,
    getTimerInfo: getTimerInfo,
    editTimerInfo: editTimerInfo,
    deleteTimer: deleteTimer
};