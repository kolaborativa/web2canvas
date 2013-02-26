/*
=====================
 MODIFICAÇÕES GERAIS
=====================
*/

// variaveis globais
// OBS: outras variaveis globais são geradas no layout_base
var titulo_caixa = "Editar Cartão",
    titulo_nova_caixa = "Novo Cartão",
    campo_vazio = "Click para escrever",
    mensagem_erro = "Não pode ser vazio!",
    mensagem_confirma = 'Você tem certeza que deseja continuar?';

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
  validate: function(value) {
      if($.trim(value) == '') {
          return mensagem_erro;
      }
  },
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
  validate: function(value) {
      if($.trim(value) == '') {
          return mensagem_erro;
      }
  },
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
    html = '<p><img src="'+urlStatic+'close.png" class="deletar_cartao campo_dinamico pull-right" /><a href="#" id="'+classeBotao+'" class="editable-click editable-empty" data-type="textarea" data-value="" data-placeholder="'+campo_vazio+'" data-pk="'+(maiorIndice + 1)+'" data-placement="right">'+campo_vazio+'</a></p>';
  } else { 
    html = '<p><img src="'+urlStatic+'close.png" class="deletar_cartao campo_dinamico pull-right" /><a href="#" id="'+classeBotao+'" class="editable-click editable-empty" data-type="textarea" data-value="" data-placeholder="'+campo_vazio+'" data-pk="'+(maiorIndice + 1)+'">'+campo_vazio+'</a></p>';
  }
  
  $("div."+classeBotao).append(html);
});


/*
===============
 REMOVER ITENS
===============
*/

// para campos carregados com a pagina
$(".deletar_cartao").click(function() {

  if(confirm(mensagem_confirma)) {
    id = $(this).next("a").attr('id');
    indice = $(this).next("a").attr('data-pk');

    removeItem(id,indice,true);
  }  
});


// para campos criados dinamicamente
$(document).on("click", ".campo_dinamico", function(){

  if(confirm(mensagem_confirma)) {
    id = $(this).next("a").attr('id');
    indice = $(this).next("a").attr('data-pk');

    removeItem(id,indice,true);
  }
});


function removeItem(id,indice,remove) {

  ajax(urlRemove+'?name='+id+'&pk='+indice+'', [''], 'target_ajax');
  statusItem(id,indice,remove);
}


function adicionaItem(id,indice,remove,texto) {

  ajax(urlAdidiona+'?name='+id+'&pk='+indice+'&value='+texto+'', [''], 'target_ajax');
  statusItem(id,indice,remove);
}


function statusItem(id,indice,remove) {
  // o terceiro parametro diz se o elemento sera deletado no DOM
  var mensagem = $("#target_ajax").text(),
      texto = "";
  // limpo o retorno da chamada ajax
  $("#target_ajax").html("");

  if (mensagem.length > 0) {
    if(mensagem === 'True') {
      texto = "Removido com Sucesso!";
      
      if(remove===true) {
        // acho o elemento para ser deletado
        $("a#"+id).each(function(){
          if($(this).attr('data-pk') == indice)
            $(this).parent().remove();
        });
      } else {
        texto = "Adicionado com Sucesso!";
      }

      $('#msg').addClass('alert-success').removeClass('alert-error').html(texto).show();
      setTimeout(removeMsg,3000);

    } else if(mensagem === "False") {
      texto = "Erro na remoção!";
      $('#msg').removeClass('alert-success').addClass('alert-error').html(texto).show();
      setTimeout(removeMsg,3000);
      
    }
  } else {
    console.log("aguardando resposta...")
    setTimeout('statusItem("'+id+'",'+indice+','+remove+')', 300);
  } 
}
