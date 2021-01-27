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
    cage = document.createElement("canvas");
    cage.id = "cage";

    cages = document.getElementById("cages");
    cages.appendChild(cage);
    cages.setAttribute("style", "top: 5%; height: 90%");
    cage.setAttribute("style", "height: 30%;");

    var newCtx = cage.getContext("2d");
    canvasLoop(cage, newCtx);

    function canvasLoop(){
        newCtx.fillStyle = 'green';
        newCtx.fillRect(0,0, cage.width, cage.height);
    
        requestAnimationFrame(canvasLoop);
    }
}