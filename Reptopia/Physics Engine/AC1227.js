//////////////////////////////////////////////////////////////////////////
//                                                                      //
//                             2020-12-27                               //
//                            LeeJungHyeok                              //
//               Animate Creaure Engine (Physics engine)                //
//    - In order to apply all physical phenomena in computer graphic.   //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


//Html Element 설정
var canvasEl = document.createElement("canvas");
var ctx = canvasEl.getContext("2d");
canvasEl.width = 500;
canvasEl.height = 650;          //canvs의 너비와 높이
document.body.appendChild(canvasEl);

//변수 초기값 정의
var objects = [];               //모든 object를 포괄하는 배열
var frame = 0;
var BGC = [30, 30, 30];         //'Backgound Color' 배경색 초기 rgb값
var floorObject = new Object('wall', 0, canvasEl.height - 50, 1, 10000, canvasEl.width, 50, [30, 20, 0]); //땅 생성

objects.push(floorObject);

loop();

function loop(){  //메인 루프
    //프레임 카운트
    frame += 1;

    //임의의 이벤트
    if(objects.length<80 & frame%4 == 0)objects.push(createRandomObject());
    if(frame%240 == 0)objects.splice(1, 78);

    //배경색
    ctx.fillStyle=arrToRGB(BGC);
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
    
    //오브젝트 변화
    objects.forEach(obj => {
        obj.draw();                 //그림
        obj.gravity();              //중력
        obj.airresist();            //공기저항
    });                                                     //과정 간결화 ---개발중---
    
    for(let i=0; i<objects.length; i++){
        //충돌 확인
        if(objects[i].collision(objects)==0)break;          //무한리커젼 탈출
        objects[i].move();
    }

    requestAnimationFrame(loop);                            //무한 루프 생성
}


//////함수//////

function arrToRGB(rgbArr){  //배열을 rgb문자열로 변환
    return 'rgb(' + rgbArr[0] + ',' + rgbArr[1] + ',' + rgbArr[2] + ')';
}

function fadeColor(weight, rgb){  //rgb 배열을 0 ~ weight(가중치)만큼 변화시켜 리턴
    for(var i = 0; i < 3; i++){
        let rnd = Math.random();
        if(rnd <= 0.1) {rgb[i] += Math.random()*weight;break;}
        else if(rnd <= Number(0.2)) {rgb[i] -= Math.random()*weight;break;}
    }

    for(var i = 0; i < 3; i++){  //r,g,b 값 0 ~ 255 유지
        if(rgb[i] > 255)rgb[i] = 255;
        if(rgb[i] < 0)rgb[i] = 0;
    }
    return rgb;
}

function createRandomObject(){  //무작위 오브젝트를 생성하여 리턴. Math.random() (0~1 리턴) 이용
    var x = Math.floor(Math.random()*canvasEl.width);
    var y = 0;
    var z = 1;

    var mess   = Math.floor(Math.random()*0.3)+0.5;
    var width  = Math.floor(Math.random()*20+8);
    var height = Math.floor(Math.random()*16+8);
    var color  = [Math.random()*80, Math.random()*80, Math.random()*255];

    return new Object('object', x, y, z, mess, width, height, color);
}

function bounce(obj1, obj2){  //작용 반작용
    //좌우 반작용
    let dxAfterBounce1 = (((obj1.m-obj2.m) * obj1.dx) + ((2*obj2.m) * obj2.dx)) / (obj1.m+obj2.m);
    let dxAfterBounce2 = (((obj2.m-obj1.m) * obj2.dx) + ((2*obj1.m) * obj1.dx)) / (obj2.m+obj1.m);

    obj1.dx = dxAfterBounce1*obj1.elasticity;
    obj2.dx = dxAfterBounce2*obj2.elasticity;


    //상하 반작용
    let dyAfterBounce1 = (((obj1.m-obj2.m) * obj1.dy) + ((2*obj2.m) * obj2.dy)) / (obj1.m+obj2.m);
    let dyAfterBounce2 = (((obj2.m-obj1.m) * obj2.dy) + ((2*obj1.m) * obj1.dy)) / (obj2.m+obj1.m);

    obj1.dy = dyAfterBounce1*obj1.elasticity;
    obj2.dy = dyAfterBounce2*obj2.elasticity;
    
    //진동 방지 및 wall type 예외처리.
    [obj1, obj2].forEach(obj =>{
        obj.stopVibration();
        if(obj.type=='wall')obj.stop();
    })
}