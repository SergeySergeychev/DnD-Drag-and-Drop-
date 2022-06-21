const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const listColumns = document.querySelectorAll(".drag-item-list");
const backlogListEl = document.getElementById("backlog-list");
const progressListEl = document.getElementById("progress-list");
const completeListEl = document.getElementById("complete-list");
const onHoldListEl = document.getElementById("on-hold-list");

// Items
let updateOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let dragging = false;
let currentColumn;

// Get Arrays from localeStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Release the course", "Sit back and relax"];
    progressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Being cool", "Getting stuff done"];
    onHoldListArray = ["Being uncool"];
  }
}
// Set LocalStorage Arrays
function updateSavedColumns() {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];
  const arrayNames = ["backlog", "progress", "complete", "onHold"];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(
      `${arrayName}Items`,
      JSON.stringify(listArrays[index])
    );
  });
}

// Filter Array to remove empty values
function filterArray(array) {
  const filteredArray = array.filter((item) => item !== null);
  return filteredArray;
}

// Create DOM Elements for each list item
function createElement(columnEl, column, item, index) {
  // list Item
  const listEl = document.createElement("li");
  listEl.textContent = item;
  listEl.id = index;
  listEl.classList.add("drag-item");
  listEl.draggable = true;
  listEl.setAttribute("onfocusout", `updateItem(${index}, ${column})`);
  listEl.setAttribute("ondragstart", "drag(event)");
  listEl.contentEditable = true;
  // Append to a drag item list.
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage.

function updateDOM() {
  // Check localStorage Once
  if (!updateOnLoad) {
    getSavedColumns();
  }
  // Backlog Column
  backlogListEl.textContent = "";
  backlogListArray.forEach((item, index, arr) => {
    createElement(backlogListEl, 0, item, index);
  });
  backlogListArray = filterArray(backlogListArray);
  // Progress Column
  progressListEl.textContent = "";
  progressListArray.forEach((item, index) => {
    createElement(progressListEl, 1, item, index);
  });
  progressListArray = filterArray(progressListArray);
  // Complete Column
  completeListEl.textContent = "";
  completeListArray.forEach((item, index) => {
    createElement(completeListEl, 2, item, index);
  });
  completeListArray = filterArray(completeListArray);
  // Backlog Column
  onHoldListEl.textContent = "";
  onHoldListArray.forEach((item, index) => {
    createElement(onHoldListEl, 3, item, index);
  });
  onHoldListArray = filterArray(onHoldListArray);
  // Don't run more than once, Update Local Storage
  updateOnLoad = true;
  updateSavedColumns();
}

// Updae Item - Delete if necessary, or update Array value

function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumn = listColumns[column].children;
  if (!dragging) {
    try {
      if (!selectedColumn[id].textContent) {
        delete selectedArray[id];
      } else {
        selectedArray[id] = selectedColumn[id].textContent;
      }
    } catch {
      const emptyEl = selectedArray.findIndex((el) => el === "");
      delete selectedArray[emptyEl];
    }
    updateDOM();
  }
}

// Add to Column List, Reset Text Box
function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = "";
  updateDOM();
}

// Show Add Item Input Box
function showInputBox(column) {
  addBtns[column].style.visibility = "hidden";
  saveItemBtns[column].style.display = "flex";
  addItemContainers[column].style.display = "flex";
}

// Hide item Input Box
function hideInputBox(column) {
  addBtns[column].style.visibility = "visible";
  saveItemBtns[column].style.display = "none";
  addItemContainers[column].style.display = "none";
  addToColumn(column);
}

// When Item Starts Dragging
function drag(e) {
  draggedItem = e.target;
  dragging = true;
}

// When Item Enters Column Area
function dragEnter(column) {
  listColumns[column].classList.add("over");
  currentColumn = column;
}

// Colun Allows for Item to Drop
function allowDrop(e) {
  e.preventDefault();
}

// Dropping Item in Column
function drop(e) {
  e.preventDefault();
  const parent = listColumns[currentColumn];
  // Remove Background Color/Padding
  listColumns.forEach((column) => {
    column.classList.remove("over");
  });
  // Add item to Column
  parent.appendChild(draggedItem);
  // Dragging complete
  dragging = false;
  rebuildArrays();
}

function editTasklList(element) {
  return Array.from(element.children).map((task) => task.textContent);
}

// Allows arrays to reflect Drag and Drop items
function rebuildArrays() {
  backlogListArray = editTasklList(backlogListEl);
  progressListArray = editTasklList(progressListEl);
  completeListArray = editTasklList(completeListEl);
  onHoldListArray = editTasklList(onHoldListEl);
  updateDOM();
}

// On Load
updateDOM();
