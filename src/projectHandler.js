import { createTodo, deleteTodo } from "./todoHandler";
import { format, isAfter, isToday } from "date-fns";
var projectCont = [];
function getProjectCont() {
  return projectCont;
}

function project(projectName) {
  var allTodo = []//all todos are stored here then split into 
  //their own cont depending on state

  //you could do this directly on display time but this is just how it is
  var todoCont = [];
  var compCont = [];

  function sortTodo() {
    //this is here coz it changes the todoCont
    todoCont.sort((a, b) => {
      if (a.getDueDate() || b.getDueDate()) {
        //this exists-
        //coz if it doesnt exist, the no dues todos keep shuffling
        if (isAfter(a.getDueDate(), b.getDueDate())) {
          return 1;
        }
        return -1;
      }
    });

    //this is to hold todos with no due date at the bottom
    var numberOfEmpties = todoCont.findIndex((item) => {
      if (item.getDueDate()) {
        return true;
      }
    });
    var noDueArray = todoCont.splice(0, numberOfEmpties);
    noDueArray.forEach((item) => todoCont.push(item));
  }

  function getProjectName() {
    return projectName;
  }

  function addTodo(title, notes, date, priority, state) {
    allTodo.unshift(createTodo(title, notes, date, priority, state));
  }

  function removeTodo(todoItem) {
    var todoIndex;
    allTodo.forEach((item, index) => {
      if (item === todoItem) {
        todoIndex = index;
      }
    });
    allTodo.splice(todoIndex, 1);
  }

 

  function verifyCheck() {
    //sorts allTodo into their specific containers for displaying
      compCont.length = 0;
      todoCont.length = 0;
    allTodo.forEach((item) => {
      
      if (item.getState() === true) {
        
        compCont.push(item);
      }else {
        
        todoCont.push(item)
      }
    });

  }

  function getAllTodo(){
    return allTodo;
  }

  function getTodoCont() {
    return todoCont;
  }

  function getCompCont() {
    return compCont;
  }

  return {
    addTodo,
    removeTodo,
    getTodoCont,
    getProjectName,
    verifyCheck,
    getCompCont,
    sortTodo,
    getAllTodo
  };
}





var todayFilter = (function () {
  const {
    getTodoCont,
    getProjectName,
    getCompCont,
    verifyCheck,
    getAllTodo
  } = project("Today");

  function getTodos(projectArray) {//gets todos from all project htat 
    //that match today's date
    getAllTodo().splice(0); //cleans array
    projectArray.forEach((project) => {
      project.getAllTodo().forEach((todo) => {
        if (isToday(todo.getDueDate())) {
          getAllTodo().push(todo);
        }
      });
    });
  }

  return {
    getTodoCont,
    getProjectName,
    getCompCont,
    getTodos,
    verifyCheck,
  };
})();

function addProject(name) {
  projectCont.unshift(project(name));
}

function deleteProject(project) {
  projectCont.forEach((item, index) => {
    if (project === item) {
      projectCont.splice(index, 1);
    }
  });
}

export { addProject, getProjectCont, deleteProject, todayFilter };
