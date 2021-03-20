/*
    Creator.js
    2021.02.04
    Js for creator canvas.
*/
/*
    1.3.8
        1 생성됨.
*/

//Element setting
var canvasEl = document.getElementById("creator");
canvasEl.width = innerWidth;
canvasEl.height = innerHeight;
var ctxBackground = canvasEl.getContext("2d");

var frame = 0;

var newCreature = new Creature(canvasEl, ctxBackground, 'creature', 200, canvasEl.height-200, 1, 1, 150, 70, [30,100,50]);
var ground = new ObjectR(canvasEl, ctxBackground, 'wall', 0, canvasEl.height-100, 1, 100, canvasEl.width, 100, [30,100,50]);

var objects = [newCreature, ground];
console.dir(objects);

backgroundLoop();

function backgroundLoop(){
    frame += 1;

    ctxBackground.fillStyle = 'black';  //배경 채우기
    ctxBackground.fillRect(0,0, canvasEl.width, canvasEl.height);

    objects.forEach(obj => { obj.update(); }); //모든 오브젝트 업데이트
    
    for(let i=0; i<objects.length; i++){    //충돌 확인 파트
        if(objects[i].collision(objects)==0) break;
        objects[i].move();
    }

    backgroundAnimation = requestAnimationFrame(backgroundLoop);
}