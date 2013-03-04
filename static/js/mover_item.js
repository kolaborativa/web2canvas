$(function() {
    var i = 0;
    var dict = {};
    $( ".drag_drop" ).sortable({
        connectWith: ".drag_drop",
        placeholder: "placeholder_item",
        distance: 5,
        delay: 300,
        opacity: 0.6,
        start: function( event, ui ) {
            ui.item.addClass( "movendo_item" );
        },
        stop: function( event, ui ) {
            ui.item.removeClass( "movendo_item" );
            var id_novo = $(ui.item).children("a").attr('id'),
                indice_novo = $(ui.item).index();

            atualizaIndiceItens(id_novo,indice_novo)
        },
        over: function( event, ui ) {
            calculaTamanhoCartoes();
        },
        receive: function(event, ui) {
            var id_velho = $(ui.item).children("a").attr('id'),
                id_novo = $(this).attr('class').split(" ")[0],
                indice_velho = $(ui.item).children("a").attr('data-pk'),
                indice_novo = $(ui.item).index();

            var statusRemove = removeItem(id_velho,indice_velho,false);
            if(statusRemove === true) {
                $(ui.item).children("a").attr('id',id_novo)
            }

            // Disable before dragdrop
            var panel = $(this),
                body = $('body');            
            // $(this).sortable("disable");
            $('body').css('cursor', 'wait');

            setTimeout(function () {
                body.css('cursor', 'default');
                // panel.sortable("enable");
            }, 1000); // Enable after 1000 ms.

        },
        update: function(event, ui) {
        }
    }).disableSelection();
});