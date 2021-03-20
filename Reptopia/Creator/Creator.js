//Element setting
var canvasEl = document.getElementById("creator");
canvasEl.width = innerWidth;
canvasEl.height = innerHeight;
var ctxBackground = canvasEl.getContext("2d");

var frame = 0;

var newCreature = randomObject('creature', canvasEl, ctxBackground);
var ground = new ObjectR(canvasEl, ctxBackground, 'wall', 0, canvasEl.height-100, 1, 100, canvasEl.width, 100, [30,100,50]);

var objects = [newCreature, ground];
console.dir(objects);

backgroundLoop();

function backgroundLoop(){ //Background animation
    frame += 1;

    ctxBackground.fillStyle = 'black';
    ctxBackground.fillRect(0,0, canvasEl.width, canvasEl.height);

    objects.forEach(obj => {
        obj.draw();
        obj.gravity();
        obj.airresist();
    });
    
    for(let i=0; i<objects.length; i++){
        //충돌 확인
        if(objects[i].collision(objects)==0)break;          //무한리커젼 탈출
        objects[i].move();
    }

    backgroundAnimation = requestAnimationFrame(backgroundLoop);
}