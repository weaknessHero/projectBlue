var canvasEl = document.createElement('canvas');
var ctx = canvasEl.getContext("2d");

canvasEl.width = innerWidth-50;
canvasEl.height = innerHeight-120;

document.body.appendChild(canvasEl);

//마우스 이벤트 감지
canvasEl.addEventListener("mousemove", mouseMove);
canvasEl.addEventListener("click", blinkEyes);

var eyes = []; //모든 눈을 담는 배열

//Mouse x, y
var mx = 0;
var my = 0;

var backgroundColor = [0,0,0];

frame = 0;

loop();

function loop(){ //메인 루프
    frame++;

    if(eyes.length<30) eyes.push(randomEye());

    ctx.fillStyle = arrToRGB(backgroundColor);
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

    eyes.forEach(function(eye){eye.look(mx-9, my-90);});
    eyes.forEach(function(obj){obj.draw();});
    eyes.forEach(function(obj){obj.toCenter();});

    requestAnimationFrame(loop);
};

function distance(location1, location2){ //location1과 location2 사이의 거리를 계산
    return Math.sqrt(((location1[0]-location2[0])**2 + (location1[1] - location2[1])**2));
}

function arrToRGB(arr){ //배열을 rgb문자열로 변환
    let result = "rgb(" + arr[0] + "," + arr[1] + "," + arr[2] + ")";
    return result;
}

function blinkEyes(){ //마우스 클릭 이벤트 발생 시 호출
    eyes.forEach(function(eye){eye.blink(frame);}); //모든 눈 깜빡임
}

function mouseMove(event){ //마우스 움직임 이벤트 발생 시 호출
    //mx, my에 마우스 위치 저장.
    mx = event.pageX;
    my = event.pageY;
    
    //배경 색을 마우스 x, y에 비례하게 바꿈
    backgroundColor[0] = (event.pageX-9)/(canvasEl.width)*255;
    backgroundColor[1] = (event.pageX+event.pageY-99)/(canvasEl.width)*255;
    backgroundColor[2] = (event.pageY-90)/(canvasEl.height)*255;
}

function randomEye(){ //무작위 눈 생성
    let x = Math.random()*canvasEl.width;
    let y = Math.random()*canvasEl.height;
    let blackRadian = Math.random()*canvasEl.height/20 + 10;
    let r2 = Math.random()*canvasEl.height/6 + 10;
    let rndRGB1 = [Math.random()*100, Math.random()*100, Math.random()*100];
    let rndRGB2 = [Math.random()*100 + 155, Math.random()*100 + 155, Math.random()*100 + 155];
    return new Eye(x, y, blackRadian, r2, rndRGB1,  rndRGB2);
}

//눈 프로토타입
function Eye(x, y, blackRadian, whiteRadian, blackColor, whiteColor){
    //검은자 x, y
    this.x = x;
    this.y = y;
    
    //중심점 x, y
    this.centerX = this.x;
    this.centerY = this.y;

    //검은자의 속력
    this.dx = 0;
    this.dy = 0;

    //검은자 크기 제한 (흰자 크기에 따라)
    if(blackRadian > whiteRadian * 3/4) this.r1 = whiteRadian * 3/4;
    else this.blackRadian = blackRadian;
    this.r2 = whiteRadian;

    //색 설정
    this.blackColor = arrToRGB(blackColor);
    this.whiteColor = arrToRGB(whiteColor);
    let eyelidDarkness = 1.5 + Math.random()*8; //눈꺼풀 명도 조정 상수
    this.eyelidCol = arrToRGB([whiteColor[0]/eyelidDarkness, whiteColor[1]/eyelidDarkness, whiteColor[2]/eyelidDarkness]);

    this.v = (this.r2 - this.blackRadian)/1200 + 0.001; //검은자 속력 상수

    this.look = function(aimX, aimY){ //aimX, aimY에 다가감
        let d = distance([this.x, this.y], [this.centerX, this.centerY]);
        this.dx = (1 - d/(this.r2-this.blackRadian)) * (aimX - this.x) * this.v;
        this.dy = (1 - d/(this.r2-this.blackRadian)) * (aimY - this.y) * this.v;

        this.x += this.dx;
        this.y += this.dy;
    }
    
    this.toCenter = function(){ //중심점으로 끌어당김
        this.x += (this.centerX-this.x)/50;
        this.y += (this.centerY-this.y)/50;
    }

    this.blinking = false; //깜빡이는지 여부
    this.blinkTime = 0; //깜빡이기 시작한 시간
    this.blinkingVel = 0; //깜빡이는 속도
    
    this.blink = function(frame){ //깜빡임
        if(!this.blinking){
            this.blinking = true;
            this.blinkTime = frame;
            this.blinkingVel = 2 + Math.random()*24;
        }
    }

    this.draw = function(){ //검은자, 흰자, [눈꺼풀] 그림
        ctx.fillStyle = this.whiteColor;
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.r2, 0, Math.PI*2, false);
        ctx.fill();

        ctx.fillStyle = this.blackColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.blackRadian, 0, Math.PI*2, false);
        ctx.fill();

        ctx.fillStyle = this.eyelidCol;

        if(this.blinking){ //깜빡임 적용
            let t = frame - this.blinkTime;
            let v = this.blinkingVel;
            if(t < v) this.close(t, v);
            else if(t < 2*v) this.open(t, v);
            else if(t > 2.5*v) this.blinking = false;
        }

    }

    this.open = function(t, v){ // 눈 뜨기
        //상좌
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.r2, Math.PI + Math.PI * 1/2 * (t-v)/v, -Math.PI * 1/2 * (t-v)/v, false);
        ctx.fill();
        //상우
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.r2, -Math.PI * 1/2 * (t-v)/v, - Math.PI + Math.PI * 1/2 * (t-v)/v, true);
        ctx.fill();

        //하좌
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.r2, Math.PI - Math.PI * 1/2 * (t-v)/v, Math.PI * 1/2 * (t-v)/v, true);
        ctx.fill();
        //상우
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.r2, Math.PI * 1/2 * (t-v)/v, Math.PI - Math.PI * 1/2 * (t-v)/v, false);
        ctx.fill();
    }

    this.close = function(t, v){ // 눈 감기
        //상좌
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.r2, Math.PI * 3/2 - Math.PI * 1/2 * t/v, Math.PI * 3/2 + Math.PI * 1/2 * t/v, false);
        ctx.fill();
        //상우
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.r2, -Math.PI * 1/2 + Math.PI * 1/2 * t/v, -Math.PI * 1/2 - Math.PI * 1/2 * t/v, true);
        ctx.fill();

        //하좌
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.r2, Math.PI * 1/2 + Math.PI * 1/2 * t/v, Math.PI * 1/2 - Math.PI * 1/2 * t/v, true);
        ctx.fill();
        //하우
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.r2, Math.PI * 1/2 - Math.PI * 1/2 * t/v, Math.PI * 1/2 + Math.PI * 1/2 * t/v, false);
        ctx.fill();
    }
}