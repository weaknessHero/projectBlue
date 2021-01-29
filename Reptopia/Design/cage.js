/*
    cage.js
    2021.01.27
    Canvas element for cages.
*/
/*
    1.3.5
        1 created.
*/
function showCages(){
    cages = document.getElementById("cages");
    cages.setAttribute("style", "top: 5%; height: 80%");
    cageList = document.getElementsByClassName("cage");
    ctxs = [];
    for(i=0;i<cageList.length;i++){
        cageList[i].setAttribute("style", "height: 30%;");
        ctxs.push(cageList[i].getContext("2d"));
    }
    canvasLoop();
    
    function canvasLoop(){
        for(j=0;j<ctxs.length;j++){
            ctxs[j].fillStyle = 'green';
            ctxs[j].fillRect(0,0, cageList[j].width, cageList[j].height);
        }
    
        requestAnimationFrame(canvasLoop);
    }
}

function hideCages(){
    cages = document.getElementById("cages");
    cages.setAttribute("style", "top: 90%; height: 0%");
    document.getElementById("arrow").setAttribute("style", "opacity: 0;");
    cageList = document.getElementsByClassName("cage");
    for(i=0;i<cageList.length;i++){cageList[i].setAttribute("style", "height: 0%;");}
}