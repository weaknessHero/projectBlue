var canvasEl = document.createElement('canvas');
var ctx = canvasEl.getContext("2d");

canvasEl.width = innerWidth-50;
canvasEl.height = innerHeight-120;

document.body.appendChild(canvasEl);

canvasEl.addEventListener("mousemove", mouseMove);
canvasEl.addEventListener("click", blinkEyes);

var eyes = [];
var mx = 0;
var my = 0;
var backgroundColor = [0,0,0];

frame = 0;
loop();

function Eye(x, y, radian1, radian2, color1, color2){
    this.x = x;
    this.y = y;
    this.pinX = this.x;
    this.pinY = this.y;

    this.dx = 0;
    this.dy = 0;

    if(radian1>radian2*3/4) this.r1 = radian2*3/4;
    else this.r1 = radian1;
    this.col1 = arrToRGB(color1);

    this.r2 = radian2;
    this.col2 = arrToRGB(color2);

    let eyelidDarkness = 2 + Math.random()*8;
    this.eyelidCol = arrToRGB([color2[0]/eyelidDarkness, color2[1]/eyelidDarkness, color2[2]/eyelidDarkness]);

    this.v = (this.r2 - this.r1)/1200 + 0.001;

    this.blinking = false;
    this.blinkTime = 0;
    this.blinkingVel = 0;

    this.look = function(aimX, aimY){
        let d = distance([this.x, this.y], [this.pinX, this.pinY]);
        this.dx = (1 - d/(this.r2-this.r1)) * (aimX - this.x) * this.v;
        this.dy = (1 - d/(this.r2-this.r1)) * (aimY - this.y) * this.v;

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

        ctx.fillStyle = this.eyelidCol;
        if(this.blinking){
            let t = frame - this.blinkTime;
            let v = this.blinkingVel;
            if(t < v) this.close(t, v);
            else if(t < 2*v) this.open(t, v);
            else if(t > 2.5*v) this.blinking = false;
        }

        this.open = function(t, v){
            //상좌
            ctx.beginPath();
            ctx.arc(this.pinX, this.pinY, this.r2, Math.PI, -Math.PI * (t-v)/v, false);
            ctx.fill();
            //상우
            ctx.beginPath();
            ctx.arc(this.pinX, this.pinY, this.r2, 0, Math.PI + Math.PI * (t-v)/v, true);
            ctx.fill();

            //하좌
            ctx.beginPath();
            ctx.arc(this.pinX, this.pinY, this.r2, Math.PI, Math.PI * (t-v)/v, true);
            ctx.fill();
            //상우
            ctx.beginPath();
            ctx.arc(this.pinX, this.pinY, this.r2, 0, Math.PI - Math.PI * (t-v)/v, false);
            ctx.fill();
        }

        this.close = function(t, v){
            //상우
            ctx.beginPath();
            ctx.arc(this.pinX, this.pinY, this.r2, 0, -Math.PI/2 - Math.PI/2 * t/v, true);
            ctx.fill();
            //상좌
            ctx.beginPath();
            ctx.arc(this.pinX, this.pinY, this.r2, Math.PI, - Math.PI/2 * (v-t)/v, false);
            ctx.fill();

            //하우
            ctx.beginPath();
            ctx.arc(this.pinX, this.pinY, this.r2, 0, Math.PI/2 + Math.PI/2 * t/v, false);
            ctx.fill();
            //하좌
            ctx.beginPath();
            ctx.arc(this.pinX, this.pinY, this.r2, -Math.PI, Math.PI/2 * (v-t)/v, true);
            ctx.fill();
        }
    }

    this.toCenter = function(){
        this.x += (this.pinX-this.x)/50;
        this.y += (this.pinY-this.y)/50;
    }

    this.blink = function(frame){
        if(!this.blinking){
            this.blinking = true;
            this.blinkTime = frame;
            this.blinkingVel = 2 + Math.random()*14;
        }
    }
}

function loop(){
    frame++;

    if(eyes.length<30) eyes.push(randomEye());

    ctx.fillStyle = arrToRGB(backgroundColor);
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

    eyes.forEach(function(eye){eye.look(mx-9, my-90);});
    eyes.forEach(function(obj){obj.draw();});
    eyes.forEach(function(obj){obj.toCenter();});

    requestAnimationFrame(loop);
};

function mouseMove(event){
    mx = event.pageX;
    my = event.pageY;
    
    backgroundColor[0] = (event.pageX-9)/(canvasEl.width)*255;
    backgroundColor[1] = (event.pageX+event.pageY-99)/(canvasEl.width)*255;
    backgroundColor[2] = (event.pageY-90)/(canvasEl.height)*255;
}

function blinkEyes(){
    eyes.forEach(function(eye){eye.blink(frame);});
}

function distance(location1, location2){
    return Math.sqrt(((location1[0]-location2[0])**2 + (location1[1] - location2[1])**2));
}

function arrToRGB(arr){
    let result = "rgb(" + arr[0] + "," + arr[1] + "," + arr[2] + ")";
    return result;
}

function randomEye(){
    let x = Math.random()*canvasEl.width;
    let y = Math.random()*canvasEl.height;
    let r1 = Math.random()*canvasEl.height/20 + 10;
    let r2 = Math.random()*canvasEl.height/6 + 10;
    let rndRGB1 = [Math.random()*100, Math.random()*100, Math.random()*100];
    let rndRGB2 = [Math.random()*100 + 155, Math.random()*100 + 155, Math.random()*100 + 155];
    return new Eye(x, y, r1, r2, rndRGB1,  rndRGB2);
}