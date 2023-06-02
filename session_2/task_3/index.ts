const dropdownTogglerElement = document.querySelector('#btn-line-dropdown-toggler') as HTMLButtonElement;
const dropdownElement = document.querySelector('#line-menu-dropdown') as HTMLDivElement;
const normalButtonElement = document.querySelector(".btn-arrow") as HTMLButtonElement;
const textboxButtonElement = document.querySelector(".btn-textbox") as HTMLButtonElement;
const lineButtonElement = document.querySelector(".btn-line") as HTMLButtonElement;

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

let mode: MouseMode = "normal";

const setMouseMode = (newMode: MouseMode) => {
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
	element.addEventListener("click", (e) => {
		const clickedLineType = element.id.match(/\-(.*)/)?.[1] as LineType;
		
		setCurrentLineType(clickedLineType);
	})
})

setMouseMode("normal")