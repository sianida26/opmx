import elements from "./elements";

const periodicTable = document.querySelector(".periodic-table");
const transitionTable = document.querySelector(".inner-transition-table");

const renderedGroups: number[] = [];
const renderedPeriods: number[] = [];
const selectedElements = new Set<string>();

// send message to parent element
// source: https://thuannp.com/react-communication-with-iframe/
const sendDataToParent = (action: "add" | "delete", elementName: string) => {
	window.parent.postMessage(
		{
			type: `element-${ action }`,
			message: elementName,
		},
		"*"
	);
};

const toggleState = (id: string, elementName: string) => {
	const elem = document.querySelector(`#elem-${id}`);
	if (elem === null) throw new Error(`Element node with id ${id} not found`);

	//if not essential or beneficial state, set to essential state
	if (
		!elem.classList.contains("essential") &&
		!elem.classList.contains("beneficial")
	) {
		elem.classList.add("essential");
		selectedElements.add(elementName);

		//send data to parent
		sendDataToParent("add", elementName)
	}
	//if in essential state, set to beneficial state
	else if (elem.classList.contains("essential")) {
		elem.classList.add("beneficial");
		elem.classList.remove("essential");
	}
	//if in beneficial state, reset the state
	else if (elem.classList.contains("beneficial")) {
		elem.classList.remove("beneficial");
		selectedElements.delete(elementName);
		sendDataToParent("delete", elementName);
	}
};

//Populate main elements
elements.forEach((elem) => {
	//create new item for grid
	const gridItem = document.createElement("button");
	gridItem.classList.add("element");
	gridItem.id = `elem-${elem.z}`;

	//position the item based on group and period
	if (typeof elem.group === "number")
		gridItem.style.gridColumnStart = String(elem.group);

	//atomic number node
	const atomicNumber = document.createElement("span");
	atomicNumber.classList.add("z");
	atomicNumber.innerText = String(elem.z);

	//element symbol node
	const symbol = document.createElement("span");
	symbol.classList.add("symbol");
	symbol.innerText = elem.symbol;

	//element name
	const name = document.createElement("span");
	name.classList.add("name");
	name.innerText = elem.name;

	//append childs
	gridItem.appendChild(atomicNumber);
	gridItem.appendChild(symbol);
	gridItem.appendChild(name);

	//if the group label is not rendered yet, add label to the element
	if (renderedGroups.indexOf(elem.group as number) === -1) {
		const label = document.createElement("span");
		label.classList.add("label-group");
		label.innerText = String(elem.group);
		gridItem.appendChild(label);
		renderedGroups.push(elem.group as number);
		label.addEventListener("click", (e) => e.stopPropagation());
	}

	if (renderedPeriods.indexOf(elem.period) === -1) {
		const label = document.createElement("span");
		label.classList.add("label-period");
		label.innerText = String(elem.period);
		gridItem.appendChild(label);
		label.addEventListener("click", (e) => e.stopPropagation());
		renderedPeriods.push(elem.period as number);
	}

	//add event listener
	gridItem.addEventListener("click", () =>
		toggleState(String(elem.z), elem.name)
	);

	//append to table
	if (typeof elem.group === "number") periodicTable?.appendChild(gridItem);
	else if (typeof elem.group === "string")
		transitionTable?.appendChild(gridItem);
});
