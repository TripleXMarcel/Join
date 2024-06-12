let contacts = [];
let editContactValue;
let letters = [];
let contact;
let edit = false;
let add = false;


/**
 * This function load all necessary functions onload of the html page
 * 
 */
async function initContacts() {
    await loadContacts();
    fillLetter();
    loadLetters();
    sortContacts();
    renderContacts();
}

/**
 * This function sort the Contacts
 * 
 */
function sortContacts() {
    contacts.sort(function (a, b) {
        return a.name.localeCompare(b.name);
    });
}


/**
 * This function load all Contacts from the Backend
 * 
 */
async function loadContacts() {
    try {
        contacts = JSON.parse(await getItem('contact2'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

/**
 * This function check the Input
 * 
 */
function checkInput() {
    var inputValue = document.getElementById('name').value.trim();
    var words = inputValue.split(' ');
    if (words.length === 2) {
        addContact();
    } else {
        alert('Die Eingabe muss genau zwei Wörter enthalten.');
    }
}


/**
 * This function add a contact to the Backend
 * 
 */
async function addContact() {
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let phone = document.getElementById('phone');
    let color = getRandomColor();
    contacts.push({ name: name.value, email: email.value, phone: phone.value, bgColor: color });
    await setItem('contact2', JSON.stringify(contacts));
    closeAddContact('addContact');
    resetAddContact(name, email, phone);
    initContacts();
}

/**
 * This function returns a random color from an array
 * 
 * @returns a random color
 */
function getRandomColor() {
    let colors = [
        '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6',
        '#1abc9c', '#34495e', '#e67e22', '#d35400', '#2980b9',
        '#c0392b', '#27ae60', '#8e44ad', '#16a085', '#f1c40f'
    ];
    let randomIndex = Math.floor(Math.random() * colors.length);
    let randomColor = colors[randomIndex];

    return randomColor;
}


/**
 * Reset the input fields
 * 
 * @param {string} name - empty string
 * @param {string} email - empty string
 * @param {string} phone - empty string
 */
function resetAddContact(name, email, phone) {
    name.value = '';
    email.value = '';
    phone.value = '';
}


/**
 * This function render all Contacts and load them on the html page
 * 
 */
function renderContacts() {
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        let firstLetterName = contact.name.charAt(0);
        let lastName = contact.name.split(' ')[1];
        let firstLetterLastName = lastName.charAt(0);
        document.getElementById(firstLetterName).innerHTML += showAvailableContactsHTML(contact, firstLetterName, firstLetterLastName, i);
    }
}

/**
 * Fills an array with unique letters based on the first letter of names in the contacts array.
 * 
 */
function fillLetter() {
    letters = [];
    for (let i = 0; i < contacts.length; i++) {
        let name = contacts[i]['name'];
        let letter = name.charAt(0);
        if (!letters.includes(letter)) {
            letters.push(letter);
        }
    }
    letters.sort();
}


/**
 * This function set the order for the contactlist on the html page
 * 
 */
function loadLetters() {
    let container = document.getElementById('contact-list');
    container.innerHTML = '';
    for (let i = 0; i < letters.length; i++) {
        const element = letters[i];
        container.innerHTML += letterHTML(element);
    };
}

/**
 * This function show the contact in detail
 * 
 * @param {number} i - index of contact
 */
function showContact(i) {
    hideheiglightedContact();
    let name = contacts[i].name;
    let nachName = name.split(' ')[1];
    let firstLetterLastName = nachName.charAt(0);
    let email = contacts[i].email;
    let phone = contacts[i].phone;
    let color = contacts[i].bgColor;
    document.getElementById(`contact${i}`).classList.add('heighlight');
    document.getElementById('showedContact').innerHTML = ``;
    document.getElementById('showedContact').innerHTML = showContactHTML(name, email, phone, i, firstLetterLastName, color);
    if (window.innerWidth <= 700) { showContactMobile(); }
}

function hideheiglightedContact() {
    for (let i = 0; i < contacts.length; i++) {
        document.getElementById(`contact${i}`).classList.remove('heighlight');
    }
}


/**
 * This function is for the detail contact view when the window has a smaller width then 700px
 * 
 */
function showContactMobile() {
    document.getElementById('contact-list').classList.add('displayNoneMobile');
    document.getElementById('addContactBTN').classList.add('displayNoneMobile');
    document.getElementById('showedContact').classList.remove('displayNoneMobile');
    document.getElementById('headline-contacts-container').classList.remove('displayNoneMobile');
    document.getElementById('menuContactBTN').classList.remove('displayNone');
    document.getElementById('arrowLeft').classList.remove('displayNone');
}


/**
 * This function hide the mobile contact view
 */
function hideContactMobile() {
    document.getElementById('contact-list').classList.remove('displayNoneMobile');
    document.getElementById('addContactBTN').classList.remove('displayNoneMobile');
    document.getElementById('showedContact').classList.add('displayNoneMobile');
    document.getElementById('headline-contacts-container').classList.add('displayNoneMobile');
    document.getElementById('menuContactBTN').classList.add('displayNone');
    document.getElementById('arrowLeft').classList.add('displayNone');
}


/**
 * This function delete the Contact 
 * 
 * @param {number} i - index
 */
async function deleteContact(i) {
    document.getElementById('contactOptions').classList.add('displayNoneMobile');
    contacts.splice(i, 1);
    await setItem('contact2', JSON.stringify(contacts));
    document.getElementById('showedContact').innerHTML = ``;
    initContacts();
    hideContactMobile();
}


/**
 * This function open the Edit Contact window
 * 
 * @param {number} i - index
 */
function openEditContact(i) {
    document.getElementById('contactOptions').classList.add('displayNoneMobile');
    showAddContact('editContact');
    loadEditContact(i);
    editContactValue = i;
}


/**
 * This function set all input values for edeting the contact
 * 
 * @param {number} i - index
 */
function loadEditContact(i) {
    let name = contacts[i].name;
    let email = contacts[i].email;
    let phone = contacts[i].phone;
    let nameInput = document.getElementById('nameEdit');
    let emailInput = document.getElementById('emailEdit');
    let phoneInput = document.getElementById('phoneEdit');
    nameInput.value = name;
    emailInput.value = email;
    phoneInput.value = phone;
    contact = i;
}


/**
 * This function save the edit contact
 * 
 */
async function editContact() {
    let nameInput = document.getElementById('nameEdit');
    let emailInput = document.getElementById('emailEdit');
    let phoneInput = document.getElementById('phoneEdit');
    let color = contacts[contact].bgColor;
    contacts[editContactValue] = ({ name: nameInput.value, email: emailInput.value, phone: phoneInput.value, bgColor: color });
    await setItem('contact2', JSON.stringify(contacts));
    closeAddContact('editContact');
    initContacts();
}


/**
 * This function open contact options
 * 
 */
function openContactOptions() {
    document.getElementById('contactOptions').classList.remove('displayNoneMobile');
}

function clickOutsideHandlerContact(event) {
    let editContactDiv = document.getElementById('editContactMainContainer');
    let addContactDiv = document.getElementById('addContactMainContainer');
    if (!editContactDiv.contains(event.target) && edit === true) {
        closeAddContact('editContact');
    }
    if (!addContactDiv.contains(event.target) && add === true) {
        closeAddContact('addContact');
    }
}
