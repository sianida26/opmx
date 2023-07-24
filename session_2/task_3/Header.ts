const Header = (() => {
    const element = document.querySelector("header") as HTMLDivElement;

    return {
        element,
        height: element.getBoundingClientRect().height
    }
})()

export default Header;