/**
 * creates the HTML for every task
 * @param {string} i index
 * @param {string} task 
 * @returns HTML Template
 */
function taskCardHTML(i, task) {
    const numberOfCheckedSubtasks = task.subtask.filter(subtask => subtask.checked).length;
    let hasSubtasks = task.subtask.length > 0;
    let fillersize = (numberOfCheckedSubtasks / task.subtask.length * 100);
    let backgroundColor = 'background-color: #0038FF';

    if (task.category == 'Technical Task') {
        backgroundColor = 'background-color: #1FD7C1;'
    }

    return `
    <article id="card${task.id}" class="card" draggable="true" ondragstart="startDragging(${task.id})" onclick="openBigView(${task.id})">
        <div class="cardLabel" style="${backgroundColor}" id="cardLabel${i}">${task.category}</div>
        <div class="card-header" id="cardHeader${i}">${task.title}</div>
        <div class="card-content" id="cardContent${i}">${task.description}</div>
        
        ${hasSubtasks ? `
            <div class="card-progress" id="cardProgress${i}">
                <div class="progressbar" id="progressbar${i}"> <div class="filler" style="width:${fillersize}%;"></div> </div>
                <div class="subtasks" id="subtasks${i}">${numberOfCheckedSubtasks}/${task.subtask.length} Subtasks</div>
            </div>
        ` : ''}

        <div class="organisation" id="organisation${i}">
            <div class="members" id="members${task.id}"><img src="img/header/User profile initials.png" alt="" class="profile-badge"></div>
            <div class="prority" id="priority${task.id}"><img src="" alt="">${task.urgentprio}</div>
        </div>
    </article>
    `;
}


function displayMoveOptions(taskId) {
    const cardContent = document.getElementById('bigcard');
    cardContent.innerHTML = '';

    cardContent.innerHTML = `
    <div class="cardoptions">
    
    <div style="display: flex; justify-content: space-between;">
        <span class="bigcard-header" >Move to</span> 
        <button onclick="closeBigView()" class="close-Btn"><img src="img/board/close.png"
        alt=""></button>
    </div>
    <div class="options-container">
    <div onclick="moveTask('${taskId}', 'toDo')" class="option-point">To Do</div>
    <div onclick="moveTask('${taskId}', 'inProgress')" class="option-point">In Progress</div>
    <div onclick="moveTask('${taskId}', 'awaitFeedback')" class="option-point">Await Feedback</div>
    <div onclick="moveTask('${taskId}', 'done')" class="option-point">Done</div>
    
    </div>
`
}



/**
 * creates the HTML for the detailedview
 * @param {string} taskCopy a copy of a task to aviod modifying the original
 * @returns the HTML Template
 */
function BigViewHTML(taskCopy) {
    return `
    <article id="bigcard" class="bigcard popUp">
    <div style="display: flex; justify-content: space-between;">
    <div class="bigcardLabel" id="big-cardLabel">${taskCopy.category}</div> 
    <button onclick="closeBigView()" class="close-Btn"><img src="img/board/close.png" alt=""></button>
    </div>
    
    <div class="bigcard-header" id="big-cardHeader">${taskCopy.title}</div>
    <div class="bigcard-content" id="big-cardContent">${taskCopy.description}</div>
    <div class="bigcard-duedate" id="big-cardDueDate">
        <table>
            <tr>
                <td>Due date:</td>
                <td>${taskCopy.date}</td>
            </tr>
        </table>
    </div>
    <div id="prioDiv" class="bigprority">
    <table>
        <tr>
            <td>Priority:</td>
            <td id="big-priority">${taskCopy.urgentprio}</td>
        </tr>
    </table>
    </div>
        
    </div>
    <div id="assignedDiv">
        <span>Assigned to:</span>
        <ul id="assignedList" class="list">
            <li>${taskCopy.contact}</li>
            <li>placeholder</li>
            <li>placeholder</li>
        </ul>
    </div>




    <div class="" id="big-subtasks">
        <span>Subtasks</span>
        <ul id="bigSubsContainer" class="subList">
            <li>${taskCopy.subtask}</li>
            <li>placeholder</li>
            <li>placeholder</li>
        </ul>
    </div>



    
    <div id="okBtn" class="edit">
        <div onclick="deleteTask(${taskCopy.id})" style="cursor: pointer"><img src="img/board/delete.png"> Delete</div>
        <div><img src="img/board/vector.png" alt=""></div>
        <div onclick="editTask(${taskCopy.id})" style="cursor: pointer"><img src="img/board/edit.png"> Edit</div>
        <div><img src="img/board/vector.png" alt=""></div>
        <div  id="moveCard" onclick="displayMoveOptions(${taskCopy.id})" style=" filter: brightness(0.5); cursor: pointer"><img src="img/sidebar/iconBoard.png"> Move</div>
    </div>

</article>
    `
}

/**
 * opens a formula to edit a task 
 * @param {string} taskId the unique id of a task 
 */
function editTask(taskId) {
    const clickedTask = tasks.find(task => task.id === taskId);
    for (let i = 0; i < clickedTask.contact.length; i++) {
        assignedTo.push(clickedTask.contact[i].name);
    }
    for (let i = 0; i < clickedTask.subtask.length; i++) {
        subTasks.push(clickedTask.subtask[i].name);
    }
    card = 'Card';

    let bigCardHeader = document.getElementById('big-cardHeader');
    let bigCardContent = document.getElementById('big-cardContent');
    let bigCardDueDate = document.getElementById('big-cardDueDate');
    let dateText = bigCardDueDate.querySelector('td:nth-child(2)').innerText;
    let currentDate = new Date().toISOString().split('T')[0];
    let bigPriority = document.getElementById('prioDiv');
    let clickedBtn = bigPriority.querySelector('td:nth-child(2)').innerText;
    let bigAssignedList = document.getElementById('assignedDiv');
    let bigSubtaskList = document.getElementById('big-subtasks');
    let okButton = document.getElementById('okBtn');
    bigSubtaskList.style.display = 'block';



    bigCardHeader.innerHTML = `<div class="edit-title"><p>Title</p><input id="titleInputCard" type="text" value="${bigCardHeader.innerText}"></div>`;
    bigCardContent.innerHTML = `<div class="edit-description"><p>Description</p><textarea id="descriptionInputCard">${bigCardContent.innerText}</textarea></div>`;
    bigCardDueDate.innerHTML = `<div class="edit-date"><p style="margin: 0;">Due date</p><input required type="date" placeholder="dd/mm/yyyy" id="dateCard" min="${currentDate}" value="${dateText}"></div>`;
    bigPriority.innerHTML = `<div class="edit-prio"> <p style="margin: 0;">Prio</p> <div class="edit-prio-selection"> 
    <button type="button" onclick="getPrio(this)" class="edit-btn-select ${clickedBtn === 'red' ? 'edit-selected-red' : ''}" id="urgentBtnCard"><p>Urgent</p><img src="./img/add-Task/Prio alta.png"></button> 
    <button type="button" onclick="getPrio(this)" class="edit-btn-select ${clickedBtn === 'yellow' ? 'edit-selected-yellow' : ''}" id="mediumBtnCard"><p>Medium</p><img src="./img/add-Task/Capa 1.png"></button> 
    <button type="button" onclick="getPrio(this)" class="edit-btn-select ${clickedBtn === 'green' ? 'edit-selected-green' : ''}" id="lowBtnCard"><p>Low</p><img src="./img/add-Task/Prio baja.png"></button> </div> </div>`;

    bigAssignedList.innerHTML =
        `<div class="edit-contact">
    <label for="contacts">Assigned to</label>
    <div class="edit-containerDropDown">
    <div class="edit-inputDropDown">
        <input id="inputDropDownCard" type="text" onkeyup="search('Card')" placeholder="Select contacts to assign">
        <img id="openDropdownCard" onclick="checkDropdown('Card')" src="img/add-Task/arrow_drop_down.svg" alt="">
    </div>

    <div id="dropDownContactsCard" style="z-index: 999; background-color: white;">

    </div>
    </div>
    <div id="checkedUserInitialsCard">

    </div>
    </div>`;
    bigSubtaskList.innerHTML = `<div class="edit-subtask">
    <p style="margin: 0;">Subtasks</p>
    <input id="subtaskCard" type="text" placeholder="Add new subtask" onfocus="changeImage('focus')" onblur="changeImage('blur')">
    <div class="edit-pngs">
    <img onclick="addSubtask()" src="./img/log-in/Subtasks icons11.png"
        id="subtask-imgCard">
    <img onclick="clearInput()" id="hidden-imageCard" class="editImg"
        src="./img/log-in/delete.png">
    </div>
    <ul class="edit-subtask-list" id="listCard"></ul>
    </div>`;

    okButton.innerHTML = `
    <div onclick="done(${taskId})" class="board-add-task-button">
    <img src="./img/board/check.png"> OK
    </div>`

    displaySubtasks();
    closeDropdown();
}