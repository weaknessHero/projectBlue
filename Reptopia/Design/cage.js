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

    for(cageN=0;cageN<ctxList.length;cageN++)
        objects.push([
            new ObjectR(cageList[cageN], ctxList[cageN], 'wall', 0, cageList[cageN].height - 30, 1, 10000,
            cageList[cageN].width, 30, [30, 20, 0]),
            
            randomCreautre(cageList[cageN], ctxList[cageN])
        ]);
    
    cageLoop();
    
    function cageLoop(){//케이지 루프
        for(cageN=0;cageN<ctxList.length;cageN++){
            ctxList[cageN].fillStyle = 'green';
            ctxList[cageN].fillRect(0,0, cageList[cageN].width, cageList[cageN].height);

            if(frame%10 == 0) objects[cageN][1].setMovingCase(); //랜덤 움직임 설정

            for(let i=0; i<objects[cageN].length; i++){
                if(objects[cageN][i].collision(objects[cageN])==0) break;
                objects[cageN][i].move();
            }

            objects[cageN].forEach(obj => obj.update());
        }
        
        cageAnimations.push(requestAnimationFrame(cageLoop));
    }
}

function hideCages(){
    cages = document.getElementById("cages");
    cages.setAttribute("style", "top: 90%; height: 0%");
    document.getElementById("arrow").setAttribute("style", "opacity: 0;");
    cageList = document.getElementsByClassName("cage");
    for(i=0;i<cageList.length;i++){cageList[i].setAttribute("style", "height: 0%;");}
}