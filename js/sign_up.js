/**
 * This function load all necessary functions onload of the html page
 * 
 */
async function initRegister() {
    loadUsers();
}


/**
 * This function load all registerd users
 * 
 */
async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}


/**
 * This function register a new user to the service
 * 
 */
function register() {
    let newUser = document.getElementById('newUser');
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let confirmPassword = document.getElementById('password2');
    let warningText = document.getElementById('warning');
    if (checkPasswords(password, confirmPassword, warningText) === 'true') {
        pushNewUser(newUser, email, password);
        resetForm(newUser, email, password, confirmPassword);
        startAnimation();
    }
}


/**
 * This function checked if the password and confirm password is the same value
 * 
 * @param {string} password - The password input field
 * @param {string} confirmPassword - The confirmed password input field
 * @param {string} warningText - The warning text box
 * @returns - true if password and confirm password have the same value
 */
function checkPasswords(password, confirmPassword, warningText) {
    if (password.value !== confirmPassword.value) {
        confirmPassword.classList.add('wrong-border');
        warningText.classList.remove('hiden');
        warningText.classList.add('wrong-text');
        return;
    } else {
        confirmPassword.classList.remove('wrong-border');
        warningText.classList.remove('wrong-text');
        warningText.classList.add('hiden');
        return 'true'
    }
}


/**
 * The function push a new user to the backend
 * 
 * @param {string} newUser - The newUser input field
 * @param {string} email - The email input field 
 * @param {string} password - The password input field 
 */
async function pushNewUser(newUser, email, password) {
    users.push({ newUser: newUser.value, email: email.value, password: password.value, });
    await setItem('users', JSON.stringify(users));
}


/**
 * This function clear all input fields
 * 
 * @param {string} newUser - The newUser input field
 * @param {string} email - The email input field 
 * @param {string} password - The password input field 
 * @param {string} confirmPassword - The confirm password input field 
 */
function resetForm(newUser, email, password, confirmPassword) {
    newUser.value = '';
    email.value = '';
    password.value = '';
    confirmPassword.value = '';
}


/**
 * This function start an animation when sign up is complete
 * 
 */
function startAnimation() {
    let animation = document.getElementById('animation');
    animation.classList.remove('hiden');
    animation.classList.add('success');
    animation.style.bottom = '50%';
    document.body.style.backgroundColor = 'lightgray';
    setTimeout(() => {
        window.location.href = 'log-in.html';
    }, 1500);
}


/**
 * This function showed a img when the input field text is visible
 * 
 * @param {string} inputId - id of the input field
 */
function showPassword(inputId) {
    let img = document.getElementById('lock-' + inputId);
    img.src = './img/log-in/visibility_off.png';
}


/**
 * This function showed a img when the input field text is unvisible
 * 
 * @param {string} inputId - id of the input field 
 */
function resetPasswordVisibility(inputId) {
    let img = document.getElementById('lock-' + inputId);
    let passwordInput = document.getElementById(inputId);
    if (passwordInput.value === '') {
        img.src = './img/log-in/lock.png';
    }
}


/**
 * This function change the input field type from text to password or password to text
 * 
 * @param {string} inputId - id of the input field  
 */
function togglePasswordVisibility(inputId) {
    let img = document.getElementById('lock-' + inputId);
    let passwordInput = document.getElementById(inputId);
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        img.src = './img/log-in/visibility.png';
    } else {
        passwordInput.type = 'password';
        img.src = './img/log-in/visibility_off.png';
    }
}