import "@css/styles.css"
import {connect, play} from "./networking";
import {startCapturingInput, stopCapturingInput} from "./input"
import {startRendering, stopRendering} from "./render";
import {setLeaderboardHidden} from "./leaderboard";


const login_menu = document.getElementById('Login_menu');
login_menu.classList.remove('hidden')
const registration_menu = document.getElementById('Registration_menu');

// login page

const go_signup_btn = document.getElementById('go-signup-btn');
go_signup_btn.addEventListener('click', goSignup);

function goSignup(event) {
    setTimeout(() => {
        login_menu.classList.add('hidden');
        registration_menu.classList.remove('hidden');
    }, 200);
}


const go_login_btn = document.getElementById('go-login-btn');
go_login_btn.addEventListener('click', goLogin);

function goLogin(event) {
    setTimeout(() => {
        login_menu.classList.remove('hidden');
        registration_menu.classList.add('hidden');
    }, 200);
}





// Register user staff

// registration_form.addEventListener('submit', registerUser)

async function registerUser(event){
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const result = await fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    }).then((res) => res.json());

    if (result.status === 'ok') {
        alert('Successful registration!!');
    }
    else {
        console.log(result)
        alert(result.error);
    }
}





// login_form.addEventListener('submit', loginUser)

async function loginUser(event){
    event.preventDefault();
    const username = document.getElementById('login_username').value;
    const password = document.getElementById('login_password').value;

    const result = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    }).then((res) => res.json());

    if (result.status === 'ok') {
        alert('Successful login!!');
        localStorage.setItem('token', result.data);
    }
    else {
        alert(result.error);
    }
}

const changePassword_form = document.getElementById('change_password-form');
changePassword_form.addEventListener('submit', changePassword)
async function changePassword(event){
    event.preventDefault();
    const password = document.getElementById('new_password').value;

    const result = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            newPassword: password,
            token: localStorage.getItem('token')
        })
    }).then((res) => res.json());

    if (result.status === 'ok') {
        alert('Successful change password!!');
        console.log("Got the token", result.data)
    }
    else {
        alert(result.error);
    }
}




const canvas = document.querySelector('canvas');
const playButton = document.getElementById('play-button');
const noConnectionButton = document.getElementById('no-connect-button');
const noConnectModal = document.getElementById('no-connect-modal');
const playMenu = document.getElementById('play-menu');
const usernameInput = document.getElementById('username-input');
const leaderboard = document.getElementById('leaderboard');
const deadMenu = document.getElementById('dead-menu');
const deadButton = document.getElementById('dead-button');

const upgradeMenu = document.getElementById('upgrade-menu');

const authMenu = document.getElementById('auth');


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
export var canvasWidth = canvas.width;
export var canvasHeight = canvas.height;


Promise.all([connect(onGameOver)])
    .then(() => {
        playMenu.classList.remove('hidden');
        usernameInput.focus();
        playButton.onclick = () => {playClicked()}
    })
    .catch(() => {
        noConnectModal.classList.remove('hidden')
        noConnectionButton.onclick = () => {
            window.location.reload();
        }
    })


function playClicked() {
    playMenu.classList.add('hidden');
    canvas.classList.remove('hidden');
    upgradeMenu.classList.remove('hidden');
    play(usernameInput.value);
    startCapturingInput();
    setLeaderboardHidden(false);
    authMenu.classList.add('hidden');

    // start rendering 100 ms later
    // so bcs waiting first update from server
    setTimeout(() => {
        startRendering();
    }, 100);

}


function onGameOver() {
    stopCapturingInput();
    stopRendering();
    setLeaderboardHidden(true);
    canvas.classList.add('hidden');
    upgradeMenu.classList.add('hidden');
    deadMenu.classList.remove('hidden');
    deadButton.onclick = () => {
        deadMenu.classList.add('hidden');
        playMenu.classList.remove('hidden');
        authMenu.classList.remove('hidden');
    }
}