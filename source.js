/**
 * Created by maheshpo on 2/4/2016.
 */

    var box_min_width = 60;
    var box_max_width = 120;
    var ele_wid  ;

    var reff_arr = [];
    var counters = [];
    var step_count = 0 ;

var dum_x ;
var dum_y ;

    function element(value){
        this.value = value ;
        //this.state = 0 ;
    }

    var checkIfEvenAndPositive = function(prod_number){
    if(isNaN(prod_number)){
        return false ;
    }
    if(prod_number > 1 &&(prod_number%2) == 0){
        return true;
    }
    return false;
}

var setTheGame = function(x,y){
    var product = x*y ;

    if(dum_x && dum_y ){

        document.getElementsByClassName('input_number')[0].value = dum_x ;
        document.getElementsByClassName('input_number')[1].value = dum_y ;

    }else{
        reff_arr = [];
        step_count = 0 ;

        for(var i = 1 ; i <= product/2 ; i++ ){
            reff_arr.push(new element(i));
            reff_arr.push(new element(i));
        }

        reff_arr = shuffle(reff_arr);
    }



    cleanUpTable();
    displayElementsInPage(x);

    if(counters && counters.length == 1){
        getAlertBox().innerHTML = 'Choose 1 more tile' ;
    }
    console.log("Game is now set");

}

var cleanUpTable = function(){
    var myNode = document.getElementById("main_area");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}

var displayElementsInPage = function(row_length){

    var row_node;
    for(var currentIndex = 0 ; currentIndex <  reff_arr.length ; currentIndex++){
        if(currentIndex % row_length == 0){
            row_node = document.createElement("TR");
            document.getElementById("main_area").appendChild(row_node);
        }else{
            row_node = document.getElementById("main_area").lastChild ;
        }

        var node = document.createElement("TH");
        node.id = (""+currentIndex) ;
        node.innerHTML = createNewElement() ;

        if(dum_x && dum_y ){
            var obj = reff_arr[currentIndex];
            var el = node.getElementsByTagName('div')[0] ;
            if(obj.exposed || currentIndex == counters[0]){
                do_reverse(el,obj);
            }
            if(obj.exposed){
                putBorderColor(el,2,'green');
            }
            if(currentIndex == counters[0]){
                getAlertBox().innerHTML = 'Choose 1 more tile' ;
            }
        }

        row_node.appendChild(node);

    }

}

var playFunc = function(){
    var x = document.getElementsByClassName('input_number')[0].value ;
    var y = document.getElementsByClassName('input_number')[1].value ;

    if(dum_x && dum_y){
        x = dum_x;
        y = dum_y;
    }else{
        if(checkIfEvenAndPositive(x*y)){
            console.log('good to go');
        }else{
            alert('Input should be a positive and non-zero number & one of the numbers should be even');
            return;
        }
        if(reff_arr.length > 0 ){
            if(confirm('Are you sure you wish to reset?')){
                resetFunc();
            }else{
                return;
            }
        }
    }

    localStorage.setItem("x", x);
    localStorage.setItem("y", y);
    setTheGame(x,y);
    check_screen_width(x);
    if(dum_x && dum_y){
        if(!getAlertBox().innerHTML){
            getAlertBox().innerHTML = 'Choose 2 tiles' ;
        }
    }else{
        getAlertBox().innerHTML = 'Choose 2 tiles' ;
    }

    dum_x = null;
    dum_y = null;

    saveToLocalStorage();

}

var resetFunc = function(){

        console.log('Game has been reseted');
        //document.getElementsByClassName('input_number')[0].value = 4 ;
        //document.getElementsByClassName('input_number')[1].value = 4 ;

        reff_arr = [];
        counters = [];
        step_count = 0 ;
        cleanUpTable();
    localStorage.clear();

}

var createNewElement = function(){

    return document.getElementById('hidden-template').childNodes[0].data;
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

var elementClicked = function(element) {

    var id = parseInt(element.parentNode.id);
    var obj = reff_arr[id];
    if(obj.exposed){
        return;
    }
    if (counters.length < 2) {
        if(counters.length == 1 && counters[0] == id ){
            return;
        }else{
            getAlertBox().innerHTML = 'Choose 1 more tile' ;
        }
        counters.push(id);
    } else {
        return;
    }

    step_count++;
    do_reverse(element,obj);

    if (counters.length == 2) {
        validateResult();
    }
    saveToLocalStorage();
}

var do_reverse = function(element,obj) {
    var childArr = element.getElementsByTagName('div');
    if(childArr.length != 2){
        alert('something is wrong');
    }else{
        if(childArr[0].style.display == 'none'){
            childArr[0].style.display = 'block';
        }else{
            childArr[0].style.display = 'none';
        }

        if(childArr[1].style.display == 'none'){
            childArr[1].style.display = 'block';
            if(obj) {
                childArr[1].innerHTML = obj.value;
            }
        }else{
            childArr[1].style.display = 'none';
            childArr[1].innerHTML = "";
        }

    }

}

var validateResult = function(){
    var th_node1 = document.getElementById(""+counters[0]);
    var th_node2 = document.getElementById(""+counters[1]);
    var el1 = th_node1.getElementsByTagName('div')[0] ;
    var el2= th_node2.getElementsByTagName('div')[0] ;
    if(reff_arr[counters[0]].value == reff_arr[counters[1]].value ){
        console.log("Success");
        getAlertBox().innerHTML = 'The tiles match! Choose 2 More tiles' ;
        reff_arr[counters[0]].exposed = true ;
        reff_arr[counters[1]].exposed = true ;
        counters = [];

        putBorderColor(el1,2,'green');
        putBorderColor(el2,2,'green');
    }else{
        console.log("Fail");
        getAlertBox().innerHTML = 'The tiles do not match!' ;

        putBorderColor(el1,2,'red');
        putBorderColor(el2,2,'red');
        setTimeout(function(){
            do_reverse(el1);
            do_reverse(el2);
            counters = [];
            putBorderColor(el1,0,'white');
            putBorderColor(el2,0,'white');
            getAlertBox().innerHTML = 'Choose 2 tiles' ;
            saveToLocalStorage();
        },1000);
    }

    if(checkIfGameIsOver()){
        var el = getAlertBox() ;
        el.innerHTML = 'You finished the game in '+step_count+' clicks!<br> Click on Play to start again' ;
        el.style.color = 'green';
        el.style.fontWeight = 'bold';
        el.style.bottom = '50%';
        el.style.backgroundColor = 'lightcyan';
        reff_arr = [];
    }
}

var checkIfGameIsOver = function(){
    if(reff_arr && reff_arr.length > 0){
        for(var x in reff_arr){
            if(!reff_arr[x].exposed){
                return false;
            }
        }
        return true;
    }else{
        return false;
    }
}

var putBorderColor = function(el,size,color){
    if(color){
        el.style.border = size+"px solid "+color ;
    }
}

var getAlertBox = function(){
    var el = document.getElementById("alert_box")
    el.style.color = 'black';
    el.style.fontWeight = 'normal';
    el.style.bottom = 0;
    el.style.backgroundColor = 'white';
    return el ;
}

var saveToLocalStorage = function(){
    localStorage.setItem("reff_arr", JSON.stringify(reff_arr));
    localStorage.setItem("counters", JSON.stringify(counters));
    localStorage.setItem("step_count", step_count);
}

var check_screen_width = function(x){
    var screen_width = screen.width - 30;
    var num = (screen_width/x)-42 ;

    if(num > box_max_width){
        num = box_max_width ;
    }

    if(num <= box_min_width){
        num = box_min_width ;
    }


    ele_wid = num ;

    var cols =     document.getElementsByClassName('element_class');
    for(i=0; i<cols.length; i++) {
        cols[i].style.width =    ele_wid+'px';
        cols[i].style.height =    ele_wid+'px';
    }

    cols =     document.getElementsByClassName('num_div');
    for(i=0; i<cols.length; i++) {
        cols[i].style.fontSize =    (ele_wid/2)+'px';
        cols[i].style.lineHeight =    ele_wid+'px';
    }
}

if(localStorage.getItem("reff_arr") && localStorage.getItem("counters") && localStorage.getItem("step_count") && localStorage.getItem("x") && localStorage.getItem("y") ){
    reff_arr = JSON.parse(localStorage.getItem("reff_arr"));
    if(reff_arr && Array.isArray(reff_arr) && reff_arr.length > 0){
        counters = JSON.parse(localStorage.getItem("counters"));
        step_count = parseInt(localStorage.getItem("step_count"));
        dum_x = parseInt(localStorage.getItem("x")) ;
        dum_y = parseInt(localStorage.getItem("y")) ;
    }
    //localStorage.clear();
}
playFunc();
