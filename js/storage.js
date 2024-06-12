const STORAGE_TOKEN = 'RI356J413WZ414HO4TBZGKHKPO03QERFSAEGI9S8';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';
let users = [];


/**
 * This function post the item to the backend
 * 
 * @param {string} key - key word of the json
 * @param {string} value - value of the json
 * @returns - fetch post function
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}


/**
 * This function get the value of the key from the backend
 * 
 * @param {string} key - key word of the json
 * @returns -fetch get function
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        if (res.data) {
            return res.data.value;
        }
        throw `Could not find data with key "${key}".`;
    });
}

/**
 * Function to retrieve a specific cookie value by name
 * 
 * @param {string} name - The name of the cookie to retrieve
 * @returns {string|null} - The value of the cookie if found, otherwise null
 */
function getCookie(name) {
    let nameEQ = name + "=";
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}


/**
 * This function set Cookies
 * 
 * @param {string} name - The name of the cookie
 * @param {string} value - The value of the cookie
 * @param {number} days - The days how long the cookies saved
 */
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}



/**
 * This function delete a cookie
 * 
 * @param {string} name - name of the cookie
 */
function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}
