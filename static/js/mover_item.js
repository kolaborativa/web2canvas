$(function() {
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
        },
        update: function() {}
    }).disableSelection();
});