/*
    cage.js
    2021.01.27
    Functions for Cages.
*/
/*
    1.3.12
        1. element, data, function 구조 변경 필요.!
*/

function cageLoop(cageNumber){
    var canvas = cageList[cageNumber];
    var ctx = cageCtxList[cageNumber];
    var cageObjects = objects[cageNumber];

    ctx.fillStyle = arrToRGB([20, 30, 20]);
    ctx.fillRect(0,0, canvas.width, canvas.height);

    cageObjects.forEach(obj => obj.update());

    for(let i=0; i<cageObjects.length; i++){
        if(cageObjects[i].collision(cageObjects)==0) break;
        cageObjects[i].move();
    }
    cageAnimations[cageNumber] = requestAnimationFrame(function(){cageLoop(cageNumber)});
}

function showCages(){
    pageState = "cages";
    var cages = document.getElementById("cages");
    cages.setAttribute("style", "top: 5%; height: 80%");
    

    for(let i=0;i<cageList.length;i++){
        cageList[i].setAttribute("style", "height: 30%;");

        cageList[i].addEventListener("click", function(){showCageInfo(i)});
        cageLoop(i);
    }
}

function hideCages(){
    cages = document.getElementById("cages");
    cages.setAttribute("style", "top: 90%; height: 0%");
    document.getElementById("arrow").setAttribute("style", "opacity: 0;");
    for(hi=0;hi<cageList.length;hi++){
        hideCage(hi);
    }
}

function hideCage(ic){
    cancelAnimationFrame(cageAnimations[ic]);
    cageList[ic].setAttribute("style", "height: 0%;");
    cageList[ic].removeEventListener("click", function(){showCageInfo(ic)});
}

function showCageInfo(si){
    if(pageState == "cages"){
        pageState = "cageInfo";
        cageList = document.getElementsByClassName("cage");
        for(let cageL = 0; cageL < cageList.length; cageL++){
            if(si!=cageL) hideCage(cageL);
            else cageList[cageL].setAttribute("style", "width: 100%; height: 80%;");
        }
    } else if(pageState=="cageInfo"){
        pageState = "cages";
        hideCage(si);
        showCages();
    }
}