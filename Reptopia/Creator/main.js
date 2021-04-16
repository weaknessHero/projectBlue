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

//객체를 총괄하는 배열
var eyes = [], waves = [], objects = [];

//Mouse x, y
var mx, my;

//현재 프레임
var frame = 0;

//canvas elements
var cageList = [];

//Animation frame objects.
var backgroundAnimation;
var initAnimation;
var cageAnimations = [];

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

setupCanvas();
init();
if(frame>100)
    cancelAnimationFrame(initAnimation);
backgroundLoop();