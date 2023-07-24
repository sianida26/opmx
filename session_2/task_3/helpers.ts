import Header from "./Header";

export const areElementsOverlap = (element1: HTMLElement, element2: HTMLElement) => {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    
    return !(
        rect1.top > rect2.bottom ||
        rect1.right < rect2.left ||
        rect1.bottom < rect2.top ||
        rect1.left > rect2.right
    )
}

export const toCartesian = ({x, y}: {x: number, y: number}) => {
    return {
        x,
        y: y - (Header.height)
    }
}

export const fromCartesian = ({x, y}: {x: number, y: number}) => {
    return {
        x,
        y: y + (Header.height)
    }
}