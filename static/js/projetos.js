$(document).ready(function () {
	$('#projeto_thumbnail').awesomeCropper(
		{ width: 200, height: 200 }
	);
});
$(".btn_file").on('click', function() {
   $('.input_file').click();
});

/*
=====================
 EXCLUIR PROJETO
=====================
*/

$(".excluir_projeto").click(function() {
  var mensagem_confirma = 'Tem certeza que deseja excluir esse projeto?';
  if(confirm(mensagem_confirma)) {
    var id_projeto = this.id;
    var url = urlExcluiProjeto+id_projeto;
    window.location=url;
  }  
});
