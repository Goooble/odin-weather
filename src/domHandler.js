import { format, isPast } from "date-fns";
const todoDisplayCont = document.querySelector(".todo-disp-cont");
const projectListCont = document.querySelector(".project-cont");

//clear the input box after things have been added in various input boxes
function cleanInputBox(inputBox) {
  inputBox.value = "";
}

//clear the todo and project lists to include new todo's and projects
function cleanList(container) {
  container
    .querySelectorAll(
      `.${container.classList[0]}>*:not(.default-project, .inbox)`
    )
    .forEach((item) => {
      container.removeChild(item);
    });
}

var display = (function () {
  function displayTodo(array) {
    cleanList(todoDisplayCont);
    array.forEach((item, index) => {
      const todoItem = document.createElement("div");
      todoItem.dataset.index = index; //to keep track off todos in the scripts
      todoItem.className = "todo-item";
      var displayDate = ""; //so that no duedates get displayed as empty string
      //and not as NaN

      var fontCol = "black";//default
      if (item.getDueDate()) {//visual indicator for missing due date
        displayDate = format(item.getDueDate(), "dd-MM-yyyy");
        if (isPast(item.getDueDate())) {
          fontCol = "red";
        }
      }

      // if(item.getDueDate()){
      //   displayDate = format(item.getDueDate(), "DD/MM/YYYY");
      // }
      todoItem.innerHTML = `
          <input class = "checkbox" type="checkbox" />
          
            <p>${item.getTitle()}</p>
            
         
        
        <div class="options-cont">
          <p class="todo-date">${displayDate}</p>
          <div class="edit-but">
            <svg class="edit-but" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path class = "edit-but" d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
          </div>
          <div class="del-but">
            <svg class="del-but" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path class = "del-but" d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
          </div>
        </div>
        <p class = "todo-notes">${item.getNotes()}</p>
          `;
      //priority color
      var bordCol;
      switch (item.getPriority()) {
        case "none":
          bordCol = "white";
          break;
        case "low":
          bordCol = "grey";
          break;
        case "medium":
          bordCol = "cyan";
          break;
        case "high":
          bordCol = "red";
          break;
      }
      todoItem.style.borderLeft = `5px solid ${bordCol}`;
      //dueDate
      todoItem.style.color = fontCol;
      todoDisplayCont.appendChild(todoItem);

      //checklist
      const subCont = document.createElement("div");
        subCont.className = "todo-sub-cont";
        if(item.getNewChecklist().length !== 0){
          todoItem.appendChild(subCont);
        }
      item.getNewChecklist().forEach((item, index) => {
        // const subCont = todoItem.querySelector(".todo-sub-cont");
        const subItem = document.createElement("div");
        subItem.className = "sub-item";
        subItem.dataset.index = index;
        subItem.innerHTML = `<input class="sub-task-checkbox" type = "checkbox" /> <p>${item.getTitle()}</p> <button class="sub-task-del">x</button>`;
        if (item.getState() === true) {
          //to display as checked whenthe state of the subtask is checked
          const checkBox = subItem.querySelector(".sub-task-checkbox")
          checkBox.setAttribute("checked", true);
          
        }
        console.log(subCont);
        subCont.appendChild(subItem);
        
        
      });
    });
  }

  function displayDoneTodo(array) {
    const doneDispCont = document.querySelector(".show-done-disp-cont");
    if (doneDispCont) {
      //so this doesnt run when show done todo hasnt been clicked
      cleanList(doneDispCont);
      array.forEach((item, index) => {
        const todoItem = document.createElement("div");
        todoItem.dataset.index = index;
        todoItem.className = "done-todo-item";
        todoItem.innerHTML = `
          <input type="checkbox" checked/>
          <p>${item.getTitle()}</p>
        `;
        doneDispCont.appendChild(todoItem);
      });
    }
  }

  function displayProject(array) {
    cleanList(projectListCont);
    array.forEach((item, index) => {
      //to skip over default inbox
      if (index === array.length - 1) {
        return 0;
      }
      const projectDiv = document.createElement("div");
      projectDiv.innerHTML = `<p class="project-name">${item.getProjectName()}</p><button class="close-proj-but">x</button>`;
      projectDiv.dataset.index = index;
      projectDiv.className = "project-item";
      projectListCont.appendChild(projectDiv);
    });
  }
  function updateProjectHeader(name) {
    //the todo view screen header
    const header = document.querySelector("header h1");
    header.textContent = name;
  }

  return { displayTodo, displayProject, updateProjectHeader, displayDoneTodo };
})();

//for the add button to switch to input after clicked(project)
function toggleInput() {
  const addProjectBut = document.querySelector(".add-project-but");
  const addProjectInput = document.querySelector("aside input");
  addProjectBut.classList.toggle("show-add-but");
  addProjectInput.classList.toggle("show-input");
}

function updateViewBox(projectName, todoArray, projectArray, doneTodoCont) {
  display.updateProjectHeader(projectName);
  display.displayTodo(todoArray);
  display.displayProject(projectArray);
  display.displayDoneTodo(doneTodoCont); //need to put it here so that
  //it not only displays when clicked on show button but also when
  //a todo is checked i am an accidental genius muahahaha
}

var dialogHandler = (function () {
  const quickInput = document.querySelector("#add-quick");
  const form = document.querySelector("dialog form");
  const title = document.querySelector("dialog #title");
  const dueDate = document.querySelector("dialog #date");
  const priority = document.querySelector("dialog #priority");
  const project = document.querySelector("dialog #project");
  const notes = document.querySelector("dialog #notes");
  const checklistInput = document.querySelector("#checklist-input");
  const checklistCont = document.querySelector(".checklist-cont");

  function getDiaChecklist() {
    var array = [];
    Array.from(checklistCont.children).forEach((item) => {
      array.push(item.textContent);
    });
    return array;
  }

  function updateDiaProjects(projectArray, activeProjectIndex) {
    //this is the project select option in dialog
    cleanList(project);
    //reversingso the appends happen in the same order
    //-as the projects displayed in the sidebar
    for (let item of projectArray) {
      const option = document.createElement("option");
      option.value = `${projectArray.indexOf(item)}`; //to access proper projects
      option.textContent = item.getProjectName();
      if (projectArray.indexOf(item) === activeProjectIndex) {
        option.setAttribute("selected", true); //to set active project as default
        //-in the options
      }
      project.appendChild(option);
    }
  }

  function matchInputBox() {
    //so that the text already entered in quick add
    //is the same when dialog is open
    title.value = quickInput.value;
  }

  function getDiaInput() {
    const returnArray = [
      +project.value,
      title.value,
      notes.value,
      dueDate.value,
      priority.value,
    ];
    form.reset();
    //making sure only domHandler can access the.. well DOM
    return returnArray;
  }

  function editTodoMatch(todo, projectIndex) {
    //when clicked on edit, same dialog box opens up
    //this acquires the value of the todo being edited in the dialog
    title.value = todo.getTitle();
    dueDate.value = format(todo.getDueDate(), "yyyy-MM-dd");
    if (todo.getDueDate() === null) {
      dueDate.value = "";
    }
    priority.value = todo.getPriority();
    notes.value = todo.getNotes();
    project.value = projectIndex;
    todo.getNewChecklist().forEach((item) => updateDiaChecklist(item.getTitle()));
  }
  function updateDiaChecklist(value) {
    var subtask = document.createElement("div");
    subtask.className = "subtask-item";
    subtask.innerText = value;
    checklistCont.appendChild(subtask);
  }

  return {
    getDiaInput,
    editTodoMatch,
    updateDiaProjects,
    matchInputBox,
    updateDiaChecklist,
    getDiaChecklist,
  };
})();

export { toggleInput, cleanInputBox, updateViewBox, dialogHandler, cleanList };
