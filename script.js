// script.js

///  Global current User variable
var currentUser = null;

// Function to set a cookie
function setCookie(name, value, days) {
 var expires = ""; // Initialize the expiration date
 if (days) {
  var date = new Date(); // Create a new Date object
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  expires = "; expires=" + date.toUTCString();
 }
 // Create the cookie string by concatenating the name, value, expiration, and path information
 document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Function to get the value of a cookie
function getCookie(name) {
 var nameEQ = name + "=";
 var ca = document.cookie.split(";");
 for (var i = 0; i < ca.length; i++) {
  var c = ca[i];
  while (c.charAt(0) === " ") {
   c = c.substring(1, c.length);
  }
  if (c.indexOf(nameEQ) === 0) {
   // Extract the value of the cookie by removing the name
   return c.substring(nameEQ.length, c.length);
  }
 }
 return null; // Return null if the cookie with the given name is not found
}

// Function to check if a cookie exists
function checkCookie(name) {
 var cookie = getCookie(name);
 return cookie !== null;
}

// Login function
function login() {
 var username = document.getElementById("usernameInput").value;
 if (username.trim() === "") {
  alert("Please enter a username!");
  return;
 }

 if (checkCookie(username)) {
  // User exists, retrieve user information from the cookie
  currentUser = JSON.parse(getCookie(username));
 } else {
  // User does not exist, create new user information
  currentUser = {
   username: username,
   tasks: [],
  };
  // Set the user information as a cookie
  setCookie(username, JSON.stringify(currentUser), 30); // Cookie expires in 30 days
 }

 document.getElementById("loginSection").style.display = "none";
 document.getElementById("taskSection").style.display = "flex";
 displayTasks(currentUser);
}

// Display tasks
function displayTasks(userData) {
 var taskList = document.getElementById("taskList");
 taskList.innerHTML = "";

 userData.tasks.forEach(function (task) {
  var listItem = document.createElement("li");

  // Create task details container
  var taskDetails = document.createElement("div");

  // Change the date format from YYYY-MM-DD to MM/DD/YYYY
  var formattedDueDate = task.dueDate.split("-").reverse().join("/");

  taskDetails.innerText =
   task.name +
   " (Priority: " +
   task.priority +
   ", Due Date: " +
   formattedDueDate +
   ")";
  taskDetails.addEventListener("click", function () {
   updateTask(task, userData);
  });

  var deleteBtnContainer = document.createElement("div");
  var deleteBtn = document.createElement("button");
  deleteBtn.innerText = "Delete";
  deleteBtn.classList.add("delete-button");
  deleteBtn.addEventListener("click", function (event) {
   event.stopPropagation();
   deleteTask(task, userData);
  });
  deleteBtnContainer.appendChild(deleteBtn);

  // Create update button
  var updateBtnContainer = document.createElement("div");
  var updateBtn = document.createElement("button");
  updateBtn.innerText = "Update";
  updateBtn.classList.add("update-button");
  updateBtn.addEventListener("click", function (event) {
   event.stopPropagation();
   updateTask(task, userData);
  });
  updateBtnContainer.appendChild(updateBtn);

  listItem.appendChild(taskDetails);
  listItem.appendChild(deleteBtnContainer);
  listItem.appendChild(updateBtnContainer);
  taskList.appendChild(listItem);
 });
}

// Create task
function createTask(userData) {
 var taskName = document.getElementById("taskNameInput").value;
 var priority = document.getElementById("prioritySelect").value;
 var dueDate = document.getElementById("dueDateInput").value;

 // Change the date format from YYYY-MM-DD to MM/DD/YYYY
 dueDate = dueDate.split("-").reverse().join("/");

 if (taskName.trim() === "" || dueDate.trim() === "") {
  alert("Please enter task name and due date!");
  return;
 }

 var task = {
  name: taskName,
  priority: priority,
  dueDate: dueDate,
 };

 userData.tasks.push(task);
 setCookie(userData.username, JSON.stringify(userData), 30); // Update the user information cookie
 displayTasks(userData);

 document.getElementById("taskNameInput").value = "";
 document.getElementById("dueDateInput").value = "";
}

// Delete task
function deleteTask(task, userData) {
 var index = userData.tasks.findIndex(
  (t) =>
   t.name === task.name &&
   t.dueDate === task.dueDate &&
   t.priority === task.priority
 );
 if (index !== -1) {
  userData.tasks.splice(index, 1);
  setCookie(userData.username, JSON.stringify(userData), 30); // Update the user information cookie
  displayTasks(userData);
 }
}

// Update task
function updateTask(task, userData) {
 var newTaskName = prompt("Enter a new name for the task", task.name);
 var newDueDate = prompt(
  "Enter a new due date for the task",
  task.dueDate.split("-").reverse().join("/") //split array to substrings, then reverse, then join them (will look normal to non-coder)
 ); // Convert format for prompt
 var newPriority = prompt(
  "Enter a new priority for the task (low, medium, high)",
  task.priority
 );

 if (newTaskName !== null && newDueDate !== null && newPriority !== null) {
  task.name = newTaskName;
  task.dueDate = newDueDate.split("/").reverse().join("-"); // Convert format back after prompt
  task.priority = newPriority;
  setCookie(userData.username, JSON.stringify(userData), 30); // Update the user information cookie
  displayTasks(userData);
 }
}
