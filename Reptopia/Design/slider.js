/*
    slider.js
    2021.01.19
    Slider of main categories of Reptopia.
*/
/*
    1.2.4
        1 Recreated.
*/
var beforeN = 1;
var d = 0;
var margin = -25;
var leftA = 0;

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
    }
    else if(n==3){
        if(beforeN == 2){
            d = -50;
            createSlide(1, false);
            inner.removeChild(inner.children[0]);
        }
        if(beforeN == 1){
            d = +50;
            createSlide(2, true);
            inner.removeChild(inner.children[3]);
        }
    }
    beforeN = n;
    leftA -= d;
    margin += d;
    inner.setAttribute("style", 'left :' + String(leftA) + '%; margin-left :' + String(margin) + '%;');
}

function createSlide(n, left = false){ //'n'슬라이드를 left/right side에 생성
    if(n == 1){
        newEl = document.createElement("input");
        newEl.setAttribute("class", "slide slide_1");
        newEl.setAttribute("type", "button");
        newEl.setAttribute("value", "Creature");
        newEl.setAttribute("onclick", "check(1)");
        if(left) inner.insertBefore(newEl, inner.firstChild);
        else inner.appendChild(newEl);
    }
    else if(n == 2){
        newEl = document.createElement("input");
        newEl.setAttribute("class", "slide slide_2");
        newEl.setAttribute("type", "button");
        newEl.setAttribute("value", "Store");
        newEl.setAttribute("onclick", "check(2)");
        if(left) inner.insertBefore(newEl, inner.firstChild);
        else inner.appendChild(newEl);
    }
    else if(n == 3){
        newEl = document.createElement("input");
        newEl.setAttribute("class", "slide slide_3");
        newEl.setAttribute("type", "button");
        newEl.setAttribute("value", "Work");
        newEl.setAttribute("onclick", "check(3)");
        if(left) inner.insertBefore(newEl, inner.firstChild);
        else inner.appendChild(newEl);
    }
}