/*
    cage.js
    2021.01.27
    Functions for Cages.
*/
/*
    1.3.12
        1. element, data, function 구조 변경 필요.!
*/

//Element setting
var canvasEl = document.getElementById("background");
canvasEl.width = innerWidth;
canvasEl.height = innerHeight;
var ctxBackground = canvasEl.getContext("2d");

//Event Listeners
document.body.addEventListener("mousemove", mouseMove);
document.body.addEventListener("click", mouseClick);
window.addEventListener("resize", resize);

//page 위치
var pageState = "slide";

//객체를 총괄하는 배열
var eyes = [], waves = [], objects = [];
var cageList = document.getElementsByClassName("cage");
var cageCtxList = [];

//Mouse x, y
var mx, my, cageMouseX, cageMouseY;

//현재 프레임
var frame = 0;

//canvas elements
var cageList = document.getElementsByClassName("cage");

//Animation frame objects.
var backgroundAnimation;
var initAnimation;
var cageAnimations = [0, 0, 0, 0, 0];

feeding = false;
out = true;

//conts
const timeSlow = 1;
const blinkVelocity = 5 * timeSlow;
const initFrameA = 35 * timeSlow;
const initFrameB = 10 * timeSlow;
const reactFrame = 10 * timeSlow;
const waveWidth = 20;
const waveFrame = 20 * timeSlow;
const eyeSizeRate =  (canvasEl.width + canvasEl.height)/1000;
const eyeRange = 25;

for(cageN=0;cageN<cageList.length;cageN++){
    cageCtxList.push(cageList[cageN].getContext("2d"));
    objects.push([  new ObjectR(cageList[cageN], cageCtxList[cageN],
            'wall', 0, cageList[cageN].height-100, 1, 10000,
            cageList[cageN].width, 100, [120,80,30]),
        randomObject('creature', cageList[cageN], cageCtxList[cageN], 10),
        randomObject('creature', cageList[cageN], cageCtxList[cageN], 700)]);
    console.log("cageN");
}

setupCanvas();
init();
if(frame>100)
    cancelAnimationFrame(initAnimation);
backgroundLoop();