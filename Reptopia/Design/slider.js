function check(n){
    checkedEl = document.getElementsByName("slider");
    checkedEl.forEach(element => {element.toggleAttribute("checked", false);});
    checkingEl = document.getElementById("slide"+String(n));
    checkingEl.toggleAttribute("checked", true);
}