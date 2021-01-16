function drawWave(wave){ //최대 반지름: canvas.width의 1/5, 초기 두께 : 15, 총 시간: 30 frame
    let t = frame-wave[2];

    ctx.strokeStyle = "rgb(217, 190, 130)";
    ctx.lineWidth = 15 - t*0.5;

    ctx.beginPath();
    ctx.arc(wave[0], wave[1], t*canvasEl.width/150, 0, 360);
    ctx.stroke();
}