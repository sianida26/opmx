import Header from "./Header";
import { fromCartesian, toCartesian } from "./helpers";
import { CartesianCoordinate } from "./types";

export class TextBox {

    element: HTMLInputElement;
    _id: number;

    private position: CartesianCoordinate = {x: 0, y:0}

    constructor(){
        this.element = document.createElement("input");
        this.element.className = "textbox absolute";
        this._id = -1;
    }

    appendToElement(element: HTMLElement){
        element.appendChild(this.element);
    }

    setPosition(position: CartesianCoordinate){
        //Center by default
        const elementPosition = {
            x: fromCartesian(position).x - this.width/2,
            y: fromCartesian(position).y - (Header.height + this.height/2)
        }
        this.element.style.left = `${elementPosition.x}px`;
        this.element.style.top = `${elementPosition.y}px`;
        this.position = position;
    }

    getPosition(){
        return this.position;
    }
    
    get width(){
        return this.element.getBoundingClientRect().width
    }

    get height(){
        return this.element.getBoundingClientRect().height
    }

    set id(count: number){
        this.element.id = `textbox-${count}`;
        this._id = count;
    }
    
    get id(){
        return this._id
    }

    remove(){
        this.element.remove();
    }
}

const createTextBox = (x: number, y: number, container?: HTMLDivElement) => {
    const textboxContainer = container ?? document.querySelector("#textbox-container") as HTMLDivElement;
    const textBox = new TextBox();
    textBox.appendToElement(textboxContainer);
    textBox.setPosition(toCartesian({x, y}));

    //focus
    textBox.element.focus();

    return textBox;
};

export default createTextBox;