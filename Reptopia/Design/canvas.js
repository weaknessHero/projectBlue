/*
    canvas.js
    2021.01.22
    Reptopia의 canvas 메인 자바스크립트.
*/
/*
    1.3.4
        1 함수 구조: 흐름을 읽기 쉽도록 수정: setup(), init(), loop() 활용
        2 loop(): 파동 구현 파트 추가.
        3 constants.
        4 resize(): 너비 뿐만 아니라 높이도 반응하도록 수정. 눈알 크기도 창 크기에 비례하도록 수정.
*/

//Element setting
var canvasEl = document.getElementsByTagName('canvas')[0];
canvasEl.width = innerWidth;
canvasEl.height = innerHeight;
var ctx = canvasEl.getContext("2d");

//Event Listeners
document.body.addEventListener("mousemove", look);
document.body.addEventListener("click", mouseClick);
window.addEventListener("resize", resize);

//객체를 총괄하는 배열
var eyes = [], waves = [];

//Mouse x, y
var mx, my;

//현재 프레임
var frame = 0;

//상수
const timeSlow = 1;
const blinkFrame = 18 * timeSlow;
const initFrameA = 35 * timeSlow;
const initFrameB = 10 * timeSlow;
const reactFrame = 10 * timeSlow;
const waveWidth = 20;
const waveFrame = 20 * timeSlow;
const sizeRate =  (canvasEl.width + canvasEl.height)/3000;
const eyeRange = 20;


//main
setup();
init();
loop();


function setup(){ //초기 세팅
    for(let temp = 0; temp < 40; temp++) eyes.push(randomEye()); //랜덤 눈알 객체
}
function init(){ //Initial setting
    if(frame < initFrameA-initFrameB) eyes.forEach(eye=>eye.init(initFrameA-initFrameB)); //
    else if(frame > initFrameA) return 0;
    if(frame > (initFrameA-initFrameB)/2) eyes.forEach(eye=>eye.eyelidWidthRadius -= 105/((initFrameA+initFrameB)/2));
    requestAnimationFrame(init);
}
function loop(){ //메인 루프
    frame += 1;
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0, canvasEl.width, canvasEl.height);

    //파동 구현 파트
    waves.forEach(wave => drawWave(wave));

    eyes.forEach(eye => eye.update());

    requestAnimationFrame(loop);
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
            eye.blackRadius *= (innerWidth+innerHeight) / (canvasEl.width+canvasEl.height);
            eye.secondBlackRadius *= (innerWidth+innerHeight) / (canvasEl.width+canvasEl.height);
            eye.looking=false; eye.centerX *= innerWidth / canvasEl.width; eye.centerY *= innerHeight / canvasEl.height;
            eye.toCenter(1);
        });
        canvasEl.width = innerWidth; canvasEl.height = innerHeight;
    }
}



function distance(location1, location2){ //location1 - location2 거리 계산
    return Math.abs(Math.sqrt(((location1[0]-location2[0])**2 + (location1[1]-location2[1])**2)));
}
function arrToRGB(arr){ //배열 -> rgb문자열
    return "rgb(" + arr[0] + "," + arr[1] + "," + arr[2] + ")";
}
function degreeToRadian(degree){ //각도 -> 라디안
    return Math.PI * degree/180;
}
