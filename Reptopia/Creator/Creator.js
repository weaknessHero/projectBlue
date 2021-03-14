//Element setting
var canvasEl = document.getElementById("creator");
canvasEl.width = innerWidth;
canvasEl.height = innerHeight;
var ctxBackground = canvasEl.getContext("2d");

var frame = 0;

var newCreature = randomObject('creature', canvasEl, ctxBackground);

console.log(newCreature);

backgroundLoop();

function backgroundLoop(){ //Background animation
    frame += 1;

    ctxBackground.fillStyle = 'black';
    ctxBackground.fillRect(0,0, canvasEl.width, canvasEl.height);

    backgroundAnimation = requestAnimationFrame(backgroundLoop);
}