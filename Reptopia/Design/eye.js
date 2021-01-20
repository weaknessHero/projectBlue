/*  eye.js
    2021.01.19
    Reptopia의 배경에 나타나는 Eye 객체와, 그걸 다루는 함수들.
*/
/*  1.3.4
        1 Eye.range: 눈 크기 뿐만 아니라 현재 화면 너비와도 비례하게 수정.
        2 더블클릭 기능 삭제: 의도치 않게 발동하는 경우 발생. Reptopia의 목적에 맞지 않는 기능.
        3 일부 주석 삭제(Eye, centerXY, range, reactingTime, ...): 변수명과 코드 흐름으로 해석 가능한 부분.
        4 Eye.update() 추가: loop에 들어가는 Eye 함수를 통합: canvas.js의 loop()에 들어갈 함수가 많을 것으로 예상되어 간소화함.
        5 randomEye() 수정: 눈 전체가 창 안에 완전히 들어오도록(경계에 걸쳐지지 않도록) 수정
*/

function Eye(x, y, blackRadius, whiteRadius, blackColor, whiteColor, eyelidColor){
    /* TODO
        + Eye shape to ellipse.
        + Eyelid skin texture.
        + Iris pattern.
        + Vein in lens.
    */

    this.centerX = x;
    this.centerY = y;

    //검은자 x, y
    this.x = x;
    this.y = y;

    //Sizes
    this.blackRadius = blackRadius;
    this.whiteRadius = whiteRadius;
    this.secondBlackRadius = (this.whiteRadius + this.blackRadius) / 2; //검은자 크기
    if(this.secondBlackRadius > whiteRadius * 3/4) this.secondBlackRadius = whiteRadius * 3/4; //검은자 크기 제한
    //백업
    this.blackRadiusB = this.blackRadius;
    this.secondBlackRadiusB = this.secondBlackRadius;
    this.whiteRadiusB = this.whiteRadius;

    //검은자 속력
    this.dx = 0;
    this.dy = 0;

    //검은자 속력 고유값
    this.f = (this.whiteRadius - this.blackRadius)/1200 + 0.001;

    //Look
    this.looking = false;
    this.range = 250 + this.secondBlackRadius;
    this.reactingTime = 10 + Math.random()*20;
    this.slowDownCount = 0;

    //Blink
    this.blinking = false;
    this.blinkStartFrame = 0;
    this.blinkTotalFrame = 0;
    this.blinkDelay = 0; //파동 시작점과 거리에 비례
    
    //눈꺼풀 두께 비례 각도
    this.eyelidWidthRadius = 180;

    this.blackColor = arrToRGB(blackColor);
    this.whiteColor = arrToRGB(whiteColor);
    this.eyelidCol = arrToRGB(eyelidColor);

    this.init = function(f){ //Draw creating eye.
        this.whiteRadius = this.whiteRadiusB * frame/f;
        this.blackRadius = this.blackRadiusB * frame/f;
        this.secondBlackRadius = this.secondBlackRadiusB * frame/f;
    }

    //main looping functions
    this.update = function(){
        if(this.looking) this.look(mx-9, my-90);
        this.draw();
        this.toCenter();
    }

    this.look = function(aimX, aimY){
        let limit = this.whiteRadius - this.secondBlackRadius; //최대 이동 거리
        let d = distance([this.x, this.y], [this.centerX, this.centerY]);
        this.dx = (1 - d/limit) * (aimX - this.x) * this.f;
        this.dy = (1 - d/limit) * (aimY - this.y) * this.f;

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
            this.blinkTotalFrame = 15 + Math.random() * 15;
        }
    }

    this.drawEyelid = function(){ // 눈꺼풀 그림
        if(this.eyelidWidthRadius>180) this.eyelidWidthRadius = 180;
        ctx.fillStyle = this.eyelidCol;

        //this.eyelidWidthRadius에 비례한 두께로 눈꺼풀 그림.
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
                let f = this.blinkTotalFrame;
                if(t <= f/2) this.closeEye(t, f/2, 180);
                else if(t <= f) this.openEye(t, f, 180);
                else {this.eyelidWidthRadius = 75; this.blinking = false;}
            }
        }
    }

    this.closeEye = function(t, f, widthRadius){
        this.eyelidWidthRadius = 75 + t/f * widthRadius;
        if(this.blackRadius + 4/f < this.secondBlackRadius) this.blackRadius += 4/f; //동공 크기 조절
    }

    this.openEye = function(t, f, widthRadius){
        this.eyelidWidthRadius = 75 + (f - t)/(f/2) * widthRadius;
        if(this.blackRadius - 8/f > this.blackRadiusB) this.blackRadius -= 8/f; //동공 크기 조절
        else this.blackRadius = this.blackRadiusB;
    }
}

function randomEye(){ //무작위 눈 생성
    let blackRadius = Math.random() * 6 + 7;
    let whiteRadius = Math.random() * 24 + 16;
    let x = Math.random()*canvasEl.width;
    let y = Math.random()*canvasEl.height;
    if(x-whiteRadius<0) x = whiteRadius;
    if(x+whiteRadius>canvasEl.width) x = canvasEl.width - whiteRadius;
    if(y-whiteRadius<0) y = whiteRadius;
    if(y+whiteRadius>canvasEl.height) y = canvasEl.height - whiteRadius;
    let rndRGB1 = [Math.random() * 100, Math.random() * 100, Math.random() * 100];
    let rndRGB2 = [Math.random() * 30 + 205, Math.random() * 30 + 205, Math.random() * 30 + 205];
    let rndRGB3 = [Math.random() * 40, Math.random() * 40, Math.random() * 40];
    return new Eye(x, y, blackRadius, whiteRadius, rndRGB1,  rndRGB2, rndRGB3);
}