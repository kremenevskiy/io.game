const upgrade_menu = document.getElementById('upgrade-menu');

const damageUpLvl = document.getElementById('dmgUp-lbl');
const damageDownLvl = document.getElementById('dmgDec-lbl');
const rangeLvl = document.getElementById('range-lbl');
const reloadLvl = document.getElementById('reload-lbl');
const speedLvl = document.getElementById('speed-lbl');
const healthLvl = document.getElementById('health-lbl');
const regenLvl = document.getElementById('regen-lbl');


export function update_lvl_labels(data){
    damageUpLvl.innerHTML = data.damageUpLvl;
    damageDownLvl.innerHTML = data.damageDecLvl;
    rangeLvl.innerHTML = data.rangeLvl;
    regenLvl.innerHTML = data.regenLvl;
    reloadLvl.innerHTML = data.reloadLvl;
    speedLvl.innerHTML = data.speedLvl;
    healthLvl.innerHTML = data.healthLvl;
}




