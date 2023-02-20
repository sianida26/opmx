const buttons = Array.from(document.querySelectorAll(".button"));

const syncToStorage = () => {
	localStorage.setItem(
		"s1t5/states",
		JSON.stringify(
			buttons.map((elem) =>
				elem.textContent === "+"
					? "+"
					: elem.textContent === "-"
					? "-"
					: ""
			) //security safe
		)
	);
	localStorage.setItem("s1t5/lastedit", String(new Date().getTime()));

	sendDataToParentWindow();
};

const sendDataToParentWindow = () => {
	window.parent.postMessage(
		{
			taskId: "s1t5",
			action: "updateStates",
			value: buttons.map((elem) =>
				elem.textContent === "+"
					? "+"
					: elem.textContent === "-"
					? "-"
					: ""
			), //security safe
		},
		"*"
	);
};

buttons.forEach((elem) => {
	elem.addEventListener("click", () => {
		const changeToPositive = () => {
			elem.textContent = "+";
			elem.classList.remove("negative");
			elem.classList.add("positive");
		};

		const changeToNegative = () => {
			elem.textContent = "-";
			elem.classList.remove("positive");
			elem.classList.add("negative");
		};

		console.log("textcontent", elem.textContent);
		console.log("innerHTML", elem.innerHTML);

		const currentStatus =
			elem.textContent === "+"
				? "positive"
				: elem.textContent === "-"
				? "negative"
				: "none";

		console.log("currentStatus", currentStatus);

		if (currentStatus === "none" || currentStatus === "negative")
			changeToPositive();
		else changeToNegative();

		syncToStorage();
	});
});

//Populate states
if (localStorage.getItem("s1t5/states")){
    const values = JSON.parse(localStorage.getItem("s1t5/states") ?? "[]");
    buttons.forEach((elem, i) => {
        const changeToPositive = () => {
			elem.textContent = "+";
			elem.classList.remove("negative");
			elem.classList.add("positive");
		};

		const changeToNegative = () => {
			elem.textContent = "-";
			elem.classList.remove("positive");
			elem.classList.add("negative");
		};

        const state = values[i] as string
        if (state === "+") changeToPositive()
        else if (state === "-") changeToNegative()
    })
}