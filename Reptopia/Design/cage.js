/*
    cage.js
    2021.01.27
    Canvas element for cages.
*/
/*
    1.3.7
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
                    cageList[cageN].width,30,[30,20,0] ),
                    randomObject('creature', cageList[cageN],ctxList[cageN])
        ]);
    
    cageLoop();
    


    function cageLoop(){
        for(cageN=0;cageN<ctxList.length;cageN++){
            let canvas = cageList[cageN];
            let ctx = ctxList[cageN];
            let cageObjects = objects[cageN];

            ctx.fillStyle = 'green';
            ctx.fillRect(0,0, canvas.width, canvas.height);

            for(let i=0; i<cageObjects.length; i++){
                if(cageObjects[i].collision(cageObjects)==0) break;
                cageObjects[i].move();
                
                if(cageObjects[i].type == 'creature'){
                    ctx.fillStyle = 'white';
                    ctx.fillText('speed : ' + String(cageObjects[i].speed), 3, 12);
                }
            }
            cageObjects.forEach(obj => obj.update());
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