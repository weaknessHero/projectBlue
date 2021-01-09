var canvasEl = document.getElementsByTagName('canvas')[0];
var ctx = canvasEl.getContext("2d");

canvasEl.width = innerWidth;
canvasEl.height = innerHeight;

//마우스 이벤트 감지
document.body.addEventListener("mousemove", mouseMove);
document.body.addEventListener("click", blinkEyes);
document.body.addEventListener("dblclick", dblclick);
window.addEventListener("resize", resize);

var img = document.getElementById("myImage");

var eyes = []; //모든 눈을 담는 배열

//Mouse x, y
var mx = canvasEl.width/2;
var my = canvasEl.height/2;

var frame = 0; //현재 프레임 수

loop();

function loop(){ //메인 루프
    frame++;
    ctx.drawImage(img, 0, 0);

    if(eyes.length<10) eyes.push(randomEye());

    eyes.forEach(function(eye){eye.look(mx-9, my-90);});
    eyes.forEach(function(obj){obj.draw();});
    eyes.forEach(function(obj){obj.toCenter();});
    requestAnimationFrame(loop);

}

function sunlight(frame, img){ //--개발중--
    let imageData = ctx.getImageData(0,0, canvasEl.width, canvasEl.height);
    console.dir(imageData);
}


function Eye(x, y, blackRadius, whiteRadius, blackColor, whiteColor){ //눈 프로토타입
    this.looking = false;

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

    //색 설정
    this.blackColor = arrToRGB(blackColor);
    this.whiteColor = arrToRGB(whiteColor);
    this.eyelidCol = arrToRGB([Math.random()*40,Math.random()*40,Math.random()*40]);

    this.f = (this.whiteRadius - this.blackRadius)/1200 + 0.001; //검은자 속력 상수

    this.look = function(aimX, aimY){ //aimX, aimY에 다가감
        if(this.looking){
            let d = distance([this.x, this.y], [this.centerX, this.centerY]);
            this.dx = (1 - d/(this.whiteRadius-this.secondBlackRadius)) * (aimX - this.x) * this.f;
            this.dy = (1 - d/(this.whiteRadius-this.secondBlackRadius)) * (aimY - this.y) * this.f;

            if(this.dx > 3) this.dx = 3;
            if(this.dy > 3) this.dy = 3;

            this.x += this.dx;
            this.y += this.dy;
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

    this.drawEyelid = function(eyelidWidth){ // 눈꺼풀 그림
        if(eyelidWidth>180) eyelidWidth = 180;
        ctx.fillStyle = this.eyelidCol;

        for(let d=-5; d+eyelidWidth<=190; d+=5){ // 위
            ctx.beginPath();
            ctx.arc(this.centerX, this.centerY, this.whiteRadius+1, degreeToRadian(d), degreeToRadian(d + eyelidWidth), false);
            ctx.fill();
        }
        for(let d=-5; d+eyelidWidth<=190; d+=5){ // 아래
            ctx.beginPath();
            ctx.arc(this.centerX, this.centerY, this.whiteRadius+1, Math.PI + degreeToRadian(d), Math.PI + degreeToRadian(d+eyelidWidth), false);
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

        this.drawEyelid(70);
        if(this.blinking){
            let t = frame - this.blinkStartTime; //깜빡이기 시작한 후 흐른 프레임 수
            let f = this.blinkEndTime; //깜빡이는데 걸리는 총 프레임 수
            if(t < f/2){
                this.drawEyelid(2*t/f * 180);
                //검은자 1 크기 조절
                if(this.blackRadius + 4/f < this.secondBlackRadius) this.blackRadius += 4/f;
            }
            else if(t < f){
                this.drawEyelid((f-t)/(f/2) * 180);
                //검은자 1 크기 조절
                if(this.blackRadius - 8/f > this.blackRadiusB) this.blackRadius -= 8/f;
                else this.blackRadius = this.blackRadiusB;
            }
            else if(t > 1.2*f) {this.blinking = false;};
        }
    }
}

function blinkEyes(){ //마우스 클릭 시 호출
    eyes.forEach(function(eye){eye.blink(frame);}); //모든 눈 깜빡임
}

function dblclick(){ //마우스 더블 클릭 시 호출
    eyes.forEach(eye=>{eye.looking=false;eye.toCenter();});
    console.log("dbclicked");
}

function mouseMove(event){ //마우스 움직임 시 호출
    eyes.forEach(eye=>eye.looking = true);
    mx = event.pageX+9;
    my = event.pageY+90;
}

function resize(){ //창 크기 변경 시 호출
    if(canvasEl.width != innerWidth){
        let wRate = (innerWidth)/canvasEl.width;
        let hRate = (innerHeight)/canvasEl.height;
        eyes.forEach(eye => {eye.centerX *= wRate;eye.centerY *= hRate;eye.toCenter(1);});
        canvasEl.width = innerWidth;
        canvasEl.height = innerHeight;
    }
}

function randomEye(){ //무작위 눈 생성
    let x = Math.random()*canvasEl.width;
    let y = Math.random()*canvasEl.height;
    let blackRadius = Math.random()*6 + 7;
    let whiteRadius = Math.random()*19 + 16;
    let rndRGB1 = [Math.random()*100, Math.random()*100, Math.random()*100];
    let rndRGB2 = [Math.random()*30 + 205, Math.random()*30 + 205, Math.random()*30 + 205];
    return new Eye(x, y, blackRadius, whiteRadius, rndRGB1,  rndRGB2);
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
