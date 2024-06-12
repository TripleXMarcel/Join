/**
 * This function checks whether the form is complete
 * 
 */
function loginForm() {
    login();
}

/**
 * This function checks whether it is a registered user
 * 
 * @returns - Indicates whether the information entered is incorrect
 */
function login() {
    let inputMail = users.find(m => m.email === email.value);
    let inputPassword = users.find(p => p.password === password.value);
    let userName = getName(email.value, password.value);

    if (!email.validity.valid || !password.validity.valid) {
        return;
    }

    wrongUser(inputMail, inputPassword);

    if (inputMail && inputPassword) {
        setCookie('username', userName, 30);
        window.location.href = 'summary.html';
    }
}

/**
 * This function produces a red frame if the data is incorrect
 * 
 * @param {string} inputMail - The email of the registered user
 * @param {string} inputPassword -The password of the registered user
 */
function wrongUser(inputMail, inputPassword) {
    let mailText = document.getElementById('wrong-mail');
    let passwordText = document.getElementById('wrong-password');

    checkUserMail(inputMail, mailText);
    checkUserPassword(inputPassword, passwordText);
}

/**
 * This function checks the email input
 * 
 * @param {string} inputMail - The email of the registered user
 * @param {string} mailText -The password of the registered user
 */
function checkUserMail(inputMail, mailText) {
    if (!inputMail) {
        email.classList.add('wrong-border');
        mailText.classList.remove('hide');
        mailText.classList.add('wrong-text');
    } else {
        email.classList.remove('wrong-border');
        mailText.classList.remove('wrong-text');
        mailText.classList.add('hide');
    }
}

/**
 * This function checks the password input
 * 
 * @param {string} inputMail - The email of the registered user
 * @param {string} mailText -The password of the registered user
 */
function checkUserPassword(inputPassword, passwordText) {
    if (!inputPassword) {
        password.classList.add('wrong-border');
        passwordText.classList.remove('hide');
        passwordText.classList.add('wrong-text');
    } else {
        password.classList.remove('wrong-border');
        passwordText.classList.remove('wrong-text');
        passwordText.classList.add('hide');
    }
}

/**
 * This function gets the registered username
 * 
 * @param {*} email - reads the email value
 * @param {*} password - reads the password value
 * @returns - Will be returned empty if no user was found
 */
function getName(email, password) {
    let foundUser = users.find(user => user.email === email && user.password === password);
    if (foundUser) {
        return foundUser.newUser; // Gibt den Namen des gefundenen Benutzers zurück
    } else {
        return null; // Oder eine andere Kennzeichnung für keinen gefundenen Benutzer
    }
}

/**
 * Shows the password when the icon is clicked
 * 
 */
function showPassword() {
    let img = document.getElementById('lock');
    img.src = './img/log-in/visibility_off.png';
}

/**
 * The icon will be reset again
 * 
 */
function resetPasswordVisibility() {
    let img = document.getElementById('lock');
    let passwordInput = document.getElementById('password');

    if (passwordInput.value === '') {
        img.src = './img/log-in/lock.png';
    }
}

/**
 * When you click on the icon, the password becomes visible and invisible
 * 
 */
function togglePasswordVisibility() {
    let img = document.getElementById('lock');
    let passwordInput = document.getElementById('password');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        img.src = './img/log-in/visibility.png';
    } else {
        passwordInput.type = 'password';
        img.src = './img/log-in/visibility_off.png';
    }
}

/**
 * allows the user to log in as a guest
 * 
 */
function guestLogIn() {
    setCookie('username', 'Guest', 30);
    window.location.href = 'summary.html';
}