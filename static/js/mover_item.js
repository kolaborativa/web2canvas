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
            // var id = $(ui.item).children("a").attr('id'),
            //     pk = $(ui.item).children("a").attr('data-pk'),
            //     indice = ui.item.index();
            // removeItem(id,pk,false);
        },
        stop: function( event, ui ) {
            ui.item.removeClass( "movendo_item" );
        },
        receive: function(event, ui) {
            // var id = $(this).attr('class').split(" ")[0];
            //     pk = $(this).children("a").attr('data-pk');
            //     var indice = ui.item.tmplItem().data;
            // console.log(id);
            // pk += 1
            // adicionaItem(id,pk,false);
        },
        update: function(event, ui) {
            // var id = $(ui.item).parent().attr('class').split(" ")[0],
            //     pk = $(ui.item).children("a").attr('data-pk'),
            //     value = $(ui.item).children("a").text(),
            //     indice = ui.item.index();
            var id = $(this).attr('class').split(" ")[0],
                pk = $(ui.item).children("a").attr('data-pk'),
                value = $(ui.item).children("a").text();

            i += 1;
            dict["id"+i] = id;

            if(dict["id2"] === undefined){
                // pass
            } else {
                removeItem(dict["id1"],pk,false);
                adicionaItem(dict["id2"],pk,false,value);           
            }
        }
    }).disableSelection();
});