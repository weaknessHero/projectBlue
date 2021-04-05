/*
    object.js
    2021.02.04
    Object engine.
*/
/*
    1.3.10
        1 Creature.walk(): 무빙케이스화
        2 Creature draw: 비율, 속도 조정
        3 Horizontal collision.
*/

function ObjectR(canvas, ctx, type, x, y, z, mess, width, height, color){
    this.canvas = canvas;
    this.ctx = ctx;

    ////특성////

    //속성
    this.type       = type;                             //ex: wall, object
    this.m          = mess;                             //질량
    this.width      = width;                            //너비
    this.height     = height;                           //높이
    this.color      = color;                            //rgb(배열)
    this.elasticity = 0.3;                              //탄성도.

    this.x = x;
    this.y = y;
    this.z = z;
    this.r = 0;

    this.dx = 0;
    this.dy = 0;
    this.dz = 0;
    this.dr = 0;                                        //각도 순간 변화량

    //꼭짓점 좌표
    this.p1     = [this.x, this.y];
    this.p2     = [this.x + this.width, this.y];
    this.p3     = [this.x + this.width, this.y + this.height];
    this.p4     = [this.x, this.y + this.height];
    this.points = [this.p1, this.p2, this.p3, this.p4]; //꼭짓점 배열
    


    this.update = function(){
        this.draw();
        this.gravity();
        this.airResist();
        this.friction();
        this.checkIn();
    }

    this.stop = function(){
        this.dx = 0;this.dy = 0;this.dr = 0;
    }
    
    this.gravity = function(){
        if(this.type != 'wall')this.dy += this.m;
    }

    this.friction = function(){
        this.dx *= 0.98;
    }

    this.airResist = function(){     //공기저항 구현 ---개발중--- 저항 면적에 비례하여 저항 상승하도록
        this.dx *= 0.99;
        this.dr *= 0.98;
        this.dy *= 0.99;
    }

    this.checkIn = function(){
        if(this.x < 0)
            this.dx = 1;
        else if(this.x > this.canvas.width - this.width)
            this.dx = -1;
    }

    this.stopVibration = function(){ //진동 정지
        if(-1 < this.dx & this.dx < 1)this.dx = 0;
        if(-1 < this.dy & this.dy < 1)this.dy = 0;
        if(-1 < this.dr & this.dr < 1)this.dr = 0;
    }

    this.move = function(){ //오브젝트의 좌표와 각도를 순간 변화량 만큼 변환하는 함수
        if(this.type == 'wall')return 0;

        this.x += this.dx;
        this.y += this.dy;
        this.r += this.dr;
        this.movePoints();
    }

    this.movePoints = function(){   //꼭짓점들을 이동. (오브젝트 속성 참조)
        this.p1     = [this.x, this.y];
        this.p2     = [this.x + this.width, this.y];
        this.p3     = [this.x + this.width, this.y + this.height];
        this.p4     = [this.x, this.y + this.height];
        this.points = [this.p1, this.p2, this.p3, this.p4];
    }

    this.draw = function(){ //오브젝트를 그림
        this.ctx.save();                                                         //2d context의 스타일을 저장
        
        //오브젝트 회전
        this.ctx.translate(this.x+this.width*0.5, this.y+this.height);           //canvas의 중심축을 (x, y)만큼 이동
        this.ctx.rotate(this.r);                                                 //canvas의 중심축을 (r)만큼 회전
        this.ctx.translate( -(this.x+this.width*0.5), -(this.y+this.height));
        
        //오브젝트, 꼭짓점 draw
        this.ctx.fillStyle = arrToRGB(this.color);
        if(this.type=='wall')
            this.ctx.fillRect(this.x, this.y, this.width*this.z, this.height*this.z);
        else if(this.type == 'creature')
            this.drawCreature();
        this.drawPoints();
        
        this.ctx.rotate(-this.r);                                                //돌렸던 canvas를 다시 원래대로 회전
        
        this.ctx.restore();                                                      //저장한 2d context 스타일을 불러옴
    }

    this.drawPoints = function(){   //꼭짓점들을 draw
        this.ctx.fillStyle = arrToRGB([255,0,0]);
        
        for(let i = 0; i<this.points.length; i++){
            //크기를 오브젝트와 비례하게 설정
            let pWidth = this.width/80 + 3;let pHeight = this.height/80 + 3;   

            //꼭짓점이 오브젝트 안에 들어오도록 설정
            if(i == 1)
                pWidth *= -1;
            else if(i==2){
                pWidth *= -1;
                pHeight *= -1;
            }
            else if(i==3)
                pHeight *= -1;

            this.ctx.fillRect(this.points[i][0], this.points[i][1], pWidth*this.z, pHeight*this.z);
    }}

    this.collision = function(objArray, recursed = 0){
        if(recursed>3) return 0;

        for(let n = 0; n<objArray.length; n++){
            objS = objArray[n];
            if(objS != this){
                for(let i = 0; i<4; i++){
                    if(this.z == objS.z){
                        this.checkColl(objS, i, objArray, recursed);
                        objS.checkColl(this, i, objArray, recursed);
                    }
                }
            }
        }
        return -1;
    }

    this.checkColl = function(objS, i, objArray, recursed){
        //this의 꼭짓점들이 objS 안에 들어가는지 확인
        if((objS.p1[0] + objS.dx <= this.points[i][0] + this.dx) & (this.points[i][0] + this.dx <= objS.p2[0] + objS.dx))
            if((objS.p2[1] + objS.dy <= this.points[i][1] + this.dy) & (this.points[i][1] + this.dy <= objS.p3[1] + objS.dy)){
                if(this.p3[1]>objS.p1[1] | this.p1[1]<objS.p3[1])
                    this.bounce(objS, 'vertical');
                if(this.p2[0]<objS.p1[0] | this.p1[0]>objS.p2[0])
                    this.bounce(objS, 'horizontal');
                this.collision(objArray, recursed+1);
                return 1;
            }
    }    

    this.bounce = function(obj, direction){
        if(direction == 'horizontal'){
            //좌우 반작용
            let dxAfterBounce1 = (((this.m-obj.m) * this.dx) + ((2*obj.m) * obj.dx)) / (this.m+obj.m);
            let dxAfterBounce2 = (((obj.m-this.m) * obj.dx) + ((2*this.m) * this.dx)) / (obj.m+this.m);
        
            this.dx = dxAfterBounce1*this.elasticity;
            obj.dx = dxAfterBounce2*obj.elasticity;
        }
        else if(direction == 'vertical'){
            //상하 반작용
            let dyAfterBounce1 = (((this.m-obj.m) * this.dy) + ((2*obj.m) * obj.dy)) / (this.m+obj.m);
            let dyAfterBounce2 = (((obj.m-this.m) * obj.dy) + ((2*this.m) * this.dy)) / (obj.m+this.m);
        
            this.dy = dyAfterBounce1*this.elasticity;
            obj.dy = dyAfterBounce2*obj.elasticity;
        }
        //진동 방지 및 wall type 예외처리.
        [this, obj].forEach(obj =>{
            obj.stopVibration();
            if(obj.type=='wall') obj.stop();
        })
    }
}

function Creature(canvas, ctx, type, x, y, z, mess, width, height, color, speed){
    this.canvas = canvas;
    this.ctx = ctx;

    this.type       = type;
    this.m          = mess;
    this.width      = width;
    this.height     = height;
    this.color      = color;
    this.elasticity = 0.3;
    this.maxSpeed = speed;
    this.nowSpeed = 0;
    this.direction = 'left';
    this.legDirection = 'left';

    this.x = x;
    this.y = y;
    this.z = z;
    this.r = 0;

    this.dx = 0;
    this.dy = 0;
    this.dz = 0;
    this.dr = 0;

    this.p1     = [this.x, this.y];
    this.p2     = [this.x + this.width, this.y];
    this.p3     = [this.x + this.width, this.y + this.height];
    this.p4     = [this.x, this.y + this.height];
    this.points = [this.p1, this.p2, this.p3, this.p4];

    this.firstFoot = {'x':0.3, 'y':1};
    this.secondFoot = {'x':0.55, 'y':1};

    this.firstKnee = {'x':0.35, 'y':0.6};
    this.secondKnee = {'x':0.62, 'y':0.6};

    this.firstShoulder = {'x': 0.3, 'y': 0.4};
    this.secondShoulder = {'x': 0.53, 'y': 0.4};

    this.drawDots = [];

    this.drawCreature = function(){
        //head
        this.ctx.strokeStyle = arrToRGB([200, 200, 30]);
        this.ctx.fillStyle = arrToRGB([200, 200, 30]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.x+this.width*0.2, this.y+this.height*0.3);
        this.ctx.bezierCurveTo(this.x+this.width*0.15,this.y+this.height*0, this.x+this.width*0.02,this.y+this.height*0.1, this.x+this.width*0,this.y+this.height*0.36);
        this.ctx.bezierCurveTo(this.x+this.width*0.08,this.y+this.height*0.72, this.x+this.width*0.11,this.y+this.height*0.72, this.x+this.width*0.20,this.y+this.height*0.62);
        this.ctx.stroke();
        this.ctx.fill();
        //body
        this.ctx.strokeStyle = arrToRGB([100, 100, 10]);
        this.ctx.fillStyle = arrToRGB([100, 100, 10]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.x+this.width*0.20,this.y+this.height*0.62);
        this.ctx.bezierCurveTo(this.x+this.width*0.01*32,this.y+this.height*0.02*38, this.x+this.width*0.01*55,this.y+this.height*0.02*40, this.x+this.width*0.62,this.y+this.height*0.63);
        this.ctx.quadraticCurveTo(this.x+this.width*0.68, this.y+this.height*0.5, this.x+this.width*0.65,this.y+this.height*0.38);
        this.ctx.bezierCurveTo(this.x+this.width*0.01*60,this.y+this.height*0.35, this.x+this.width*0.01*30,this.y+this.height*0.18, this.x+this.width*0.2,this.y+this.height*0.3);
        this.ctx.stroke();
        this.ctx.fill();
        //tail
        this.ctx.strokeStyle = arrToRGB([200, 200, 10]);
        this.ctx.fillStyle = arrToRGB([200, 200, 10]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.x+this.width*0.01*63,this.y+this.height*0.02*30);
        this.ctx.bezierCurveTo(this.x+this.width*0.01*70,this.y+this.height*0.02*40, this.x+this.width*0.01*85,this.y+this.height*0.02*36, this.x+this.width*1,this.y+this.height*0.6);
        this.ctx.bezierCurveTo(this.x+this.width*0.01*80,this.y+this.height*0.28, this.x+this.width*0.01*70,this.y+this.height*0.02*20, this.x+this.width*0.63,this.y+this.height*0.38);
        this.ctx.stroke();
        this.ctx.fill();
        //legs
        this.ctx.strokeStyle = arrToRGB([200, 200, 10]);
        this.ctx.fillStyle = arrToRGB([200, 200, 10]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.x+this.width*this.firstShoulder['x'], this.y+this.height*this.firstShoulder['y']);
        this.ctx.quadraticCurveTo(this.x+this.width*0.34, this.y+this.height*0.4, this.x+this.width*0.01*37, this.y+this.height*0.02*30);
        this.ctx.quadraticCurveTo(this.x+this.width*0.37, this.y+this.height*0.8, this.x+this.width*this.firstFoot['x'], this.y+this.height*this.firstFoot['y']);
        this.ctx.quadraticCurveTo(this.x+this.width*0.32, this.y+this.height*0.7, this.x+this.width*this.firstKnee['x']*0.95, this.y+this.height*this.firstKnee['y']);
        this.ctx.stroke();
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.moveTo(this.x+this.width*this.secondShoulder['x'], this.y+this.height*this.secondShoulder['y']);
        this.ctx.quadraticCurveTo(this.x+this.width*0.6, this.y+this.height*0.4, this.x+this.width*this.secondKnee['x'], this.y+this.height*this.secondKnee['y']);
        this.ctx.quadraticCurveTo(this.x+this.width*0.01*60, this.y+this.height*0.02*39, this.x+this.width*this.secondFoot['x'], this.y+this.height*this.secondFoot['y']);
        this.ctx.quadraticCurveTo(this.x+this.width*0.01*58, this.y+this.height*0.02*32, this.x+this.width*this.secondKnee['x']*0.95, this.y+this.height*this.secondKnee['y']);
        this.ctx.stroke();
        this.ctx.fill();
    }
    

    this.walk = function(){
        if(this.direction == 'left')
            var sign = -1;
        else if(this.direction == 'right')
            var sign = 1;

        this.dx = this.nowSpeed * sign;

        let tempVelocity = this.nowSpeed*this.width/100000;
        
        if(this.firstFoot['x'] < 0.2)
            this.legDirection = 'right'
        else if(this.firstFoot['x'] > 0.4)
            this.legDirection = 'left'

        if(this.legDirection == 'left'){
            this.firstFoot['x'] -= tempVelocity;
            this.firstKnee['x'] -= tempVelocity/5;
            this.secondFoot['x'] += tempVelocity;
            this.secondKnee['x'] += tempVelocity/5;
        }
        else if(this.legDirection == 'right'){
            this.firstFoot['x'] += tempVelocity;
            this.firstKnee['x'] += tempVelocity/5;
            this.secondFoot['x'] -= tempVelocity;
            this.secondKnee['x'] -= tempVelocity/5;
        }
    }

    this.jump = function(){
        this.dy -= Math.random() * this.maxSpeed*5 + 2;
    }
    
    this.stay = function(){
    }

    this.movingCase = this.stay;
    
    this.update = function(){
        if(frame % Math.floor(200/this.maxSpeed) == 0) this.setMovingCase();
        this.gravity();
        this.airResist();
        this.friction();
        this.movingCase.call(this);
        this.checkIn();
        this.draw();
    }

    this.setMovingCase = function(){
        let moveCase = Math.floor(Math.random()*5);
        if(moveCase <= 3){
            if(Math.floor(Math.random()*2)<1)
                this.direction = 'left';
            else
                this.direction = 'right';
            this.movingCase = this.walk;
            this.nowSpeed = Math.floor(this.maxSpeed * Math.random())+0.5;
            this.walk();
        }
        else if (moveCase == 4){
            this.movingCase = this.stay;
            this.jump();
        }
        else{
            this.movingCase = this.stay;
            this.stay();
        }
    }
}

Creature.prototype = new ObjectR(); //Object prototype와 chain(상속)

function randomObject(type, canvas, ctx){
    let mess   = Math.floor(Math.random()*2) + 1;
    let width  = Math.floor(Math.random()*65) + 90;
    let height = Math.floor(Math.random()*45) + 45;
    let color  = [80, 80, 255].map(x=> Math.floor(x*Math.random()));
    let x = Math.floor(Math.random()*canvas.width) - width;
    let y = 1;
    let z = 1;
    let speed = Math.floor(Math.random() * 100) + 0.1;

    if(type == 'object')
        return new ObjectR(canvas, ctx, 'object', x, y, z, mess, width, height, color);
    else if(type == 'creature')
        return new Creature(canvas, ctx, 'creature', x, y, z, mess, width, height, color, speed);
}

function arrToRGB(rgbArr){  //배열을 rgb문자열로 변환
    return 'rgb(' + rgbArr[0] + ',' + rgbArr[1] + ',' + rgbArr[2] + ')';
}