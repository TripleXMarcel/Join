function openBigView(taskId) {
    const bigCardContainer = document.getElementById('BigCardContainer');
    const clickedTask = tasks.find(task => task.id === taskId);
    const taskCopy = { ...clickedTask };

    bigCardContainer.innerHTML =
        BigViewHTML(taskCopy);
    renderAssignedTo(taskCopy);
    renderSubtasks(taskCopy, taskId);
    setPrioBigCard(taskCopy);

    bigCardContainer.style.visibility = 'visible';
    bigViewWindow = true;
    document.addEventListener('mousedown', clickOutsideHandlerBoard);
}

/**
 * renders the Assigned contacts to the task
 * @param {string} taskCopy a copy of a task to aviod modifying the original
 */
function renderAssignedTo(taskCopy) {
    let container = document.getElementById('assignedList');
    container.innerHTML = '';

    for (let i = 0; i < taskCopy.contact.length; i++) {
        let userDetailsResult = userDetails(taskCopy.contact[i].name);
        container.innerHTML += `<li class="assignedNames" ><div style="background-color: ${taskCopy.contact[i].color}" class="userInitilas">${userDetailsResult}</div><div>${taskCopy.contact[i].name}</div></li>`;
    }
}


/**
 * renders the assigned contact as icons on the tasks on board
 * @param {string} i index
 * @param {*} taskCopy a copy of a task to aviod modifying the original
 */
function renderAssignedToSmall(i, taskCopy) {
    let container = document.getElementById(`members${taskCopy.id}`);
    container.innerHTML = '';

    const maxDisplay = 3;
    const totalMembers = taskCopy.contact.length;

    for (let i = 0; i < Math.min(maxDisplay, totalMembers); i++) {
        let userDetailsResult = userDetails(taskCopy.contact[i].name);
        container.innerHTML += `<div  class="profile-badge" style="background-color: ${taskCopy.contact[i].color}">${userDetailsResult}</div>`;
    }

    if (totalMembers > maxDisplay) {
        container.innerHTML += `<div class="profile-badge batch">+${totalMembers - maxDisplay}</div>`;
    }
}


/**
 * renders the Subtasks or hides them depending if available on the popup
 * @param {string} taskCopy a copy of a task to aviod modifying the original
 * @param {*} taskId the unique id from a task
 */
function renderSubtasks(taskCopy, taskId) {
    let container = document.getElementById('bigSubsContainer');

    container.innerHTML = '';

    for (let i = 0; i < taskCopy.subtask.length; i++) {
        container.innerHTML += `<li id="bigSubtask${i}" onclick="checkSubtask(${taskId}, ${i})" class="${taskCopy.subtask[i].checked ? '' : ''}">
        <img id="subtaskImg${i}" src="${taskCopy.subtask[i].checked ? 'img/board/Checked button.png' : 'img/board/Check button.png'}" alt="Checkbox">${taskCopy.subtask[i].name}</li>`;
    }
    hideSubtasks(taskCopy);
    pushToBackend();
}


/**
 * Checks if subtasks exist and sets there display accordingly
 * @param {string} taskCopy a copy of a task to aviod modifying the original
 * @returns is used to exit the function early if ther are no subtasks
 */
function hideSubtasks(taskCopy) {
    let subtaskSection = document.getElementById('big-subtasks')

    // Check if subtasks exist
    if (taskCopy.subtask.length === 0) {
        subtaskSection.style.display = 'none';
        return;
    } else {
        subtaskSection.style.display = 'block';
    }
}

/**
 * is used to check or uncheck a subtask
 * @param {string} taskId the unique id of a task 
 * @param {string} index the index
 */
function checkSubtask(taskId, index) {
    tasks.find(task => task.id === taskId).subtask[index].checked = !tasks.find(task => task.id === taskId).subtask[index].checked;
    renderSubtasks(tasks.find(task => task.id === taskId), taskId);
}

/**
 * is used to Close the the detailview of a task
 */
function closeBigView() {
    assignedTo = [];
    subTasks = [];
    const bigCardContainer = document.getElementById('BigCardContainer')
    bigCardContainer.style.visibility = 'hidden';
    loadTasks();
    bigViewWindow = false;
    document.removeEventListener('mousedown', clickOutsideHandlerBoard);
}

async function moveTask(taskId, status) {
    let taskToMove = tasks.find(task => task.id === parseInt(taskId)); // Convert taskId to number for comparison
    if (taskToMove) {
        taskToMove.status = status;
        await sortTasks();
    } else {
        console.error('Task not found.');
    }
    closeBigView();
}

/**
 * sets the image accordingly to the importance of the task
 * @param {string} task a single task from the task array
 */
function setPrio(task) {
    let prioContainer = document.getElementById(`priority${task.id}`);
    let prioLow = `<img src="img/add-Task/Prio baja.png" alt="">`;
    let prioMedium = `<img src="img/add-Task/Capa 1.png" alt="">`;
    let prioHigh = `<img src="img/add-Task/Prio alta.png" alt="">`;

    if (prioContainer) {
        if (task.urgentprio[0] === 'green') {
            prioContainer.innerHTML = prioLow;
        } else if (task.urgentprio[0] === 'yellow') {
            prioContainer.innerHTML = prioMedium;
        } else if (task.urgentprio[0] === 'red') {
            prioContainer.innerHTML = prioHigh;
        }
    }

}
/**
 * sets the image accordingly to the importance of the task on the detailview
 * @param {string} task a single task from the task array
 */
function setPrioBigCard(task) {
    let prioContainer = document.getElementById(`big-priority`);
    let prioLow = `Low <img src="img/add-Task/Prio baja.png" alt="">`;
    let prioMedium = `Medium <img src="img/add-Task/Capa 1.png" alt="">`;
    let prioHigh = `High <img src="img/add-Task/Prio alta.png" alt="">`;

    if (prioContainer) {
        if (task.urgentprio[0] === 'green') {
            prioContainer.innerHTML = prioLow;
        } else if (task.urgentprio[0] === 'yellow') {
            prioContainer.innerHTML = prioMedium;
        } else if (task.urgentprio[0] === 'red') {
            prioContainer.innerHTML = prioHigh;
        }
    }
}

/**
 * deletes a task by clicking a button 
 * @param {string} taskId the unique id of a task 
 */
async function deleteTask(taskId) {
    const index = tasks.findIndex(task => task.id === taskId);
    if (index !== -1) {
        tasks.splice(index, 1);
        const cardToRemove = document.getElementById(`card${taskId}`);
        if (cardToRemove) {
            const bigCard = document.querySelector('.bigcard.popUp');
            bigCard.style.display = 'none';
            cardToRemove.remove();
        }
        console.log(tasks);
    }
    await pushToBackend();
    closeBigView();
}

/**
 * is used to accept the changes made by the editTask
 * @param {string} taskId the unique id of a task 
 */
async function done(taskId) {
    const index = tasks.findIndex(task => task.id === taskId);
    let status = tasks[index].status;
    selectedCategory = tasks[index].category;
    checkDropdown('card');
    tasks.splice(index, 1);
    tasks.push(getTaskContent(status, taskId));
    await pushToBackend();
    closeBigView();
}

function clickOutsideHandlerBoard(event) {
    let bigCardDiv = document.getElementById('bigcard');
    let addTaskDiv = document.getElementById('closeAddTask');
    if (!addTaskDiv.contains(event.target) && addTaskWindow === true) {
        closeAddTask();
    }
    else if (!bigCardDiv.contains(event.target) && bigViewWindow === true) {
        closeBigView();
    }
}

loadTasks();