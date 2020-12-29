var canvasEl = document.createElement('canvas');
var ctx = canvasEl.getContext("2d");

canvasEl.width = 900;
canvasEl.height = 500;

document.body.appendChild(canvasEl);

canvasEl.addEventListener("mouseenter", mouseEnter);
canvasEl.addEventListener("mouseout", mouseOut);
canvasEl.addEventListener("mousemove", mouseMove);
var up0 = false;
var up1 = false;
var up2 = false;


let col = [0, 0, 255];

loop();

function loop(){

    ctx.fillStyle = arrToRGB(col);
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

    requestAnimationFrame(loop);
}

function mouseEnter(){
    col = [255, 0, 0];
}

function mouseOut(){
    col = [0, 0, 255];
}

function mouseMove(event){
    
    col[0] = (event.pageX-9)/(canvasEl.width)*255;
    col[2] = (event.pageY-90)/(canvasEl.height)*255;
    col[1] = (event.pageX+event.pageY-99)/(canvasEl.width)*255;

    console.log(event.pageX, event.pageY);
    console.log(col);

    //if(col[0]<10) up0 = true;
    //else if(col[0]>245) up0 = false;
    //if(up0) col[0] ++;
    //else col[0] --;

    //if(col[1]<10) up1 = true;
    //else if(col[1]>245) up1 = false;
    //if(up1) col[1] += 0.5;
    //else col[1] -= 0.5;

    //if(col[2]<10) up2 = true;
    //else if(col[2]>245) up2 = false;
    //if(up2) col[2] += 0.1;
    //else col[2] -= 0.1;
}

function arrToRGB(arr){
    return "rgb(" + arr[0] + "," + arr[1] + "," + arr[2] + ")";
}