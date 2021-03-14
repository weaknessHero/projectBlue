/*
    object.js
    2021.02.04
    Object engine.
*/
/*
    1.3.7
        1 bounce(obj1, obj2): ObjectR.bounce(obj)로 수정(prototype 내부로 들임)
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
        this.airresist();
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
        this.dx *= 0.9;
    }

    this.airresist = function(){     //공기저항 구현 ---개발중--- 저항 면적에 비례하여 저항 상승하도록
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
        this.ctx.fillRect(this.x, this.y, this.width*this.z, this.height*this.z);
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
            if(i == 1)pWidth *= -1;
            else if(i==2){pWidth *= -1;pHeight *= -1;}
            else if(i==3)pHeight *= -1;

            this.ctx.fillRect(this.points[i][0], this.points[i][1], pWidth*this.z, pHeight*this.z);
    }}

    this.collision = function(objArray, recursed = 0){
        if(recursed>3) return 0;

        for(let n = 0; n<objArray.length; n++){
            objS = objArray[n];
            if(objS != this){for(let i = 0; i<4; i++){
                if(this.z == objS.z){

                    //this의 꼭짓점들이 objS 안에 들어가는지 확인
                    if((objS.p1[0] + objS.dx < this.points[i][0] + this.dx) & (this.points[i][0] + this.dx < objS.p2[0] + objS.dx))
                        if((objS.p2[1] + objS.dy < this.points[i][1] + this.dy) & (this.points[i][1] + this.dy < objS.p3[1] + objS.dy)){
                            this.bounce(objS);
                            this.collision(objArray, recursed+1);
                            return 1;
                        }
                            
                    //objS의 꼭짓점들이 this 안에 들어가는지 확인
                    if((this.p1[0] + this.dx < objS.points[i][0] + objS.dx) & (objS.points[i][0] + objS.dx < this.p2[0] + this.dx))
                        if((this.p2[1] + this.dy < objS.points[i][1]+objS.dy) & (objS.points[i][1] + objS.dy < this.p3[1] + this.dy)){
                            objS.bounce(this);
                            objS.collision(objArray, recursed+1);
                            return 1;
                        }
        }}}}
        return -1;
    }

    this.bounce = function(obj){
        //좌우 반작용
        //let dxAfterBounce1 = (((this.m-obj.m) * this.dx) + ((2*obj.m) * obj.dx)) / (this.m+obj.m);
        //let dxAfterBounce2 = (((obj.m-this.m) * obj.dx) + ((2*this.m) * this.dx)) / (obj.m+this.m);
    //
        //this.dx = dxAfterBounce1*this.elasticity;
        //obj.dx = dxAfterBounce2*obj.elasticity;
    
    
        //상하 반작용
        let dyAfterBounce1 = (((this.m-obj.m) * this.dy) + ((2*obj.m) * obj.dy)) / (this.m+obj.m);
        let dyAfterBounce2 = (((obj.m-this.m) * obj.dy) + ((2*this.m) * this.dy)) / (obj.m+this.m);
    
        this.dy = dyAfterBounce1*this.elasticity;
        obj.dy = dyAfterBounce2*obj.elasticity;
        
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
    this.speed = speed;

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
    
    this.moveLeft = function(){
        this.dx -= Math.random() * this.speed;
    }
    this.moveRight = function(){
        this.dx += Math.random() * this.speed;
    }
    this.jump = function(){
        this.dy -= Math.random() * this.speed + 1;
    }
    this.stay = function(){
    }

    this.movingCase = this.stay;
    
    this.update = function(){
        if(frame % Math.floor(200/this.speed) == 0) this.setMovingCase();
        this.gravity();
        this.airresist();
        this.friction();
        this.movingCase.call();
        this.checkIn();
        this.draw();
    }

    this.setMovingCase = function(){
        let moveCase = Math.floor(Math.random()*10);
        if(moveCase <= 3){
            if(Math.floor(Math.random()*2)<1){
                this.movingCase = this.moveLeft;
                this.moveLeft();
            }
            else{
                this.movingCase = this.moveRight;
                this.moveRight();
            }
        }
        else if (moveCase <= 4){
            this.movingCase = this.jump;
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
    let width  = Math.floor(Math.random()*25) + 10;
    let height = Math.floor(Math.random()*20) + 5;
    let color  = [80, 80, 255].map(x=> Math.floor(x*Math.random()));
    let x = Math.floor(Math.random()*canvas.width) - width;
    let y = 1;
    let z = 1;
    let speed = Math.floor(Math.random() * 10) + 2;

    if(type == 'object')
        return new ObjectR(canvas, ctx, 'object', x, y, z, mess, width, height, color);
    else if(type == 'creature')
        return new Creature(canvas, ctx, 'creature', x, y, z, mess, width, height, color, speed);
}