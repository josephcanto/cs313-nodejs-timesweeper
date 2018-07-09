// Using function from: https://stackoverflow.com/questions/8567114/how-to-make-an-ajax-call-without-jquery
function callAjax(action, url, data, callback) {
    var xmlhttp;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && (xmlhttp.status == 200 || xmlhttp.status == 201 || xmlhttp.status == 204)) {
            callback(xmlhttp.responseText);
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

function openRegistration() {
    hideLogin();
    document.getElementById('registration-page').style.display = 'block';
    document.title = 'Register | Timesweeper';
}

function registerUser() {
    console.log('Registering user...');
    var username = document.getElementById('reg-username').value;
    var password = document.getElementById('reg-password').value;
    var theme = document.getElementById('reg-theme').value;
    console.log('User:', username);
    console.log('PW:', password);
    console.log('Theme:', theme);
    var url = '/register';
    var userData = {"username": username, "password": password, "theme": theme};
    console.log(userData);
    // callAjax("POST", url, userData, getTimers);
    hideRegistration();
    showDashboard();
}

function performLogin() {
    console.log('Logging in...');
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    console.log('User:', username);
    console.log('PW:', password);
    var url = '/login';
    var userData = {"username": username, "password": password};
    console.log(userData);
    // callAjax("POST", url, userData, getTimers);
    hideLogin();
    showDashboard();
    buildTimerList({"label": "CS 313", "currentTime": "00:25:45"});
}

function getTimers(response) {
    console.log(response);
    // var user_id = response.user_id;
    // var url = '/timers/' + user_id;
    // callAjax("GET", url, null, buildTimerList);
}

function hideLogin() {
    document.getElementById('login-page').style.display = 'none';
}

function hideRegistration() {
    document.getElementById('registration-page').style.display = 'none';
}

function showDashboard() {
    document.getElementById('dashboard-page').style.display = 'block';
    document.title='Dashboard | Timesweeper';
}

function buildTimerList(response) {
    var timerList = document.getElementById('timer-list');
    timerList.style.display = 'block';
    timerList.innerText = '';
    // if(!response) {
    //     console.log("No timers were found for this user.");
    //     return;
    // }
    // console.log(response);

    var timer, 
        timerLabels, 
        label, 
        currentTime, 
        startButton, 
        pausedButtons,
        resetButton,
        resumeButton;

    // Hard-coded test data
    response = {
        success:true,
        data: [
            {
                label: 'CIT 365', 
                currentTime: '00:00:00'
            },
            {
                label: 'CS 313', 
                currentTime: '00:48:53'
            },
            {
                label: 'FDREL 250', 
                currentTime: '00:00:00'
            }
        ]
    };

    for(var i = 0; i < response.data.length; i++) {
        timer = document.createElement('div');
        timer.setAttribute('class', 'timer');

        timerLabels = document.createElement('div');
        timerLabels.setAttribute('class', 'timer-labels');
        label = document.createElement('span');
        label.setAttribute('class', 'label');
        currentTime = document.createElement('span');
        currentTime.setAttribute('class', 'time');

        startButton = document.createElement('button');
        startButton.setAttribute('class', 'start-button');
        startButton.innerText = 'Start';

        pausedButtons = document.createElement('div');
        pausedButtons.setAttribute('class', 'paused-buttons');
        resetButton = document.createElement('button');
        resetButton.innerText = 'Reset';
        resumeButton = document.createElement('button');
        resumeButton.innerText = 'Resume';
        pausedButtons.appendChild(resetButton);
        pausedButtons.appendChild(resumeButton);

        label.innerHTML = response.data[i].label;
        currentTime.innerHTML = response.data[i].currentTime;
        timerLabels.appendChild(label);
        timerLabels.appendChild(currentTime);
        timer.appendChild(timerLabels);
        timer.appendChild(startButton);
        timer.appendChild(pausedButtons);
        timerList.appendChild(timer);
    }
}