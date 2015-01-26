var blink = function() {
    $('#errorMsg').animate({
        opacity: '0.2'
    }, function(){
        $(this).animate({
            opacity: '1'
        }, blink);
    });
}

blink();