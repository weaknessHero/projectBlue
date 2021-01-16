//Element setting
var canvasEl = document.getElementsByTagName('canvas')[0];
var ctx = canvasEl.getContext("2d");
canvasEl.width = innerWidth;
canvasEl.height = innerHeight;

//이벤트 감지
document.body.addEventListener("mousemove", look);
document.body.addEventListener("click", mouseClick);
document.body.addEventListener("dblclick", lookatMe);
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
setting();
loop();

function setting(){ //Initial setting
    for(let temp = 0; temp < 26; temp++) eyes.push(randomEye()); // 26개의 랜덤 객체
}

function loop(){ //메인 루프
    frame++;
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0, canvasEl.width, canvasEl.height);

    waves.forEach(wave => drawWave(wave));
    waves.forEach(function(wave){
        if(frame - wave[2] >= 29)
            waves.splice(waves.findIndex( w => w==wave), 1);
    });

    eyes.forEach(eye => eye.look(mx-9, my-90));
    eyes.forEach(eye => eye.draw());
    eyes.forEach(eye => eye.toCenter());

    requestAnimationFrame(loop);
}

function Eye(x, y, blackRadius, whiteRadius, blackColor, whiteColor, eyelidColor){ //눈 프로토타입
    /*
        + Eye shape to ellipse.
        + Eyelid skin texture.
        + Iris pattern.
        + Vein in lens.
    */

    //중심점 x, y
    this.centerX = x;
    this.centerY = y;

    //검은자 x, y
    this.x = x;
    this.y = y;

    //Size
    this.blackRadius = blackRadius;
    this.whiteRadius = whiteRadius;
    this.secondBlackRadius = (this.whiteRadius + this.blackRadius) / 2; //검은자 크기
    if(this.secondBlackRadius > whiteRadius * 3/4) this.secondBlackRadius = whiteRadius * 3/4; //검은자 크기 제한
    this.blackRadiusB = this.blackRadius; //백업
    this.secondBlackRadiusB = this.secondBlackRadius;

    //검은자 속력
    this.dx = 0;
    this.dy = 0;

    //검은자 속력 고유값
    this.f = (this.whiteRadius - this.blackRadius)/1200 + 0.001;

    //Look
    this.looking = false;
    this.lookMe = false;
    this.range = 150 + this.secondBlackRadius * canvasEl.width / 200; //감지 거리
    this.reactingTime = 10 + Math.random()*20; //반응속도
    this.slowDownCount = 0;

    //Blink
    this.blinking = false; //깜빡이는지 여부
    this.blinkStartFrame = 0; //깜빡이기 시작한 시간
    this.blinkEndTime = 0; //깜빡이는 데에 걸리는 총 시간
    this.blinkDelay = 0;
    
    //눈꺼풀 두께 비례 각도
    this.eyelidWidthRadius = 60;

    //Color
    this.blackColor = arrToRGB(blackColor);
    this.whiteColor = arrToRGB(whiteColor);
    this.eyelidCol = arrToRGB(eyelidColor);

    this.look = function(aimX, aimY){ //검은자가 aimX, aimY에 다가감
        v = this.f;
        if(!this.looking) return 0;
        else if(this.lookMe){ v = this.f / 200; aimX = canvasEl.width/2; aimY = canvasEl.height*2/7;} //사용자 보기

        let limit = this.whiteRadius - this.secondBlackRadius;
        let d = distance([this.x, this.y], [this.centerX, this.centerY]);
        this.dx = (1 - d/limit) * (aimX - this.x) * v;
        this.dy = (1 - d/limit) * (aimY - this.y) * v;
        
        if(this.slowDownCount>0){ //반응 속도에 따른 속도 조절
            this.dx *= (this.reactingTime-this.slowDownCount)/this.reactingTime;
            this.dy *= (this.reactingTime-this.slowDownCount)/this.reactingTime;
            this.slowDownCount -= 1;
        }
        if(distance([this.centerX, this.centerY], [this.x + this.dx, this.y + this.dy]) < limit){
            this.x += this.dx;
            this.y += this.dy;
        }
    }

    this.toCenter = function(f=0){ //중심점으로 끌어당김 f:중앙 강제 고정 옵션
        if(f==0){
            this.x += (this.centerX-this.x) / 40;
            this.y += (this.centerY-this.y) / 40;
        }
        else{
            this.x += (this.centerX-this.x) * 0.98;
            this.y += (this.centerY-this.y) * 0.98;
        }
    }

    this.blink = function(frame, delay = 0){ //깜빡임
        if(!this.blinking){
            this.blinkDelay = delay - this.whiteRadius/(canvasEl.width/5)*30;
            this.blinking = true;
            this.blinkStartFrame = frame + this.blinkDelay;
            this.blinkEndTime = 15 + Math.random() * 15;
        }
    }

    this.drawEyelid = function(){ // 눈꺼풀 그림
        if(this.eyelidWidthRadius>180) this.eyelidWidthRadius = 180;
        ctx.fillStyle = this.eyelidCol;

        //eyelidWidthRadius에 비례한 두께 만큼 눈꺼풀 그림.
        for(let d = -5; d + this.eyelidWidthRadius <= 185; d += 5){ // 위
            ctx.beginPath();
            ctx.arc(this.centerX, this.centerY, this.whiteRadius+1, degreeToRadian(d), degreeToRadian(d + this.eyelidWidthRadius), false);
            ctx.fill();
        }
        for(let d = -5; d + this.eyelidWidthRadius <= 185; d += 5){ // 아래
            ctx.beginPath();
            ctx.arc(this.centerX, this.centerY, this.whiteRadius + 1, Math.PI + degreeToRadian(d), Math.PI + degreeToRadian(d + this.eyelidWidthRadius), false);
            ctx.fill();
        }
    }

    this.draw = function(){ //검은자, 흰자, (눈꺼풀) 그림
        //흰자 그림 ---명암 적용---
        ctx.fillStyle = this.whiteColor;
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.whiteRadius, 0, Math.PI * 2, false);
        ctx.fill();

        //두 번째 검은자 그림
        ctx.fillStyle = this.blackColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.secondBlackRadius, 0, Math.PI * 2, false);
        ctx.fill();

        //검은자 그림
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.blackRadius, 0, Math.PI * 2, false);
        ctx.fill();
        
        //눈꺼풀 그림
        this.drawEyelid(this.eyelidWidthRadius);
        if(this.blinking){
            if(this.blinkDelay > 0)
                this.blinkDelay -= 1;
            else{
                let t = frame - this.blinkStartFrame; //깜빡이기 시작한 후 흐른 프레임 수
                let f = this.blinkEndTime;
                if(t <= f/2) this.closeEye(t, f/2, 180);
                else if(t <= f) this.openEye(t, f, 180);
                else {this.eyelidWidthRadius = 60;this.blinking = false;}
            }
        }
    }

    this.closeEye = function(t, f, widthRadius){
        this.eyelidWidthRadius = 60 + t/f * widthRadius;
        if(this.blackRadius + 4/f < this.secondBlackRadius) this.blackRadius += 4/f; //동공 크기 조절
    }

    this.openEye = function(t, f, widthRadius){
        this.eyelidWidthRadius = 60 + (f - t)/(f/2) * widthRadius;
        if(this.blackRadius - 8/f > this.blackRadiusB) this.blackRadius -= 8/f; //동공 크기 조절
        else this.blackRadius = this.blackRadiusB;
    }
}

function mouseClick(){ //마우스 클릭 시 호출
    //파동 생성
    waves.push([mx-9, my-90, frame]);

    //눈 깜빡임
    eyes.forEach(function(eye){
        d = distance([mx-9,my-90], [eye.centerX, eye.centerY]);
        if(d < canvasEl.width/5) eye.blink(frame, (d/(canvasEl.width/5)) * 30);
    });
}

function lookatMe(){ //마우스 더블 클릭 시 호출
    eyes.forEach(eye=>{eye.looking=true; eye.lookMe=true;});
}

function look(event){ //마우스 움직임 시 호출
    mx = event.pageX + 9;
    my = event.pageY + 90;
    eyes.forEach(function(eye){
        if(distance([mx, my], [eye.centerX, eye.centerY]) < eye.range){ //반응 사거리 구현
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

function randomEye(){ //무작위 눈 생성
    let x = Math.random()*canvasEl.width;
    let y = Math.random()*canvasEl.height;
    let blackRadius = Math.random() * 6 + 7;
    let whiteRadius = Math.random() * 24 + 16;
    let rndRGB1 = [Math.random() * 100, Math.random() * 100, Math.random() * 100];
    let rndRGB2 = [Math.random() * 30 + 205, Math.random() * 30 + 205, Math.random() * 30 + 205];
    let rndRGB3 = [Math.random() * 40, Math.random() * 40, Math.random() * 40];
    return new Eye(x, y, blackRadius, whiteRadius, rndRGB1,  rndRGB2, rndRGB3);
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
