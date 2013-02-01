//init editables
function removeMsg(){
  $('#msg').hide('slow');
}

$('.campo_editavel').editable({
  type: 'text',
  // pk: 1,
  url: urlJson,
  title: 'Enter username',
  emptytext: "Click para escrever",
  placement: "top",
  success: function(response) {
      if(response.success) {
        $('#msg').addClass('alert-success').removeClass('alert-error').html(response.msg).show();
        setTimeout(removeMsg,3000)
      } else if(response.error) {
        $('#msg').removeClass('alert-success').addClass('alert-error').html(response.msg).show();
        setTimeout(removeMsg,3000)
      }
  }
});

//make username required
$('.campo_editavel').editable('option', 'validate', function(v) {
    if(v == '') return 'Não pode ser vazio!';
});

// $(".cell-container").mouseover(function() {
//   $('button').show();
//   }).mouseout(function(){
//   $('button').hide();
// });


$(".cell-container").mouseout(function(){
  // $("button:first",this).show();
  $("button:first",this).hide();
}).mouseover(function(){
  $("button:first",this).show();
  // $("button:first",this).hide();
});