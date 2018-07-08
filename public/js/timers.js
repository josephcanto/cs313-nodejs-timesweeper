// Using function from: https://stackoverflow.com/questions/8567114/how-to-make-an-ajax-call-without-jquery
function callAjax(action, url, callback) {
    var xmlhttp;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            callback(xmlhttp.responseText);
        }
    }
    xmlhttp.open(action, url, true);
    xmlhttp.send();
}

function openRegistration() {
    hideLogin();
    document.getElementById('registration-page').style.display = 'block';
}

function performLogin() {
    console.log('Logging in...');

    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    console.log('User:', username);
    console.log('PW:', password);

    var url = '/login';

    var response = callAjax("POST", url, getTimers);
}

function getTimers(response) {
    console.log(response);
    // var user_id = response.user_id;
    // var url = '/timers/' + user_id;
    // hideLogin();
    // callAjax("GET", url, buildTimerList);
}

function hideLogin() {
    document.getElementById('login-page').style.display = 'none';
}

function buildTimerList(response) {
    var timerList = document.getElementById('timer-list');
    timerList.style.display = 'block';
    if(!response) {
        console.log("No timers were found for this user.");
        return;
    }
    console.log(response);

    var timer, label, currentTime;

    for(var i = 0; i < response.length; i++) {
        timer = document.createElement('div');
        label = document.createElement('span');
        currentTime = document.createElement('span');
        label.innerHTML = response[i].label;
        currentTime.innerHTML = response[i].currentTime;
        timer.appendChild(label);
        timer.appendChild(currentTime);
        timerList.appendChild(timer);
    }
}