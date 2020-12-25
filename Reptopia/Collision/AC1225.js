//////////////////////////////////////////////////////////////////////////
//                                                                      //
//                             2020-12-25                               //
//                            LeeJungHyeok                              //
//               Animate Creaure Engine (Physics engine)                //
//    - In order to apply all physical phenomena in computer graphic.   //
//                                                                      //
//////////////////////////////////////////////////////////////////////////

window.onload = function(){     //페이지가 로드되면, html을 읽을 때, 이 함수를 가장 먼저 실행. (main)


    var canvasEl = document.createElement("canvas");        //canvasEl라는 캔버스 엘리먼트를 만든다.
    var ctx = canvasEl.getContext("2d");                    //canvas 메서드. 2d Context를 가져온다.
    canvasEl.width = 700;
    canvasEl.height = 700;                                  //canvs의 너비와 높이.
    document.body.appendChild(canvasEl);                    //캔버스 엘리먼트를 document의 body로 가져온다.


    var objects = [];                                       //모든 object를 포괄하는 배열.
    objects.push(new Object('wall', 0, canvasEl.height - 100, 1, 10000, canvasEl.width, 100, [0, 255, 0])) //바닥 생성 wall type을 주면 gravity의 영향을 받지 않는다.
    

    var t = 0;                    //시간 변수. 정확히는 프레임.
    var BGC = [30, 30, 30];       //'Backgound Color' 초기 배경색 rgb값.
    loop();                       //무한 루프 실행.

    

    function loop(){    //메인 루프

        t += 1;                                                 //프레임 수 카운트.

        if(objects.length<30)
            if(t%30 == 0){                                      //프레임 수를 이용해 시간대 별 이벤트 발생.
                var rndobj = createRandomObject();
                objects.push(rndobj);                           //랜덤 오브젝트 1개 생성.
            }
        
        if(t%900 == 0)objects.splice(1, 28);                    //600프레임 마다 오브젝트들 초기화(바닥, 마지막 obj 제외)

        BGC = fadeColor(2, BGC);                                //배경색을 바꿈.
        ctx.fillStyle=arrToRGB(BGC);
        ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);    //배경을 칠함.
        
        objects.forEach(obj => {                                //모든 오브젝트에 아래 함수들을 실행.
            obj.draw();         //그림 (원래만 맨 마지막 순서가 맞지만, 이전 프레임의 위치에 그리게 해도 영향은 없다. checkCollision 이후에 draw를 하면 코드가 길어지가 때문에 이렇게 함.)
            obj.fadeColor(10);  //색 변화
            obj.gravity();      //중력
            obj.airresist();    //공기저항
        });                                                     //과정 간결화 ---개발중---
        
        checkCollision();

        requestAnimationFrame(loop);                            //무한 루프 생성.
    }

    
    function Object(type, x, y, z, mess, width, height, color){     //모든 오브젝트를 다루는 프로토타입.

        this.type       = type;                             //오브젝트의 타입을 나눈다. 현재 object, wall만 존재.
        this.m          = mess;                             //오브젝트의 질량
        this.width      = width;
        this.height     = height;
        this.color      = color;                            //rgb배열
        this.elasticity = 0.3;                              //탄성도. 충돌 시 반작용 가중치.

        this.x = x;
        this.y = y;
        this.z = z;
        this.r = 0;                                         //오브젝트의 각도
        this.dx = 0;                                        //x좌표 순간 변화량 (1프레임에 얼마나 변하는지)
        this.dy = 0;                                        //y좌표 순간 변화량
        this.dr = 0;                                        //각도 순간 변화량


        this.p1     = [this.x, this.y];
        this.p2     = [this.x + this.width, this.y];
        this.p3     = [this.x + this.width, this.y + this.height];
        this.p4     = [this.x, this.y + this.height];           //오브젝트의 꼭짓점들. collision(충돌) 함수 구현에 필요.
        this.points = [this.p1, this.p2, this.p3, this.p4]; //꼭짓점들을 for문으로 돌리기위해 배열에 넣었다.
    
        this.accelerateMoveDraw = function(dx, dy, dr){
            //가속, 이동, 그리기를 묶어놓은 함수. 삭제 가능.

            this.accelerate(dx, dy, dr);
            this.move();
            this.draw();
        }
    
        this.accelerate = function(dx, dy, dr){
            //가속 함수. x/y/r의 순간변화량을 바꾼다.

            this.dx += dx;
            this.dy += dy;
            this.dr += dr;

            if(this.type == 'wall')this.stop();        //타입이 wall일 경우 가속하지 않음.
        }

        this.stop = function()
        {this.dx = 0;this.dy = 0;this.dr = 0;}  //오브젝트를 정지하는 함수.

        this.move = function(){         //오브젝트의 좌표와 각도를 순간 변화량 만큼 변환하는 함수.
            if(this.type == 'wall')return 0;

            this.x += this.dx;
            this.y += this.dy;
            this.r += this.dr;

            this.movePoints();          //오브젝트의 꼭짓점들도 움직여준다.
        }
    
        this.collision = function(objArray){
            //오브젝트들 사이에서 충돌 구현.
            
            for(let n = 0; n<objArray.length; n++){
                objS = objArray[n];                                                         //Sub object.

                if(objS != this){for(let i =0; i<4; i++){

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

            }}}//for문을 object의 개수의 제곱 번 돌면서 한 오브젝트를 두 번 검사함. 두 번 하지 않으면 한 오브젝트가 다른 오브젝트에 완전 포함될 경우 충돌 감지를 못함.
            return -1;
        }

        this.draw = function(){                                                 //오브젝트를 그린다. 오브젝트의 위치(x, y), 너비와 높이, 각도가 적용된다.


            ctx.save();                                                         //2d context가 가진 스타일을 저장.
            
            ctx.translate(this.x+this.width*0.5, this.y+this.height);           //canvas의 중심축을 (x, y)만큼 이동시킨다.
            ctx.rotate(this.r);                                                 //canvas의 중심축을 (r)만큼 회전시킨다.
            ctx.translate( -(this.x+this.width*0.5), -(this.y+this.height));
            //오브젝트의 위치만큼 중심축을 이동시키고(중심축을 오브젝트 위치에 놓고), 중심축을 오브젝트의 각도만큼 회전시키고,
            //다시 이동시켰던 (x, y)만큼 되돌아간다(회전된 상태에서). 이렇게 하면 회전한 오브젝트를 그릴 수 있다.
    
            ctx.fillStyle = arrToRGB(this.color);                               //오브젝트의 색깔을 설정한다.
            ctx.fillRect(this.x, this.y, this.width*this.z, this.height*this.z);//오브젝트를 그린다.
            this.drawPoints();                                                  //꼭짓점을 그린다.
    
            ctx.rotate(-this.r);                                                //돌렸던 canvas를 다시 원래대로 돌려놓는다.
            ctx.restore();                                                      //저장한 2d context 스타일을 불러옴.
        }
    
        this.movePoints = function(){                               //꼭짓점들을 이동시키는 함수.
            this.p1     = [this.x, this.y];
            this.p2     = [this.x + this.width, this.y];
            this.p3     = [this.x + this.width, this.y + this.height];
            this.p4     = [this.x, this.y + this.height];
            this.points = [this.p1, this.p2, this.p3, this.p4];     //오브젝트의 좌표, 너비, 높이를 참조해 꼭짓점 위치 설정.
        }

        this.drawPoints = function(){                       //꼭짓점들을 그리는 함수.

            ctx.fillStyle = arrToRGB([255,0,0]);            //꼭짓점 색깔 설정.
            
            for(let i = 0; i<this.points.length; i++){      //points 배열로 꼭짓점들을 참조.

                let pWidth = this.width/80 + 3;let pHeight = this.height/80 + 3;    //점d 크기를 오브젝트와 비례하게 설정.

                if(i == 1)pWidth *= -1;
                else if(i==2){pWidth *= -1;pHeight *= -1;}
                else if(i==3)pHeight *= -1;                 //꼭짓점이 오브젝트 안에 들어오도록 설정

                ctx.fillRect(this.points[i][0], this.points[i][1], pWidth*this.z, pHeight*this.z);
            }
        }

        this.stickObj = function(){
            if(-1 < this.dx & this.dx < 1)this.dx = 0;
            if(-1 < this.dy & this.dy < 1)this.dy = 0;
            if(-1 < this.dr & this.dr < 1)this.dr = 0;
        }
    
        this.gravity = function(){  //중력 구현 함수.
            if(this.type != 'wall')this.accelerate(0, this.m*3.5, 0);      //3.5 * 질량만큼 가속함. 현실에서는 9.8 * 질량이지만 이는 지구의 질량과 반지름에 의해 결정된 중력가속도 값(만유인력)으로, 다른 환경이라고 가정하고 중력가속도를 3.5로 잡았음.
        }
    
        this.airresist = function(){    //공기저항 구현 함수. ---개발중--- !저항 면적에 비례하여 저항 상승
            this.dx *= 0.99;
            this.dr *= 0.98;
            this.dy *= 0.99;
        }

        this.fadeColor = function(w){this.color = fadeColor(w, this.color);}
    }

    function checkCollision(){  //object.collision() 반복 호출하여 충돌 구현
        var crashed = [];var lim = 0;

        for(let i = 0; i < objects.length; i++){
            col = objects[i].collision(objects)
            if(col != -1 & !crashed.includes([i+','+col])){     //이미 처리한 충돌에 대해서는 무시.
                i = 0;
                crashed.push([i+','+col]);
            }

            objects[i].move();

            lim++;if(lim>1000)break;                            //무한루프에 걸렸을 경우 탈출.
        }
    }
    
    function createRandomObject(){  //무작위 오브젝트를 생성하여 리턴. (여기서는 빗방울)

        var x = Math.floor(Math.random()*canvasEl.width);
        var y = 10;
        var z = 1;
        var mess = Math.floor(Math.random()*0.1)+0.1;
        var width = Math.floor(Math.random()*100+15);
        var height = Math.floor(Math.random()*100+15);
        var color = [Math.random()*150, Math.random()*255, Math.random()*255];  //x, y, 질량, 너비, 높이, 색 무작위 하드코딩.

        var rndObj = new Object('object', x, y, z, mess, width, height, color);

        return rndObj;                                                          //생성된 오브젝트 리턴.
    }
    
    function fadeColor(weight, rgb){
        //rgb 배열을 무작위로 weight(가중치)만큼 변화시켜 리턴.

        for(var i = 0; i < 3; i++){
            let rnd = Math.random();
            if(rnd<=0.1) {rgb[i] += Math.random()*weight;break;}        //33% 확률   <Math.random(): 0~1 사이의 무작위값 리턴>
            else if(rnd <= 0.2) {rgb[i] -= Math.random()*weight;break;} //가중치를 각 r/g/b 값에서 빼거나 더함.
        }
        for(var i = 0; i < 3; i++){
            if(rgb[i]>255)
                rgb[i] = 255;
            if(rgb[i] < 0)
                rgb[i] = 0;
        }                               //rgb값이 255를 넘거나 0보다 작아지지 않게 제어함.
    
        return rgb;                     //rgb 배열을 리턴
    }
    
    function arrToRGB(rgbArr)           //배열을 rgb문자열로 변환하여 리턴.
    {return 'rgb(' + rgbArr[0] + ',' + rgbArr[1] + ',' + rgbArr[2] + ')';}
    

    //항상 힘으로 생각하기.

    function bounce(obj1, obj2){
        //작용 반작용

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
        
        [obj1, obj2].forEach(obj =>{
            obj.stickObj();                 //속도가 1 미만이면 움직이지 않음.(무한 충돌 방지)
            if(obj.type=='wall')obj.stop();                 //벽일 경우 움직이지 않음.
        })
    }

}