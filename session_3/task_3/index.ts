// index.ts

// Define the type for a Position object, containing two properties, x and y, both of which are numbers.
type Position = { x: number, y: number };

// Initialize the state of the application.
let selectedElement: HTMLElement | null = null;  // Holds the currently selected HTML element (or null if none is selected).
let initialPosition: Position = { x: 0, y: 0 };  // Holds the initial mouse position when an element was clicked.
let offset: Position = { x: 0, y: 0 };  // The offset of the mouse position relative to the selected element's position.
let isMoveable = false; // Flag indicating whether an element is currently moveable (moveable for task 3, unmoveable for task 4).
let isMoving = false;  // Flag indicating whether an element is currently being moved.

// Define default positions for each color box.
const defaultPositions = {
    red: {top: 60, left: 545},
    orange: {top: 94, left: 545},
    yellow: {top: 129, left: 545},
    green: {top: 165, left: 545},
}

const mapWidth = 818; // Map width in pixels.
const mapHeight = 583; // Map height in pixels.

// Handle the 'mousedown' event.
function onMouseDown(event: MouseEvent): void {
    // Check if the clicked element is a box.
    if (event.target instanceof HTMLElement && event.target.classList.contains('box')) {
        selectedElement = event.target;
        initialPosition.x = event.clientX;
        initialPosition.y = event.clientY;

        // Calculate the offset from the mouse position to the top-left corner of the selected element.
        const rect = selectedElement.getBoundingClientRect();
        offset.x = initialPosition.x - rect.left;
        offset.y = initialPosition.y - rect.top;
    }
}

// Handle the 'mousemove' event.
function onMouseMove(event: MouseEvent): void {
    // Move the selected element, if there is one.
    if (selectedElement) {
        isMoving = true;
        // Keep the element within the boundaries of the map.
        selectedElement.style.left = `${Math.max(38, Math.min(event.clientX, mapWidth)) - offset.x - 8}px`;
        selectedElement.style.top = `${Math.max(38, Math.min(event.clientY, mapHeight)) - offset.y - 8}px`;
    }
}

// Handle the 'mouseup' event.
function onMouseUp(): void {
    if (selectedElement && isMoving){
        // Parse the color and index from the element's id.
        const color = selectedElement.id.match(/^\w+/)?.[0];
        const index = Number(selectedElement.id.match(/\d+$/)?.[0]);
        
        // Parse the top and left style properties to get the final position of the box.
        const top = Number(selectedElement.style.top.match(/^\d+/)?.[0]);
        const left = Number(selectedElement.style.left.match(/^\d+/)?.[0]);

        // Send the box move event data to the parent window.
        window.parent.postMessage({
            taskId: "s3t3",
            action: "move",
            value: {
                color,
                index,
                position: {
                    top,
                    left
                }
            }
        }, "*");
    }

    // Reset the selected element and isMoving flag.
    selectedElement = null;
    isMoving = false;
}

// Add the mouse event listeners to the document.
document.addEventListener('mousedown', onMouseDown, false);
document.addEventListener('mousemove', onMouseMove, false);
document.addEventListener('mouseup', onMouseUp, false);

// Request initial box positions from the parent window.
window.parent.postMessage({
    taskId: "s3t3",
    action: "request init data"
}, "*");

// Listen for messages from the parent window.
window.addEventListener("message", (event: MessageEvent) => {
    const data = event.data;

    // Make the box moveable or unmoveable depending on the taskId.
    if (data.taskId === "s3t3"){
        isMoveable = true;
    } 
    else if (data.taskId === "s3t4") {
        isMoveable = false;
    } 
    //Ignore message if taskId is not s3t3 or s3t4.
    else return;

    // Handle the 'init' action.
    if (data.action === "init") {
        const boxData = data.boxData;

        // Function to update the position of boxes for a given color.
        const updateBoxPositions = (color: string) => {
            return (coordinate: {top: number; left: number}, index: number) => {
                const box = document.getElementById(`${color}-${index}`) as HTMLSpanElement;

                // If the coordinates are 0, then place the box in the default position.
                if (coordinate.top === 0 || coordinate.left === 0){
                    box.style.top = `${defaultPositions[color].top}px`;
                    box.style.left = `${defaultPositions[color].left}px`;
                    return;
                }

                // Otherwise, place the box at the received coordinates.
                box.style.top = `${coordinate.top}px`;
                box.style.left = `${coordinate.left}px`;
            };
        }

        // Update the positions of all boxes.
        boxData.red.forEach(updateBoxPositions("red"));
        boxData.orange.forEach(updateBoxPositions("orange"));
        boxData.yellow.forEach(updateBoxPositions("yellow"));
        boxData.green.forEach(updateBoxPositions("green"));
    }
});
