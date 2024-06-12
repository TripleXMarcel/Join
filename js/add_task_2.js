/**
 * Shows which contact was clicked on
 * 
 * @param {string} loggedIn - shows you
 * @param {string} userInitials -The initials of the contact
 * @param {string} userName -The Name of the contact
 * @returns - The updated checkbox
 */
function showUsersHTMLunchecked(userInitials, userName, loggedIn, color) {
    return `
      <div class="dropDownContent" onclick="toggleCheckbox('${userName}')">
        <div class="userInitilas"  style="background-color: ${color}">${userInitials}</div>
        <div class="userName">${userName + loggedIn}</div>
        <input id="${userName}" class="checkBox" type="checkbox" name="myCheckbox" value="${userName}">
      </div>
    `;
}

/**
 * Shows which contact was not clicked on
 * 
 * @param {string} loggedIn - shows you
 * @param {string} userInitials -The initials of the contact
 * @param {string} userName -The Name of the contact
 * @returns -The updated checkbox
 */
function showUsersHTMLchecked(userInitials, userName, loggedIn, color) {
    return `
      <div class="dropDownContent" onclick="toggleCheckbox('${userName}')">
        <div class="userInitilas"  style="background-color: ${color}">${userInitials}</div>
        <div class="userName">${userName + loggedIn}</div>
        <input id="${userName}" class="checkBox" type="checkbox" name="myCheckbox" value="${userName}" checked>
      </div>
    `;
}

/**
 * This function allows the contact to also be clicked outside of the box
 * 
 * @param {string} userName - The Name of the contact
 */
function toggleCheckbox(userName) {
    const checkbox = document.getElementById(userName);
    checkbox.checked = !checkbox.checked;

    if (checkbox.checked) {
        checkbox.parentElement.classList.add('checked');
    } else {
        checkbox.parentElement.classList.remove('checked');
    }
}

/**
 * Closes Dropbox again when you click on the image or outside of it
 * 
 */
function closeDropdown() {
    document.getElementById('openDropdown' + card).style.transform = 'rotate(0deg)';
    let checkboxes = document.querySelectorAll('input[type="checkbox"]');
    let dropDown = document.getElementById('dropDownContacts' + card);
    let assignedToInitials = document.getElementById('checkedUserInitials' + card);
    dropDown.innerHTML = '';
    checkboxes.forEach(function (checkbox) {
        if (checkbox.checked && !assignedTo.includes(checkbox.value)) {
            assignedTo.push(checkbox.value);
        }
        if (!checkbox.checked && assignedTo.includes(checkbox.value)) {
            assignedTo.splice(checkbox.value, 1);
        }
    });
    showInitials(assignedToInitials)
    removeByClick(assignedToInitials, checkboxes);
}

/**
 * This function allows you to close Dropbox outside of Dropbox
 * 
 */
function addClickOutsideListener() {
    document.addEventListener('click' + card, function (event) {
        let dropdown = document.getElementById('dropDownContacts' + card);
        let isClickedInsideDiv = dropdown.contains(event.target);
        let isButtonClick = event.target.id === 'openDropdown' + card;
        if (!isClickedInsideDiv && open === true && !isButtonClick) {
            checkDropdown();
        }
    });
}

/**
 * Shows the first letter of the first and last name and adds them below the input field
 * 
 * @param {string} assignedToInitials - first letter of the first and last name
 */
function showInitials(assignedToInitials) {
    assignedToInitials.innerHTML = '';
    assignedTo.forEach(assignedName => {
        const contact = contacts.find(contact => contact.name === assignedName);
        if (contact) {
            assignedToInitials.innerHTML += showCheckedUserInitials(userDetails(contact.name), contact.name, contact.bgColor);
        }
    });
}

/**
 * Removes the initials and updates the checkbox
 * 
 * @param {string} assignedToInitials - first letter of the first and last name
 * @param {string} checkboxes - The respective contact in a checkbox
 */
function removeByClick(assignedToInitials, checkboxes) {
    assignedToInitials.addEventListener('click', function (event) {
        if (event.target.classList.contains('userInitilas')) {
            event.target.remove();
            let initialsToRemove = event.target.textContent.trim();
            checkboxes.forEach(function (checkbox) {
                if (checkbox.value === initialsToRemove) {
                    checkbox.checked = false;
                }
            });
        }
    });
}

/**
 * Adds the initials for each clicked contact under the input field
 * 
 * @param {*} userInitials -The initials of the contact
 * @param {*} element - The respective contact
 * @returns - An icon with the initials
 */
function showCheckedUserInitials(userInitials, element, color) {
    return `<div id="userInitilas" style="background-color: ${color}" onclick="deleteCheckedUser('${element}')" class="userInitilas">${userInitials}</div>`;
}


/**
 * Removes the respective icon that was clicked
 * 
 * @param {string} initials - The respective icon
 */
function deleteCheckedUser(initials) {
    const index = assignedTo.indexOf(initials);
    if (index !== -1) {
        assignedTo.splice(index, 1);
    }
    showCheckedUserInitials()
}

/**
 * Shows which button was clicked
 * 
 * @param {string} button - The clicked button
 */
function getPrio(button) {
    prioColor(button);
    prios = button;
}

/**
 * Displays the color of the button clicked
 * 
 * @param {string} button - The clicked button
 */
function prioColor(button) {
    let red = document.getElementById('urgentBtn' + card);
    let yellow = document.getElementById('mediumBtn' + card);
    let green = document.getElementById('lowBtn' + card);
    pushToArray(button, red, yellow, green)
}

/**
 * Adds the clicked button with the appropriate color to the array
 * 
 * @param {string} button - The clicked button
 * @param {string} red - The Urgent Button
 * @param {string} yellow - The Medium Button
 * @param {string} green - The Low Button
 */
function pushToArray(button, red, yellow, green) {
    if (button === red) {
        urgentPrio = ['red'];
        button.classList.add('red');
        yellow.classList.remove('yellow');
        green.classList.remove('green');
    } else if (button === yellow) {
        urgentPrio = ['yellow'];
        button.classList.add('yellow');
        red.classList.remove('red');
        green.classList.remove('green');
    } else if (button === green) {
        urgentPrio = ['green'];
        button.classList.add('green');
        red.classList.remove('red');
        yellow.classList.remove('yellow');
    }
}