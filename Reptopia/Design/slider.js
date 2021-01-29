/*
    slider.js
    2021.01.24
    Slider of main categories of Reptopia.
*/
/*
    1.3.5
        1 가운데 슬라이드 클릭 시 오작동 해결.
        2 check(n), createSlide(n, left): 중복 코드 축약.
        3 hideSlides(), showCreatures(), openStore(), showWorkplace(): Created.
*/
var beforeN = 1;
var d = 0;
var margin = -25;
var leftA = 0;
var inner = document.getElementsByClassName("inner")[0];

window.onload = setupSlider;

function setupSlider(){
    resizeFontSize(innerWidth, innerHeight);
}

function check(n){
    inner = document.getElementsByClassName("inner")[0];
    if(beforeN == n-1 | beforeN == n+2){
        d = -50;
        let Nslide = n+1;
        if(Nslide == 4) Nslide = 1;
        createSlide(Nslide, false);
        inner.removeChild(inner.children[0]);
    }
    else if(beforeN == n+1 | beforeN == n-2){
        d = +50;
        let Nslide = n-1;
        if(Nslide == 0) Nslide = 3;
        createSlide(Nslide, true);
        inner.removeChild(inner.children[3]);
    }
    else {
        hideSlides();
        if(n==1) showCages();
        else if(n==2) openStore();
        else if(n==3) showWorkplace();
        return 0;
    }
    beforeN = n;
    leftA -= d;
    margin += d;
    inner.setAttribute("style", 'left :' + String(leftA) + '%; margin-left :' + String(margin) + '%;');
}

function createSlide(n, left = false){ //'n'슬라이드를 left/right side에 생성
    let newEl = document.createElement("input");
    let newElAttributes = {"class":"", "type":"", "value":"", "onclick":""};
    
    if(n==1) newElAttributes = {"class":"slide slide_1", "value":"Creature", "onclick":"check(1)"};
    else if(n==2) newElAttributes = {"class":"slide slide_2", "value":"Store", "onclick":"check(2)"};
    else if(n==3) newElAttributes = {"class":"slide slide_3", "value":"Work", "onclick":"check(3)"};
    
    newEl.setAttribute("style", "font-size: "+ String((canvasEl.width+canvasEl.height)/30) + "px;");
    newEl.setAttribute("type", "button");
    newEl.setAttribute("class", newElAttributes["class"]);
    newEl.setAttribute("value", newElAttributes["value"]);
    newEl.setAttribute("onclick", newElAttributes["onclick"]);

    if(left) inner.insertBefore(newEl, inner.firstChild);
    else inner.appendChild(newEl);
}

function resizeFontSize(width, height){
    inner = document.getElementsByClassName('inner')[0];
    let sliders = inner.children;
    for(let i=0; i<sliders.length; i++)
        sliders[i].setAttribute("style", "font-size: "+ String((width+height)/32) + "px;");
}

function hideSlides(){
    let slides = document.getElementById("slides");
    slides.setAttribute("style", 'top: -15%');
    document.getElementById("arrow").setAttribute("style", "opacity: 1;");
}

function showSlides(){
    hideCages();
    let slides = document.getElementById("slides");
    slides.setAttribute("style", 'top: 40%');
}

function openStore(){

}

function showWorkplace(){

}