const mobileScreenDisplayed = sessionStorage.getItem('mobileScreenDisplayed'); //sessionStorage wird nach browser schließen, gilt für eine Sitzung

async function initSummary() {
    if (window.innerWidth <= 400 && !mobileScreenDisplayed) {
        greetingScreenMobile();
        sessionStorage.setItem('mobileScreenDisplayed', 'true');
    }
    await loadTask();
    let tasksInBoard = tasks.length;
    let storedName = getCookie('username');
    renderTasks(tasksInBoard, storedName);
}

/**
 * This function greets the guest or logged in user in the mobile version before the summary components are shown
 * 
 */
function greetingScreenMobile() {
    document.getElementById('mobileLeft').style.display = 'none';
    document.getElementById('mobileRight').style.display = 'flex';
    setTimeout(() => {
        document.getElementById('mobileRight').classList.add('animateOut');
        setTimeout(() => {
            document.getElementById('mobileLeft').style.display = 'block';
            document.getElementById('mobileRight').style.display = 'none';
            document.getElementById('mobileRight').classList.remove('animateOut');
        }, 500);
    }, 1700);
}

/**
 * This function display the tasks with status or without
 * 
 * @param {number} tasksInBoard - total tasks in board
 * @param {string} storedName - Logged User or guest
 */
function renderTasks(tasksInBoard, storedName) {
    getTasksData();

    document.getElementById('tasksInBoard').innerHTML = `${tasksInBoard}`;
    document.getElementById('tasksUrgent').innerHTML = renderUrgentTasksHTML();
    document.getElementById('urgentDeadline').innerHTML = renderUrgentDate();
    document.getElementById('loggedUserGreetings').innerHTML = renderLoggedUserGreetings(storedName);
    document.getElementById('tasksToDo').innerHTML = `${tasksToDo}`;
    document.getElementById('tasksDone').innerHTML = `${tasksDone}`;
    document.getElementById('tasksInProgress').innerHTML = `${tasksinProgress}`;
    document.getElementById('tasksAwaitingFeedback').innerHTML = `${tasksAwaitFeedback}`;
    document.getElementById('greetingDate').innerHTML = greetingDate();
}

/**
 * This function arrange the tasks in depending on their status
 * 
 *  @returns -tasks with status
 */
function getTasksData() {
    resetCounters();

    for (let i = 0; i < tasks.length; i++) {
        countTasks(tasks[i]);
    }

    return {
        tasksInBoard: tasks.length,
        tasksToDo,
        tasksDone,
        tasksinProgress,
        tasksAwaitFeedback
    };
}

/**
 * This function set the counters of the tasks with status
 * 
 */
function resetCounters() {
    tasksToDo = 0;
    tasksDone = 0;
    tasksinProgress = 0;
    tasksAwaitFeedback = 0;
}

/**
 * This function count the tasks with status
 * 
 */
function countTasks(task) {
    if (task.status) {
        if (task.status.includes('toDo')) {
            tasksToDo++;
        } else if (task.status.includes('done')) {
            tasksDone++;
        } else if (task.status.includes('inProgress')) {
            tasksinProgress++;
        } else if (task.status.includes('awaitFeedback')) {
            tasksAwaitFeedback++;
        }
    }
}

/**
 * This function arrange tasks with priority
 * 
 */
function renderUrgentTasksHTML() {
    let numberOfRedTasks = 0;

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        if (task.urgentprio && task.urgentprio.includes('red')) {
            numberOfRedTasks++;
        }
    }
    return `${numberOfRedTasks}`;
}

/**
 * This function arrange the earliest date form tasks with priority
 * 
 */
function renderUrgentDate() {
    let earliestRedDate = null;

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        earliestRedDate = findDate(task, earliestRedDate);
    }

    if (earliestRedDate) {
        return `${earliestRedDate}`;
    } else {
        return `Kein dringendes Datum`;
    }
}

/**
 * This function find the earliest date
 * 
 */
function findDate(task, earliestRedDate) {
    if (task.urgentprio && task.urgentprio.includes('red') && task.date) {
        if (!earliestRedDate || task.date < earliestRedDate) {
            earliestRedDate = task.date;
            const [year, month, day] = earliestRedDate.split('-');
            earliestRedDate = `${day}-${month}-${year}`;
        }
    }
    return earliestRedDate;
}

/**
 * This function display guest or logged user in the greeting
 * 
 *   @param {string} storedName - Logged User or guest
 */
function renderLoggedUserGreetings(storedName) {
    if (storedName === 'Guest' || storedName === null) {
        return ``;
    } else {
        return `${storedName}!`;
    }
}


function openBoard() {
    window.location.href = 'board.html';
}

/**
 * This function greets the user in depending on the day time
 * 
 */
function greetingDate() {
    let currentTime = new Date();
    let hours = currentTime.getHours();
    let greeting;

    if (hours < 12) {
        greeting = "Good morning";
    } else if (hours < 18) {
        greeting = "Good afternoon";
    } else {
        greeting = "Good evening";
    }

    return greeting;
}