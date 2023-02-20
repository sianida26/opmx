const inputs = Array.from(document.querySelectorAll("input"))
const syncToStorage = () => {
    localStorage.setItem(
		"s1t2/values",
		JSON.stringify(
			inputs.map(elem => elem.value)
		)
	);
	localStorage.setItem("s1t2/lastedit", String(new Date().getTime()));

    sendDataToParentWindow()
}

const sendDataToParentWindow = () => {
    window.parent.postMessage({
        taskId: "s1t2",
        action: "updateValues",
        value: inputs.map((elem) => elem.value)
    }, "*")
}

inputs.forEach(elem => elem.addEventListener("input", syncToStorage))

//populate saved value
if (localStorage.getItem("s1t2/values")){
    const values = JSON.parse(localStorage.getItem("s1t2/values") ?? "[]");
    inputs.forEach((elem, i) => elem.value = values[i] ?? "")
}

export {};
