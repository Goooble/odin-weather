import "./reset.css";
import "./styles.css";

//interface between dom and scripts
import {
  cleanInputBox,
  toggleInput,
  updateViewBox,
  dialogHandler,
  cleanList,
} from "./domHandler";
import {
  addProject,
  getProjectCont,
  deleteProject,
  todayFilter,
} from "./projectHandler";

var activeProject; //to know which project is currently on the main
function getActiveProject() {
  return activeProject;
}

const quickAddCont = document.querySelector(".quick-add-cont");

function updateScreen() {
  todayFilter.getTodos(getProjectCont());
  getActiveProject().verifyCheck();

  if (getActiveProject() === todayFilter) {
    //removes quick input box
    quickAddCont.classList.add("today-filter-show");
  } else {
    quickAddCont.classList.remove("today-filter-show");
    getActiveProject().sortTodo();
  }

  //takes in lot of params, so i thought this would be easier
  updateViewBox(
    //slicing this so that a copy is passed, just-
    //to make sure it isnt changed somehow though it-
    //shouldnt normally happen lets see
    getActiveProject().getProjectName(),
    getActiveProject().getTodoCont().slice(0),
    getProjectCont().slice(0),
    getActiveProject().getCompCont().slice(0),
  );
  store();
}

function setActiveProject(project) {
  activeProject = project;
  updateScreen();
}

const aside = document.querySelector("aside");

//event listeners
//dialog add todos
const addTodoBut = document.querySelector(".add-but");
const dialog = document.querySelector("dialog");
const closeDiaBut = document.querySelector("dialog .close-but");
const inputBox = document.querySelector("header input");
const todosHolder = document.querySelector(".todo-disp-cont");
const checklistInput = document.querySelector("#checklist-input");

//opens dialog
addTodoBut.addEventListener("click", () => {
  dialog.showModal();
  dialogHandler.updateDiaProjects(
    getProjectCont(),
    getProjectCont().indexOf(getActiveProject()),
  );
  dialogHandler.matchInputBox();
});
//closes dialog when clicking close button
closeDiaBut.addEventListener("click", () => {
  dialog.close();
});

//add subtasks
const subCont = document.querySelector(".checklist-cont");

checklistInput.addEventListener("keydown", (e) => {
  //prevents user from entering blank todos
  if (e.key === "Enter" && checklistInput.value !== "") {
    dialogHandler.updateDiaChecklist(checklistInput.value);
    cleanInputBox(checklistInput);
  }
});

var editMode = false; //to ensure the submit was done by an edit and not an add
var brokenTodo;
//this works for both editing and adding using the above to variables
dialog.addEventListener("close", () => {
  var checklistArray = []; //TODO get state as well
  if (dialog.returnValue === "Submit") {
    checklistArray = dialogHandler.getDiaChecklist();
    //to extract project index value seperately
    const [projectIndex, ...todoInput] = dialogHandler.getDiaInput();

    if (editMode === true) {
      //for today-filter
      var preProjectIndex; //stores the index of project of the original
      //project the todo belonged to, to splice it
      getProjectCont().forEach((project) => {
        //finds the preproject
        project.getAllTodo().forEach((item) => {
          if (item === brokenTodo) {
            preProjectIndex = getProjectCont().indexOf(project);
          }
        });
      });

      if (
        getProjectCont()[projectIndex] !== getProjectCont()[preProjectIndex]
      ) {
        //if preproject and selected project are different, moving to a diffrent project and removing it fromthe current

        //if some other project is selected, the todo gets moved

        getProjectCont()
          [preProjectIndex].getAllTodo()
          .splice(
            getProjectCont()[preProjectIndex].getAllTodo().indexOf(brokenTodo),
            1,
          );
        //added to the new project
        getProjectCont()[projectIndex].addTodo(...todoInput);
        getProjectCont()
          [projectIndex].getAllTodo()[0]
          .createSubtask(checklistArray);
      } else {
        //if same project
        //on that note, might as well implement the same as above no?
        //just remove from the same project and add it back in? but i guess that changes it position
        brokenTodo.editTodo(...todoInput);
        getProjectCont()
          [projectIndex].getAllTodo()[0]
          .createSubtask(checklistArray);
      }
    } else {
      //dialog wasnt closed from an edit
      getProjectCont()[projectIndex].addTodo(...todoInput);

      getProjectCont()
        [projectIndex].getAllTodo()[0]
        .createSubtask(checklistArray);
    }
    updateScreen();
    cleanInputBox(inputBox);
    dialog.returnValue = "init"; //resetting this value for the next add
  }
  editMode = false; //if dialog is closed by something other than submit
  //for ex: after editing, user pressed cancel

  cleanList(subCont);
});

// edit todos
todosHolder.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-but")) {
    editMode = true;
    dialog.showModal();
    dialogHandler.updateDiaProjects(getProjectCont()); //it works without second value-
    //as editTodoMatch below used projectvalue(index) to get the default option in dia
    var index = e.composedPath().find((item) => {
      //to get index
      if (item.classList.contains("todo-item")) {
        return true;
      }
    }).dataset.index;

    brokenTodo = getActiveProject().getTodoCont()[index];

    var projectIndex; //to get project index for both filter and projects
    getProjectCont().forEach((project) => {
      project.getAllTodo().forEach((item) => {
        if (item === brokenTodo) {
          projectIndex = getProjectCont().indexOf(project);
        }
      });
    });
    dialogHandler.editTodoMatch(brokenTodo, projectIndex);
  }
});

//quick add todos

inputBox.addEventListener("keydown", quickAdd);

function quickAdd(e) {
  //prevents user from entering blank todos
  if (e.key === "Enter" && inputBox.value !== "") {
    getActiveProject().addTodo(inputBox.value);
    cleanInputBox(inputBox);
    updateScreen();
  }
}

//check todo
const showDoneBut = document.querySelector(".show-done");
const doneDispCont = document.querySelector(".done-disp-cont");
todosHolder.addEventListener("click", (e) => {
  if (e.target.classList.contains("checkbox")) {
    var index = e.composedPath().find((item) => {
      //to get index
      if (item.classList.contains("todo-item")) {
        return true;
      }
    }).dataset.index;
    //toggles the state of the todo
    var toCheck = getActiveProject().getTodoCont()[index];
    toCheck.toggleState();
    updateScreen();
  }
});

//check subtodo
todosHolder.addEventListener("click", (e) => {
  if (e.target.classList.contains("sub-task-checkbox")) {
    var todoIndex = e.composedPath().find((item) => {
      //to get todo index
      if (item.classList.contains("todo-item")) {
        return true;
      }
    }).dataset.index;
    var subIndex = e.composedPath().find((item) => {
      //to get sub index
      if (item.classList.contains("sub-item")) {
        return true;
      }
    }).dataset.index;

    var toCheckTodo = getActiveProject().getTodoCont()[todoIndex];

    toCheckTodo.getNewChecklist()[subIndex].toggleState();
    updateScreen();
  }
});
var i = false;
//show done todo
showDoneBut.addEventListener("click", (e) => {
  if (i) {
    showDoneBut.textContent = "Show completed tasks ▼";
  } else {
    showDoneBut.textContent = "Close completed tasks ▲";
  }
  i = !i;

  doneDispCont.classList.toggle("show-done-disp-cont");
  if (doneDispCont.classList.contains("show-done-disp-cont")) {
    updateScreen();
  }
});

//uncheck todo
doneDispCont.addEventListener("click", (e) => {
  if (e.target.tagName === "INPUT") {
    var index = e.composedPath().find((item) => {
      if (item.classList.contains("done-todo-item")) {
        return true;
      }
    }).dataset.index;
    var toUncheck = getActiveProject().getCompCont()[index];
    toUncheck.toggleState();

    updateScreen();
  }
});

//delete todo's
todosHolder.addEventListener("click", (e) => {
  var toDelTodo; //holes the to be deleted todo
  if (e.target.classList.contains("del-but")) {
    if (confirm("Do you wanna delete this todo?")) {
      var index = e.composedPath().find((item) => {
        //to get index
        if (item.classList.contains("todo-item")) {
          return true;
        } //should have made this into a function fr
      }).dataset.index;
      toDelTodo = getActiveProject().getTodoCont()[index];

      var projectIndex; //to get project index for both filter and projects
      getProjectCont().forEach((project) => {
        project.getAllTodo().forEach((item) => {
          if (item === toDelTodo) {
            projectIndex = getProjectCont().indexOf(project);
          }
        });
      });

      getProjectCont()[projectIndex].removeTodo(toDelTodo);
      updateScreen();
    }
  }
});

//delete subtodos
todosHolder.addEventListener("click", (e) => {
  var toDelTodo; //the todo that holds the subtask that is to be deleted
  if (e.target.classList.contains("sub-task-del")) {
    var shortArray = e.composedPath().slice(0, -2); //removes document and window
    var todoIndex; //stores the index of todo
    shortArray.forEach((item) => {
      if (item.classList.contains("todo-item")) {
        todoIndex = item.dataset.index;
      }
    });
    var subTaskIndex;
    shortArray.forEach((item) => {
      if (item.classList.contains("sub-item")) {
        subTaskIndex = item.dataset.index;
      }
    });
    toDelTodo = getActiveProject().getTodoCont()[todoIndex];
    toDelTodo.removeSubTask(subTaskIndex);
    updateScreen();
  }
});

//add projects
const addProjectBut = document.querySelector(".add-project-but");
const addProjectInput = document.querySelector("aside input");
//to switch the add project button to input
addProjectBut.addEventListener("click", () => {
  toggleInput();
  addProjectInput.focus();
});

//to enter the value in the add project input
addProjectInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && addProjectInput.value !== "") {
    addProject(addProjectInput.value);
    cleanInputBox(addProjectInput);
    updateScreen();
  }
});

//to switch back to show add button
addProjectInput.addEventListener("focusout", () => {
  toggleInput();
});

//to select a project to display on the main screen

aside.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("project-item") ||
    e.target.classList.contains("project-name")
  ) {
    var projectSelected;

    var shortArray = e.composedPath().slice(0, -2);
    //having document and window object in the path messes up the .contains() below

    var projectItem = shortArray.find((item) => {
      //so that even clicking on text which is inside p works
      if (item.classList.contains("project-item")) {
        return true;
      }
    });
    //maybe add eventlistners to individual project-items themselves using for each

    //need an two if's coz inbox doesnt contain a dataset.index
    //because its displayed above and and is a default
    //this was easier than assigning it a dataset
    //but if need arises i might as well assign it
    if (projectItem) {
      projectSelected = getProjectCont()[+projectItem.dataset.index];
      if (e.target.classList.contains("inbox")) {
        projectSelected = getProjectCont()[getProjectCont().length - 1];
      }
      if (e.target.classList.contains("today-filter")) {
        projectSelected = todayFilter;
      }
      setActiveProject(projectSelected);
    }
  }
});
//delete project
aside.addEventListener("click", (e) => {
  if (e.target.classList.contains("close-proj-but")) {
    if (confirm("Do you want to delete the project?")) {
      deleteProject(getProjectCont()[e.target.parentElement.dataset.index]);
      setActiveProject(getProjectCont()[getProjectCont().length - 1]);
    }
  }
});

//default
addProject("Inbox");
getProjectCont()[0].addTodo("example", "important stuff", "2025-12-30", "none");
getData();
setActiveProject(getProjectCont()[getProjectCont().length - 1]);

function store() {
  localStorage.clear();
  var projectCont = [];
  getProjectCont().forEach((project, proIndex) => {
    var todoContObj = [];

    project.getAllTodo().forEach((todo, index) => {
      var checklistObj = [];
      todo.getNewChecklist().forEach((item, index) => {
        checklistObj[index] = {
          name: item.getTitle(),
          state: item.getState(),
        };
      });
      var date = todo.getDueDate();
      if (todo.getDueDate()) {
        //toISOstring starts throwing errors if its date is null
        date = todo.getDueDate().toISOString().slice(0, 10);
      }
      todoContObj[index] = {
        state: todo.getState(),
        title: todo.getTitle(),
        notes: todo.getNotes(),
        dueDate: date,
        //all of this date stuff to append +"T23:59" at the end while adding todo
        priority: todo.getPriority(),
        checklistCont: checklistObj,
      };
    });
    projectCont[proIndex] = {
      allTodo: todoContObj,
      name: project.getProjectName(),
    };
  });
  localStorage.setItem("json", JSON.stringify(projectCont));
  return projectCont;
}

function getData() {
  var data;
  getProjectCont().length = 0;
  data = JSON.parse(localStorage.getItem("json"));
  data.toReversed().forEach((item, index) => {
    addProject(item.name);
    item.allTodo.toReversed().forEach((item) => {
      getProjectCont()[index].addTodo(
        item.title,
        item.notes,
        item.dueDate,
        item.priority,
        item.state,
      );

      var checklistName = [];
      var checklistState = [];
      item.checklistCont.toReversed().forEach((subtask) => {
        checklistName.push(subtask.name);
        checklistState.push(subtask.state);
      });
      getProjectCont()
        [index].getAllTodo()[0]
        .createSubtask(checklistName, checklistState);
    });
  });
  return getProjectCont();
}

//show notes
const todoHead = document.querySelector(".todo-header");

todosHolder.addEventListener("click", (e) => {
  if (
    !e.target.classList.contains("edit-but") &&
    !e.target.classList.contains("checkbox") &&
    !e.target.classList.contains("del-but") //optimize this laterTODO
  ) {
    var path = e.composedPath().slice(0, -2);
    var todo = path.find((item) => {
      if (item.classList.contains("todo-item")) {
        return true;
      }
    });
    if (todo) {
      var notesCont = todo.querySelector(".todo-notes");
      notesCont.classList.toggle("show-notes");
    }
  }
});
