window.onload = function(){

var canvasEl = document.createElement("canvas");
var ctx = canvasEl.getContext("2d");
canvasEl.width = 1920;
canvasEl.height = 1080;
document.body.appendChild(canvasEl);

function Object(x, y, mess, width, height, color){
    this.m = mess;
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
    this.r = 0;
    this.dx = 0;
    this.dy = 0;
    this.dr = 0;

    this.amd = function(dx, dy, dr){
        this.accelerate(dx, dy, dr);
        this.move();
        this.draw();
    }

    this.accelerate = function(dx, dy, dr){
        this.dx += dx;
        this.dy += dy;
        this.dr += dr;
    }

    this.move = function(){
        this.x += this.dx;
        this.y += this.dy;
        if(this.y > canvasEl.height){
            this.y = 0- this.height;
            this.x = Math.floor(Math.random()*canvasEl.width);
            this.dy = 0;
            this.color = fadeColor(20, this.color);
        }

        this.r += this.dr;
    }

    this.draw = function(){
        ctx.save();

        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);

        ctx.fillStyle = arrToRGB(this.color);

        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.restore();
    }
}

var objects = [];

for(var i =0; i<1000; i++){
    var rndobj = createRandomObject();
    objects.push(rndobj);
}

var t = 0;
var bgc = [0, 0, 0];

function loop(){
    t += 1;
    bgc = fadeColor(0.25, bgc);
    ctx.fillStyle='rgb(' + bgc[0] + ',' + bgc[1] + ',' + bgc[2] + ')';

    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

    objects.forEach(obj => obj.amd(0, obj.m, 0));

    requestAnimationFrame(loop);
}

loop();

function createRandomObject(){
    var x1 = Math.floor(Math.random()*canvasEl.width);
    var y1 = Math.floor(Math.random()*canvasEl.height);
    var mess1 = Math.floor(Math.random()*2000)/1000.0 + 0.1;
    var size1 = Math.floor(Math.random()*15);
    var size2 = Math.floor(Math.random()*40);
    var color1 = [0, 0, 0];
    var rndObj = new Object(x1, y1, mess1, size1, size2, color1);
    return rndObj;
}

function fadeColor(w, rgb){
    for(var i = 0; i < 3; i++){
        if(Math.random()>=0.5)
            rgb[i] += w;
        else
            rgb[i] -= w;
    }
    for(var i = 0; i < 3; i++){
        if(rgb[i]>255)
            rgb[i] = 255;
        if(rgb[i] < 0)
            rgb[i] = 0;
    }

    return rgb;
}

function arrToRGB(arr){
    return 'rgb(' + arr[0] + ',' + arr[1] + ',' + arr[2] + ')';
}

}