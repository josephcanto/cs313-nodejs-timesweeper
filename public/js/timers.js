// Using function from: https://stackoverflow.com/questions/8567114/how-to-make-an-ajax-call-without-jquery
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

function performLogin() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    if(username && password) {
        var url = '/login';
        var userData = {"username": username, "password": password};
        callAjax("POST", url, userData, getTimers);
        hideLogin();
        showDashboard();
    } else {
        document.getElementById('notice').innerText = "Please fill out all form fields.";
    }
}

function getTimers(response) {
    var json = JSON.parse(response);
    if(json.success) {
        var user_id = json.data;
        var url = '/timers/' + user_id;
        callAjax("GET", url, null, buildTimerList);
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
    document.getElementById('dashboard-page').style.display = 'block';
    document.title='Dashboard | Timesweeper';
    document.getElementById('edit-mode-link').style.display = 'flex';
    document.getElementById('add-new-link').style.display = 'block';
}

function hideDashboard() {
    document.getElementById('dashboard-page').style.display = 'none';
}

function buildTimerList(response) {
    var timerList = document.getElementById('timer-list');
    timerList.style.display = 'block';

    var json = JSON.parse(response);

    if(!json.success) {
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

            deleteBtn = document.createElement('div');
            deleteBtn.setAttribute('class', 'delete-button');
            deleteBtn.innerText = '–';
    
            timerLabels = document.createElement('div');
            timerLabels.setAttribute('class', 'timer-labels');
            label = document.createElement('span');
            label.setAttribute('class', 'label');
            currentTime = document.createElement('span');
            currentTime.setAttribute('class', 'time');

            startPauseResumeBtn = document.createElement('button');
            startPauseResumeBtn.setAttribute('class', 'start-pause-resume-button');
            startPauseResumeBtn.innerText = 'Start';
            startPauseResumeBtn.setAttribute('onclick', 'changeBtnText(this)');
            startPauseResumeBtn.setAttribute('data-timer-state', 'untouched');

            controlBtns = document.createElement('div');
            controlBtns.setAttribute('class', 'control-buttons');
            resetBtn = document.createElement('button');
            resetBtn.innerText = 'Reset';
            resetBtn.setAttribute('class', 'reset-button');
            resetBtn.setAttribute('onclick', 'resetCurrentTime(this, '+ i + ')');
    
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
    }
}

// function startTimer(element) {
//     var timer = element.parentElement.parentElement;
//     var timerNum = timer.getAttribute('data-timer-num');
//     timer.classList.add('active-timer');
//     element.innerText = 'Pause';
//     element.setAttribute('onclick', 'changeBtnText(this)');
//     element.style.backgroundColor = '#0087d0';
//     element.style.color = 'white';
//     var timeLabel = element.parentElement.previousSibling.lastChild;
//     startTime(timerNum, timeLabel);
//     element.setAttribute('data-timer-state', 'touched');
//     console.log("Start time:", timeLabel.innerText);
// }

function resetCurrentTime(element, timerNum) {
    // TODO: Add AJAX call that resets the currentTime on the specified timer to 00:00:00 in the database as well
    console.log("Reset time:", document.getElementsByClassName('time')[timerNum].innerText);
    // document.getElementsByClassName('time')[timerNum].innerText = '00:00:00';
    element.parentElement.parentElement.classList.remove('active-timer');
    document.getElementsByClassName('reset-button')[timerNum].style.display = 'none';
    var startPauseResumeBtn = document.getElementsByClassName('start-pause-resume-button')[timerNum];
    startPauseResumeBtn.innerText = 'Start';
    startPauseResumeBtn.setAttribute('data-timer-state', 'untouched');
    startPauseResumeBtn.style.backgroundColor = 'white';
    startPauseResumeBtn.style.color = '#0087d0';
    
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

var t;

/* JavaScript timer borrowed from https://jsfiddle.net/Daniel_Hug/pvk6p/ */
function controlTimer(timerNum, timeLabel) {
    var startPauseResumeBtn = document.getElementsByClassName('start-pause-resume-button')[timerNum],
        resetBtn = document.getElementsByClassName('reset-button')[timerNum],
        seconds = 0, minutes = 0, hours = 0;
        //var t;
    
    function add() {
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
    console.log("Timer state:", timerState);

    if(timerState == 'untouched') {
        console.log("Starting...");
        timer();
    } else if(timerState == 'touched' || timerState == 'unpaused') {
        console.log("Pausing...");
        clearTimeout(t);
    } else {
        console.log("Resuming...");
        // TODO: Figure out how to unpause the timer without resetting it to zero...
        timer();
    }
    
    /* Clear button */
    resetBtn.onclick = function() {
        timeLabel.innerText = "00:00:00";
        seconds = 0; minutes = 0; hours = 0;
        resetCurrentTime(resetBtn, timerNum);
    }
}