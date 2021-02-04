/*
    background.js
    2021.02.01
    Reptopia의 background canvas 자바스크립트.
*/
/*
    1.3.6
        1 파일명 변경: 자세한 기능(background) 명시. 포괄적 의미(canvas) 삭제.
        2 Animation frame 객체를 각 변수에 할당: 화면에 보이지 않을 때 애니메이션을 중단하기 위함.
*/

//Element setting
var canvasEl = document.getElementById("background");
canvasEl.width = innerWidth;
canvasEl.height = innerHeight;
var ctxBackground = canvasEl.getContext("2d");

//Event Listeners
document.body.addEventListener("mousemove", look);
document.body.addEventListener("click", mouseClick);
window.addEventListener("resize", resize);

//객체를 총괄하는 배열
var eyes = [], waves = [], objects = [];

//Mouse x, y
var mx, my;

//현재 프레임
var frame = 0;

//Animation frame objects.
var backgroundAnimation;
var cageAnimations = [];

//상수
const timeSlow = 1;
const blinkVelocity = 5 * timeSlow;
const initFrameA = 35 * timeSlow;
const initFrameB = 10 * timeSlow;
const reactFrame = 10 * timeSlow;
const waveWidth = 20;
const waveFrame = 20 * timeSlow;
const sizeRate =  (canvasEl.width + canvasEl.height)/3000;
const eyeRange = 25;


//main
setupCanvas();
init();
backgroundLoop();

function setupCanvas(){ //초기 세팅
    for(let temp = 0; temp < 30; temp++) eyes.push(randomEye()); //랜덤 눈알 객체
}
function init(){ //Initial setting
    if(frame < initFrameA-initFrameB) eyes.forEach(eye=>eye.init(initFrameA-initFrameB)); //
    else if(frame > initFrameA) return 0;
    if(frame > (initFrameA-initFrameB)/2) eyes.forEach(eye=>eye.eyelidWidthRadius -= 105/((initFrameA+initFrameB)/2));
    requestAnimationFrame(init);
}
function backgroundLoop(){ //Background animation
    frame += 1;

    //Background
    ctxBackground.fillStyle = 'black';
    ctxBackground.fillRect(0,0, canvasEl.width, canvasEl.height);

    waves.forEach(wave => drawWave(wave));

    eyes.forEach(eye => eye.update());
    eyes.forEach(function(eye){if(Math.random()*2000<1) eye.blink(frame)});

    backgroundAnimation = requestAnimationFrame(backgroundLoop);
}



function mouseClick(){ //마우스 클릭 시 호출
    //파동 생성
    waves.push({'x' : mx-9, 'y' : my-90, 'frame' : frame, 'end' : false});

    //눈 깜빡임
    eyes.forEach(function(eye){
        d = distance([mx-9,my-90], [eye.centerX, eye.centerY]);
        if(d < (canvasEl.width + canvasEl.height)/10 + eye.whiteRadius) eye.blink(frame, (d/((canvasEl.width + canvasEl.height)/10)) * waveFrame);
    });
}
function look(event){ //마우스 움직임 시 호출
    mx = event.pageX + 9;
    my = event.pageY + 90;

    eyes.forEach(function(eye){
        if(distance([mx, my], [eye.centerX, eye.centerY]) < eye.range * (canvasEl.width + canvasEl.height)/2000){ //반응 사거리 구현
            if(!eye.looking){
                eye.slowDownCount = eye.reactingTime; //반응속도 구현
                eye.looking = true;
            }
        }
        else eye.looking = false;
    });
}
function resize(){ //창 크기 변경 시 호출
    if(canvasEl.width != innerWidth | canvasEl.height != innerHeight){
        eyes.forEach(eye => {
            eye.whiteRadius *= (innerWidth+innerHeight) / (canvasEl.width+canvasEl.height);
            eye.pupilRadius *= (innerWidth+innerHeight) / (canvasEl.width+canvasEl.height);
            eye.irisRadius *= (innerWidth+innerHeight) / (canvasEl.width+canvasEl.height);
            eye.looking=false; eye.centerX *= innerWidth / canvasEl.width; eye.centerY *= innerHeight / canvasEl.height;
            eye.toCenter(1);
        });
        canvasEl.width = innerWidth; canvasEl.height = innerHeight;
    }
    resizeFontSize(innerWidth, innerHeight); //글자 크기
}



function distance(location1, location2){
    return Math.abs(Math.sqrt(((location1[0]-location2[0])**2 + (location1[1]-location2[1])**2)));
}
function arrToRGB(arr){
    return "rgb(" + arr[0] + "," + arr[1] + "," + arr[2] + ")";
}
function degreeToRadian(degree){
    return Math.PI * degree/180;
}
