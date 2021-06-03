import "@css/styles.css"
import {connect, play} from "./networking";
import {startCapturingInput, stopCapturingInput} from "./input"
import {startRendering, stopRendering} from "./render";
import {setLeaderboardHidden} from "./leaderboard";


const login_menu = document.getElementById('Login_menu');
const registration_menu = document.getElementById('Registration_menu');
const logged_menu = document.getElementById('logged_in-menu');
const changePassword_menu = document.getElementById('change_password_menu');

const go_signup_btn = document.getElementById('go-signup-btn');
go_signup_btn.addEventListener('click', goSignup);

const go_login_btn = document.getElementById('go-login-btn');
go_login_btn.addEventListener('click', goLogin);

function goSignup(event) {
    setTimeout(() => {
        login_menu.classList.add('hidden');
        registration_menu.classList.remove('hidden');
    }, 200);
}

function goLogin(event) {
    setTimeout(() => {
        login_menu.classList.remove('hidden');
        registration_menu.classList.add('hidden');
    }, 200);
}


// registration handling
const registration_form = document.getElementById('registration-form');
registration_form.addEventListener('submit', registerUser);
const usernameError_registration = document.querySelector('.username.error');
const passwordError_registration = document.querySelector('.password.error');
const successRegister = document.querySelector('.register.success');


function cleanErrors_registration() {
    usernameError_registration.textContent = '';
    passwordError_registration.textContent = '';
    successRegister.textContent = '';
}


async function registerUser(event){
    event.preventDefault();
    const username = document.getElementById('register_username').value;
    const password = document.getElementById('register_password').value;
    cleanErrors_registration();

    try{
        const result = await fetch('/api/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: username, password: password})
        }).then((res) => res.json());

        if (result.status === 'ok') {
            successRegister.textContent = `${username} successfully registered!`;
        }
        else {
            usernameError_registration.textContent = result.error.username;
            passwordError_registration.textContent = result.error.password;
        }
    }
    catch (e){
        console.log('Error in registration: ', e);
    }
}


// login handling
const login_form = document.getElementById('login-form');
login_form.addEventListener('submit', loginUser);
const usernameError_login = document.querySelector('.usernameLogin.error');
const passwordError_login = document.querySelector('.passwordLogin.error');
const successLogin = document.querySelector('.login.success');

const changePassword_btn = document.getElementById('go_change_password');
changePassword_btn.addEventListener('click', changePasswordOn);

function changePasswordOn(event) {
    changePassword_menu.classList.remove('hidden');
    changePassword_btn.classList.add('disabled');
}


function cleanErrors_login() {
    usernameError_login.textContent = '';
    passwordError_login.textContent = '';
    successRegister.textContent = '';
}


const logged_username = document.getElementById('logged_username');
const logged_maxScore = document.getElementById('logged_maxScore');

let isLogged = false;
let usernameLogged = '';


async function loginUser(event){
    event.preventDefault();
    const username = document.getElementById('login_username').value;
    const password = document.getElementById('login_password').value;

    try {
        cleanErrors_login();
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
            successLogin.textContent = "Login successful";
            setTimeout(() => {
                login_menu.classList.add('hidden');
                logged_menu.classList.remove('hidden');
                logged_username.textContent = result.data.username;
                logged_maxScore.textContent = result.data.maxScore;
                isLogged = true;
                usernameLogged = result.data.username;

            }, 1000);
        } else {
            usernameError_login.textContent = result.error.username;
            passwordError_login.textContent = result.error.password;
        }
    }
    catch (e){
        console.log('Error in login: ', e);
    }
}

const changePassword_form = document.getElementById('change_password-form');
changePassword_form.addEventListener('submit', changePassword);

const changePasswordSuccess = document.querySelector('.changePassword.success');
const oldPasswordError = document.querySelector('.oldPassword.error');
const newPasswordError = document.querySelector('.newPassword.error');

function cleanErrorPassword() {
    oldPasswordError.textContent = '';
    newPasswordError.textContent = '';
}

async function changePassword(event){
    event.preventDefault();
    const oldPassword = document.getElementById('old_password').value;
    const newPassword = document.getElementById('new_password').value;

    cleanErrorPassword();

    const result = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldPassword: oldPassword,
            newPassword: newPassword,
        })
    }).then((res) => res.json());

    if (result.status === 'ok') {
        changePasswordSuccess.textContent = 'Password changed successful';
        setTimeout(() => {
            changePassword_menu.classList.add('hidden');
        }, 200);
    }
    else {
        console.log(result.error);
        oldPasswordError.textContent = result.error.oldPassword;
        newPasswordError.textContent = result.error.newPassword;
    }
}



const logout_btn = document.getElementById('logout-btn');
logout_btn.addEventListener('click', logout);

async function logout(event) {
    try{
        const result = await fetch('/api/logout', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json'}
        }).then(res => res.json());
        isLogged = false;
        window.location.reload(true);
    }

    catch (e) {
        console.log('Error in logout: ', e);
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
    const player_data = {
        gameUsername: usernameInput.value,
        isLogged: isLogged,
        usernameLogged: usernameLogged
    }
    console.log(player_data.usernameLogged);
    play(player_data);
    startCapturingInput();
    setLeaderboardHidden(false);
    authMenu.classList.add('hidden');

    // start rendering 100 ms later
    // so bcs waiting first update from server
    setTimeout(() => {
        startRendering();
    }, 100);
}


function onGameOver(aliveData) {

    const score = aliveData.score;
    const prev_score = logged_maxScore.textContent;

    if (score > prev_score) {
        logged_maxScore.textContent = score;
    }

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