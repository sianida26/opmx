import { TinyEmitter } from "tiny-emitter";
import Context from "./ContextAbstract";
import createTextBox, { TextBox } from "../TextBox";
import Header from "../Header";
import { areElementsOverlap, toCartesian } from "../helpers";
import { CartesianCoordinate } from "../types";
import createLine, { Line } from "../Line";

type MouseMode = "normal" | "textbox" | "line"
export type LineType = "negative-hypothesized" | "positive-hypothesized" | "negative" | "positive"

class TaskContext extends Context  {

    isDropdownOpen = false;
    currentMouseMode: MouseMode = "normal"
    currentLineMode: LineType = "negative-hypothesized"
    initialTextBoxPosition: CartesianCoordinate | null = null
    textBoxDragged: TextBox | null = null
    textBoxes: TextBox[] = []
    currentOriginTextBox: TextBox | null = null;
    currentDrawingLine: Line | null = null;

    lines: {origin: TextBox, target: TextBox, line: Line}[] = []; //saves the lines connection between textBoxes

    private _emitter = new TinyEmitter();

    constructor() {
        super()
    }

    get isDragging(){
        return Boolean(this.textBoxDragged)
    }

    changeMouseMode(mode: MouseMode){
        this._emitter.emit("mouse mode change", mode)
        this.currentMouseMode = mode
    }

    onMouseModeChange(callback: (mode: MouseMode) => void){
        this._emitter.on("mouse mode change", callback)
    }

    changeLineType(type: LineType){
        this._emitter.emit("line type change", type)
        this.currentLineMode = type

        //change mouse mode when line type changes
        this.changeMouseMode("line");

        //close dropdown when line type changes
        taskContext.closeDropdown();
    }

    onLineTypeChange(callback: (type: LineType) => void){
        this._emitter.on("line type change", callback)
    }

    openDropdown(){
        if (this.isDropdownOpen) return; //prevent open when already opened
        this._emitter.emit("dropdown state change", true)
        // console.log("Emit", "dropdownstatechange")
        this.isDropdownOpen = true;
    }

    closeDropdown(){
        if (!this.isDropdownOpen) return; //prevent close when already closed
        this._emitter.emit("dropdown state change", false)
        this.isDropdownOpen = false;
    }

    toggleDropdown(){
        if (this.isDropdownOpen) this.closeDropdown();
        else this.openDropdown();
    }

    onDropdownStateChange(callback: (isOpen: boolean) => void) {
        this._emitter.on("dropdown state change", callback)
    }

    getTextBoxFromPoint(clientX: number, clientY: number): TextBox | null {
        const selectedTextBox = document.elementsFromPoint(clientX, clientY)
			.find(el => el.classList.contains("textbox")) as HTMLInputElement ?? null;
        
        if (!selectedTextBox) return null;

        const textBox = this.textBoxes.find(textBox => textBox.element === selectedTextBox);

        if (!textBox) return null;

        return textBox;
    }

    createTextBox(x: number, y: number){
        const textBox = createTextBox(x, y);

        //check for overlap
        if (this.textBoxes.find((textBoxItem) => areElementsOverlap(textBoxItem.element,textBox.element))){
            //remove if overlap
            textBox.remove();
        }

        textBox.id = this.textBoxes.length;
        this.textBoxes.push(textBox);
        this._emitter.emit("textbox created", textBox)
        return textBox;
    }

    beginDragTextBox(textBox: TextBox){
        this.textBoxDragged = textBox;
        this.initialTextBoxPosition = textBox.getPosition();
    }

    dragTextBox(x: number, y: number){
        if (!this.textBoxDragged) return;
        this.textBoxDragged.setPosition(toCartesian({x, y}));
        this.updateLines(); //update lines positions when textbox is dragged
    }

    endDragTextBox(){
        if (this.textBoxDragged === null || this.initialTextBoxPosition === null) return;
        
        //return to initial position if overlap
        if (this.textBoxes.find((textBoxItem) => textBoxItem !== this.textBoxDragged && areElementsOverlap(textBoxItem.element,this.textBoxDragged!.element))){
            this.textBoxDragged.setPosition(this.initialTextBoxPosition)
        }
        
        this.textBoxDragged = null;
    }

    createLine(clientX: number, clientY: number){
        const textBoxAtPoint = this.getTextBoxFromPoint(clientX, clientY);
        if (!textBoxAtPoint) return; //don't create line if no text box at point
        this.currentOriginTextBox = textBoxAtPoint;
        const line = createLine(this.currentLineMode, this.currentOriginTextBox.getPosition());
        this.currentDrawingLine = line;
        this._emitter.emit("draw line", line);
    }

    onDrawLine(clientX: number, clientY: number){
        if (!this.currentDrawingLine) return;
        this.currentDrawingLine.setEndPoint(toCartesian({x: clientX, y: clientY}))
    }
    
    endDrawLine(clientX: number,  clientY: number){
        if (!this.currentDrawingLine || !this.currentOriginTextBox) return;
        this.currentDrawingLine.setEndPoint(toCartesian({x: clientX, y: clientY}));
        
        //detect landing textbox
        const textBoxAtPoint = this.getTextBoxFromPoint(clientX, clientY);
        if (!textBoxAtPoint){
            //if no textbox at ending point, remove current line
            this.currentDrawingLine.remove();
            this.currentDrawingLine = null;
            return;
        }

        if (this.lines.find(line => line[0] === this.currentOriginTextBox && line[1] === textBoxAtPoint) ||
            this.lines.find(line => line[0] === textBoxAtPoint && line[1] === this.currentOriginTextBox)
        ){
            //if line already exists, remove current line
            this.currentDrawingLine.remove();
            this.currentDrawingLine = null;
            return;
        }
        
        this.currentDrawingLine.setEndPoint(textBoxAtPoint.getPosition()); //snap to textbox

        //save line
        this.lines.push({origin: this.currentOriginTextBox, target: textBoxAtPoint, line: this.currentDrawingLine})


        this.currentDrawingLine = null;
    }

    private updateLines(){
        if (!this.textBoxDragged) return;
        this.lines
            .map((lineRecord, index) => {
                if (lineRecord.origin !== this.textBoxDragged && lineRecord.target !== this.textBoxDragged) return;

                if (lineRecord.origin === this.textBoxDragged){
                    lineRecord.line.setOrigin(lineRecord.target.getPosition())
                    lineRecord.line.setEndPoint(this.textBoxDragged.getPosition())

                    //update the record
                    this.lines[index] = {origin: lineRecord.target, target: lineRecord.origin, line: lineRecord.line}
                } else if (lineRecord.target === this.textBoxDragged){
                    lineRecord.line.setEndPoint(this.textBoxDragged.getPosition())
                }
            })
    }
}

const taskContext = new TaskContext();

export default taskContext;
