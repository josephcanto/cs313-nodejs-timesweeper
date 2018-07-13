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
    callAjax("POST", url, userData, getTimers);
    hideRegistration();
    showDashboard();
}

function performLogin() {
    console.log('Logging in...');
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var url = '/login';
    var userData = {"username": username, "password": password};
    callAjax("POST", url, userData, getTimers);
    hideLogin();
    showDashboard();
}

function getTimers(response) {
    console.log("Received the following response after running the performLogin function:", response);
    var json = JSON.parse(response);
    if(json.success) {
        var user_id = json.data;
        console.log("Found the following user ID:", user_id);
        var url = '/timers/' + user_id;
        console.log("URL:", url);
        callAjax("GET", url, null, buildTimerList);
    } else {
        console.log("Error: Could not retrieve the user's ID");
    }
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
    document.getElementById('edit-mode-link').style.display = 'flex';
    document.getElementById('add-new-link').style.display = 'block';
}

function buildTimerList(response) {
    var timerList = document.getElementById('timer-list');
    timerList.style.display = 'block';

    var json = JSON.parse(response);

    if(!json.success) {
        console.log("No timers were found for this user.");
        return;
    } else {
        console.log(json.data);

        timerList.innerText = '';
        timerList.style.textAlign = 'left';
    
        var timer, 
            timerLabels, 
            label, 
            currentTime, 
            startButton, 
            pausedButtons,
            resetButton,
            resumeButton,
            deleteButton;
    
        for(var i = 0; i < json.data.length; i++) {
            timer = document.createElement('div');
            timer.setAttribute('class', 'timer');

            deleteButton = document.createElement('div');
            deleteButton.setAttribute('class', 'delete-button');
            deleteButton.innerText = '–';
    
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
    
            label.innerHTML = json.data[i].label;
            currentTime.innerHTML = json.data[i].current;
            timerLabels.appendChild(label);
            timerLabels.appendChild(currentTime);
            timer.appendChild(deleteButton);
            timer.appendChild(timerLabels);
            timer.appendChild(startButton);
            timer.appendChild(pausedButtons);
            timerList.appendChild(timer);
        }
    }
}

function toggleDeleteBtns() {
    var editLink = document.getElementById('edit-mode-link');
    var deleteBtns = document.getElementsByClassName("delete-button");

    if(editLink.innerText === 'Edit') {
        for(var i = 0; i < deleteBtns.length; i++) {
            deleteBtns[i].style.display = "flex";
        }
        editLink.innerText = 'Done';
    } else if(editLink.innerText === 'Done') {
        for(var i = 0; i < deleteBtns.length; i++) {
            deleteBtns[i].style.display = "none";
        }
        editLink.innerText = 'Edit';
    }
}