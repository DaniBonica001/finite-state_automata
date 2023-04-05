$(document).ready(function() {

    changeDiv("startPage")

    $('#mealyBtn').click(function(){
        changeDiv("statesMealyMachine")
    });

    $('#mooreBtn').click(function(){
        changeDiv("statesMooreMachine")
    });

    $('.backBtn').click(function(){
        changeDiv("startPage")
    });

});

function changeDiv(target){
    $('.page').hide();
    $('.page').each(function(){
        if($(this).attr('id') == target){
            $(this).show();
        }
    })
    
}