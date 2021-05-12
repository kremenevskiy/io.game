import {updateDirection} from "./networking";
import {createBullet} from "./networking";
import {canvasWidth, canvasHeight} from "./index";

import {addDamage, decDamage} from "./networking";
import {addReload} from "./networking";
import {addHealth} from "./networking";
import {addRange} from "./networking";
import {addRegen} from "./networking";
import {addSpeed} from "./networking";


const damageAdd_btn = document.getElementById('dmgUp-btn');
const damageDec_btn = document.getElementById('dmgDec-btn');
const healthAdd_btn = document.getElementById('health-btn');
const regenAdd_btn = document.getElementById('regen-btn');
const rangeAdd_btn = document.getElementById('range-btn');
const speedAdd_btn = document.getElementById('speed-btn');
const reloadAdd_btn = document.getElementById('reload-btn');
const upgrade_menu = document.getElementById('upgrade-menu');




const canvas = document.querySelector('canvas')

export var mouseX = 0;
export var mouseY = 0;

var mouseUp = true;
var button_pressed = false;


function onMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    handleMove(mouseX, mouseY);
}

function onMouseDown(event) {
    mouseUp = false;

    // setTimeout(() => {
    //     if (button_pressed){
    //         return;
    //     }
    // }, 20);

    if (button_pressed){
        button_pressed = false;
        return;
    }

    var shoot_int = setInterval(() => {
        const dir = Math.atan2(mouseY - canvasHeight / 2, mouseX - canvasWidth / 2);
        createBullet(dir)
        if (mouseUp) {
            clearInterval(shoot_int);
        }
    }, 100)

}


function onMouseUp(event) {
    mouseUp = true;
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
    updateDirection(update_data);
}


// listen for upgrade

function onMenuClicked(event){
    button_pressed = true;
}

function onDamageAdd(){
    addDamage('damage_add');
}

function onDamageDec(){
    decDamage('damage_decrease');
}

function onReloadAdd(){
    addReload('reload');
}

function onRangeAdd(){
    addRange('range');
}

function onRegenADd(){
    addRegen('regen');
}

function onHealthAdd(){
    addHealth('health');
}

function onSpeedAdd(){
    addSpeed('speed');
}


export function startCapturingInput() {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousedown', onMouseDown);


    upgrade_menu.addEventListener('click', onMenuClicked);
    damageAdd_btn.addEventListener('click', onDamageAdd);
    damageDec_btn.addEventListener('click', onDamageDec);
    reloadAdd_btn.addEventListener('click', onReloadAdd);
    rangeAdd_btn.addEventListener('click', onRangeAdd);
    healthAdd_btn.addEventListener('click', onHealthAdd);
    regenAdd_btn.addEventListener('click', onRegenADd);
    speedAdd_btn.addEventListener('click', onSpeedAdd);
}


export function stopCapturingInput(){
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    window.removeEventListener('mousedown', onMouseDown);

    damageAdd_btn.removeEventListener('click',onDamageAdd);
    damageDec_btn.removeEventListener('click',onDamageDec);
    reloadAdd_btn.removeEventListener('click',onReloadAdd);
    rangeAdd_btn.removeEventListener('click',onRangeAdd);
    healthAdd_btn.removeEventListener('click',onHealthAdd);
    regenAdd_btn.removeEventListener('click', onRegenADd);
    speedAdd_btn.removeEventListener('click',onSpeedAdd);
}