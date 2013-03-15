$(function() {
    var i = 0;
    var dict = {};
    $( ".drag_drop" ).sortable({
        connectWith: ".drag_drop",
        placeholder: "placeholder_item",
        delay: 100,
        opacity: 0.6,
        start: function( event, ui ) {
            ui.item.addClass( "movendo_item" );
        },
        stop: function( event, ui ) {
            ui.item.removeClass( "movendo_item" );
            var id_novo = $(ui.item).parent().parent().attr('class').split(" ")[0];
            atualizaIndiceItens(id_novo);
        },
        receive: function(event, ui) {
            var id_velho = $(ui.item).find('a.cartao').attr('id'),
                id_novo = $(this).parent().attr('class').split(" ")[0],
                indice_velho = $(ui.item).find('a.cartao').attr('data-pk');

            var statusRemove = removeItem(id_velho,indice_velho,false);
            if(statusRemove === true) {
                $(ui.item).find('a.cartao').attr('id',id_novo);
            }

            // Disable before dragdrop
            var panel = $(this),
                body = $('body');            
            $('body').css('cursor', 'wait');

            setTimeout(function () {
                body.css('cursor', 'default');
                // panel.sortable("enable");
            }, 1000); // Enable after 1000 ms.

        },
        // over: function( event, ui ) {
        // },
        // update: function(event, ui) {
        // }
    });
});