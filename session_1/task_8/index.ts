import elements from "./elements";

const periodicTable = document.querySelector(".periodic-table");
const transitionTable = document.querySelector(".inner-transition-table");

const renderedGroups: number[] = [];
const renderedPeriods: number[] = [];
const selectedElements = new Map<number, string>();

// sync to storage
const syncToStorage = () => {
	localStorage.setItem(
		"s1t8/states",
		JSON.stringify(Array.from(selectedElements.entries()))
	);
	localStorage.setItem("s1t8/lastedit", String(new Date().getTime()));

	sendDataToParentWindow();
};

const sendDataToParentWindow = () => {
	window.parent.postMessage(
		{
			taskId: "s1t8",
			action: "updateStates",
			value: selectedElements,
		},
		"*"
	);
};

const toggleState = (z: number, to?: string) => {
	const elem = document.querySelector(`#elem-${String(z)}`);
	if (elem === null)
		throw new Error(`Element node with atomic number ${z} not found`);

	const setToBenefical = () => {
		elem.classList.add("beneficial");
		elem.classList.remove("essential");
		selectedElements.set(z, "beneficial");
	};

	const setToNone = () => {
		elem.classList.remove("beneficial");
		selectedElements.delete(z);
	};

	const setToEssential = () => {
		elem.classList.add("essential");
		selectedElements.set(z, "essential");
	};

	if (!!to){
		switch (to){
			case "beneficial": setToBenefical(); break;
			case "essential": setToEssential(); break;
			default: setToNone(); break;
		}
		return;
	}

	//if in essential state, set to beneficial state
	if (elem.classList.contains("essential")) {
		setToBenefical();
	}

	//if in beneficial state, reset the state
	else if (elem.classList.contains("beneficial")) {
		setToNone();
	}

	//if not essential or beneficial state, set to essential state
	else {
		setToEssential();
	}
	syncToStorage();
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
	gridItem.addEventListener("click", () => toggleState(elem.z));

	//append to table
	if (typeof elem.group === "number") periodicTable?.appendChild(gridItem);
	else if (typeof elem.group === "string")
		transitionTable?.appendChild(gridItem);
});

//Update state from localstorage
if (localStorage.getItem("s1t8/states")) {
	const values = new Map<number, string>(
		JSON.parse(localStorage.getItem("s1t8/states") ?? "[]")
	);
	Array.from(values.entries()).forEach(([z, value]) => toggleState(z,value));
}
