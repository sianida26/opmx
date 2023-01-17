import * as PIXI from 'pixi.js'
import image from './aJuU_1.png'

//create a container and appends to the html
const app = new PIXI.Application({ background: '#1099bb' });
document.body.appendChild(app.view as any);

//create tree image as background
const tree = PIXI.Sprite.from(image);
app.stage.addChild(tree);

//set image's size to be fit on container
tree.width = app.screen.width
tree.height = app.screen.height

//input fields
const inputs = Array.from(document.getElementsByClassName("s1t2_input") as HTMLCollectionOf<HTMLElement>)

const positions = [
    [100,100],
    [0,0],
    [0,0],
]

inputs.forEach((input, i) => {
    input.style.position = "absolute"
    input.style.display = "inline"
    input.style.left = positions[i][0] + "px"
    input.style.top = positions[i][1] + "px"
})