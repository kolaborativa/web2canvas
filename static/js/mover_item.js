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
            // var id = $(ui.item).children("a").attr('id');
            //     pk = $(ui.item).children("a").attr('data-pk'),
            //     indice = ui.item.index();
            // removeItem(id,pk,false);
            // console.log(id);
        },
        stop: function( event, ui ) {
            ui.item.removeClass( "movendo_item" );
        },
        receive: function(event, ui) {
            var id_velho = $(ui.item).children("a").attr('id'),
                id_novo = $(this).attr('class').split(" ")[0],
                indice_velho = $(ui.item).children("a").attr('data-pk'),
                value = $(ui.item).children("a").text(),
                indice_novo = $(ui.item).index();
                // indice_novo = $(this).index();
            console.log(indice_velho);

            var statusRemove = removeItem(id_velho,indice_velho,false);
            // alert(statusRemove)
            if(statusRemove === true) {
                $(ui.item).children("a").attr('id',id_novo)
                adicionaItem(id_novo,indice_velho,false,value);
            }            

            // adicionaItem(id,pk,false);
        },
        update: function(event, ui) {
            // var id = $(ui.item).parent().attr('class').split(" ")[0],
            //     pk = $(ui.item).children("a").attr('data-pk'),
            //     value = $(ui.item).children("a").text(),
            // var id = $(this).attr('class').split(" ")[0],
            //     pk = $(ui.item).children("a").attr('data-pk'),
            //     value = $(ui.item).children("a").text(),
            //     indice = ui.item.index();
            

            // i += 1;
            // dict["id"+i] = id;

            // if(dict["id2"] === undefined){
            //     // pass
            // } else if(dict["id2"] === dict["id1"]){
            //     // pass
            // } else {
            //     removeItem(dict["id1"],pk,false);
            //     adicionaItem(dict["id2"],pk,false,value);           
            // }

            // if(dict["id2"] != dict["id1"] && dict["id2"] != undefined){
            //     var statusRemove = removeItem(dict["id1"],pk,false);
            //     // alert(statusRemove)
            //     if(statusRemove === true) {
            //         $(ui.item).children("a").attr('id',dict["id2"])
            //         var statusAdiciona = adicionaItem(dict["id2"],pk,false,value);
            //     }
            // }
        }
    }).disableSelection();
});