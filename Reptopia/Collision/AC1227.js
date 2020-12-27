//////////////////////////////////////////////////////////////////////////
//                                                                      //
//                             2020-12-27                               //
//                            LeeJungHyeok                              //
//               Animate Creaure Engine (Physics engine)                //
//    - In order to apply all physical phenomena in computer graphic.   //
//                                                                      //
//////////////////////////////////////////////////////////////////////////

//html Element 설정
var canvasEl = document.createElement("canvas");
var ctx = canvasEl.getContext("2d");
canvasEl.width = 500;
canvasEl.height = 650;                                  //canvs의 너비와 높이
document.body.appendChild(canvasEl);

//변수 초기값 정의
var objects = [];               //모든 object를 포괄하는 배열
var frame = 0;                  //프레임 변수
var BGC = [30, 30, 30];         //'Backgound Color' 배경색 초기 rgb값
var floor = new Object('wall', 0, canvasEl.height - 50, 1, 10000, canvasEl.width, 50, [0, 255, 0]); //땅 생성

objects.push(floor);

loop();

function loop(){    //메인 루프
    frame += 1;                                             //프레임 수 카운트

    //임의의 이벤트
    if(objects.length<30 & frame%30 == 0)objects.push(createRandomObject());
    if(frame%900 == 0)objects.splice(1, 28);

    //배경색
    BGC = fadeColor(2, BGC);
    ctx.fillStyle=arrToRGB(BGC);
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
    
    //오브젝트 변화
    objects.forEach(obj => {
        obj.draw();                 //그림
        obj.fadeObjColor(5);           //색 변화
        obj.gravity();              //중력
        obj.airresist();            //공기저항
    });                                                     //과정 간결화 ---개발중---
    
    checkCollision();                                       //충돌 확인

    requestAnimationFrame(loop);                            //무한 루프 생성
}


////////함수////////

function arrToRGB(rgbArr){   //배열을 rgb문자열로 변환
    return 'rgb(' + rgbArr[0] + ',' + rgbArr[1] + ',' + rgbArr[2] + ')';
}

function fadeColor(weight, rgb){    //rgb 배열을 0 ~ weight(가중치)만큼 변화시켜 리턴
    for(var i = 0; i < 3; i++){
        let rnd = Math.random();
        if(rnd <= 0.1) {rgb[i] += Math.random()*weight;break;}
        else if(rnd <= Number(0.2)) {rgb[i] -= Math.random()*weight;break;}
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