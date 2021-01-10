//Element setting
var canvasEl = document.getElementsByTagName('canvas')[0];
var ctx = canvasEl.getContext("2d");
canvasEl.width = innerWidth;
canvasEl.height = innerHeight;

//이벤트 감지
document.body.addEventListener("mousemove", look);
document.body.addEventListener("click", blinkEyes);
document.body.addEventListener("dblclick", lookatMe);
window.addEventListener("resize", resize);

var img = document.getElementById("myImage");
//모든 눈을 담는 배열
var eyes = [];
//Mouse x, y
var mx;
var my;
//현재까지의 프레임 수
var frame = 0;

setting();
loop();

function setting(){ //Initial setting
    for(let temp = 0; temp < 66; temp++)
        eyes.push(randomEye());
}

function loop(){ //메인 루프
    frame++;
    ctx.drawImage(img, 0, 0);
    //sunlight(frame)

    eyes.forEach(function(eye){eye.look(mx-9, my-90);});
    eyes.forEach(function(obj){obj.draw();});
    eyes.forEach(function(obj){obj.toCenter();});
    requestAnimationFrame(loop);

}

function sunlight(frame){ //--개발중--
    let imageData = ctx.getImageData(0,0, canvasEl.width, canvasEl.height);
    console.dir(imageData);
}


function Eye(x, y, blackRadius, whiteRadius, blackColor, whiteColor, eyelidColor){ //눈 프로토타입

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
    this.secondBlackRadius = (this.whiteRadius + this.blackRadius) / 2; //첫 번째 검은자를 감싸는 두 번째 검은자 크기
    if(this.secondBlackRadius > whiteRadius * 3/4) this.secondBlackRadius = whiteRadius * 3/4; //흰자 크기에 따라 검은자 크기 제한
    this.secondBlackRadiusB = this.secondBlackRadius; //두 번째 검은자 백업

    //looking 사거리
    this.range = this.secondBlackRadius * 20;
    this.looking = false;
    this.reactingTime = 10 + Math.random()*20;
    this.slowDownCount = 0;

    //색 설정
    this.blackColor = arrToRGB(blackColor);
    this.whiteColor = arrToRGB(whiteColor);
    this.eyelidCol = arrToRGB(eyelidColor);

    this.f = (this.whiteRadius - this.blackRadius)/1200 + 0.001; //검은자 속력 상수

    this.look = function(aimX, aimY){ //aimX, aimY에 다가감
        if(this.looking){
            let limit = this.whiteRadius-this.secondBlackRadius;
            let d = distance([this.x, this.y], [this.centerX, this.centerY]);
            this.dx = (1 - d/limit) * (aimX - this.x) * this.f;
            this.dy = (1 - d/limit) * (aimY - this.y) * this.f;
            
            if(this.slowDownCount>0){ //객체의 반응 속도, 반응한 시간에 따른 속도조절
                this.dx *= (this.reactingTime-this.slowDownCount)/this.reactingTime;
                this.dy *= (this.reactingTime-this.slowDownCount)/this.reactingTime;
                this.slowDownCount --;
            }

            if(Math.abs(this.dx) > limit) this.looking = false;
            else this.x += this.dx

            if(Math.abs(this.dy) > limit) this.looking = false;
            else this.y += this.dy

            // --자연스러운 속도제한--
        }
    }

    this.toCenter = function(f=0){ //중심점으로 끌어당김 f:중앙 강제 고정 옵션
        if(f==0){
            this.x += (this.centerX-this.x)/40;
            this.y += (this.centerY-this.y)/40;
        }
        else{
            this.x += (this.centerX-this.x);
            this.y += (this.centerY-this.y);
        }
    }

    this.blinking = false; //깜빡이는지 여부
    this.blinkStartTime = 0; //깜빡이기 시작한 시간
    this.blinkEndTime = 0; //깜빡이는 데에 걸리는 총 시간

    this.blink = function(frame){ //깜빡임
        if(!this.blinking){
            this.blinking = true;
            this.blinkStartTime = frame;
            this.blinkEndTime = 10 + Math.random()*40;
        }
    }

    this.drawEyelid = function(eyelidWidthRadius){ // 눈꺼풀 그림
        if(eyelidWidthRadius>180) eyelidWidthRadius = 180;
        ctx.fillStyle = this.eyelidCol;

        //eyelidWidthRadius에 비례한 두께 만큼 눈꺼풀 그림.
        for(let d=-5; d+eyelidWidthRadius<=185; d+=5){ // 위
            ctx.beginPath();
            ctx.arc(this.centerX, this.centerY, this.whiteRadius+1, degreeToRadian(d), degreeToRadian(d + eyelidWidthRadius), false);
            ctx.fill();
        }
        for(let d=-5; d+eyelidWidthRadius<=185; d+=5){ // 아래
            ctx.beginPath();
            ctx.arc(this.centerX, this.centerY, this.whiteRadius+1, Math.PI + degreeToRadian(d), Math.PI + degreeToRadian(d+eyelidWidthRadius), false);
            ctx.fill();
        }
    }

    this.draw = function(){ //검은자, 흰자, (눈꺼풀) 그림
        //흰자 그림 ---명암 적용---
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
        this.drawEyelid(70);
        if(this.blinking){
            let t = frame - this.blinkStartTime; //깜빡이기 시작한 후 흐른 프레임 수
            let f = this.blinkEndTime; //깜빡이는데 걸리는 총 프레임 수
            if(t < f/2){ //눈을 감는 동안
                this.drawEyelid(t/(f/2) * 180);
                if(this.blackRadius + 4/f < this.secondBlackRadius) this.blackRadius += 4/f; //검은자 1 크기 조절
            }
            else if(t < f){ //눈을 뜨는 동안
                this.drawEyelid((f-t)/(f/2) * 180);
                if(this.blackRadius - 8/f > this.blackRadiusB) this.blackRadius -= 8/f; //검은자 1 크기 조절
                else this.blackRadius = this.blackRadiusB;
            }
            else if(t > 1.2*f) {this.blinking = false;}; //눈을 뜨고 난 후 쿨타임
        }
    }
}

function blinkEyes(){ //마우스 클릭 시 호출
    eyes.forEach(function(eye){if(eye.looking) eye.blink(frame);}); //모든 눈 깜빡임
}

function lookatMe(){ //마우스 더블 클릭 시 호출
    eyes.forEach(eye=>{eye.looking=false;eye.toCenter();});
    console.log("dbclicked");
}

function look(event){ //마우스 움직임 시 호출
    mx = event.pageX+9;
    my = event.pageY+90;
    eyes.forEach(function(eye){
        if((Math.abs(mx - eye.centerX) < eye.range) & (Math.abs(my - eye.centerY) < eye.range)){ //반응 사거리 구현
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
        let wRate = (innerWidth)/canvasEl.width;
        let hRate = (innerHeight)/canvasEl.height;
        eyes.forEach(eye => {eye.looking=false; eye.centerX *= wRate;eye.centerY *= hRate;eye.toCenter(1);});
        canvasEl.width = innerWidth;
        canvasEl.height = innerHeight;
    }
}

function randomEye(){ //무작위 눈 생성
    let x = Math.random()*canvasEl.width;
    let y = Math.random()*canvasEl.height;
    let blackRadius = Math.random()*6 + 7;
    let whiteRadius = Math.random()*24 + 16;
    let rndRGB1 = [Math.random()*100, Math.random()*100, Math.random()*100];
    let rndRGB2 = [Math.random()*30 + 205, Math.random()*30 + 205, Math.random()*30 + 205];
    let rndRGB3 = [Math.random()*40,Math.random()*40,Math.random()*40];
    return new Eye(x, y, blackRadius, whiteRadius, rndRGB1,  rndRGB2, rndRGB3);
}

function distance(location1, location2){ //location1과 location2 사이의 거리를 계산
    return Math.sqrt(((location1[0]-location2[0])**2 + (location1[1] - location2[1])**2));
}

function arrToRGB(arr){ //배열을 rgb문자열로 변환
    let result = "rgb(" + arr[0] + "," + arr[1] + "," + arr[2] + ")";
    return result;
}

function degreeToRadian(degree){ //각도 -> 라디안
    return Math.PI * degree/180;
}
