var model = require('../models/timerModel');

function createTimer(req, res) {
    var label = req.body.label;
    var startTime = req.body.start;
    var currentTime = req.body.current;
    var user_id = req.session.userId;
    model.addTimerToDb(label, startTime, currentTime, user_id, (error, result) => {
        if(error || result == null || result.length < 1) {
            res.status(500).json({success: false, data: error});
        } else {
            res.status(200).json({success: true, data: user_id});
        }
    });
}

function getTimers(request, response) {
    var user_id = request.params.user_id;
    model.getTimersFromDb(user_id, (error, result) => {
        if(error || result == null || result.length < 1) {
            response.status(500).json({success: false, data: error});
        } else {
            response.status(200).json({success: true, data: result});
        }
    });
}

function editTimerInfo(req, res) {
    var id = req.params.id;
    var label = req.body.label;
    var startTime = req.body.start;
    var currentTime = req.body.current;
    model.editTimerInfoInDb(id, label, startTime, currentTime, (error, result) => {
        if(error || result == null || result.length < 1) {
            res.status(500).json({success: false, data: error});
        } else {
            res.status(200).json({success: true, data: req.session.userId});
        }
    });
}

function deleteTimer(req, res) {
    var timerId = req.params.id;
    model.deleteTimerFromDb(timerId, (error, result) => {
        if(error || result == null || result.length < 1) {
            res.status(500).json({success: false, data: error});
        } else {
            res.status(200).json({success: true, data: req.session.userId});
        }
    });
}

module.exports = {
    createTimer: createTimer,
    getTimers: getTimers,
    editTimerInfo: editTimerInfo,
    deleteTimer: deleteTimer
};