/*
    slider.js
    2021.01.24
    Slider of main categories of Reptopia.
*/
/*
    1.3.5
        1 가운데 슬라이드 클릭 시 오작동 해결.
*/
var beforeN = 1;
var d = 0;
var margin = -25;
var leftA = 0;

window.onload = setupSlider;

function setupSlider(){
    resizeFontSize(innerWidth, innerHeight);
}

function check(n){
    inner = document.getElementsByClassName("inner")[0];
    if(n==1){
        if(beforeN == 3){
            d = -50;
            createSlide(2, false);
            inner.removeChild(inner.children[0]);
        }
        else if(beforeN == 2){
            d = +50;
            createSlide(3, true);
            inner.removeChild(inner.children[3]);
        }
        else return 0;
    }
    else if(n == 2){
        if(beforeN == 1){
            d = -50;
            createSlide(3, false);
            inner.removeChild(inner.children[0]);
        }
        else if(beforeN == 3){
            d = +50;
            createSlide(1, true);
            inner.removeChild(inner.children[3]);
        }
        else return 0;
    }
    else if(n==3){
        if(beforeN == 2){
            d = -50;
            createSlide(1, false);
            inner.removeChild(inner.children[0]);
        }
        else if(beforeN == 1){
            d = +50;
            createSlide(2, true);
            inner.removeChild(inner.children[3]);
        }
        else return 0;
    }
    beforeN = n;
    leftA -= d;
    margin += d;
    inner.setAttribute("style", 'left :' + String(leftA) + '%; margin-left :' + String(margin) + '%;');
}

function createSlide(n, left = false){ //'n'슬라이드를 left/right side에 생성
    let newEl = document.createElement("input");
    newEl.setAttribute("style", "font-size: "+ String((canvasEl.width+canvasEl.height)/30) + "px;");
    if(n == 1){
        newEl.setAttribute("class", "slide slide_1");
        newEl.setAttribute("type", "button");
        newEl.setAttribute("value", "Creature");
        newEl.setAttribute("onclick", "check(1)");
        if(left) inner.insertBefore(newEl, inner.firstChild);
        else inner.appendChild(newEl);
    }
    else if(n == 2){
        newEl.setAttribute("class", "slide slide_2");
        newEl.setAttribute("type", "button");
        newEl.setAttribute("value", "Store");
        newEl.setAttribute("onclick", "check(2)");
        if(left) inner.insertBefore(newEl, inner.firstChild);
        else inner.appendChild(newEl);
    }
    else if(n == 3){
        newEl.setAttribute("class", "slide slide_3");
        newEl.setAttribute("type", "button");6
        newEl.setAttribute("value", "Work");
        newEl.setAttribute("onclick", "check(3)");
        if(left) inner.insertBefore(newEl, inner.firstChild);
        else inner.appendChild(newEl);
    }
}

function resizeFontSize(width, height){
    inner = document.getElementsByClassName('inner')[0];
    let sliders = inner.children;
    for(let i=0; i<sliders.length; i++)
        sliders[i].setAttribute("style", "font-size: "+ String((width+height)/30) + "px;");
}