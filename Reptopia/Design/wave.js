/*
    wave.js
    2021.01.22
    Wave. One of interactive functions in Reptopia.
*/
/*
    1.3.5
        ctxBackground.strokeStyle = "red": 파동 색 변경.
*/

function drawWave(wave){
    if(wave['end']) waves.splice(waves.findIndex( w => w==wave), 1); //제거 파트

    let t = frame - wave['frame'];

    ctxBackground.strokeStyle = "red";
    ctxBackground.lineWidth = waveWidth - waveWidth/waveFrame * t; //시간과 두께 반비례.

    ctxBackground.beginPath();
    ctxBackground.arc(wave['x'], wave['y'], t*(canvasEl.width+canvasEl.height)/(waveFrame*10), 0, 360); //시간과 반지름 비례.
    ctxBackground.stroke();

    if(frame - wave['frame'] >= waveFrame-2) wave['end'] = true; //제거 파트
}