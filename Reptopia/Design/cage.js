/*
    cage.js
    2021.01.27
    Canvas element for cages.
*/
/*
    1.3.6
        1 cageAnimations.push(requestAnimationFrame(canvasLoop)): 애니메이션 프레임 객체를 ctxList에 push.
        2 canvasLoop 내에 object 구현.
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

    for(cageNum=0;cageNum<ctxList.length;cageNum++)
        objects.push([new Object(ctxList[cageNum], 'wall', 0, cageList[cageNum].height - 20, 1, 1000, cageList[cageNum].width, 50, [30, 20, 0]), randomObject(cageList[cageNum], ctxList[cageNum])]);
    
    canvasLoop();
    
    function canvasLoop(){
        for(cageNum=0;cageNum<ctxList.length;cageNum++){
            ctxList[cageNum].fillStyle = 'green';
            ctxList[cageNum].fillRect(0,0, cageList[cageNum].width, cageList[cageNum].height);

            if(frame%100 == 0) objects[cageNum].push(randomObject(cageList[cageNum], ctxList[cageNum]));
            objects[cageNum].forEach(obj => obj.update());
            for(let i=0; i<objects[cageNum].length; i++){
                //충돌 확인
                if(objects[cageNum][i].collision(objects[cageNum])==0) break;          //무한리커젼 탈출
                objects[cageNum][i].move();
            }

            if(frame%100 == 0)
                console.log(String(cageNum) + ' is running');
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