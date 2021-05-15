/*
    cage.js
    2021.01.27
    Functions for Cages.
*/
/*
    1.3.12
        1. element, data, function 구조 변경 필요.!
*/

function showCages(){
    var cages = document.getElementById("cages");
    cages.setAttribute("style", "top: 5%; height: 80%");
    
    document.getElementById("feed").setAttribute("style", "opacity: 1;");
    
    var cageList = document.getElementsByClassName("cage");
    var ctxList = [];

    for(let i=0;i<cageList.length;i++){
        cageList[i].setAttribute("style", "height: 30%;");
        let newCtx = cageList[i].getContext("2d");
        newCtx.font = '12px Arial';
        ctxList.push(newCtx);

        cageList[i].addEventListener("mouseover", function(){mouseOverCage(i)});
        cageList[i].addEventListener("mouseout", function(){mouseOutCage(i)});
        cageList[i].addEventListener("mousemove", updateCageMouseXY);
        cageList[i].addEventListener("click", function(){feedCage(i)});
    }

    for(cageN=0;cageN<ctxList.length;cageN++)
        objects.push([  new ObjectR(cageList[cageN], ctxList[cageN],
                            'wall', 0, cageList[cageN].height-30, 1, 10000,
                            cageList[cageN].width, 30, [120,80,30]),
                        randomObject('creature', cageList[cageN], ctxList[cageN], 10),
                        randomObject('creature', cageList[cageN], ctxList[cageN], 200)]);


    cageLoop();

    function cageLoop(){
        for(cageN=0;cageN<ctxList.length;cageN++){
            let canvas = cageList[cageN];
            let ctx = ctxList[cageN];
            let cageObjects = objects[cageN];

            ctx.fillStyle = arrToRGB([20, 30, 20]);
            ctx.fillRect(0,0, canvas.width, canvas.height);

            cageObjects.forEach(obj => obj.update());

            for(let i=0; i<cageObjects.length; i++){
                if(cageObjects[i].collision(cageObjects)==0) break;
                cageObjects[i].move();
            }
        }
        cageAnimations.push(requestAnimationFrame(cageLoop));
    }
}

function hideCages(){
    cageAnimations.forEach(cageAnim=>cancelAnimationFrame(cageAnim));
    cages = document.getElementById("cages");
    cages.setAttribute("style", "top: 90%; height: 0%");
    document.getElementById("arrow").setAttribute("style", "opacity: 0;");
    document.getElementById("feed").setAttribute("style", "opacity: 0;");
    cageList = document.getElementsByClassName("cage");
    for(i=0;i<cageList.length;i++){
        cageList[i].setAttribute("style", "height: 0%;");

        cageList[i].removeEventListener("mouseover", function(){mouseOverCage(i)});
        cageList[i].removeEventListener("mouseout", function(){mouseOutCage(i)});
        cageList[i].removeEventListener("mousemove", updateCageMouseXY);
        cageList[i].removeEventListener("click", function(){feedCage(i)});
    }
    feeding = false;
}

function feed(){
    feeding = true;
}

function dragCricket(){
    ctxBackground.drawImage(document.getElementById("feed2"), mx-35, my-130, 50, 50);
}

function feedCage(iCage){
    if(feeding)
        for(let c = 1; c < objects[iCage].length; c++){
            obj = objects[iCage][c];
            obj.dy -= 10;
        }
    feeding = false;
}

function mouseOverCage(i){
    out = false;
}

function mouseOutCage(i){
    out = true;
}

function updateCageMouseXY(event){
    cageMouseX = event.pageX;
    cageMouseY = event.pageY;
}