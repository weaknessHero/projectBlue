/*
    cage.js
    2021.01.27
    Canvas element for cages.
*/
/*
    1.3.6
        1 cageAnimations.push(requestAnimationFrame(canvasLoop)): 애니메이션 프레임 객체를 ctxList에 push.
*/
function showCages(){
    cages = document.getElementById("cages");
    cages.setAttribute("style", "top: 5%; height: 80%");
    cageList = document.getElementsByClassName("cage");
    ctxList = [];
    for(i=0;i<cageList.length;i++){
        cageList[i].setAttribute("style", "height: 30%;");
        ctxList.push(cageList[i].getContext("2d"));
    }

    canvasLoop();
    
    function canvasLoop(){
        for(j=0;j<ctxList.length;j++){
            ctxList[j].fillStyle = 'green';
            ctxList[j].fillRect(0,0, cageList[j].width, cageList[j].height);
            if(frame%100 == 0)
                console.log(String(j) + ' is running');
        }
        
        cageAnimations.push(requestAnimationFrame(canvasLoop));
    }
}

function hideCages(){
    cages = document.getElementById("cages");
    cages.setAttribute("style", "top: 90%; height: 0%");
    document.getElementById("arrow").setAttribute("style", "opacity: 0;");
    cageList = document.getElementsByClassName("cage");
    for(i=0;i<cageList.length;i++){cageList[i].setAttribute("style", "height: 0%;");}
}