function drawWave(wave){ //1.2.3
    let t = frame-wave[2];

    ctx.strokeStyle = "white";
    ctx.lineWidth = 15 - t*0.5;

    ctx.beginPath();
    ctx.arc(wave[0], wave[1], t*canvasEl.width/150, 0, 360);
    ctx.stroke();
}