var canvasEl = document.createElement('canvas');
var ctx = canvasEl.getContext("2d");

canvasEl.width = innerWidth-50;
canvasEl.height = innerHeight-120;

document.body.appendChild(canvasEl);

canvasEl.addEventListener("pointermove", mouseMove);
canvasEl.addEventListener("pointerup", mouseMove);

var eyes = [];

frame = 0;
loop();

//부드러운 구현 (dx, dy 추가해야할듯?)

function Eye(x, y, radian1, radian2, color1, color2){
    this.x = x;
    this.y = y;
    this.pinX = this.x;
    this.pinY = this.y;

    this.dx = 0;
    this.dy = 0;

    if(radian1>radian2*3/4) this.r1 = radian2*3/4;
    else this.r1 = radian1;
    this.col1 = color1;

    this.r2 = radian2;
    this.col2 = color2;

    this.v = (this.r2 - this.r1)/1200 + 0.0001;

    this.look = function(aimX, aimY){
        this.dx = (((this.r2-this.r1)-distance([this.x, this.y], [this.pinX, this.pinY]))/(this.r2-this.r1)) * (aimX - this.x) * this.v;
        this.dy = (((this.r2-this.r1)-distance([this.x, this.y], [this.pinX, this.pinY]))/(this.r2-this.r1)) * (aimY - this.y) * this.v;

        if(this.dx > this.r2) this.dx /= 2;
        if(this.dx < -this.r2) this.dx /= 2;
        if(this.dy > this.r2) this.dy /= 2;
        if(this.dy < -this.r2) this.dy /= 2;

        this.x += this.dx;
        this.y += this.dy;
    }

    this.draw = function(){
        ctx.fillStyle = this.col2;
        ctx.beginPath();
        ctx.arc(this.pinX, this.pinY, this.r2, 0, Math.PI*2, false);
        ctx.fill();

        ctx.fillStyle = this.col1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r1, 0, Math.PI*2, false);
        ctx.fill();
    }

    this.toCenter = function(){
        this.x += (this.pinX-this.x)/200;
        this.y += (this.pinY-this.y)/200;
    }
}

function loop(){
    frame++;

    if(eyes.length<300) eyes.push(randomEye());
    if(frame%500==0) eyes.splice(0, eyes.length-1);

    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

    eyes.forEach(function(obj){obj.draw();});
    eyes.forEach(function(obj){obj.toCenter();});

    requestAnimationFrame(loop);
};

function mouseMove(event){
    eyes.forEach(function(eye){eye.look(event.pageX-9, event.pageY-90);});
}

function distance(location1, location2){
    return Math.sqrt(((location1[0]-location2[0])**2 + (location1[1] - location2[1])**2));
}

function randomEye(){
    let rndRGB1 = "rgb(" + Math.random()*255 + "," + Math.random()*255 + "," + Math.random()*255 + ")";
    let rndRGB2 = "rgb(" + Math.random()*255 + "," + Math.random()*255 + "," + Math.random()*255 + ")";
    return new Eye(Math.random()*canvasEl.width, Math.random()*canvasEl.height, Math.random()*canvasEl.height/30 + 10, Math.random()*canvasEl.height/9 + 10, rndRGB1,  rndRGB2);
}