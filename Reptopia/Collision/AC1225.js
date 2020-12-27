//////////////////////////////////////////////////////////////////////////
//                                                                      //
//                             2020-12-27                               //
//                            LeeJungHyeok                              //
//               Animate Creaure Engine (Physics engine)                //
//    - In order to apply all physical phenomena in computer graphic.   //
//                                                                      //
//////////////////////////////////////////////////////////////////////////

window.onload = function(){
    var canvasEl = document.createElement("canvas");
    var ctx = canvasEl.getContext("2d");
    canvasEl.width = 500;
    canvasEl.height = 650;                                  //canvs의 너비와 높이
    document.body.appendChild(canvasEl);

    var objects = [];                                       //모든 object를 포괄하는 배열

    var floor = new Object('wall', 0, canvasEl.height - 50, 1, 10000, canvasEl.width, 50, [0, 255, 0]); //땅 생성
    objects.push(floor);
    
    var frame = 0;                //프레임 변수
    var BGC = [30, 30, 30];       //'Backgound Color' 배경색 초기 rgb값
    loop();                       //무한 루프 실행



    ////함수////
    
    function loop(){    //메인 루프
        frame += 1;                                             //프레임 수 카운트

        //임의의 이벤트
        if(objects.length<30)
            if(frame%30 == 0)objects.push(createRandomObject());
        if(frame%900 == 0)objects.splice(1, 28);
        
        //배경색
        BGC = fadeColor(2, BGC);
        ctx.fillStyle=arrToRGB(BGC);
        ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
        
        //오브젝트 변화
        objects.forEach(obj => {
            obj.draw();                 //그림
            obj.fadeColor(5);           //색 변화
            obj.gravity();              //중력
            obj.airresist();            //공기저항
        });                                                     //과정 간결화 ---개발중---
        
        checkCollision();                                       //충돌 확인

        requestAnimationFrame(loop);                            //무한 루프 생성
    }

    function arrToRGB(rgbArr){   //배열을 rgb문자열로 변환
        return 'rgb(' + rgbArr[0] + ',' + rgbArr[1] + ',' + rgbArr[2] + ')';
    }
    
    function fadeColor(weight, rgb){    //rgb 배열을 0 ~ weight(가중치)만큼 변화시켜 리턴
        for(var i = 0; i < 3; i++){
            let rnd = Math.random();
            if(rnd <= 0.1) {rgb[i] += Math.random()*weight;break;}
            else if(rnd <= 0.2) {rgb[i] -= Math.random()*weight;break;}
        }

        for(var i = 0; i < 3; i++){ //r,g,b 값 0 ~ 255 유지
            if(rgb[i] > 255)rgb[i] = 255;
            if(rgb[i] < 0)rgb[i] = 0;
        }
        return rgb;
    }

    function checkCollision(){  //object.collision() 반복 호출하여 충돌 구현 ---개발중---<충돌한 객체들에게 재귀함수 호출>
        var crashed = [];var lim = 0;

        for(let i = 0; i < objects.length; i++){
            col = objects[i].collision(objects)
            if(col != -1 & !crashed.includes([i+','+col])){     //이미 처리한 충돌에 대해서는 무시
                i = 0;
                crashed.push([i+','+col]);
            }

            objects[i].move();

            lim++;if(lim>1000)break;                            //무한루프에 걸렸을 경우 탈출
        }
    }
    
    function createRandomObject(){  //무작위 오브젝트를 생성하여 리턴. Math.random() (0~1 리턴) 이용
        var x = Math.floor(Math.random()*canvasEl.width);
        var y = 10;
        var z = 1;
        var mess = Math.floor(Math.random()*0.1)+0.1;
        var width = Math.floor(Math.random()*100+15);
        var height = Math.floor(Math.random()*100+15);
        var color = [Math.random()*150, Math.random()*255, Math.random()*255];

        var rndObj = new Object('object', x, y, z, mess, width, height, color);

        return rndObj;
    }

    function bounce(obj1, obj2){    //작용 반작용
        //상하 반작용
        let b1 = (((obj1.m-obj2.m) * obj1.dy) + ((2*obj2.m) * obj2.dy)) / (obj1.m+obj2.m);
        let b2 = (((obj2.m-obj1.m) * obj2.dy) + ((2*obj1.m) * obj1.dy)) / (obj2.m+obj1.m);

        obj1.dy = b1*obj1.elasticity;
        obj2.dy = b2*obj2.elasticity;

        //좌우 반작용
        b1 = (((obj1.m-obj2.m) * obj1.dx) + ((2*obj2.m) * obj2.dx)) / (obj1.m+obj2.m);
        b2 = (((obj2.m-obj1.m) * obj2.dx) + ((2*obj1.m) * obj1.dx)) / (obj2.m+obj1.m);

        obj1.dx = b1*obj1.elasticity;
        obj2.dx = b2*obj2.elasticity;
        
        
        //진동 방지 및 wall type 예외처리.
        [obj1, obj2].forEach(obj =>{
            obj.stopVibration();
            if(obj.type=='wall')obj.stop();
        })
    }

    
    ////프로토타입////
    
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

        this.fadeColor = function(w){    //오브젝트 서서히 색변화
            this.color = fadeColor(w, this.color);
        }
        
        this.gravity = function(){   //중력 구현
            if(this.type != 'wall')this.dy += this.m*3.5;
        }

        this.airresist = function(){    //공기저항 구현 ---개발중--- 저항 면적에 비례하여 저항 상승하도록
            this.dx *= 0.99;
            this.dr *= 0.98;
            this.dy *= 0.99;
        }

        this.stopVibration = function(){    //진동 정지
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
    
        this.collision = function(objArray){    //오브젝트들 사이에서 충돌 구현. 충돌한 오브젝트의 인덱스 혹은 -1 리턴
            for(let n = 0; n<objArray.length; n++){
                objS = objArray[n];

                if(objS != this){for(let i = 0; i<4; i++){
                    if(this.z == objS.z){
                        if( objS.p1[0] + objS.dx < this.points[i][0]+this.dx & this.points[i][0]+this.dx < objS.p2[0] + objS.dx)
                            if( objS.p2[1] + objS.dy < this.points[i][1]+this.dy & this.points[i][1]+this.dy < objS.p3[1] + objS.dy){
                                bounce(this, objS);
                                return n;
                            }//this의 꼭짓점들이 objS 안에 들어가는지 확인
                        if( this.p1[0] + this.dx < objS.points[i][0]+objS.dx & objS.points[i][0]+objS.dx < this.p2[0] + this.dx)
                            if( this.p2[1] + this.dy < objS.points[i][1]+objS.dy & objS.points[i][1]+objS.dy < this.p3[1] + this.dy){
                                bounce(objS, this); 
                                return n;
                            }//objS의 꼭짓점들이 this 안에 들어가는지 확인
            }}}}
            return -1;
        }
    }
}
