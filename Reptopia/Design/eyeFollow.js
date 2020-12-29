var canvasEl = document.createElement('canvas');
var ctx = canvasEl.getContext("2d");

canvasEl.width = innerWidth-50;
canvasEl.height = innerHeight-120;

document.body.appendChild(canvasEl);

canvasEl.addEventListener("pointermove", mouseMove);
canvasEl.addEventListener("pointerup", mouseMove);

eye1 = new Eye(5, "white");
circle = new Eye(105, "green");

loop();

//부드러운 구현 (dx, dy 추가해야할듯?)

function Eye(radian, color){
    this.x = canvasEl.width/2;
    this.y = canvasEl.height/2;
    this.pinX = canvasEl.width/2;
    this.pinY = canvasEl.height/2;
    this.r = radian;
    this.col = color;

    this.look = function(aimX, aimY){
        dx = (aimX-this.pinX)/(canvasEl.width/2)*100;
        dy = (aimY-this.pinY)/(canvasEl.height/2)*100;
        if(Math.sqrt(dx**2 + dy**2)<101){
            this.x = this.pinX + dx;
            this.y = this.pinY + dy;
        }
        else{
            this.x += (dx/Math.abs(dy))/5;
            this.y += 1/5;
        }
    }
    this.draw = function(){
        ctx.fillStyle = this.col;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
        ctx.fill();
    }
    this.toCenter = function(){
        this.x += (this.pinX-this.x)/150;
        this.y += (this.pinY-this.y)/150;
    }
}

function loop(){

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

    circle.draw();
    eye1.draw();

    eye1.toCenter();

    requestAnimationFrame(loop);
};

function mouseMove(event){
    eye1.look(event.pageX-9, event.pageY-90);
}

function calculateDistance(location1, location2){
    return Math.sqrt(((location1[0]-location2[0])**2 + (location1[1] - location2[1])**2));
}