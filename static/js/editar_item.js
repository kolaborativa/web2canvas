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
    msg_titulo = "",
    msg_texto = "",
    msg_tipo = "";

// modificar stilo dos botoes
$.fn.editableform.buttons = 
  '<button type="submit" class="btn btn-success editable-submit"><i class="icon-ok icon-white"></i></button>' +
 '<button type="button" class="btn editable-cancel"><i class="icon-remove"></i></button>'; 

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
  url: urlNovoEdita,
  title: titulo_caixa,
  emptytext: campo_vazio,
  placement: "top",
  validate: function(value) {
      if($.trim(value) == '') {
          return mensagem_erro;
      }
  },
  success: function(response) {
      msg_titulo = "Cartão";
      if(response.success) {
        msg_texto = response.msg;
        msg_tipo = "success";
      } else if(response.error) {
        msg_texto = response.msg;
        msg_tipo = "error";
      }
      // notificacao
      $.pnotify({
        title: msg_titulo,
        text: msg_texto,
        type: msg_tipo
      });
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
  url: urlNovoEdita,
  title: titulo_nova_caixa,
  validate: function(value) {
      if($.trim(value) == '') {
          return mensagem_erro;
      }
  },
  success: function(response) {
      msg_titulo = "Cartão";
      if(response.success) {
        msg_texto = response.msg;
        msg_tipo = "success";
      } else if(response.error) {
        msg_texto = response.msg;
        msg_tipo = "error";
      }
      // notificacao
      $.pnotify({
        title: msg_titulo,
        text: msg_texto,
        type: msg_tipo
      });    
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
    var maiorIndice = Array.max(keys),
        indiceItem = maiorIndice + 1;
  } else {
    var indiceItem = 1;
  }

  // modifico a posicao da caixa de edicao nesses blocos para melhorar a visualizacao
  if(classeBotao == "estrutura_custos" || classeBotao == "parcerias_principais" ) {
    html = '<p><img src="'+urlStatic+'close.png" class="deletar_cartao campo_dinamico pull-right" /><a href="#" id="'+classeBotao+'" class="editable-click editable-empty" data-type="textarea" data-value="" data-placeholder="'+campo_vazio+'" data-pk="'+indiceItem+'" data-placement="right">'+campo_vazio+'</a></p>';
  } else { 
    html = '<p><img src="'+urlStatic+'close.png" class="deletar_cartao campo_dinamico pull-right" /><a href="#" id="'+classeBotao+'" class="editable-click editable-empty" data-type="textarea" data-value="" data-placeholder="'+campo_vazio+'" data-pk="'+indiceItem+'">'+campo_vazio+'</a></p>';
  }
  
  $("div."+classeBotao).append(html);
});


/*
=================
 MODIFICAR ITENS
=================
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

// para remover itens
function removeItem(id,indice,remove) {

  ajax(urlRemove+'?name='+id+'&pk='+indice+'', [''], 'target_ajax');
  var status = statusItem(id,indice,remove);
  if(status === true) {
    return true
  } else {
    return false
  }
}

// atualiza indices e cria o cartao movido
function atualizaIndiceItens(id,indice) {
  var values = {},
      value,
      valuesUrl;
  $("."+id).children("p").each(function(index) {
    index += 1;
    value = $(this).text();
    values[index] = value;
    $(this).children("a").attr('data-pk',index)
  });
  
  valuesUrl = jQuery.param(values);
  ajax(urlAtualiza+'?name='+id+'&'+valuesUrl, [''], 'target_ajax');
  // statusItem(id,indice,false);
}


function statusItem(id,indice,remove) {
  // o terceiro parametro diz se o elemento sera deletado no DOM
  var mensagem = $("#target_ajax").text(),
      texto = "";

  if (mensagem.length > 0) {

    if(mensagem === 'True') {
      msg_titulo = "Cartão";
      msg_texto = "Removido com Sucesso!";
      msg_tipo = "success";
      
      if(remove===true) {
        // encontro elemento a ser deletado
        $("a#"+id).each(function(){
          if($(this).attr('data-pk') == indice)
            $(this).parent().fadeOut("slow", function() { $(this).remove() })
        });
      } else if(remove===false) {
        msg_texto = "Movido com Sucesso!";
      }


    } else if(mensagem === "False") {
      msg_texto = "Erro na remoção!";
      msg_tipo = "error";
    }

    // notificacao
    $.pnotify({
      title: msg_titulo,
      text: msg_texto,
      type: msg_tipo
    });

  } else {
    console.log("aguardando resposta...")
    setTimeout('statusItem("'+id+'",'+indice+','+remove+')', 300);
  }
  // limpo o retorno da chamada ajax
  $("#target_ajax").empty();
  return true
}
