$(function() {
    $( ".drag_drop" ).sortable({
        connectWith: ".drag_drop",
        placeholder: "mover_item",
        distance: 5,
        delay: 300,
        opacity: 0.6,
        update: function() {}
    }).disableSelection();
    // $('.canvas-cell').sortable({ cancel: 'button' });
});