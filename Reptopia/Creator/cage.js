/*
    cage.js
    2021.01.27
    Functions for Cages.
*/
/*
    1.3.11
        1. Speed 출력 삭제
        2. Put two creature in one cage.
*/

function showCages(){
    var cages = document.getElementById("cages");
    cages.setAttribute("style", "top: 5%; height: 80%");
    
    var cageList = document.getElementsByClassName("cage");
    var ctxList = [];

    for(i=0;i<cageList.length;i++){
        cageList[i].setAttribute("style", "height: 30%;");
        let newCtx = cageList[i].getContext("2d");
        newCtx.font = '12px Arial';
        ctxList.push(newCtx);
    }

    for(cageN=0;cageN<ctxList.length;cageN++)
        objects.push([ new ObjectR( cageList[cageN],ctxList[cageN],
                    'wall',0,cageList[cageN].height-30,1,10000,
                    cageList[cageN].width,30,[120,80,30] ),
                    randomObject('creature', cageList[cageN],ctxList[cageN], 10),
                    randomObject('creature', cageList[cageN],ctxList[cageN], 200)
                    ]);
    
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
    cageList = document.getElementsByClassName("cage");
    for(i=0;i<cageList.length;i++){cageList[i].setAttribute("style", "height: 0%;");}
}