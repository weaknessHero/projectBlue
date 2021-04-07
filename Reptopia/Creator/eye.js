/*
    eye.js
    2021.01.24
    Reptopia의 배경에 나타나는 Eye 객체와, 그걸 다루는 함수들.
*/
/*
    1.3.7
        1 Eye.draw() if eye.type == vertical: 가운데 빈 공간 채우는 선 추가.
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
        
        if(this.slowDownCount>0){ //반응 속도에 따른 속도 조절. 초기값 : this.reactingTime
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
                this.blinkTotalFrame = this.blinkWidth/(blinkVelocity);
            }
            else{
                this.blinking = true;
                this.blinkStartFrame = frame;
                this.blinkTotalFrame = blinkVelocity + 10;
                this.blinkWidth = 180;
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

    this.draw = function(){
        //흰자 ---명암---
        ctxBackground.fillStyle = arrToRGB(this.whiteColor);
        ctxBackground.beginPath();
        ctxBackground.arc(this.centerX, this.centerY, this.whiteRadius, 0, Math.PI * 2, false);
        ctxBackground.fill();

        //홍채
        if(this.pupilShape == 'circle'){
            ctxBackground.fillStyle = arrToRGB(this.irisColor);
            ctxBackground.beginPath();
            ctxBackground.arc(this.x, this.y, this.irisRadius, 0, Math.PI * 2, false);
            ctxBackground.fill();

            //그라데이션
            var gradation = 1;
            ctxBackground.lineWidth = 1;
            for(let tempR = 0; tempR < this.irisRadius-this.pupilRadius; tempR+=ctxBackground.lineWidth){
                gradation = tempR/this.irisRadius;
                ctxBackground.strokeStyle = arrToRGB([this.irisColor[0] * gradation, this.irisColor[1] * gradation, this.irisColor[2] * gradation]);
                ctxBackground.beginPath();
                ctxBackground.arc(this.x, this.y, this.irisRadius-tempR, 0, Math.PI * 2, false);
                ctxBackground.stroke();
            }

            //동공
            ctxBackground.fillStyle = "black";
            ctxBackground.beginPath();
            ctxBackground.arc(this.x, this.y, this.pupilRadius, 0, Math.PI * 2, false);
            ctxBackground.fill();
        }
        else if(this.pupilShape == 'vertical'){
            ctxBackground.fillStyle = "black";
            ctxBackground.strokeStyle = "black";

            //right half
            ctxBackground.beginPath();
            ctxBackground.arc(this.x-this.pupilRadius*1.63, this.y, this.pupilRadius*2, -Math.PI/5, Math.PI/5, false);
            ctxBackground.fill();

            //left half
            ctxBackground.beginPath();
            ctxBackground.arc(this.x+this.pupilRadius*1.63, this.y, this.pupilRadius*2, Math.PI*4/5, Math.PI*6/5, false);
            ctxBackground.fill();

            //middle line
            ctxBackground.beginPath();
            ctxBackground.moveTo(this.x, this.y - (this.pupilRadius*1.63 * Math.sin(Math.PI/5)));
            ctxBackground.lineTo(this.x, this.y + (this.pupilRadius*1.63 * Math.sin(Math.PI/5)));
            ctxBackground.lineWidth = 2;
            ctxBackground.stroke();
        }

        //눈꺼풀
        this.drawEyelid(this.eyelidWidthRadius);
        if(this.blinking){
            if(this.blinkDelay > 0)
                this.blinkDelay -= 1;
            else{
                let t = frame - this.blinkStartFrame; //깜빡이기 시작한 후 흐른 프레임 수
                let f = this.blinkTotalFrame;
                if(t <= f/2) {
                    this.eyelidWidthRadius = 75 + t/(f/2) * this.blinkWidth;
                    this.pupilRadius += this.irisRadius * 0.01;
                }
                else if(t <= f) {
                    this.eyelidWidthRadius = 75 + (f - t)/(f/2) * this.blinkWidth;
                    this.pupilRadius -= (this.pupilRadius - this.pupilRadiusB) * (t/(f/2) - 1);
                }
                else {
                    this.eyelidWidthRadius = 75;
                    this.blinking = false;
                    this.blinkWidth = 180;
                }
            }
        }
    }
}

function randomEye(){
    let whiteRadius = (Math.random() * 24 + 26) * sizeRate;
    let x = Math.random()*canvasEl.width;
    let y = Math.random()*canvasEl.height;

    let change = true;
    while(change){
        change = false
        eyes.forEach(function(eye){
            if(distance([eye.centerX, eye.centerY], [x, y])<whiteRadius+eye.whiteRadius){
                x = Math.random()*canvasEl.width;
                y = Math.random()*canvasEl.height;
                change = true;
            }
        })
    }

    if(x-whiteRadius<0) x = whiteRadius;
    if(x+whiteRadius>canvasEl.width) x = canvasEl.width - whiteRadius;
    if(y-whiteRadius<0) y = whiteRadius;
    if(y+whiteRadius>canvasEl.height) y = canvasEl.height - whiteRadius;

    let irisColor = [Math.random() * 230 + 20, Math.random() * 230 + 20, Math.random() * 230 + 20];
    let whiteColor = [Math.random() * 30 + 205, Math.random() * 30 + 205, Math.random() * 30 + 205];
    let eyelidColor = [Math.random() * 160, Math.random() * 160, Math.random() * 160];
    let shape = ['circle', 'circle', 'vertical'][Math.floor(Math.random()*3)];
    return new Eye(x, y, whiteRadius, irisColor, whiteColor, eyelidColor, shape);
}