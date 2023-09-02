//tl;dr: This code is a real mess.
import taskContext, {LineType} from "./contexts/TaskContext";


const ArrowMenu = (() => {
	const element = document.querySelector(".btn-arrow") as HTMLButtonElement;

	//Emit mouse mode change on button click
	element.addEventListener("click", () => taskContext.changeMouseMode("normal"))

	//Listen to mouse mode change
	taskContext.onMouseModeChange((mode) => {
		if (mode === "normal"){
			element.classList.add("active")	
		} else {
			element.classList.remove("active")
		}
	})
})()

const TextboxButton = (() => {
	const element = document.querySelector(".btn-textbox") as HTMLButtonElement;

	//Emit mouse mode change on button click
	element.addEventListener("click", () => {
		taskContext.changeMouseMode("textbox")
		console.log("aaa")
	});
	// (element.querySelector("input") as HTMLInputElement).addEventListener("focus", (e) => console.log("aaa"))

	//Listen to mouse mode change
	taskContext.onMouseModeChange((mode) => {
		if(mode === "textbox") {
			element.classList.add("active");
		} else {
			element.classList.remove("active");
		}
	})
})()

const LineButton = (() => {
	const element = document.querySelector(".btn-line") as HTMLButtonElement;
	const dropdownTogglerElement = document.querySelector('#btn-line-dropdown-toggler') as HTMLButtonElement;
	const dropdownElement = document.querySelector('#line-menu-dropdown') as HTMLDivElement;
	const lineInsideButton = element.querySelector("span.line") as HTMLSpanElement;

	//Emit mouse mode change on button click
	element.addEventListener("click", () => taskContext.changeMouseMode("line"));

	//Toggle dropdown
	dropdownTogglerElement.addEventListener("click", () => taskContext.toggleDropdown());

	// close dropdown on click outside
	document.addEventListener('click', (event) => {
		const target = event.target as HTMLElement;
		if (taskContext.isDropdownOpen && !dropdownElement.contains(target) && !dropdownTogglerElement.contains(target)) {
			taskContext.closeDropdown();
		}
	});

	// close dropdown on 'esc' key pressed
	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') {
			taskContext.closeDropdown();
		}
	});

	//Listen to mouse mode change
	taskContext.onMouseModeChange((mode) => {
		if(mode === "line") {
			element.classList.add("active");
		} else {
			element.classList.remove("active");
		}
	})

	//Listen to dropdown state change
	taskContext.onDropdownStateChange((isOpen) => {
		if (isOpen){
			dropdownElement.classList.add("show");
		} else {
			dropdownElement.classList.remove("show");
		}
	})

	//set mouse mode when select line
	dropdownElement.querySelectorAll("button").forEach(element => {
		console.log(element)
		element.addEventListener("click", (e) => {
			console.log(element.id)
			const clickedLineType = element.id.match(/\-(.*)/)?.[1] as LineType;
			taskContext.changeLineType(clickedLineType)
		})
	})

	//Listen to line type change
	taskContext.onLineTypeChange((type) => {
		switch(type){
			case "negative-hypothesized": {
				lineInsideButton.className = "line negative hypothesized"
				break;
			}
			case "positive-hypothesized": {
				lineInsideButton.className = "line positive hypothesized"
				break;
			}
			case "negative": {
				lineInsideButton.className = "line negative"
				break;
			}
			case "positive": {
				lineInsideButton.className = "line positive"
				break;
			}
			default: {
				lineInsideButton.className = "line negative hypothesized"
			}
		}
	})
})()

const DeleteButton = (() => {
	const deleteButton = document.querySelector("#delete-btn") as HTMLButtonElement;

	taskContext.onTextboxFocus(() => {
		deleteButton.classList.remove("hidden")
	})

	taskContext.onTextboxBlur(() => {
		deleteButton.classList.add("hidden")
	})

	deleteButton.addEventListener("pointerdown", () => taskContext.deleteSelectedTextbox())
})()


const DrawingArea = (() => {
	const drawingContainer = document.querySelector("#drawing-container") as HTMLDivElement;
	const lineContainer = document.querySelector("#line-container") as HTMLDivElement;

	drawingContainer.addEventListener("click", (event) => {

		//create textbox
		if (taskContext.currentMouseMode === "textbox"){
			taskContext.createTextBox(event.clientX, event.clientY)
		}
	})

	drawingContainer.addEventListener("mousedown", (event) => {
		const selectedTextBox = taskContext.getTextBoxFromPoint(event.clientX, event.clientY)

		//begin dragging textbox if it's selected
		if (taskContext.currentMouseMode === "normal" && selectedTextBox){
			taskContext.beginDragTextBox(selectedTextBox)
		}
	})

	drawingContainer.addEventListener("mousemove", (event) => {

		//drag textbox
		if (taskContext.textBoxDragged){
			taskContext.dragTextBox(event.clientX, event.clientY)
		}
	})

	drawingContainer.addEventListener("mouseup", (event) => {
		//end dragging textbox
		if (taskContext.textBoxDragged){
			taskContext.endDragTextBox()
		}
	})

	drawingContainer.addEventListener("mousedown", (event) => {
		//create line
		if (taskContext.currentMouseMode === "line"){
			taskContext.createLine(event.clientX, event.clientY)
		}
	})

	drawingContainer.addEventListener("mousemove", (event) => {
		//drag line
		if (taskContext.currentDrawingLine){
			taskContext.onDrawLine(event.clientX, event.clientY)
		}
	})

	drawingContainer.addEventListener("mouseup", (event) => {
		//end drag line
		if (taskContext.currentDrawingLine){
			taskContext.endDrawLine(event.clientX, event.clientY);
		}
	})
})()

//apply initial states
taskContext.changeMouseMode("normal")