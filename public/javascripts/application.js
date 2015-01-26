$( document ).ready(function() {
    console.log('ready');
    
    $('#delete').click(function(){
        var my_id= $("#delete").attr('data-id');
        $.ajax({
            url: '/delete?id=' + my_id,
            type: 'DELETE',
            success: function(result) {
                window.location.replace("/contacts");
            }
        });
    });
});