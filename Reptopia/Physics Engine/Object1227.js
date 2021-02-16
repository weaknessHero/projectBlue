function Object(type, x, y, z, mess, width, height, color){
    ////특성////

    //속성
    this.type       = type;                             //ex: wall, object
    this.m          = mess;                             //질량
    this.width      = width;                            //너비
    this.height     = height;                           //높이
    this.color      = color;                            //rgb(배열)
    this.elasticity = 0.3;                              //탄성도.

    //좌표, 각도
    this.x = x;
    this.y = y;
    this.z = z;
    this.r = 0;

    //좌표, 각도 순간변화량
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
    

    ////함수////

    this.stop = function(){
        this.dx = 0;this.dy = 0;this.dr = 0;
    }

    this.fadeObjColor = function(w){    //오브젝트 서서히 색변화
        this.color = fadeColor(w, this.color);
    }
    
    this.gravity = function(){       //중력 구현
        if(this.type != 'wall')this.dy += this.m*3.5;
    }

    this.airresist = function(){     //공기저항 구현 ---개발중--- 저항 면적에 비례하여 저항 상승하도록
        this.dx *= 0.99;
        this.dr *= 0.98;
        this.dy *= 0.99;
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
        ctx.save();                                                         //2d context의 스타일을 저장
        
        //오브젝트 회전
        ctx.translate(this.x+this.width*0.5, this.y+this.height);           //canvas의 중심축을 (x, y)만큼 이동
        ctx.rotate(this.r);                                                 //canvas의 중심축을 (r)만큼 회전
        ctx.translate( -(this.x+this.width*0.5), -(this.y+this.height));
        
        //오브젝트, 꼭짓점 draw
        ctx.fillStyle = arrToRGB(this.color);
        ctx.fillRect(this.x, this.y, this.width*this.z, this.height*this.z);
        this.drawPoints();
        
        ctx.rotate(-this.r);                                                //돌렸던 canvas를 다시 원래대로 회전
        
        ctx.restore();                                                      //저장한 2d context 스타일을 불러옴
    }

    this.drawPoints = function(){   //꼭짓점들을 draw
        ctx.fillStyle = arrToRGB([255,0,0]);
        
        for(let i = 0; i<this.points.length; i++){
            //크기를 오브젝트와 비례하게 설정
            let pWidth = this.width/80 + 3;let pHeight = this.height/80 + 3;   

            //꼭짓점이 오브젝트 안에 들어오도록 설정
            if(i == 1)pWidth *= -1;
            else if(i==2){pWidth *= -1;pHeight *= -1;}
            else if(i==3)pHeight *= -1;

            ctx.fillRect(this.points[i][0], this.points[i][1], pWidth*this.z, pHeight*this.z);
    }}

    this.collision = function(objArray, recursed = 0){    //오브젝트들 사이에서 충돌 구현. 재귀호출로 연쇄충돌 구현.
        //무한 리커젼 탈출
        if(recursed>3){console.log("ce." + recursed);return 0;}

        for(let n = 0; n<objArray.length; n++){
            objS = objArray[n];

            if(objS != this){for(let i = 0; i<4; i++){
                if(this.z == objS.z){

                    //this의 꼭짓점들이 objS 안에 들어가는지 확인
                    if((objS.p1[0] + objS.dx < this.points[i][0] + this.dx) & (this.points[i][0] + this.dx < objS.p2[0] + objS.dx))
                        if((objS.p2[1] + objS.dy < this.points[i][1] + this.dy) & (this.points[i][1] + this.dy < objS.p3[1] + objS.dy)){
                            bounce(this, objS);
                            this.collision(objArray, recursed+1);
                            objS.collision(objArray, recursed+1);
                            return 1;
                        }
                            
                    //objS의 꼭짓점들이 this 안에 들어가는지 확인
                    if((this.p1[0] + this.dx < objS.points[i][0] + objS.dx) & (objS.points[i][0] + objS.dx < this.p2[0] + this.dx))
                        if((this.p2[1] + this.dy < objS.points[i][1]+objS.dy) & (objS.points[i][1] + objS.dy < this.p3[1] + this.dy)){
                            bounce(this, objS);
                            this.collision(objArray, recursed+1);
                            objS.collision(objArray, recursed+1);
                            return 1;
                        }
        }}}}
        return -1;
    }
}