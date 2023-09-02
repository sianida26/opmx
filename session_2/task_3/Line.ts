import { LineType } from "./contexts/TaskContext";
import { fromCartesian } from "./helpers";
import { CartesianCoordinate } from "./types";

export class Line {

    element: HTMLSpanElement;
    
    private type: LineType
    private origin: CartesianCoordinate;

    constructor(type: LineType){
        this.type = type;

        this.element = document.createElement("span");
        this.element.className = `absolute line ${type.split("-").join(" ")}`
        this.element.style.height = "2px";
        this.element.style.transformOrigin = "0 0";

        this.element.onclick = () => this.element.classList.toggle("focus")
    }

    appendToElement(element: HTMLElement){
        element.appendChild(this.element);
    }

    setOrigin(position: CartesianCoordinate){
        // const elementPosition = fromCartesian(position)
        const elementPosition = position;
        console.log("element position", elementPosition);
        this.element.style.left = `${ elementPosition.x }px`;
        this.element.style.top = `${ elementPosition.y }px`;
        this.origin = position;
    }

    setEndPoint(position: CartesianCoordinate){
        const offsetX = this.origin.x - position.x;
        const offsetY = this.origin.y - position.y;
        const rotation = Math.atan2(-offsetY, -offsetX) * 180 / Math.PI;
        this.element.style.width = `${ Math.sqrt(offsetX ** 2 + offsetY ** 2) }px`;
		this.element.style.transform = `rotate(${ rotation }deg)`;
    }

    remove(){
        this.element.remove();
    }
}

const createLine = (lineType: LineType, originPosition: CartesianCoordinate, container?: HTMLDivElement) => {

    const lineContainer = container ?? document.querySelector("#line-container") as HTMLDivElement;
    const line = new Line(lineType);
    line.appendToElement(lineContainer)
    line.setOrigin(originPosition)
    
    return line;
}

export default createLine;
