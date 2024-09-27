# restaurant-odin

#notes
updateviewbox function is great coz it updates the entire screent based on any change no matter where the change was done

use class names to access dom so that even if you move around the design later you dont have to change much code in the domhandler

start with really basic design to get the scripts to actually work

date() constructor returns an object yes but it has implicit object to string toString() that converts it

when passing arrays to domHandler like this with references inside, make sure you duplicate the array to not change the original array

to toglge bool: bool = !bool

duplicating array: .slice(0) but this creates shallow copies but i wanted deep copies lmao

decisions should be made from the most intrinsic values and not extrinsic ones, like displaying checked todos must be done from checking the state of the todo itself, not moving these todos in an array when they are checked

`<button type="submit" disabled style="display: none" aria-hidden="true"></button>`
to disable form submit on enter https://stackoverflow.com/a/51507806

you could have the event listeners in index but make them call specific function not even as a callback 
`addeventlistener("click", (e) => {functioncall();})`

use class selectors, easier to edit and understand in css please

new date("string") without time generates date with time set as 05:30 in this timezone