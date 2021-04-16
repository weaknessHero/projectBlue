/*
    Creator.js
    2021.02.04
    Js for creator canvas.
*/
/*
    1.3.9
        1 Movement test.
*/

//Element setting
var canvasEl = document.getElementById("creator");
canvasEl.width = innerWidth;
canvasEl.height = innerHeight;
var ctxBackground = canvasEl.getContext("2d");

//consts
const eyeSizeRate =  (canvasEl.width + canvasEl.height)/1000;
const eyeRange = 25;
const timeSlow = 1;
const blinkVelocity = 5 * timeSlow;
const initFrameA = 35 * timeSlow;
const initFrameB = 10 * timeSlow;
const reactFrame = 10 * timeSlow;

var frame = 60;

var newCreature = new Creature(canvasEl, ctxBackground, 'creature', canvasEl.width-300, canvasEl.height-500, 1, 0.3, 250, 50, [30,100,50], 12);
var ground = new ObjectR(canvasEl, ctxBackground, 'wall', 0, canvasEl.height-100, 1, 100, canvasEl.width, 100, [30,100,50]);
var wall1 = new ObjectR(canvasEl, ctxBackground, 'wall', canvasEl.width-200, canvasEl.height-300, 1, 100, 100, 50, [30,100,150]);
var wall2 = new ObjectR(canvasEl, ctxBackground, 'wall', canvasEl.width-250, canvasEl.height-250, 1, 100, 200, 50, [30,50,150]);
var wall3 = new ObjectR(canvasEl, ctxBackground, 'wall', canvasEl.width-300, canvasEl.height-200, 1, 100, 300, 50, [180,100,150]);
var wall4 = new ObjectR(canvasEl, ctxBackground, 'wall', canvasEl.width-350, canvasEl.height-150, 1, 100, 400, 50, [0,100,150]);

var objects = [newCreature, ground, wall1, wall2, wall3, wall4];


backgroundLoop();
function backgroundLoop(){
    frame += 1;

    ctxBackground.fillStyle = 'black';  //배경 채우기
    ctxBackground.fillRect(0,0, canvasEl.width, canvasEl.height);

    objects.forEach(obj => { obj.update(); }); //모든 오브젝트 업데이트
    
    for(let i=0; i<objects.length; i++){    //충돌 확인 파트
        if(objects[i].collision(objects)==0) break;
        objects[i].move();
    }

    backgroundAnimation = requestAnimationFrame(backgroundLoop);
}