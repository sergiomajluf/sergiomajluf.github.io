# Moral Courage TO-DO list

This documents describes all the pages/views/functionalities we should build, and throught the bottom of the file, the pending items to be done.

*f »* Means functionality

###USER TESTING GOAL
- Create and change is crucial
- One cell
- The order of the questions is relevant
- The creation of more cells is not for this phase

---

## Last edit: Jan 8 2014 13:15 @sergio

* Connect cell that to the Identities Modal > The number of identities = the number of inner rings 
* Not critical > Prevent tooltip while dragging (mouse pressing)
* ~~REMEMBER: The whole cell is clickable and it will open the identities modal~~ > Try identities as planets, ~~Implement boostrap tooltip and double-click~~

* Global Save among all modals (Think about alternatives - maybe AJAX)


* Create, Style and Solve the Back-End Issue of the Add New Student Page 
* Add a Plus icon that will add cells (Open Identities Modal)
* For this thursday: Disable plus icon after you create the first cell
* Remove Nav Bar / Icon for Color BG change
* Update the Modals


* Maybe AJAX - Create variables representing the elements on the modal windows for the questions, so each cell will have unique modals (texts).


### Also done this time
* Major file clean up
	* in static html
	* in css file
* JS Functionalitites moved to external .js file
* Updated Node App with all this changes:
	* Added email as user field 	
	
#### Previously done
(move done lines form above on next edit of this file)

* ~~Create new cell~~
* ~~On click: Add Notes~~  | ~~Exceptions over the questions~~
* ~~When you click, add an icon and open the note modal~~ **binded to Double click**
* * ~~Alternative: Status Bar Tooltip~~




___



## Front end
###First Page
* **Sign Up/Register** - Where users register their Name and E-mail. This can be ignored for the beta, where the teacher can sign them all up. In this case, an _admin_ view is needed for her to do this.
* **Login** - For each user to enter the site (Name and E-mail)
* Recover password, not really needed for the beta?

###Main Page / App
* *f »*  Set up/change Background image, specific to the user
* Add Spiral image overlay (Map areas)
* *f »*  Add new Cell (Overlay Settings: Title, description and color of each identity/layer)
* Milestone Questions (Overlay Textbox)
* Cell behavior | Draggable, Limited in the area between questions until you answer each. 
* Notes | In the areas between questions, you can click and add notes. It generates a little icon and opens an Overlay Textbox.
* User profile | edit name, email, pass, background


## List of modals (OK)
* Questions > Textbox
* Identities > Title, description, color
* Notes > Textbox

---

## Back end
* Node app setup... long list missing here
* Verify mongoose data structure


---

## Updated Front-End To do (04.12)
* Make spiral smaller, fit in window
* Background image / same illustrator image
* Cell, while answering questions, add circles (planets) around it. 
* The outer layers represents the identities, so they vary according to the amount (max. 4) of identities the user creates when creating a new cell (the beginning and each time you click in the center of the spiral.
* constrain movement within spiral

---


---
##Code references

[Login](http://www.quietless.com/kitchen/building-a-login-system-in-node-js-and-mongodb/) 

[Modal](http://getbootstrap.com/javascript/#modals)
[Modal](http://wrapbootstrap.com/preview/WB06641R7)

Spiral done in Processin JS, close and nice
[http://processingjs.nihongoresources.com/spiro/](http://)

Other one in Processing
[http://krazydad.com/tutorials/circles_js/](http://)

Beautifuly simple Processing sketch
[view-source:http://dzoba.com/processing/dotSpiral/sketch_jun19a.pde
](http://)

Just plain beautiful
[http://nooshu.com/explore/euler-spiral/](http://)

Whole explanation of the spiral process, Fibonacci sequence, and more than I can absorve right now
[http://www.virtualcode.es/en/tplos_index](http://)


JQuery Image Map
[http://www.outsharked.com/imagemapster/default.aspx?demos.html#usa](http://)

List Effects - We might customize it to use in the NOTES
[http://sarasoueidan.com/demos/creative-list-effects/](http://)

Page Menu - For changing settings
[http://tympanus.net/Tutorials/CircularNavigation/index.html] (http://)
