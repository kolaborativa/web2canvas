var id_usuario = '';

$('#autocomplete').autocomplete({
    lookup: usuarios,
    onSelect: function (suggestion) {
        id_usuario = suggestion.data;
        $('#adicionar_usuario').attr('href', '{{=URL(c="default", f="adicionar_usuario", vars={"projeto_id": projeto.id})}}' + '&usuario_id=' + id_usuario);
    }
});