let currentDraggedElement;
let currentStatusBox;
let currentClickedElement;
let bigViewWindow = false;
let addTaskWindow = false;
let taskToMove;



/**
 * Loads the task from the backend and calls the sortTasks function 
 * when the board is loaded
 * 
 */
function loadTasks() {
    loadTask()
        .then(() => {
            sortTasks();
        })
        .catch(error => {
            console.log('Loading error:', error);
        });
}

/**
 * Sorts the tasks into the according containers based on there status value and renders them.
 * if the conatiner is empty it displays an div that says No tasks available
 * passes the tasks back to the backend to save changes.
 */
async function sortTasks() {
    let statusValues = ['toDo', 'inProgress', 'awaitFeedback', 'done'];

    for (let status of statusValues) {
        let filteredTasks = tasks.filter(t => t['status'] === status);
        let containerId = `${status}Container`;
        let containerElement = document.getElementById(containerId);
        containerElement.innerHTML = '';

        if (filteredTasks.length === 0) {
            containerElement.innerHTML = '<div class="empty-board-task" >No tasks available</div>';
        } else {
            for (let i = 0; i < filteredTasks.length; i++) {
                let task = filteredTasks[i];
                containerElement.innerHTML += taskCardHTML(i, task);
                renderAssignedToSmall(i, task);
                setPrio(task);
            }
        }
    }
    await pushToBackend();
}

/**
 * The created task is added to the array
 * 
 * @param {string} statusBox - Checks what status the respective task has
 */
async function boardPushToTask(statusBox) {
    let id = uniqueIdGenerator();
    checkDropdown();
    tasks.push(getTaskContent(statusBox, id));
    clearForm();
    await pushToBackend();
    loadTasks();
    closeAddTask();
}

/**
 * searches on the board for tasks based on the input 
 * If the trimmed value is an empty string, it calls updateTaskDisplay with the original list of tasks. 
 * 
 * @param {string} inputId the input from the searchbar
 */
function SearchOnBoard(inputId) {
    const searchQuery = document.getElementById(inputId).value.trim(); // Trim to handle spaces
    if (searchQuery === '') {
        updateTaskDisplay(tasks);
    } else {
        searchForTasks(searchQuery);
    }
}


/**
 * Uses the filter method on the tasks array to find tasks whose title or description includes the lowercased query
 * @param {string} query the trimmed input value from the searchbar
 */
function searchForTasks(query) {
    const lowerCaseQuery = query.toLowerCase();

    const searchResults = tasks.filter(task =>
        task.title.toLowerCase().includes(lowerCaseQuery) ||
        task.description.toLowerCase().includes(lowerCaseQuery)
    );

    updateTaskDisplay(searchResults);
}


/**
 * displays or hides the tasks based on the searchResult
 * @param {string} searchResults the result from the searchbar input
 */
function updateTaskDisplay(searchResults) {
    tasks.forEach(task => {
        const taskId = `card${task.id}`;
        const taskElement = document.getElementById(taskId);

        if (taskElement) {
            // If the task is in searchResults, make it visible; otherwise, hide it
            taskElement.style.display = searchResults.some(result => result.id === task.id) ? 'flex' : 'none';
        }
    });
}


/**
 * sets the currentDraggedElement to the selected task
 * @param {string} taskId the id of the dragged task
 */
function startDragging(taskId) {
    currentDraggedElement = taskId;
}

/**
 * 
 * @param {string} id the id of the container where task is fragged to 
 */
function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighlight() {
    document.getElementById('toDoContainer').classList.remove('drag-area-highlight');
    document.getElementById('inProgressContainer').classList.remove('drag-area-highlight');
    document.getElementById('awaitFeedbackContainer').classList.remove('drag-area-highlight');
    document.getElementById('doneContainer').classList.remove('drag-area-highlight');
}


/**
 * Opens the the Addtask as a popUp to create new tasks based on the chosen statusbox
 * @param {string} statusBox Checks what status the respective task has
 */
function openAddTask(statusBox) {
    if (isMobile()) {
        switchToAddTask(statusBox);
    } else {
        let addTask = document.getElementById('openAddTask');
        addTask.style.visibility = 'visible';

        // Update the currentStatusBox variable
        currentStatusBox = statusBox;
        card = '';
        document.addEventListener('mousedown', clickOutsideHandlerBoard);
        addTaskWindow = true;
    }
}

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}


/**
 * closes the addtask popup
 */
function closeAddTask() {
    let addTask = document.getElementById('openAddTask')
    clearForm();
    addTask.style.visibility = 'hidden';
    addTaskWindow = false;
    document.removeEventListener('mousedown', clickOutsideHandlerBoard);
}


/**
 * switches to the add_task.html (only in use on mobile version of join)
 * @param {*} statusBox Checks what status the respective task has
 */
function switchToAddTask(statusBox) {
    currentStatusBox = statusBox;
    window.location.href = 'add_task.html';
}


/**
 * changes the status of the task to match the dragged container
 * @param {string} status the status value of the container the task is dragged on
 */
function moveTo(status) {
    const draggedTask = tasks.find(task => task.id === currentDraggedElement);
    if (draggedTask) {
        draggedTask.status = status;
        sortTasks();
    } else {
        console.error('Task not found.');
    }
}


/**
 * allowes the drag and drop for tasks
 * @param {string} ev 
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * Creates a copy of the task to avoid modifying the original task
 * opens a detailed view of the selected task
 * @param {string} taskId the uniwue id from a task
 */
