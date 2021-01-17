/*
    1.2.4 무한 슬라이더
*/
var beforeN = 1;
var dm = 0;
var margin = -25;
var leftA = 0;

function check(n){
    inner = document.getElementsByClassName("inner")[0];

    if(n==1){
        if(beforeN == 3){
            dm = -50;
            makeElement(2, false);
            inner.removeChild(inner.children[0]);
        }
        else if(beforeN == 2){
            dm = +50;
            makeElement(3, true);
            inner.removeChild(inner.children[3]);
        }
    }
    else if(n == 2){
        if(beforeN == 1){
            dm = -50;
            makeElement(3, false);
            inner.removeChild(inner.children[0]);
        }
        else if(beforeN == 3){
            dm = +50;
            makeElement(1, true);
            inner.removeChild(inner.children[3]);
        }
    }
    else if(n==3){
        if(beforeN == 2){
            dm = -50;
            makeElement(1, false);
            inner.removeChild(inner.children[0]);
        }
        if(beforeN == 1){
            dm = +50;
            makeElement(2, true);
            inner.removeChild(inner.children[3]);
        }
    }
    leftA -= dm;
    margin += dm;
    inner.setAttribute("style", 'left :' + String(leftA) + '%; margin-left :' + String(margin) + '%;');
    beforeN = n;
}
function deleteElement(left = false){
    inner = document.getElementsByClassName("inner")[0]
    if(left) inner.removeChild(inner.children[0]);
    else inner.removeChild(inner.children[4]);
}

function makeElement(n, left = false){
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