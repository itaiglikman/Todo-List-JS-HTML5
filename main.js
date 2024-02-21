"use strict";

// check calculateMinDate() again, try to disable past time.
// find how to do fade in on real last child in addTask only.
// unique font.
// background image
// form image
// task image


// on page load - print exciting tasks on page:
displayTaskAtLoad();

// on submit the function will: 
// 1. get the input values.
// 2. check if valid and print the error message.
// 3. insert the new information to the local storage.
// 4. clear the input fields.
// 5. print the new task.
function save() {

    // prevent from submission:
    event.preventDefault();

    // get new input values:
    let titleBox = document.getElementById("titleBox");
    let descriptionBox = document.getElementById("descriptionBox");
    let deadlineBox = document.getElementById("deadlineBox");

    let title = titleBox.value;
    // if original text contains multiply line the function will add it:
    let description = textareaFormattedText(descriptionBox.value);
    // set deadline format from UTC to default:
    let deadline = new Date(deadlineBox.value);

    // input validation:
    // if isValidInput return false(contain error message) - activate. 
    let isValid = isValidInput(title, description, deadline);
    if (!isValid) return isValid;

    // insert new input to an object:
    let taskInfo = { title, description, deadline };

    // check if local storage contains past info - use the exciting array.
    // else - set a new one.
    let json = localStorage.getItem("taskArr");
    let taskArr = json ? JSON.parse(json) : [];

    // insert the new info to the array and local storage:
    taskArr.push(taskInfo);
    json = JSON.stringify(taskArr);
    localStorage.setItem("taskArr", json);

    // clear input fields:
    titleBox.value = "";
    descriptionBox.value = "";
    deadlineBox.value = "";

    // print new task on page:
    displayNewTask(taskArr);
}

// when getting value of textarea, js omits the new line orders.
// the function get a textarea text and reformat to a text which contains new lines order: 
function textareaFormattedText(text) {
    let formattedText = text.replace(/\n/g, "<br>");
    return formattedText;
}

// the function will get the exciting info from local storage
// and print all tasks on page load.
function displayTaskAtLoad() {

    // checking if taskArr contains anything.
    // if not stop the function.
    let json = localStorage.getItem("taskArr");
    if (!json) return;
    let taskArr = JSON.parse(json);


    let tasksSection = document.getElementById("tasksSection");
    let text = "";

    // run over taskArr and add task's DOM to text:
    for (const item of taskArr) {
        text += getTaskHTMLText(taskArr, taskArr.indexOf(item));
    }

    // insert to taskSection all tasks:
    tasksSection.innerHTML = text;
}

// function will get array with all tasks info.
// insert to tasksSection the new task.
function displayNewTask(taskArr) {
    let text = getTaskHTMLText(taskArr, taskArr.length - 1);
    tasksSection.innerHTML += text;
}

// the function get the array with all tasks info and index of the specific task to print:
// the function will implement the info to text by template.
// return the task's HTML.
function getTaskHTMLText(taskArr, index) {
    let item = taskArr[index];
    let text = `
    <div class="taskContainer">
    <div class="taskNumber">${index + 1}</div>
    <div class="taskTitle">${item.title}</div>
    <div class="taskDescription">${item.description}</div>
    <div class="taskDeadline">${formattedDeadline(item.deadline)}</div>
    <button class="deleteTaskBtn" onclick="deleteTask(${index})">
    <i  class="fa-solid fa-trash-can fa-flip fa-lg" ></i>
    </button>
        </div>
        `;
    return text;
}

// function will get the index of the wanted task to delete.
// function will remove the wanted from the array and from the local storage.
// print updated info.
function deleteTask(deletedIndex) {
    // get info from local storage:
    let taskArr = JSON.parse(localStorage.getItem("taskArr"));

    // remove wanted item from array:
    taskArr.splice(deletedIndex, 1);

    // update local storage:
    let json = JSON.stringify(taskArr);
    localStorage.setItem("taskArr", json);

    // update page:
    displayTaskAtLoad();
}

// clearing local storage from all data:
function clearFromStorage() {
    let tasksSection = document.getElementById("tasksSection");
    tasksSection.innerHTML = "";
    localStorage.clear();
}

// function will get a date object in default format
// return a string with the time (HH:MM): 
function formattedTime(date) {
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

// function will get a date object in default format
// return a string with the date (MM:DD:YYYY): 
function formattedDate(date) {
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    let year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

// function will get a date, 
// transform it to a printable date and time string.
// return date and time string.
function formattedDeadline(deadline) {
    // reformatting deadline to default because onload the format of deadline is UTC.
    let date = new Date(deadline);
    return `${formattedDate(date)} ${formattedTime(date)}`;
}

// the function get the title value and make validation on it:
// if empty or too short or too long.
// return suitable error message.
function isValidTitle(title) {
    let errorText = '';

    // if title is empty
    if (!title)
        errorText = `The title of your task is empty!<hr>`;
    // if title too short 
    else if (title.length < 2 || title.length > 30)
        errorText = `Keep the title between 2 to 30 characters please.
    Giving a clear and direct title to your task will increase the chances to complete it!
    You'll thank me later...<hr>`;

    return errorText;
}


// the function get the title value and make validation on it:
// if empty or too short.
// return suitable error message.
function isValidDescription(description) {
    let errorText = '';

    // if description is empty
    if (!description)
        errorText = `The description of your task is empty!<hr>`;
    // if title too short 
    else if (description.length < 10)
        errorText = `The description of your task is too short!
    If you would like to rock that task - Take a few minutes and plan it well step by step!
    That time will come back to you...<hr>`

    return errorText;
}

// function will get deadline value and make validation on it.
// check if empty, if same day - no past time.
// return suitable error message.
// calculateMinDate() is another function which disable the option to choose past dated 
// so no need to validate this parameter in this function.
function isValidDeadline(deadline) {

    let errorText = ``;

    // if deadline is empty:
    // when new Date() gets invalid value it returns an object of "Invalid Date".
    // so check if deadline is not a number.
    if (isNaN(deadline))
        return errorText = `The deadline date is empty... \n Give yourself a goal and it will be much easier!`;

    // set todays date and deadline string:
    let today = new Date();
    let todayDateString = formattedDate(today);
    let deadlineDateString = formattedDate(deadline);

    // check if deadline and today are not the same.
    // then it means deadline is future date and is valid.
    if (deadlineDateString !== todayDateString)
        return "";

    // if reached here it means the dl date is on the same date as current date
    // so check time:
    let dlHours = deadline.getHours();
    let dlMinutes = deadline.getMinutes();
    let tdHours = today.getHours();
    let tdMinutes = today.getMinutes();

    // if dl hours is les or equal and dl minutes is less then the time is earlier today and invalid.
    if ((dlHours < tdHours) || (dlHours === tdHours && dlMinutes < tdMinutes))
        errorText = "Earlier today";

    // else - all valid.
    return errorText;
}

// function get the input values.
// function will get the error messages of each input.
// if there are no errors return true.
// if there is an error display alert and return false.
function isValidInput(title, description, deadline) {
    let errorText = "";
    let titleMsg = isValidTitle(title);
    let descriptionMsg = isValidDescription(description);
    let deadlineMsg = isValidDeadline(deadline);

    // incase one of the error messages contains an error: 
    if (titleMsg || descriptionMsg || deadlineMsg) {
        errorText = `${titleMsg} ${descriptionMsg} ${deadlineMsg}`;
        displayAlert(errorText);
        return false;
    }
    return true;
}

// function get the error text.
// displaying error message to user:
function displayAlert(errorText) {
    Swal.fire({
        icon: 'error',
        title: errorText,
    });
}

// function will set the deadline input to allow choosing only future date
// by setting the min attribute of deadline:
function calculateMinDate() {
    let deadlineBox = document.getElementById("deadlineBox");
    let currentDate = new Date(); // current date and time
    let currentDateString = currentDate.toISOString().slice(0, 10); // get date part
    let currentTimeString = currentDate.toISOString().slice(11, 16); // get current time part
    deadlineBox.min = `${currentDateString}T${currentTimeString}`; // allow selecting any time on future dates
}

calculateMinDate();
