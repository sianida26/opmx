import { areElementsOverlap } from "./helpers";

//header events
const dropdownTogglerElement = document.querySelector('#btn-line-dropdown-toggler') as HTMLButtonElement;
const dropdownElement = document.querySelector('#line-menu-dropdown') as HTMLDivElement;
const normalButtonElement = document.querySelector(".btn-arrow") as HTMLButtonElement;
const textboxButtonElement = document.querySelector(".btn-textbox") as HTMLButtonElement;
const lineButtonElement = document.querySelector(".btn-line") as HTMLButtonElement;
const headerElement = document.querySelector("header") as HTMLDivElement;

//header dropdown functionality
let isDropdownOpen = false;

const showDropdown = () => {
	isDropdownOpen = true;
	dropdownElement.classList.add("show");
}

const closeDropdown = () => {
	isDropdownOpen = false;
	dropdownElement.classList.remove("show");
}

// toggle dropdown
dropdownTogglerElement.addEventListener('click', () => {
	if (isDropdownOpen) {
		closeDropdown()
	} else {
		showDropdown()
	}
});

// close dropdown on click outside
document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  if (isDropdownOpen && !dropdownElement.contains(target) && !dropdownTogglerElement.contains(target)) {
	closeDropdown();
  }
});

// close dropdown on 'esc' key pressed
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeDropdown();
  }
});

type MouseMode = "normal" | "textbox" | "line"

let currentMouseMode: MouseMode = "normal";

const setMouseMode = (newMode: MouseMode) => {
	currentMouseMode = newMode;
	switch(newMode){
		case "normal": {
			normalButtonElement.classList.add("active");
			textboxButtonElement.classList.remove("active");
			lineButtonElement.classList.remove("active");
			break;
		}
		case "textbox": {
			normalButtonElement.classList.remove("active");
			textboxButtonElement.classList.add("active");
			lineButtonElement.classList.remove("active");
			break;
		}
		case "line": {
			normalButtonElement.classList.remove("active");
			textboxButtonElement.classList.remove("active");
			lineButtonElement.classList.add("active");
			break;
		}
		default: {
			normalButtonElement.classList.add("active");
			textboxButtonElement.classList.remove("active");
			lineButtonElement.classList.remove("active");
		}
	}
}

normalButtonElement.addEventListener("click", () => {
	setMouseMode("normal")
});

textboxButtonElement.addEventListener("click", () => {
	setMouseMode("textbox")
});

lineButtonElement.addEventListener("click", () => {
	setMouseMode("line")
});

type LineType = "negative-hypothesized" | "positive-hypothesized" | "negative" | "positive"
let currentLineType: LineType = "negative-hypothesized";

const setCurrentLineType = (newType: LineType) => {
	currentLineType = newType;
	const lineInsideButton = lineButtonElement.querySelector("span.line") as HTMLSpanElement;

	//update button display
	switch(newType){
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

	setMouseMode("line")
	closeDropdown();
}

//set mouse mode when select line
dropdownElement.querySelectorAll("button").forEach(element => {
	console.log(element)
	element.addEventListener("click", (e) => {
		console.log(element.id)
		const clickedLineType = element.id.match(/\-(.*)/)?.[1] as LineType;
		console.log(clickedLineType);
		setCurrentLineType(clickedLineType);
	})
})

const drawingContainer = document.querySelector("#drawing-container") as HTMLDivElement;
const textboxContainer = document.querySelector("#textbox-container") as HTMLDivElement;
const lineContainer = document.querySelector("#line-container") as HTMLDivElement;

let isDragging = false;
let dragOffset = {x: 0, y: 0};

const textboxes: HTMLInputElement[] = []
const lines: {nodes: [HTMLInputElement, HTMLInputElement], type: LineType}[] = []

drawingContainer.addEventListener("click", (e) => {
	console.log('pointer event', e.clientX, e.clientY)
	//textbox functionality
	const createTextBox = (): HTMLInputElement => {
		const textbox = document.createElement("input");
		textbox.className = "textbox absolute";
		textboxContainer.appendChild(textbox);
		return textbox;
	}
	
	if (currentMouseMode === "textbox") {
		console.log("creating textbox");
		if (isDragging) return; //prevent creating new texbox when dragging
		const textbox = createTextBox();
		textbox.style.left = (e.clientX - textbox.getBoundingClientRect().width/2) + "px";
		textbox.style.top = (e.clientY - (headerElement.getBoundingClientRect().height) - (textbox.getBoundingClientRect().height/2)) + "px";
		const isOverlap = !!textboxes.find((element) => areElementsOverlap(element,textbox))
		if (isOverlap) {
			console.log("overlap detected");
			textbox.remove();
			return;
		}
		textbox.id = `textbox-${textboxes.length}`;
		// textbox.addEventListener("")
		textboxes.push(textbox);
		textbox.focus();
	}
})

let selectedTextBox: HTMLInputElement | null;
let lineToCreate: HTMLSpanElement | null;
let lineOrigin: {x: number, y: number} = {x: 0, y: 0}

drawingContainer.addEventListener("mousedown", (e) => {
	console.log('mouse down', e.clientX, e.clientY)
	selectedTextBox = document.elementsFromPoint(e.clientX, e.clientY).find(el => el.classList.contains("textbox")) as HTMLInputElement ?? null;
	if (currentMouseMode === "normal"){
		isDragging = true;
		dragOffset = {x: 0, y: 0}
		console.log(selectedTextBox)
	}

	//begin create line
	if (currentMouseMode === "line" && selectedTextBox){
		console.log('creating line')
		const createLine = (): HTMLSpanElement => {
			const line = document.createElement("span");
			line.className = "absolute line " + currentLineType.split("-").join(" ");
			line.style.height = "2px";
			line.style.transformOrigin = "0 0";
			console.log('line created')
			lineContainer.appendChild(line);
			return line;
		}

		lineToCreate = createLine();
		lineToCreate.style.left = (selectedTextBox.getBoundingClientRect().left + selectedTextBox.getBoundingClientRect().width/2) + "px";
		lineToCreate.style.top = (selectedTextBox.getBoundingClientRect().top - headerElement.getBoundingClientRect().height + selectedTextBox.getBoundingClientRect().height/2) + "px";
		lineOrigin = {x: selectedTextBox.getBoundingClientRect().left + selectedTextBox.getBoundingClientRect().width/2, y: selectedTextBox.getBoundingClientRect().top - headerElement.getBoundingClientRect().height + selectedTextBox.getBoundingClientRect().height/2}
	}
})

drawingContainer.addEventListener("mousemove", (e) => {
	if (isDragging) {
		if (selectedTextBox) {
			selectedTextBox.style.left = (e.clientX - dragOffset.x - selectedTextBox.getBoundingClientRect().width/2 )  + "px";
			selectedTextBox.style.top = (e.clientY - dragOffset.y - headerElement.getBoundingClientRect().height - selectedTextBox.getBoundingClientRect().height/2) + "px";
		}
	}
	if (lineToCreate){
		const offsetX = lineOrigin.x - e.clientX
		const offsetY = lineOrigin.y - e.clientY + headerElement.getBoundingClientRect().height
		const rotation = Math.atan2(-offsetY, -offsetX) * 180 / Math.PI;
		console.log({
			originX: lineOrigin.x, originY: lineOrigin.y,
			offsetX, offsetY, rotation
		})
		lineToCreate.style.width = `${ Math.sqrt(offsetX ** 2 + offsetY ** 2) }px`;
		lineToCreate.style.transform = `rotate(${ rotation }deg)`;
	}
})

drawingContainer.addEventListener("mouseup", (e) => {
	isDragging = false;
	selectedTextBox = null;
	if (lineToCreate){
		const targetTextbox = document.elementsFromPoint(e.clientX, e.clientY).find(el => el.classList.contains("textbox")) as HTMLInputElement ?? null;
		if (!targetTextbox || targetTextbox === selectedTextBox) {
			lineToCreate.remove();
			lineToCreate = null;
		} else {
			const offsetX = lineOrigin.x - targetTextbox.getBoundingClientRect().left - targetTextbox.getBoundingClientRect().width/2
			const offsetY = lineOrigin.y - targetTextbox.getBoundingClientRect().top + headerElement.getBoundingClientRect().height - targetTextbox.getBoundingClientRect().height/2
			const rotation = Math.atan2(-offsetY, -offsetX) * 180 / Math.PI;
			lineToCreate.style.width = `${ Math.sqrt(offsetX ** 2 + offsetY ** 2) }px`;
			lineToCreate.style.transform = `rotate(${ rotation }deg)`;
			lineToCreate = null;
		}
	}
})

document.addEventListener("DOMContentLoaded", () => {
	setCurrentLineType("negative-hypothesized");
	setMouseMode("normal");
})