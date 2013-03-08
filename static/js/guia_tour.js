$(document).ready(function () {
  // chamada onload do guia
  if(chama_guia === true) {
    $('#joyRideTipContent').joyride();
  }
});

/*
=================
 BOTAO DO GUIA
=================
*/
$('#guia-btn').on('click', function (e) {
  e.preventDefault();
  $('#joyRideTipContent').joyride();
});
