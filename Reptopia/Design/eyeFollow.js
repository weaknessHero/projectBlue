var canvasEl = document.createElement('canvas');
var ctx = canvasEl.getContext("2d");

canvasEl.width = innerWidth-50;
canvasEl.height = innerHeight-120;

document.body.appendChild(canvasEl);

canvasEl.addEventListener("pointermove", mouseMove);
canvasEl.addEventListener("pointerup", mouseMove);

eye1 = new Eye(5, 50, "black", "white");

loop();

//부드러운 구현 (dx, dy 추가해야할듯?)

function Eye(radian1, radian2, color1, color2){
    this.x = canvasEl.width/2;
    this.y = canvasEl.height/2;
    this.pinX = this.x;
    this.pinY = this.y;

    this.dx = 0;
    this.dy = 0;

    this.r1 = radian1;
    this.col1 = color1;

    this.r2 = radian2;
    this.col2 = color2;

    this.v = this.r2/2000;

    this.look = function(aimX, aimY){
        this.dx = (((this.r2-this.r1)-distance([this.x, this.y], [this.pinX, this.pinY]))/(this.r2-this.r1)) * (aimX - this.x) * this.v;
        this.dy = (((this.r2-this.r1)-distance([this.x, this.y], [this.pinX, this.pinY]))/(this.r2-this.r1)) * (aimY - this.y) * this.v;

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
        this.x += (this.pinX-this.x)/300;
        this.y += (this.pinY-this.y)/300;
    }
}

function loop(){

    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

    eye1.draw();
    eye1.toCenter();

    requestAnimationFrame(loop);
};

function mouseMove(event){
    eye1.look(event.pageX-9, event.pageY-90);
}

function distance(location1, location2){
    return Math.sqrt(((location1[0]-location2[0])**2 + (location1[1] - location2[1])**2));
}