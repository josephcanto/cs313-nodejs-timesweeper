// The function below was borrowed from: https://stackoverflow.com/questions/8567114/how-to-make-an-ajax-call-without-jquery
function callAjax(action, url, data, callback) {
    var xmlhttp;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && (xmlhttp.status == 200 || xmlhttp.status == 201 || xmlhttp.status == 204)) {
            if(callback) {
                callback(xmlhttp.responseText);
            }
        }
    }
    xmlhttp.open(action, url, true);
    if(action === 'GET' || action === 'DELETE') {
        xmlhttp.send();
    } else if(action === 'POST' || action === 'PUT') {
        xmlhttp.setRequestHeader('Content-type', 'application/json');
        xmlhttp.send(JSON.stringify(data));
    }
}

/* User-related functions */

function performLogin() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    if(username && password) {
        var url = '/login';
        var userData = {"username": username, "password": password};
        callAjax("POST", url, userData, getTimers);
    } else {
        document.getElementById('notice').innerText = "Please fill out all form fields.";
    }
}

function showLogin() {
    document.getElementById('login-page').style.display = 'block';
    document.getElementById('notice').innerText = '';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.title = 'Login | Timesweeper';
}

function hideLogin() {
    document.getElementById('login-page').style.display = 'none';
}

function registerUser() {
    console.log('Registering user...');
    var username = document.getElementById('reg-username').value;
    var password = document.getElementById('reg-password').value;
    var theme = document.getElementById('reg-theme').value.toLowerCase();
    if(username && password && theme !== "choose theme") {
        var url = '/register';
        var userData = {"username": username, "password": password, "theme": theme};
        console.log(userData);
        callAjax("POST", url, userData, (response) => {
            var json = JSON.parse(response);
            if(!json.success && json.message) {
                document.getElementById('message').innerText = json.message;
            } else {
                hideRegistration();
                showDashboard();
            }
        });
    } else {
        document.getElementById('message').innerText = "Please fill out all form fields.";
    }
}

function showRegistration() {
    hideLogin();
    document.getElementById('registration-page').style.display = 'block';
    document.getElementById('message').innerText = '';
    document.getElementById('reg-username').value = '';
    document.getElementById('reg-password').value = '';
    document.getElementById('reg-theme').value = 'Choose Theme';
    document.title = 'Register | Timesweeper';
}

function hideRegistration(action) {
    document.getElementById('registration-page').style.display = 'none';
    if(action) showLogin();
}

function showDashboard() {
    document.getElementById('dashboard-page').classList.remove('hide');
    document.getElementById('dashboard-page').style.display = 'block';
    document.title='Dashboard | Timesweeper';
    document.getElementById('edit-mode-link').style.display = 'flex';
    document.getElementById('add-new-link').style.display = 'block';
}

function hideDashboard() {
    document.getElementById('dashboard-page').classList.add('hide');
    document.getElementById('dashboard-page').style.display = 'none';
}

/* End of user-related functions */

/**********************************************************************/

/* Timer-related functions */

function showCreateTimerPage() {
    hideDashboard();
    document.getElementById('edit-mode-link').setAttribute('onclick', 'hideCreateTimerPage()');
    document.getElementById('edit-mode-link').innerText = 'Cancel';
    document.getElementById('app-title').innerText = 'Create Timer';
    document.getElementById('add-new-link').style.visibility = 'hidden';
    document.getElementById('create-timer-page').style.display = 'block';
}

function hideCreateTimerPage() {
    document.getElementById('create-timer-page').style.display = 'none';
    document.getElementById('edit-mode-link').setAttribute('onclick', 'toggleDeleteBtns()');
    if(document.getElementsByClassName('delete-button')[0] != null) {
        if(document.getElementsByClassName('delete-button')[0].style.display == 'flex') {
            document.getElementById('edit-mode-link').innerText = 'Done';
        } else {
            document.getElementById('edit-mode-link').innerText = 'Edit';
        }
    } 
    document.getElementById('app-title').innerText = 'Timesweeper';
    document.getElementById('add-new-link').style.visibility = 'visible';
    showDashboard();
}

function createTimer() {
    var timerLabel = document.getElementById('new-label').value;
    var startTime = document.getElementById('new-start').value;
    var currentTime;
    if(document.getElementById('timer-type').value == 'Stopwatch') {
        currentTime = "00:00:00";
    } else {
        currentTime = startTime;
    }
    console.log("Timer label:", timerLabel, "Start time:", startTime, "Current time:", currentTime);
    document.getElementById('type-placeholder').hidden = false;
    document.getElementById('timer-type').selectedIndex = 0;
    document.getElementById('new-label').value = '';
    document.getElementById('new-start').value = '';

    hideCreateTimerPage();
    
    var url = '/timer';
    var timerData = {
        "label": timerLabel,
        "start": startTime,
        "current": currentTime
    }
    callAjax("POST", url, timerData, getTimers);
}

function getTimers(response) {
    var json = JSON.parse(response);
    if(json.success) {
        hideLogin();
        showDashboard();
        var user_id = json.data;
        var url = '/timers/' + user_id;
        callAjax("GET", url, null, buildTimerList);
    } else {
        document.getElementById('notice').innerText = json.message;
    }
}

function enableEdit(timers) {
    for(var i = 0; i < timers.length; i++) {
        timers[i].firstChild.nextSibling.setAttribute('onclick', 'showTimerEditPage(this)');
        timers[i].firstChild.nextSibling.style.cursor = 'pointer';
    }
}

function disableEdit(timers) {
    for(var i = 0; i < timers.length; i++) {
        timers[i].firstChild.nextSibling.setAttribute('onclick', '');
        timers[i].firstChild.nextSibling.style.cursor = 'default';
    }
}

function showTimerEditPage(element) {
    document.getElementById('dashboard-page').style.display = 'none';
    document.getElementById('edit-mode-link').setAttribute('onclick', 'hideTimerEditPage()');
    document.getElementById('edit-mode-link').innerText = 'Cancel';
    document.getElementById('app-title').innerText = 'Edit Timer';
    document.getElementById('add-new-link').style.visibility = 'hidden';
    document.getElementById('edit-timer-page').style.display = 'block';
    document.getElementById('edit-label').value = element.firstChild.innerText;
    document.getElementById('edit-start').value = element.parentElement.getAttribute('data-timer-start');
    document.getElementById('edit-current').value = element.lastChild.innerText;
    document.getElementById('timer-id').value = element.parentElement.getAttribute('data-timer-id');
}

function hideTimerEditPage() {
    document.getElementById('edit-timer-page').style.display = 'none';
    document.getElementById('edit-mode-link').setAttribute('onclick', 'toggleDeleteBtns()');
    document.getElementById('edit-mode-link').innerText = 'Done';
    document.getElementById('app-title').innerText = 'Timesweeper';
    document.getElementById('add-new-link').style.visibility = 'visible';
    document.getElementById('dashboard-page').style.display = 'block';
}

function editTimer() {
    var timerLabel = document.getElementById('edit-label').value;
    var startTime = document.getElementById('edit-start').value;
    var currentTime = document.getElementById('edit-current').value;
    var timerId = document.getElementById('timer-id').value;
    console.log("Timer label:", timerLabel, "Start time:", startTime, "Current time:", currentTime, "Timer ID:", timerId);
    hideTimerEditPage();
    
    var url = '/timer/' + timerId;
    var timerData = {
        "label": timerLabel,
        "start": startTime,
        "current": currentTime,
        "id": timerId
    }
    callAjax("PUT", url, timerData, getTimers);
}

function showDeleteTimerPage(element) {
    hideDashboard();
    document.getElementById('edit-mode-link').setAttribute('onclick', 'hideDeleteTimerPage()');
    document.getElementById('edit-mode-link').innerText = 'Cancel';
    document.getElementById('app-title').innerText = 'Delete Timer';
    document.getElementById('add-new-link').style.visibility = 'hidden';
    document.getElementById('delete-label').value = element.nextSibling.firstChild.innerText;
    document.getElementById('delete-start').value = element.parentElement.getAttribute('data-timer-start');
    document.getElementById('delete-current').value = element.nextSibling.lastChild.innerText;
    document.getElementById('delete-timer-id').value = element.parentElement.getAttribute('data-timer-id');
    document.getElementById('delete-timer-page').style.display = 'block';
}

function hideDeleteTimerPage() {
    document.getElementById('delete-timer-page').style.display = 'none';
    document.getElementById('edit-mode-link').setAttribute('onclick', 'toggleDeleteBtns()');
    document.getElementById('edit-mode-link').innerText = 'Done';
    document.getElementById('app-title').innerText = 'Timesweeper';
    document.getElementById('add-new-link').style.visibility = 'visible';
    showDashboard();
}

function deleteTimer() {
    var timerId = document.getElementById('delete-timer-id').value;
    hideDeleteTimerPage();
    
    var url = '/timer/' + timerId;
    callAjax("DELETE", url, null, getTimers);
}

function buildTimerList(response) {
    var timerList = document.getElementById('timer-list');
    timerList.style.display = 'block';

    var json = JSON.parse(response);

    if(json.error) {
        console.log("No timers were found for this user.");
    } else {
        timerList.innerText = '';
        timerList.style.textAlign = 'left';
        
        var timer, 
        timerLabels, 
        label, 
        currentTime,
        startPauseResumeBtn,
        controlBtns,
        resetBtn,
        deleteBtn;
    
        for(var i = 0; i < json.data.length; i++) {
            timer = document.createElement('div');
            timer.setAttribute('class', 'timer');
            timer.setAttribute('data-timer-num', i);
            timer.setAttribute('data-timer-id', json.data[i].id);
            timer.setAttribute('data-timer-start', json.data[i].start);

            deleteBtn = document.createElement('div');
            deleteBtn.setAttribute('class', 'delete-button');
            deleteBtn.innerText = '–';
            deleteBtn.setAttribute('onclick', 'showDeleteTimerPage(this)');
    
            timerLabels = document.createElement('div');
            timerLabels.setAttribute('class', 'timer-labels');
            label = document.createElement('span');
            label.setAttribute('class', 'label');
            currentTime = document.createElement('span');
            currentTime.setAttribute('class', 'time');

            controlBtns = document.createElement('div');
            controlBtns.setAttribute('class', 'control-buttons');
            resetBtn = document.createElement('button');
            resetBtn.innerText = 'Reset';
            resetBtn.setAttribute('class', 'reset-button');
            resetBtn.setAttribute('onclick', 'resetCurrentTime(this, '+ i + ')');

            startPauseResumeBtn = document.createElement('button');
            startPauseResumeBtn.setAttribute('class', 'start-pause-resume-button');
            startPauseResumeBtn.setAttribute('onclick', 'changeBtnText(this)');

            if(json.data[i].current != "00:00:00") {
                timer.classList.add('active-timer');
                startPauseResumeBtn.innerText = 'Resume';
                startPauseResumeBtn.setAttribute('data-timer-state', 'paused');
                startPauseResumeBtn.style.backgroundColor = '#0087d0';
                startPauseResumeBtn.style.color = 'white';
                resetBtn.style.display = 'block';
            } else {
                startPauseResumeBtn.innerText = 'Start';
                startPauseResumeBtn.setAttribute('data-timer-state', 'untouched');
            }
    
            label.innerHTML = json.data[i].label;
            currentTime.innerHTML = json.data[i].current;
            timerLabels.appendChild(label);
            timerLabels.appendChild(currentTime);
            controlBtns.appendChild(resetBtn);
            controlBtns.appendChild(startPauseResumeBtn);
            timer.appendChild(deleteBtn);
            timer.appendChild(timerLabels);
            timer.appendChild(controlBtns);
            timerList.appendChild(timer);

            if(document.getElementById('edit-mode-link').innerText == 'Done') {
                toggleDeleteBtns();
            }
        }
    }
}

function toggleDeleteBtns() {
    var editLink = document.getElementById('edit-mode-link');
    var deleteBtns = document.getElementsByClassName('delete-button');
    var timers = document.getElementsByClassName('timer');
    var controlBtns = document.getElementsByClassName('control-buttons');
    var resetBtns = document.getElementsByClassName('reset-button');
    var startPauseResumeBtns = document.getElementsByClassName('start-pause-resume-button');

    if(editLink.innerText == 'Edit') {
        for(var i = 0; i < timers.length; i++) {
            controlBtns[i].style.visibility = 'hidden';
            resetBtns[i].style.display = 'none';
        }

        for(var i = 0; i < deleteBtns.length; i++) {
            deleteBtns[i].style.display = "flex";
        }
        editLink.innerText = 'Done';
        enableEdit(timers);
    } else if(editLink.innerText == 'Done') {
        for(var i = 0; i < timers.length; i++) {
            controlBtns[i].style.visibility = 'visible';
            if(startPauseResumeBtns[i].getAttribute('data-timer-state') == 'paused') {
                resetBtns[i].style.display = 'block';
            }
        }

        for(var i = 0; i < deleteBtns.length; i++) {
            deleteBtns[i].style.display = "none";
        }
        editLink.innerText = 'Edit';
        disableEdit(timers);
    }
}

function resetCurrentTime(element, timerNum) {
    console.log("Reset time:", document.getElementsByClassName('time')[timerNum].innerText);
    element.parentElement.parentElement.classList.remove('active-timer');
    element.parentElement.previousSibling.lastChild.innerText = "00:00:00";
    document.getElementsByClassName('reset-button')[timerNum].style.display = 'none';
    var startPauseResumeBtn = document.getElementsByClassName('start-pause-resume-button')[timerNum];
    startPauseResumeBtn.innerText = 'Start';
    startPauseResumeBtn.setAttribute('data-timer-state', 'untouched');
    startPauseResumeBtn.style.backgroundColor = 'white';
    startPauseResumeBtn.style.color = '#0087d0';
    
    var timerLabel = element.parentElement.previousSibling.firstChild.innerText;
    var startTime = element.parentElement.parentElement.getAttribute('data-timer-start');
    var currentTime = element.parentElement.previousSibling.lastChild.innerText;
    var timerId = element.parentElement.parentElement.getAttribute('data-timer-id');
    var url = '/timer/' + timerId;
    var timerData = {
        "label": timerLabel,
        "start": startTime,
        "current": currentTime,
        "id": timerId
    }
    callAjax("PUT", url, timerData, getTimers);
}

function changeBtnText(element) {
    var timeLabel = element.parentElement.previousSibling.lastChild;
    var timer = element.parentElement.parentElement;
    var timerNum = timer.getAttribute('data-timer-num');

    if(element.innerText == 'Pause') { 
        element.innerText = 'Resume';
        element.previousSibling.style.display = 'block';
        controlTimer(timerNum, timeLabel);
        element.setAttribute('data-timer-state', 'paused');
        console.log("Pause time:", timeLabel.innerText);

        var timerLabel = element.parentElement.previousSibling.firstChild.innerText;
        var startTime = timer.getAttribute('data-timer-start');
        var currentTime = timeLabel.innerText;
        var timerId = timer.getAttribute('data-timer-id');
        var url = '/timer/' + timerId;
        var timerData = {
            "label": timerLabel,
            "start": startTime,
            "current": currentTime,
            "id": timerId
        }
        callAjax("PUT", url, timerData, getTimers);
    } else if(element.innerText == 'Resume') {
        element.innerText = 'Pause';
        element.previousSibling.style.display = 'none';
        controlTimer(timerNum, timeLabel);
        element.setAttribute('data-timer-state', 'unpaused');
        console.log("Resume time:", timeLabel.innerText);
    } else {
        timer.classList.add('active-timer');
        element.innerText = 'Pause';
        element.style.backgroundColor = '#0087d0';
        element.style.color = 'white';
        element.previousSibling.style.display = 'none';
        controlTimer(timerNum, timeLabel);
        element.setAttribute('data-timer-state', 'touched');
        console.log("Start time:", timeLabel.innerText);
    }
}

/* Parts of this JavaScript timer were borrowed from https://jsfiddle.net/Daniel_Hug/pvk6p/ */
var t;

function controlTimer(timerNum, timeLabel) {
    var startPauseResumeBtn = document.getElementsByClassName('start-pause-resume-button')[timerNum],
        resetBtn = document.getElementsByClassName('reset-button')[timerNum],
        seconds = 0, minutes = 0, hours = 0,
        hms; // stands for hours / minutes / seconds
    
    function add() {
        hms = timeLabel.innerText.split(':');
        hours = parseInt(hms[0]);
        minutes = parseInt(hms[1]);
        seconds = parseInt(hms[2]);

        seconds++;
        if (seconds >= 60) {
            seconds = 0;
            minutes++;
            if (minutes >= 60) {
                minutes = 0;
                hours++;
            }
        }
        
        timeLabel.innerText = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
        
        timer();
    }

    function timer() {
        t = setTimeout(add, 1000);
    }

    var timerState = startPauseResumeBtn.getAttribute('data-timer-state');

    if(timerState == 'untouched') {
        console.log("Starting timer...");
        timer();
    } else if(timerState == 'touched' || timerState == 'unpaused') {
        console.log("Pausing timer...");
        clearTimeout(t);
    } else {
        console.log("Unpausing timer...");
        t = setTimeout(add, 1000);
    }
    
    resetBtn.onclick = function() {
        console.log("Resetting timer...");
        resetCurrentTime(resetBtn, timerNum);
    }
}

/* End of timer-related functions */