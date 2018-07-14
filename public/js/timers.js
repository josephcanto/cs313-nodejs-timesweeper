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
            startButton.setAttribute('onclick', 'startTimer(this)')
    
            pausedButtons = document.createElement('div');
            pausedButtons.setAttribute('class', 'paused-buttons');
            resetButton = document.createElement('button');
            resetButton.innerText = 'Reset';
            resetButton.setAttribute('onclick', 'resetCurrentTime(this, '+ i + ')');
            resumeButton = document.createElement('button');
            resumeButton.innerText = 'Resume';
            resumeButton.setAttribute('onclick', 'swapBtns(this)');
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
    console.log(document.getElementsByClassName('timer')[0].classList.contains('active-timer') && document.getElementsByClassName('timer')[0].getElementsByTagName('button')[0].innerText != 'Pause');
    console.log(document.getElementsByClassName('timer')[0].classList.contains('active-timer'));

    if(editLink.innerText == 'Edit') {
        for(var i = 0; i < document.getElementsByClassName('timer').length; i++) {
            document.getElementsByClassName('timer')[i].getElementsByTagName('button')[0].style.visibility = 'hidden';
            document.getElementsByClassName('timer')[i].getElementsByTagName('button')[0].style.display = 'block';
            document.getElementsByClassName('timer')[i].getElementsByClassName('paused-buttons')[0].style.display = 'none';
        }

        for(var i = 0; i < deleteBtns.length; i++) {
            deleteBtns[i].style.display = "flex";
        }
        editLink.innerText = 'Done';
    } else if(editLink.innerText == 'Done') {
        for(var i = 0; i < document.getElementsByClassName('timer').length; i++) {
            if(document.getElementsByClassName('timer')[i].classList.contains('active-timer') && document.getElementsByClassName('timer')[i].getElementsByTagName('button')[0].innerText != 'Pause') {
                document.getElementsByClassName('timer')[i].getElementsByClassName('paused-buttons')[0].style.display = 'block';
                document.getElementsByClassName('timer')[i].getElementsByTagName('button')[0].style.display = 'none';
            } else {                
                document.getElementsByClassName('timer')[i].getElementsByTagName('button')[0].style.visibility = 'visible';
            }
        }

        for(var i = 0; i < deleteBtns.length; i++) {
            deleteBtns[i].style.display = "none";
        }
        editLink.innerText = 'Edit';
    }
}

function startTimer(element) {
    if(!element.parentElement.classList.contains('active-timer')) {
        element.parentElement.classList.add('active-timer');
    }

    // TODO: Add functionality to make the timer start counting

    if(element.innerText == 'Start') {
        element.innerText = 'Pause';
        if(element.classList.contains('start-button')) {
            element.classList.remove('start-button');
        }
        element.style.backgroundColor = '#0087d0';
        element.style.color = 'white';
        element.style.fontSize = '1em';
    } else {
        element.nextSibling.style.display = 'block';
        element.nextSibling.style.visibility = 'visible';
        element.style.display = 'none';
        element.style.visibility = 'hidden';
    }
}

function resetCurrentTime(element, timerNum) {
    document.getElementsByClassName('time')[timerNum].innerText = '00:00:00';
    element.parentElement.parentElement.classList.remove('active-timer');
    document.getElementsByClassName('paused-buttons')[timerNum].style.display = 'none';
    var startButton = document.getElementsByClassName('timer')[timerNum].getElementsByTagName('button')[0];
    startButton.innerText = 'Start';
    startButton.style.backgroundColor = 'white';
    startButton.style.color = '#0087d0';
    startButton.style.display = 'block';
    startButton.style.visibility = 'visible';
}

function swapBtns(element) {
    if(element.innerText == 'Pause') { 
        element.innerText = 'Resume';
        element.previousSibling.style.visibility = 'visible';
        // TODO: Implement resumeTimer function
        // element.setAttribute('onclick', 'resumeTimer()');
    } else {
        element.innerText = 'Pause';
        element.previousSibling.style.visibility = 'hidden';
        // TODO: Implement pauseTimer function()
        // element.setAttribute('onclick', 'pauseTimer()');
    }
}