/**
 * Adds the contents of the input field to the subtask list
 * 
 */
function addSubtask() {
    let content = document.getElementById('subtask'+card);
    if (content.value.trim() !== '') { // Überprüfe, ob der Input-Wert nicht leer ist
        subTasks.push(content.value);
        content.value = '';
        displaySubtasks();
    }
}

/**
 *  Deletes the contents of the input field
 *
 */
function clearInput() {
    let content = document.getElementById('subtask'+card);
    content.value = '';
    displaySubtasks();
}

/**
 * Gives options to add or delete the content in the list as soon as you click on the input field
 * 
 */
function changeImage(event) {
    let img = document.getElementById('subtask-img'+card);
    let hiddenImage = document.getElementById('hidden-image'+card);

    if (event === 'focus') {
        showImgOnFocus(img, hiddenImage)
    } else if (event === 'blur') {
        img.src = "./img/log-in/Subtasks icons11.png"; // Setze das Bild auf das Standard-Bild
        hiddenImage.classList.add('editImg');
    }
}

/**
 * This function shows the hidden options
 * 
 * @param {string} img - The tick picture
 * @param {string} hiddenImage - The trash can picture
 */
function showImgOnFocus(img, hiddenImage) {
    img.src = "./img/log-in/done.png"; // Setze das Bild auf das Fokus-Bild
        hiddenImage.classList.remove('editImg');
        img.addEventListener('mousedown', function(event) {
            event.preventDefault(); 
            addSubtask(); 
        });
        hiddenImage.addEventListener('mousedown', function(event) {
            event.preventDefault(); 
            clearInput(); 
        });
}

/**
 * Deletes the respective subtask
 * 
 * @param {string} index - respective subtask
 */
function deleteSubtask(index) {
    subTasks.splice(index, 1);
    displaySubtasks();
}

/**
 * Allows you to edit the respective subTask
 * 
 * @param {string} index -- respective subtask
 */
function editSubtask(index) {
    let listItem = document.getElementById('list'+card).getElementsByTagName('li')[index];
    let subtaskContent = listItem.firstChild.nodeValue.trim();

    let inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = subtaskContent;

    inputField.onblur = function () {
        subTasks[index] = this.value;
        displaySubtasks();
    };

    listItem.innerHTML = '';
    listItem.appendChild(inputField);
}

/**
 * Displays the entered subtasks as a list
 * 
 */
function displaySubtasks() {
    let listContainer = document.getElementById('list'+card);
    listContainer.innerHTML = '';

    for (let i = 0; i < subTasks.length; i++) {
        const createdSubtask = subTasks[i];
        let listItem = document.createElement('li');
        listItem.textContent = createdSubtask;
        listItem.classList.add('hidden');

        let buttonContainer = document.createElement('div');
        editAndDeleteBtn(buttonContainer, i);

        listItem.appendChild(buttonContainer);
        listContainer.appendChild(listItem);
    }
}

/**
 * Creates an edit and remove button
 * 
 * @param {string} buttonContainer - Creates an Div Container for the Buttons
 * @param {string} i -  The respective subtask
 */
function editAndDeleteBtn(buttonContainer, i) {
    let editImg = document.createElement('img');
    editImg.src = "./img/log-in/edit.png";
    editImg.className = "editImg";
    editImg.onclick = function () { editSubtask(i); };

    let deleteImg = document.createElement('img');
    deleteImg.src = "./img/log-in/delete.png";
    deleteImg.className = "editImg";
    deleteImg.onclick = function () { deleteSubtask(i); };

    buttonContainer.appendChild(deleteImg);
    buttonContainer.appendChild(editImg);
    buttonContainer.classList.add('button-position');
}


/**
 * This function resets the AddTask page
 * 
 */
function clearForm() {
    document.getElementById('titleInput'+card).value = '';
    document.getElementById('descriptionInput'+card).value = '';
    document.getElementById('date'+card).value = '';
    document.getElementById('checkedUserInitials'+card).innerHTML = '';
    document.getElementById('subtask'+card).value = '';
    document.getElementById('dropDownContacts' + card).innerHTML= '';
    resetArrays();
}

/**
 * This Function resets every Array on addTask
 * 
 */
function resetArrays() {
    assignedTo = [];
    urgentPrio = ['yellow'];
    prios = '';
    subTasks = [];
    selectedCategory = [];
    let subList = document.getElementById('list');
    subList.innerHTML = '';
    let options = document.getElementsByTagName("select");
    for (let i = 0; i < options.length; i++) {
        options[i].selectedIndex = 0;
    }
    let buttons = document.getElementsByClassName("btn-select");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("red", "yellow", "green");
    }
}