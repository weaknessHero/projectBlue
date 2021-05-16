/*
    background.js
    2021.02.01
    Reptopia의 background canvas 자바스크립트.
*/
/*
    1.3.14
        1. cages 화면에서 feeding 삭제
*/

//Initial function
function setupCanvas(){
    for(let temp = 0; temp < document.getElementsByClassName("cage").length; temp++)
        eyes.push(randomEye(canvasEl, ctxBackground)); //개체 수 만큼의 배경 눈
}

function init(){ //Initial setting
    if(frame < initFrameA-initFrameB) eyes.forEach(eye=>eye.init(initFrameA-initFrameB)); //
    else if(frame > initFrameA) return 0;
    if(frame > (initFrameA-initFrameB)/2) eyes.forEach(eye=>eye.eyelidWidthRadius -= 105/((initFrameA+initFrameB)/2));
    initAnimation = requestAnimationFrame(init);
    if(frame>100)
        cancelAnimationFrame(initAnimation);
}


function backgroundLoop(){ //Background animation
    frame += 1;

    ctxBackground.fillStyle = 'black';
    ctxBackground.fillRect(0,0, canvasEl.width, canvasEl.height);

    waves.forEach(wave => drawWave(wave));
    eyes.forEach(eye => eye.update());
    eyes.forEach(function(eye){if(Math.random()*2000<1) eye.blink(frame)});

    backgroundAnimation = requestAnimationFrame(backgroundLoop);
}


//Event handler
function mouseClick(){
    eyes.forEach(function(eye){
        let d = distance([mx-9,my-90], [eye.centerX, eye.centerY]);
        if(d < (eye.canvas.width + eye.canvas.height)/10 + eye.whiteRadius)
            eye.blink(frame, (d/((eye.canvas.width + eye.canvas.height)/10)) * waveFrame);
    });
    waves.push({'x' : mx-9, 'y' : my-90, 'frame' : frame, 'end' : false});
}

function mouseMove(event){
    mx = event.pageX + 9;
    my = event.pageY + 90;

    eyes.forEach(function(eye){
        let d = distance([mx, my], [eye.centerX, eye.centerY]);
        if(d > eye.range * (eye.canvas.width + eye.canvas.height)/2000)
            eye.looking = false;
        else if(!eye.looking){
            eye.slowDownCount = eye.reactingTime; //반응속도 구현
            eye.looking = true;
        }
    });
}

function resize(){
    inWidth = innerWidth;
    if(innerHeight>530) inHeight = innerHeight;
    else                inHeight = 530;
    
    let rate = (inWidth+inHeight) / (canvasEl.width+canvasEl.height);

    eyes.forEach(eye => {
        eye.whiteRadius  *= rate;
        eye.whiteRadiusB *= rate;
        eye.pupilRadius  *= rate;
        eye.pupilRadiusB *= rate;
        eye.irisRadius   *= rate;
        eye.irisRadiusB  *= rate;
        eye.looking = false;
        eye.centerX *= inWidth / canvasEl.width;
        eye.centerY *= inHeight / canvasEl.height;
        eye.toCenter(1);
    });

    canvasEl.width = inWidth;
    canvasEl.height = inHeight;
    
    let inner = document.getElementsByClassName('inner')[0];
    let sliders = inner.children;
    for(let i=0; i<sliders.length; i++)
        sliders[i].setAttribute("style", "font-size: "+ String(((inWidth+inHeight))/30) + "px;");
}

//etc
function distance(location1, location2){
    return Math.abs(Math.sqrt(((location1[0]-location2[0])**2 + (location1[1]-location2[1])**2)));
}

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