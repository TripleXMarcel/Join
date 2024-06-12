svgURLS = ['iconSummery', 'iconAddTask', 'iconBoard', 'iconContacts'];


/**
 * This function open the page log-in.html
 * 
 */
function openLogin() {
    window.open('log-in.html', '_self');
}




/**
 * This function load all necessary functions onload of the html page
 * 
 * @param {string} site - This is the current html page
 */
async function init(site) {
    document.body.classList.add('visible');
    await loadUsers();
    await includeHTML();
    headerUserInitials();
    loadSVG();
    isLoggedin(site);
    changeSidebarActive(site);
    loadScript(site);
}


/**
 * This function checked the cookie if the user is logged in and if not the page log-in.html open
 * 
 * @param {string} site - This is the current html page 
 */
function isLoggedin(site) {
    if ((site === 'legalNotice' || site === 'privacyPolicy') && !getCookie('username')) {
        loadLegalAndPrivacyNotLoggedIn();
    }
    else if (!getCookie('username')) {
        window.location.href = 'log-in.html';
    }
}


function loadLegalAndPrivacyNotLoggedIn() {
    document.getElementById('sidebarMenuContainer').classList.add('displayNone');
    document.getElementById('headerPicturesContainer').classList.add('displayNone');
}

/**
 * This function load the necessary function of the javascript from the html page
 * 
 * @param {string} site - This is the current html page
 */
function loadScript(site) {
    if (site === 'contacts') { initContacts() }
    if (site === 'addTask') { initTasks() }
    if (site === 'summery') { initSummary() }
}


/**
 * This function load the Templates
 * 
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        let element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        try {
            let resp = await fetch(file);
            if (resp.ok) {
                element.innerHTML = await resp.text();
            } else {
                element.innerHTML = 'Page not found';
            }
        } catch (error) {
            console.error('Error loading file:', error);
        }
    }
}


/**
 * This function load the .svg files
 * 
 */
function loadSVG() {
    for (let i = 0; i < svgURLS.length; i++) {
        const element = svgURLS[i];
        fetch(`img/sidebar/${element}.svg`)
            .then(response => response.text())
            .then(svgData => {
                document.getElementById(element).innerHTML = svgData;
            });
    }
}


/**
 * This function shows on the sidebar which page is active
 * 
 * @param {string} site - This is the current html page 
 */
function changeSidebarActive(site) {
    document.getElementById('summery').classList.remove('active');
    document.getElementById('addTask').classList.remove('active');
    document.getElementById('board').classList.remove('active');
    document.getElementById('contacts').classList.remove('active');
    document.getElementById('privacyPolicy').classList.remove('active');
    document.getElementById('legalNotice').classList.remove('active');
    document.getElementById(site).classList.add('active');
}


/**
 * This function open edit- or addcontact
 * 
 * @param {string} element - This is the element which should open on click
 */
function showAddContact(element) {
    document.getElementById(element).classList.remove('displayNone');
    if (element === 'addContact') {
        add = true;
    }
    else {
        edit = true;
    }
    document.addEventListener('mousedown', clickOutsideHandlerContact);
}


/**
 * This function close edit- or addcontact
 * 
 * @param {string} element - This is the element which should open on click
 */
function closeAddContact(element) {
    document.getElementById(element).classList.add('displayNone');
    if (element === 'addContact') {
        add = false;
    }
    else {
        edit = false;
    }
    document.removeEventListener('mousedown', clickOutsideHandlerContact);
}


/**
 * This function load all Users which have an account
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
 * This function checked the logged user for the initials and show it in the header
 * 
 */
function headerUserInitials() {
    let storedName = getCookie('username');
    if (storedName) {
        let firstLetterName = storedName.charAt(0);
        let lastName = storedName.split(' ')[1];
        let firstLetterLastName = lastName ? lastName.charAt(0) : '';
        if (firstLetterName || firstLetterLastName) {
            document.getElementById('userLoginInitials').innerHTML = renderUserInitials(firstLetterName, firstLetterLastName);
        }
    }
}


/**
 * This function return the html template with the initials
 * 
 * @param {string} firstLetterName - This is the First Letter of the first name
 * @param {string} firstLetterLastName - This is the First Letter of the last name
 * @returns - return the html template
 */
function renderUserInitials(firstLetterName, firstLetterLastName) {
    if (!firstLetterLastName) {
        return `
        <span class="header-picture-user">${firstLetterName}</span>
        `;
    } else {
        return `
        <span class="header-picture-user">${firstLetterName}${firstLetterLastName}</span>
        `;
    }
}







/**
 * This function open the page help.html
 * 
 */
function openHelp() {
    window.location.href = 'help.html';
}




/**
 * This function open the header menu
 * 
 */
function openHeaderMenu() {
    document.getElementById('headerMenu').classList.remove('displayNone');
}


/**
 * This function close the header menu
 * 
 */
function closeHeaderMenu() {
    document.getElementById('headerMenu').classList.add('displayNone');
}