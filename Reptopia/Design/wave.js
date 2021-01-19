/*  wave.js
    2021.01.19
    Wave. One of interactive functions in Reptopia.
*/
/*  1.3.4
        1 Created.
*/

function drawWave(wave){ //1.3.4
    let t = frame - wave['frame'];

    ctx.strokeStyle = "white";
    ctx.lineWidth = 15 - t * 0.5; //시간과 두께 반비례.

    ctx.beginPath();
    ctx.arc(wave['x'], wave['y'], t*canvasEl.width/150, 0, 360); //시간과 반지름 비례.
    ctx.stroke();
}