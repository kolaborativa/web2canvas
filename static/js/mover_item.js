$(function() {
    $( ".drag_drop" ).sortable({
        connectWith: ".drag_drop",
        placeholder: "placeholder_item",
        distance: 5,
        delay: 300,
        opacity: 0.6,
        start: function( event, ui ) {
            ui.item.addClass( "movendo_item" );
            // var start_pos = ui.item.index();
            // alert(start_pos);
        },
        stop: function( event, ui ) {
            ui.item.removeClass( "movendo_item" );
            // var end_pos = ui.item.index();
            // alert(end_pos);
        },
        update: function() {
        }
    }).disableSelection();
});