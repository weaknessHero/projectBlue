/*
    Reptopia의 canvas 메인 자바스크립트.
*/
/*  1.3.4
        1 함수 구조: 흐름을 읽기 쉽도록 수정: setup(), init(), loop() 활용
        2 loop(): 파동 구현 파트 추가.
*/

//Element setting
var canvasEl = document.getElementsByTagName('canvas')[0];
var ctx = canvasEl.getContext("2d");
canvasEl.width = innerWidth;
canvasEl.height = innerHeight;
//Event Listeners
document.body.addEventListener("mousemove", look);
document.body.addEventListener("click", mouseClick);
window.addEventListener("resize", resize);
//객체를 총괄하는 배열
var eyes = [];
var waves = [];
//Mouse x, y
var mx;
var my;
//현재까지의 프레임 수
var frame = 0;



//main
setup();
init();
loop();



function setup(){ //초기 세팅
    for(let temp = 0; temp < 15; temp++) eyes.push(randomEye()); //랜덤 눈알 객체
}
function init(){ //Initial setting
    if(frame < 40) eyes.forEach(eye=>eye.init(40));
    if(frame > 20) eyes.forEach(eye=>eye.eyelidWidthRadius -= 105/30);
    if(frame > 50) return 0;
    requestAnimationFrame(init);
}
function loop(){ //메인 루프
    frame += 1;
    ctx.fillStyle = 'rgb(20,20,20)';
    ctx.fillRect(0,0, canvasEl.width, canvasEl.height);

    //파동 구현 파트
    waves.forEach(wave => drawWave(wave));
    waves.forEach(function(wave){if(frame - wave['frame'] >= 29) waves.splice(waves.findIndex( w => w==wave), 1)}); //힘을 다 한 파동 삭제.

    eyes.forEach(eye => eye.update());

    requestAnimationFrame(loop);
}



function mouseClick(){ //마우스 클릭 시 호출
    //파동 생성
    waves.push({'x' : mx-9, 'y' : my-90, 'frame' : frame});

    //눈 깜빡임
    eyes.forEach(function(eye){
        d = distance([mx-9,my-90], [eye.centerX, eye.centerY]);
        if(d < canvasEl.width/5) eye.blink(frame, (d/(canvasEl.width/5)) * 30);
    });
}
function look(event){ //마우스 움직임 시 호출
    mx = event.pageX + 9;
    my = event.pageY + 90;

    eyes.forEach(function(eye){
        if(distance([mx, my], [eye.centerX, eye.centerY]) < eye.range * canvasEl.width/900){ //반응 사거리 구현
            eye.lookMe = false;
            if(!eye.looking){
                eye.slowDownCount = eye.reactingTime; //반응속도 구현
                eye.looking = true;
            }
        }
        else eye.looking = false;
    });
}
function resize(){ //창 크기 변경 시 호출
    if(canvasEl.width != innerWidth){
        let wRate = innerWidth / canvasEl.width;
        let hRate = innerHeight / canvasEl.height;
        eyes.forEach(eye => {eye.looking=false; eye.centerX *= wRate; eye.centerY *= hRate; eye.toCenter(1);}); //검은자 강제 고정
        canvasEl.width = innerWidth;
        canvasEl.height = innerHeight;
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
