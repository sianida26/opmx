Array.from(document.querySelectorAll(".button")).forEach((elem) => {
    elem.addEventListener("click", () => {

        const changeToPositive = () => {
            elem.textContent = "+";
            elem.classList.remove("negative");
            elem.classList.add("positive");
        }

        const changeToNegative = () => {
            elem.textContent = "-";
            elem.classList.remove("positive");
            elem.classList.add("negative");
        }

        console.log('textcontent',elem.textContent)
        console.log('innerHTML',elem.innerHTML)

        const currentStatus = elem.textContent == "" ? "none"
            : elem.textContent == "+" ? "positive" : "negative"

        console.log("currentStatus", currentStatus)
        
        if (currentStatus === "none" || currentStatus === "negative") changeToPositive()
        else changeToNegative()
    })
});