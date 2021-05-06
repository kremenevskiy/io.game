

const canvas = document.querySelector('canvas')

export var mouseX = 0;
export var mouseY = 0;


export function startListen(socket, player)
{
    window.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    })


    window.addEventListener('click', (event) => {
        const angle = Math.atan2(event.clientY - canvas.height / 2,
            event.clientX - canvas.width / 2);


        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }

        var bulletData = {
            x: player.x,
            y: player.y,
            dir: angle
        }

        // console.log('newbullet with: ' + bulletData.x + "Y: " + bulletData.y)
        socket.emit('newbullet', bulletData);

        // projectiles.push(new Projectile(
        //     player.x, player.y,
        //     5, 'red', velocity
        // ))

    })

}








//
//
// function onMouseMove(event) {
//     handleInput(event.clientX, event.clientY);
// }
//
//
// function handleInput(x, y) {
//     const angle = Math.atan2(y - window.height / 2,
//         event.clientX - canvas.width / 2);
// }
//
//
// function onClicked(event) {
//     createNewBullet(event.
// }
//
// export function startCapturingInput() {
//     window.addEventListener('mousemove', onMouseMove);
//     window.addEventListener('click', onClicked)
// }
//
//
// export function stopCapturingInput(){
//     window.removeEventListener('mousemove', onMouseMove);
//     window.removeEventListener('click', onClicked);
// }