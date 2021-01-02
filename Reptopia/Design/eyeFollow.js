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
var frame = 0; //현재 프레임 수

loop();

function loop(){ //메인 루프
    canvasEl.width = innerWidth-50;
    canvasEl.height = innerHeight-120;
    frame++;

    if(eyes.length<50) eyes.push(randomEye());

    ctx.fillStyle = arrToRGB(backgroundColor);
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

    eyes.forEach(function(eye){eye.look(mx-9, my-90);});
    eyes.forEach(function(obj){obj.draw();});
    eyes.forEach(function(obj){obj.toCenter();});

    requestAnimationFrame(loop);
}


function Eye(x, y, blackRadius, whiteRadius, blackColor, whiteColor){ //눈 프로토타입
    //검은자 x, y
    this.x = x;
    this.y = y;

    //중심점 x, y
    this.centerX = this.x;
    this.centerY = this.y;

    //검은자의 속력
    this.dx = 0;
    this.dy = 0;

    //검은자, 흰자 크기
    this.blackRadius = blackRadius;

    this.whiteRadius = whiteRadius;
    this.blackRadiusB = this.blackRadius; //첫 번째 검은자 백업
    this.secondBlackRadius = (this.whiteRadius + this.blackRadius) / 3 + Math.random()*3; //첫 번째 검은자를 감싸는 두 번째 검은자 크기
    if(this.secondBlackRadius > whiteRadius * 3/4)
        this.secondBlackRadius = whiteRadius * 3/4; //흰자 크기에 따라 검은자 크기 제한
    this.secondBlackRadiusB = this.secondBlackRadius; //두 번째 검은자 백업

    //색 설정
    this.blackColor = arrToRGB(blackColor);
    this.whiteColor = arrToRGB(whiteColor);
    let eyelidDarkness = 1.1 + Math.random()*5; //눈꺼풀 명도 조정 상수
    this.eyelidCol = arrToRGB([whiteColor[0]/eyelidDarkness, whiteColor[1]/eyelidDarkness, whiteColor[2]/eyelidDarkness]);

    this.f = (this.whiteRadius - this.blackRadius)/1200 + 0.01; //검은자 속력 상수

    this.look = function(aimX, aimY){ //aimX, aimY에 다가감
        let d = distance([this.x, this.y], [this.centerX, this.centerY]);
        this.dx = (1 - d/(this.whiteRadius-this.secondBlackRadius)) * (aimX - this.x) * this.f;
        this.dy = (1 - d/(this.whiteRadius-this.secondBlackRadius)) * (aimY - this.y) * this.f;

        if(this.dx > 3) this.dx = 3;
        if(this.dy > 3) this.dy = 3;

        this.x += this.dx;
        this.y += this.dy;
    }

    this.toCenter = function(){ //중심점으로 끌어당김
        this.x += (this.centerX-this.x)/40;
        this.y += (this.centerY-this.y)/40;
    }

    this.blinking = false; //깜빡이는지 여부
    this.blinkStartTime = 0; //깜빡이기 시작한 시간
    this.blinkEndTime = 0; //깜빡이는 시간

    this.blink = function(frame){ //깜빡임
        if(!this.blinking){
            this.blinking = true;
            this.blinkStartTime = frame;
            this.blinkEndTime = 8 + Math.random()*24;
        }
    }

    this.draw = function(){ //검은자, 흰자, (눈꺼풀) 그림
        //흰자 그림
        ctx.fillStyle = this.whiteColor;
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.whiteRadius, 0, Math.PI*2, false);
        ctx.fill();

        //두 번째 검은자 그림
        ctx.fillStyle = this.blackColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.secondBlackRadius, 0, Math.PI*2, false);
        ctx.fill();

        //검은자 그림
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.blackRadius, 0, Math.PI*2, false);
        ctx.fill();

        //눈꺼풀 그림
        ctx.fillStyle = this.eyelidCol;
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.whiteRadius, Math.PI*5/4, Math.PI*7/4, false);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.whiteRadius, Math.PI*1/4, Math.PI*3/4, false);
        ctx.fill();

        if(this.blinking){
            let t = frame - this.blinkStartTime; //깜빡이기 시작한 후 흐른 프레임 수
            let f = this.blinkEndTime; //깜빡이는데 걸리는 총 프레임 수

            if(t < f/2){
                this.close(t, f/2);
                if(this.blackRadius < this.blackRadiusB)
                    this.blackRadius += 10 / f;
                if(this.secondBlackRadius > 11)
                    this.secondBlackRadius -= 10 / f;
            }
            else if(t < f){
                this.open(t, f/2);
                if(this.blackRadius > 11)
                    this.blackRadius -= 10 / f;
                if(this.secondBlackRadius < this.secondBlackRadiusB)
                    this.secondBlackRadius += 10 / (f/2);
            }
            else if(t > 1.5*f) {this.blinking = false;};
        }
    }

    this.open = function(t, f){ // 눈 뜨기. arc : startRadian과 endRadian 사이 호를 채움. true:시계반대방향, false:시계방향
        //상좌
        let startRadian = Math.PI + Math.PI * 1/2 * (t-f)/f;
        let endRadian = -Math.PI * 1/2 * (t-f)/f;
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.whiteRadius, startRadian, endRadian, false);
        ctx.fill();

        //상우
        startRadian = -Math.PI * 1/2 * (t-f)/f;
        endRadian = -Math.PI + Math.PI * 1/2 * (t-f)/f;
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.whiteRadius, startRadian, endRadian, true);
        ctx.fill();

        //하좌
        startRadian = Math.PI - Math.PI * 1/2 * (t-f)/f;
        endRadian = Math.PI * 1/2 * (t-f)/f;
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.whiteRadius, startRadian, endRadian, true);
        ctx.fill();

        //상우
        startRadian = Math.PI * 1/2 * (t-f)/f;
        endRadian = Math.PI - Math.PI * 1/2 * (t-f)/f;
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.whiteRadius, startRadian, endRadian, false);
        ctx.fill();
    }

    this.close = function(t, f){ // 눈 감기
        //상좌
        startRadian = Math.PI * 3/2 - Math.PI * 1/2 * t/f;
        endRadian = Math.PI * 3/2 + Math.PI * 1/2 * t/f;
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.whiteRadius, startRadian, endRadian, false);
        ctx.fill();

        //상우
        startRadian = -Math.PI * 1/2 + Math.PI * 1/2 * t/f;
        endRadian = -Math.PI * 1/2 - Math.PI * 1/2 * t/f;
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.whiteRadius, startRadian, endRadian, true);
        ctx.fill();

        //하좌
        startRadian = Math.PI * 1/2 + Math.PI * 1/2 * t/f;
        endRadian = Math.PI * 1/2 - Math.PI * 1/2 * t/f;
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.whiteRadius, startRadian, endRadian, true);
        ctx.fill();

        //하우
        startRadian = Math.PI * 1/2 - Math.PI * 1/2 * t/f;
        endRadian = Math.PI * 1/2 + Math.PI * 1/2 * t/f;
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.whiteRadius, startRadian, endRadian, false);
        ctx.fill();
    }
}

function blinkEyes(){ //마우스 클릭 이벤트 발생 시 호출
    eyes.forEach(function(eye){eye.blink(frame);}); //모든 눈 깜빡임
}

function mouseMove(event){ //마우스 움직임 이벤트 발생 시 호출
    //mx, my에 마우스 위치 저장
    mx = event.pageX;
    my = event.pageY;
    
    //배경 색을 마우스 x, y에 비례하게 바꿈
    backgroundColor[0] = (event.pageX-9-canvasEl.width/2)/(canvasEl.width)*100;
    backgroundColor[1] = (event.pageX+event.pageY-99-canvasEl.width/2)/(canvasEl.width)*100;
    backgroundColor[2] = (event.pageY-90-canvasEl.height/2)/(canvasEl.height)*100;
    for(let c = 0; c<3; c++){
        if(backgroundColor[c]<0)
            backgroundColor[c] *= -1;
    }
}

function randomEye(){ //무작위 눈 생성
    let x = Math.random()*canvasEl.width;
    let y = Math.random()*canvasEl.height;
    let blackRadius = Math.random()*15 + 7;
    let whiteRadius = Math.random()*50 + 45;
    let rndRGB1 = [Math.random()*100, Math.random()*100, Math.random()*100];
    let rndRGB2 = [Math.random()*100 + 155, Math.random()*100 + 155, Math.random()*100 + 155];
    return new Eye(x, y, blackRadius, whiteRadius, rndRGB1,  rndRGB2);
}

function distance(location1, location2){ //location1과 location2 사이의 거리를 계산
    return Math.sqrt(((location1[0]-location2[0])**2 + (location1[1] - location2[1])**2));
}

function arrToRGB(arr){ //배열을 rgb문자열로 변환
    let result = "rgb(" + arr[0] + "," + arr[1] + "," + arr[2] + ")";
    return result;
}