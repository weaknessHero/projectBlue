/*
    eye.js
    2021.01.24
    Reptopia의 배경에 나타나는 Eye 객체와, 그걸 다루는 함수들.
*/
/*
    1.3.6
        1 눈 떨림 현상 방지: Eye.look()의 this.dx = (1 - dDivLimit) * (aimX - this.x) * this.f; 에서 d/limit가 1보다 커지는 경우가 생겨 dx의 부호가 반대가 되어 순간이동했었음. -> dDivLimit의 최대치를 1로 제한함으로써 해결.
*/

function Eye(x, y, whiteRadius, irisColor, whiteColor, eyelidColor, shape){
    /* TODO
        + Eye shape to ellipse.
        + Eyelid skin texture.
        + Vein in lens.
    */

    this.pupilShape = shape;

    this.centerX = x;
    this.centerY = y;

    //검은자 x, y
    this.x = x;
    this.y = y;

    //Size
    this.whiteRadius = whiteRadius;
    if(this.pupilShape == 'circle') this.pupilRadius = whiteRadius/2;
    else if(this.pupilShape == 'vertical') this.pupilRadius = 3*whiteRadius/4;
    this.irisRadius = (this.whiteRadius + this.pupilRadius) / 2; //홍채 크기
    if(this.irisRadius > whiteRadius * 3/4) this.irisRadius = whiteRadius * 3/4; //홍채 크기 제한

    //백업
    this.pupilRadiusB = this.pupilRadius;
    this.irisRadiusB = this.irisRadius;
    this.whiteRadiusB = this.whiteRadius;

    //검은자 속력
    this.dx = 0;
    this.dy = 0;

    //검은자 속력 고유값
    this.f = (this.whiteRadius - this.pupilRadius)/1500 + 0.0001;

    //Look
    this.looking = false;
    this.range = eyeRange * this.irisRadius;
    this.reactingTime = reactFrame + Math.random()*10;
    this.slowDownCount = 0;

    //Blink
    this.blinking = false;
    this.blinkStartFrame = 0;
    this.blinkTotalFrame = 0;
    this.blinkDelay = 0; //파동 시작점과 거리에 비례
    this.blinkWidth = 180;
    
    //눈꺼풀 두께 비례 각도
    this.eyelidWidthRadius = 180;

    this.irisColor = irisColor;
    this.whiteColor = whiteColor;
    this.eyelidCol = eyelidColor;

    this.init = function(f){ //눈 생성.
        this.whiteRadius = this.whiteRadiusB * frame/f;
        this.pupilRadius = this.pupilRadiusB * frame/f;
        this.irisRadius = this.irisRadiusB * frame/f;
    }

    //main looping functions
    this.update = function(){
        if(this.looking) this.look(mx-9, my-90);
        this.draw();
        this.toCenter();
    }

    this.look = function(aimX, aimY){
        let limit = this.whiteRadius - this.irisRadius; //최대 이동 거리
        let d = distance([this.x, this.y], [this.centerX, this.centerY]);
        let dDivLimit = d/limit;
        if(dDivLimit > 1) dDivLimit = 1;
        this.dx = (1 - dDivLimit) * (aimX - this.x) * this.f;
        this.dy = (1 - dDivLimit) * (aimY - this.y) * this.f;
        
        if(this.slowDownCount>0){ //반응 속도에 따른 속도 조절
            this.dx *= (this.reactingTime-this.slowDownCount)/this.reactingTime;
            this.dy *= (this.reactingTime-this.slowDownCount)/this.reactingTime;
            this.slowDownCount -= 1;
        }

        this.x += this.dx;
        this.y += this.dy;
    }

    this.toCenter = function(f=0){ //중심점으로 끌어당김 f:중앙 강제 고정 옵션
        if(f==0){
            this.x += (this.centerX-this.x) / 20;
            this.y += (this.centerY-this.y) / 20;
        }
        else{
            this.x += (this.centerX-this.x);
            this.y += (this.centerY-this.y);
        }
    }

    this.blink = function(frame, delay = 0){ //깜빡임
        if(!this.blinking){
            if(delay != 0){
                this.blinkDelay = delay - this.whiteRadius/((canvasEl.width+canvasEl.height)/10)*30;
                this.blinkWidth = 180-this.blinkDelay*6;
                this.blinking = true;
                this.blinkStartFrame = frame + this.blinkDelay;
                this.blinkTotalFrame = blinkFrame + this.blinkWidth/10 + Math.floor(Math.random()*10);
            }
            else{
                this.blinking = true;
                this.blinkStartFrame = frame;
                this.blinkTotalFrame = blinkFrame + 10;
            }
        }
    }

    this.drawEyelid = function(){ // 눈꺼풀 그림
        if(this.eyelidWidthRadius>180) this.eyelidWidthRadius = 180;
        ctxBackground.fillStyle = arrToRGB(this.eyelidCol);

        //this.eyelidWidthRadius에 비례한 두께로 눈꺼풀 그림.
        for(let d = -5; d + this.eyelidWidthRadius <= 185; d += 5){ // 위
            ctxBackground.beginPath();
            ctxBackground.arc(this.centerX, this.centerY, this.whiteRadius+1, degreeToRadian(d), degreeToRadian(d + this.eyelidWidthRadius), false);
            ctxBackground.fill();
        }
        for(let d = -5; d + this.eyelidWidthRadius <= 185; d += 5){ // 아래
            ctxBackground.beginPath();
            ctxBackground.arc(this.centerX, this.centerY, this.whiteRadius + 1, Math.PI + degreeToRadian(d), Math.PI + degreeToRadian(d + this.eyelidWidthRadius), false);
            ctxBackground.fill();
        }
    }

    this.draw = function(){ //검은자, 흰자, (눈꺼풀) 그림
        //흰자 그림 ---명암 적용---
        ctxBackground.fillStyle = arrToRGB(this.whiteColor);
        ctxBackground.beginPath();
        ctxBackground.arc(this.centerX, this.centerY, this.whiteRadius, 0, Math.PI * 2, false);
        ctxBackground.fill();

        //두 번째 검은자 그림
        ctxBackground.fillStyle = arrToRGB(this.irisColor);
        ctxBackground.beginPath();
        ctxBackground.arc(this.x, this.y, this.irisRadius, 0, Math.PI * 2, false);
        ctxBackground.fill();

        //홍채 그라데이션
        var gradation = 1;
        ctxBackground.lineWidth = 1;
        for(let tempR = 0; tempR < this.irisRadius-this.pupilRadius; tempR+=ctxBackground.lineWidth){
            gradation = tempR/this.irisRadius;
            ctxBackground.strokeStyle = arrToRGB([this.irisColor[0] * gradation, this.irisColor[1] * gradation, this.irisColor[2] * gradation]);
            ctxBackground.beginPath();
            ctxBackground.arc(this.x, this.y, this.irisRadius-tempR, 0, Math.PI * 2, false);
            ctxBackground.stroke();
        }


        //검은자 그림
        ctxBackground.fillStyle = "black";
        if(this.pupilShape == 'circle'){
            ctxBackground.beginPath();
            ctxBackground.arc(this.x, this.y, this.pupilRadius, 0, Math.PI * 2, false);
            ctxBackground.fill();
        }
        else if(this.pupilShape == 'vertical'){
            ctxBackground.beginPath();
            ctxBackground.arc(this.x, this.y, this.pupilRadius, 0, Math.PI * 2, false);
            ctxBackground.fill();
        }
        //눈꺼풀 그림
        this.drawEyelid(this.eyelidWidthRadius);
        if(this.blinking){
            if(this.blinkDelay > 0)
                this.blinkDelay -= 1;
            else{
                let t = frame - this.blinkStartFrame; //깜빡이기 시작한 후 흐른 프레임 수
                let f = this.blinkTotalFrame;
                if(t <= f/2) {
                    this.closeEye(t, f/2, this.blinkWidth);
                    this.pupilRadius += this.irisRadius * 0.01;
                }
                else if(t <= f) {
                    this.openEye(t, f, this.blinkWidth);
                    this.pupilRadius -= this.irisRadius * 0.01;
                }
                else {this.eyelidWidthRadius = 75; this.blinking = false; this.blinkWidth = 180;}
            }
        }
    }

    this.closeEye = function(t, f, widthRadius){
        this.eyelidWidthRadius = 75 + t/f * widthRadius;
    }

    this.openEye = function(t, f, widthRadius){
        this.eyelidWidthRadius = 75 + (f - t)/(f/2) * widthRadius;
    }
}

function randomEye(){ //무작위 눈 생성
    let whiteRadius = (Math.random() * 24 + 26) * sizeRate;
    let x = Math.random()*canvasEl.width;
    let y = Math.random()*canvasEl.height;

    if(x-whiteRadius<0) x = whiteRadius;
    if(x+whiteRadius>canvasEl.width) x = canvasEl.width - whiteRadius;
    if(y-whiteRadius<0) y = whiteRadius;
    if(y+whiteRadius>canvasEl.height) y = canvasEl.height - whiteRadius;

    let irisColor = [Math.random() * 230 + 20, Math.random() * 230 + 20, Math.random() * 230 + 20];
    let whiteColor = [Math.random() * 30 + 205, Math.random() * 30 + 205, Math.random() * 30 + 205];
    let eyelidColor = [Math.random() * 160, Math.random() * 160, Math.random() * 160];
    let shape = ['circle', 'vertical'][Math.floor(Math.random()*2)];
    return new Eye(x, y, whiteRadius, irisColor, whiteColor, eyelidColor, shape);
}