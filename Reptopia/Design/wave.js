/*
    wave.js
    2021.01.22
    Wave. One of interactive functions in Reptopia.
*/
/*
    1.3.4
        1 Created.
*/

function drawWave(wave){
    if(wave['end']) waves.splice(waves.findIndex( w => w==wave), 1); //제거 파트

    let t = frame - wave['frame'];

    ctx.strokeStyle = "white";
    ctx.lineWidth = waveWidth - waveWidth/waveFrame * t; //시간과 두께 반비례.

    ctx.beginPath();
    ctx.arc(wave['x'], wave['y'], t*(canvasEl.width+canvasEl.height)/(waveFrame*10), 0, 360); //시간과 반지름 비례.
    ctx.stroke();

    if(frame - wave['frame'] >= waveFrame-2) wave['end'] = true; //제거 파트
}