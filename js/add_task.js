let prios = '';
let status = '';
let tasks = [];
let assignedTo = [];
let urgentPrio = ['yellow'];
let contactsDisplayed = false;
let selectedCategory = [];
let subTasks = [];
let open = false;
let user;
let card = '';
let selectedContactName = [];

/**
 * This function load all necessary functions onload of the html page
 * 
 */
async function initTasks() {
    await loadTask();
    let currentDate = new Date().toISOString().split('T')[0];
    let futureDateInput = document.getElementById('date');
    futureDateInput.min = currentDate;
}

/**
 * This function load all Tasks from the Backend
 * 
 */
async function loadTask() {
    try {
        tasks = JSON.parse(await getItem('task'));
        contacts = JSON.parse(await getItem('contact2'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

/**
 * This function sets a own ID for each Task
 * 
 * @returns Specifies the time when the task was created
 */
function uniqueIdGenerator() {
    const timestamp = new Date().getTime();
    return timestamp;
}

/**
 * The created task is added to the array
 * 
 * @param {string} statusBox - Checks what status the respective task has
 */
async function pushToTask(statusBox) {
    let id = uniqueIdGenerator();
    startAnimation();
    tasks.push(getTaskContent(statusBox, id));
    await pushToBackend();
}

/**
 * gets the values ​​from the task page
 * 
 * @param {string} statusBox - - Checks what status the respective task has
 * @returns 
 */
function getTaskContent(statusBox, id) {
    let title = document.getElementById('titleInput' + card).value;
    let description = document.getElementById('descriptionInput' + card).value;
    let date = document.getElementById('date' + card).value;
    let selectedContactName = searchUser();
    const task = {
        id: id,
        status: statusBox,
        title,
        description,
        contact: selectedContactName,
        prio: prios,
        date,
        category: selectedCategory,
        subtask: subTasks.map(subtask => ({ name: subtask, checked: false })), // Include 'checked' property
        urgentprio: urgentPrio
    };
    return task;
}

function searchUser() {
    let selectedContactName = [];
    assignedTo.forEach(assignedName => {
        const contact = contacts.find(contact => contact.name === assignedName);
        if (contact) {
            selectedContactName.push({ name: contact.name, color: contact.bgColor });
        }
    });
    return selectedContactName;
}


function validateCategory() {
    let category = document.getElementById('category');
    let selectedCategoryIndex = category.selectedIndex;
    let selectedCategoryName = category.options[selectedCategoryIndex].text;
    if (selectedCategoryName !== 'Select task Category') {
        if (selectedCategory.length > 0) {
            selectedCategory.pop();
        }
        selectedCategory.push(selectedCategoryName);
    }
}

/**
 * A popup appears after creating a task
 * 
 */
function startAnimation() {
    let animation = document.getElementById('animation');
    animation.classList.remove('displayNone');
    animation.classList.add('success');
    animation.style.bottom = '50%';
    setTimeout(() => {
        window.location.href = 'board.html';
    }, 1500);
}

/**
 * The task array is inserted into the backend
 * 
 */
async function pushToBackend() {
    await setItem('task', JSON.stringify(tasks));
}

/**
 * This function searches for the respective contacts when you enter the name in the input field
 * 
 */
function search() {
    closeDropdown();
    openDropdown();
    open = true;
}

/**
 * Shows every contact including the logged In User
 * 
 */
function checkDropdown() {
    user = getCookie('username');
    if (open === false) {
        openDropdown();
        open = true;
    } else {
        closeDropdown();
        open = false;
    }
}

/**
 * Opens the Dropbox with all registered teammates and the current user
 * 
 */
function openDropdown() {
    document.getElementById(`openDropdown` + card).style.transform = 'rotate(180deg)';
    let dropDown = document.getElementById('dropDownContacts' + card);
    document.getElementById('checkedUserInitials' + card).innerHTML = '';
    dropDown.innerHTML = '';
    dropDown.innerHTML = isChecked(userDetails(user), user, ' (You)');
    for (let i = 0; i < contacts.length; i++) {
        const element = contacts[i];
        dropDown.innerHTML += isChecked(userDetails(element.name), element.name, '', element.bgColor);
    }
    addClickOutsideListener();
}

/**
 * Shows contacts by their full names
 * 
 * @param {string} name - The Name of the contact
 * @returns - Contacts are not displayed if nothing was found
 */
function userDetails(name) {
    if (name && name.length > 0) {
        let firstLetterName = name.charAt(0);
        let lastName = name.split(' ')[1];
        let firstLetterLastName = lastName ? lastName.charAt(0) : '';
        return firstLetterName + firstLetterLastName;
    } else {
        return '';
    }
}

/**
 * Checks which contact was clicked on
 * 
 * @param {string} loggedIn - shows you
 * @param {string} userInitials - Searches for the respective contact using the input in the input field
 * @param {string} userName - Displays the clicked contact
 * @returns - All unclicked contacts
 */
function isChecked(userInitials, userName, loggedIn, bgColor) {
    let searchValue = document.getElementById('inputDropDown' + card).value.toLowerCase();
    let userNameLower = userName.toLowerCase();
    if (userNameLower.includes(searchValue)) {
        if (assignedTo.includes(userName)) {
            return showUsersHTMLchecked(userInitials, userName, loggedIn, bgColor);
        } else {
            return showUsersHTMLunchecked(userInitials, userName, loggedIn, bgColor);
        }
    } else {
        return '';
    }
}

