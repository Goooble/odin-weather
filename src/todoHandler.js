function todo(
  title,
  notes,
  date = undefined,
  priority = "none",
  state = false
) {
  var newChecklistCont = []//just forgot to remove the "new", too lazy
  function createSubtask(checklist = [], state){
    newChecklistCont.length = 0;//clears it before adding again
    checklist.forEach((name) => {//recieves names and states seperately
      //states are sent from getData only for now, to retain teh state on closing and opening
      newChecklistCont.unshift(subtask(name, state))
    })
    
  }

  function getNewChecklist(){
    return newChecklistCont;
  }

  var checked = state;
  
  var dueDate;
  if (!date) {
    dueDate = null;
  }else{
    dueDate = new Date(date+"T23:59");
  }//to make sure format doesnt act up, thats why the if

  function removeSubTask(index) {
    newChecklistCont.splice(index, 1);;
  }
  function getTitle() {
    return title;
  }
  function getState() {
    return checked;
  }
  function setState(state){
    checked = state;
  }
  function toggleState() {
    checked = !checked;//to change checkecd state
  }
  function getNotes() {
    if (!notes) {
      return "";//to remove the null and replace it wiht ""
    }
    return notes;
  }
  function getDueDate() {
    return dueDate;
  }
  function getPriority() {
    if (!priority) {
      return "none";//to set it as default
      //not even sure i am using this anywayere lmao
    }
    return priority;
  }

  function setTitle(info) {
    title = info;
  }
  function setNotes(info) {
    notes = info;
  }
  function setDueDate(info) {
    dueDate = info;
  }
  function setPriority(info) {
    priority = info;
  }

  function editTodo(name, desc, date, label) {
    //when you edit, this is how data gets updated
    title = name;
    notes = desc;
    dueDate = new Date(date+"T23:59");//otherwise, due date doesnt work well
    if (!date) {
      dueDate = null;
    }
    priority = label;
  }



  return {
    setState,
    getState,
    getTitle,
    getNotes,
    getDueDate,
    getPriority,
    setNotes,
    setTitle,
    setDueDate,
    setPriority,
    editTodo,
    toggleState,
    removeSubTask,
    createSubtask,
    getNewChecklist
  };
}

function subtask(title, state = false){
  var {getTitle, getState, toggleState, setState} = todo(title, null, null, null, null, state)
  setState(state);
  return {getTitle, getState, toggleState}
}



function createTodo(title, notes, date, priority, checklist, state) {
  return todo(title, notes, date, priority, checklist, state);
}

export { createTodo };
