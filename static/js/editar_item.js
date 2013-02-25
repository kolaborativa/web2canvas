/*
=====================
 MODIFICAÇÕES GERAIS
=====================
*/

// variaveis globais
// OBS: outras variaveis globais são geradas no layout_base
var titulo_caixa = "Editar Cartão",
    titulo_nova_caixa = "Novo Cartão",
    campo_vazio = "Click para escrever";

// modificar stilo dos botoes
$.fn.editableform.buttons = 
  '<button type="submit" class="btn btn-success editable-submit"><i class="icon-ok icon-white"></i></button>' +
 '<button type="button" class="btn editable-cancel"><i class="icon-remove"></i></button>'; 

// esconde mensagem
function removeMsg(){
  $('#msg').hide('slow');
}

// para saber o maior indice do array
Array.max = function( array ){
return Math.max.apply( Math, array );
};


/*
===============================
 ITENS CARREGADOS COM A PAGINA
===============================
*/

// chamada do plugin x-editable
$('.item_existente').editable({
  type: 'textarea',
  url: urlJson,
  title: titulo_caixa,
  emptytext: campo_vazio,
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

// fazer com que o campo seja required
$('.item_existente').editable('option', 'validate', function(v) {
    if(v == '') return 'Não pode ser vazio!';
});


/*
=============================
 ITENS GERADOS DINAMICAMENTE
=============================
*/

// chamada do plugin x-editable
$('.itens').editable({
  selector: 'a',
  url: urlJson,
  title: titulo_nova_caixa,
  success: function(response) {
      if(response.success) {
        $('#msg').addClass('alert-success').removeClass('alert-error').html(response.msg).show();
        setTimeout(removeMsg,3000);
      } else if(response.error) {
        $('#msg').removeClass('alert-success').addClass('alert-error').html(response.msg).show();
        setTimeout(removeMsg,3000);
      }
  }
});

// ao clicar no botao de adicionar novo item
$('.adicionar_item').click(function(){

  var todasClassesBotao = $(this).attr('class'),
      classeBotao = todasClassesBotao.split(" ")[0],
      keys = [],
      html;
  
  $("a#"+classeBotao).each(function() {
    keys.push(parseInt($(this).attr('data-pk')));
  });

  if(keys.length > 0) {
    var maiorIndice = Array.max(keys);
  } else {
    var maiorIndice = 0;
  }

  // modifico a posicao da caixa de edicao nesses blocos para melhorar a visualizacao
  if(classeBotao == "estrutura_custos" || classeBotao == "parcerias_principais" ) {
    html = '<p><img src="'+urlStatic+'clear.png" class="deletar-cartao pull-right" onclick=\'removeItem("'+classeBotao+'",'+(maiorIndice + 1)+')\'/><a href="#" id="'+classeBotao+'" class="campo_dinamico editable-click editable-empty" data-type="textarea" data-value="" data-placeholder="'+campo_vazio+'" data-pk="'+(maiorIndice + 1)+'" data-placement="right">'+campo_vazio+'</a></p>';
  } else { 
    html = '<p><img src="'+urlStatic+'clear.png" class="deletar-cartao pull-right" onclick=\'removeItem("'+classeBotao+'",'+(maiorIndice + 1)+')\'/><a href="#" id="'+classeBotao+'" class="campo_dinamico editable-click editable-empty" data-type="textarea" data-value="" data-placeholder="'+campo_vazio+'" data-pk="'+(maiorIndice + 1)+'">'+campo_vazio+'</a></p>';
  }
  
  $("div."+classeBotao).append(html);
});


/*
===============
 REMOVER ITENS
===============
*/
function removeItem(item,id) {

  var confirma = confirm('Você tem certeza que deseja continuar?');
  if(confirma) {
    ajax(urlRemove+'?name='+item+'&pk='+id+'', [''], 'target-deleted');

    statusRemoveItem(item,id);
  }
}

function statusRemoveItem(item,id) {
  var mensagem = $("#target-deleted").text(),
      texto = "";
  // limpo o retorno da chamada ajax
  $("#target-deleted").html("");

  if (mensagem.length > 0) {
    if(mensagem === 'True') {
      texto = "Removido com Sucesso!";
      $('#msg').addClass('alert-success').removeClass('alert-error').html(texto).show();
      setTimeout(removeMsg,3000);
      
      // acho o elemento para ser deletado
      $("a#"+item).each(function(){
        if($(this).attr('data-pk') == id)
          $(this).parent().remove();
      });

    } else if(mensagem === "False") {
      texto = "Erro na remoção!";
      $('#msg').removeClass('alert-success').addClass('alert-error').html(texto).show();
      setTimeout(removeMsg,3000);
      
    }
  } else {
    console.log("aguardando resposta...")
    setTimeout('statusRemoveItem("'+item+'",'+id+')', 300);
  } 
}
