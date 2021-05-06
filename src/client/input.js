import {updateDirection} from "./networking";
import {createBullet} from "./networking";
import {canvasWidth, canvasHeight} from "./index";

const canvas = document.querySelector('canvas')

export var mouseX = 0;
export var mouseY = 0;


function onMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    handleMove(mouseX, mouseY);
}

function onClicked(event) {
    const dir = Math.atan2(event.clientY - canvasHeight / 2, event.clientX - canvasWidth / 2);
    createBullet(dir)
}


function handleMove(x, y) {
    // console.log('hangle move');
    // console.log('size: ' + window.innerWidth/2 + " " + window.innerWidth/2)
    const angle = Math.atan2(y - canvasHeight / 2, x - canvasWidth / 2);
    var update_data = {
        dir: angle,
        vel_mid: {
            x: mouseX - window.innerWidth / 2,
            y: mouseY - window.innerHeight / 2
        }
    }
    // setInterval(() => {
    //     console.log(angle)
    // }, 1000);
    updateDirection(update_data);
}


export function startCapturingInput() {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClicked)
}


export function stopCapturingInput(){
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('click', onClicked);
}