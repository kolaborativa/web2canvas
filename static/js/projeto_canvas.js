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
 '<button type="button" class="btn editable-cancel pull-left"><i class="icon-arrow-left"></i></button>'+
  '<button type="submit" class="btn btn-success editable-submit pull-right"><i class="icon-ok icon-white"></i></button>';
$.fn.editable.defaults.mode = 'inline';

// para saber o maior indice do array
Array.max = function( array ){
  return Math.max.apply( Math, array );
};

/*
===============================
 ITENS CARREGADOS COM A PAGINA
===============================
*/

(function ($) {
    var cartao = function (options) {
        this.init('cartao', options, cartao.defaults);
    };

    //inherit from Abstract input
    $.fn.editableutils.inherit(cartao, $.fn.editabletypes.abstractinput);

    $.extend(cartao.prototype, {   
        render: function() {
           this.$input = this.$tpl.find('textarea');
        },
        
        value2html: function(value, element) {
            if(!value) {
                $(element).empty();
                return; 
            }
            var html = $('<div>').text(value.texto).html();
            $(element).html(html); 
        },
        
        html2value: function(html) {        
          return null;  
        },
      
       value2str: function(value) {
           var str = '';
           if(value) {
               for(var k in value) {
                   str = str + k + ':' + value[k] + ';';  
               }
           }
           return str;
       }, 
       
       str2value: function(str) {
           return str;
       },                
          
       value2input: function(value) {
           cor = $(".editable-container").prev(".cartao").attr("data-color");
           html = $(".editable-container").prev(".cartao").text();
           if(html!==campo_vazio) {
             this.$input.filter('[name="texto"]').val(html);
           }
           this.$input.filter('[name="cor"]').val(cor);
       },       
           
       input2value: function() { 
           return {
              texto: this.$input.filter('[name="texto"]').val(),
              cor: this.$input.filter('[name="cor"]').val() 
           };
       },        
       
       activate: function() {
            this.$input.filter('[name="texto"]').focus();
       },  
       
       autosubmit: function() {
           this.$input.keydown(function (e) {
                if (e.which === 13) {
                    $(this).closest('form').submit();
                }
           });
       }       
    });

    cartao.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
        tpl: '<div class="editable-address"><textarea name="texto" rows="7"></textarea></div><br />'+
             '<div class="editable-address clearfix"><textarea name="cor" class="input-mini"></textarea><div class="cores_cartao" data-color="#FFFFFF" style="background-color:#FFFFFF;"></div><div class="cores_cartao" data-color="#FFFF9E" style="background-color:#FFFF9E;"></div><div class="cores_cartao" data-color="#C7FFFF" style="background-color:#C7FFFF;"></div><div class="cores_cartao" data-color="#BFFFB5" style="background-color:#BFFFB5;"></div><div class="cores_cartao" data-color="#CBBFFA" style="background-color:#CBBFFA;"></div><div class="cores_cartao" data-color="#FFA09D" style="background-color:#FFA09D;"></div><div class="cores_cartao" data-color="#E3E3E3" style="background-color:#E3E3E3;"></div></div>',
             
        inputclass: ''
    });

    $.fn.editabletypes.address = cartao;

}(window.jQuery));


$('.cartao').editable({
    url: urlNovoEdita,
    title: titulo_caixa,
    emptytext: campo_vazio,
    disabled: true,
    value: {
        texto: "",
        cor: ""
    }, // End value
    validate: function(value) {
        if(value.texto === '') return mensagem_erro; 
    }, // End validate function()
    display: function(value) {
        if(!value) {
            $(this).empty();
            return; 
        } // End if
        var html = $('<div>').text(value.texto).html();
        $(this).html(html); 
    }, // End display option
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
        $('.cartao').editable("disable");
    },
}); // End editable()


/*
=============================
 ITENSeditar_cartao GERADOS DINAMICAMENTE
=============================
*/

// chamada do plugin x-editable
$('.drag_drop').editable({
  selector: 'a',
  url: urlNovoEdita,
  title: titulo_nova_caixa,
  value: {
      texto: campo_vazio, 
      cor: ""
  },
  validate: function(value) {
      if(value.texto === '') return mensagem_erro; 
  }, // End validate function()
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
      $('.cartao').editable("disable");
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

    html = '<li><div class="card_container"><div class="row"><button class="btn deletar_cartao pull-right" alt="Deletar" title="Deletar"><i class="icon-remove"></i></button><button class="btn editar_cartao pull-right" alt="Editar" title="Editar"><i class="icon-edit"></i></button></div><a href="#" class="editable-click editable-empty cartao novo" id="'+classeBotao+'" data-type="address" data-placeholder="'+campo_vazio+'" data-pk="'+indiceItem+'" data-color="#FFFFFF">'+campo_vazio+'</a></div></li>';

    $("div."+classeBotao+" > ul").append(html);
    // abro a edição do cartao apos cria-lo
    setTimeout(function () {
       $("a#"+classeBotao+":last").trigger('click');
    }, 100);
    // faz scroll ate o elemento
    $('html,body').animate({ scrollTop: $("a#"+classeBotao+":last").offset().top - (200) }, 1500);
});


/*
=================
 MODIFICAR ITENS
=================
*/

// chamada para editar cartao
// para campos criados dinamicamente chamo assim

// libera para editar cartao
$(document).on("click", ".editar_cartao", function(){
    var cartao = $(this).parent().next(".cartao");
    cartao.editable("enable");

    setTimeout(function(cartao){
        cartao.trigger('click');
    }, 100, cartao);
});

// testa se a edicao no cartao foi cancelada
$('.cartao').on('hidden', function(e, reason) {
    if(reason === 'onblur' || reason === 'cancel') {
        var cor = $(this).attr('data-color');
        $(this).closest(".card_container").css("background-color",'"'+cor+'"');
        $('.cartao').editable("disable");
    } 
});

// escolhe a cor do cartao
$(document).on("click", ".cores_cartao", function(){
    var cor = $(this).attr('data-color');
    $(this).closest(".card_container").css("background-color",'"'+cor+'"');
    $(this).parent().find('.input-mini').val(cor);
});

// deletar_cartao
$(document).on("click", ".deletar_cartao", function(){

  if(confirm(mensagem_confirma)) {
    id = $(this).parent().parent().find('.cartao').attr('id');
    indice = $(this).parent().parent().find('.cartao').attr('data-pk');

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
function atualizaIndiceItens(id) {
  var allValues = {},
      valuesUrl = "",
      texto = "",
      cor = "";

  $("."+id).children("ul").find('.cartao').each(function(index) {
    
    if(texto !== campo_vazio) {
      index += 1;
      texto = $(this).text();
      cor = $(this).attr("data-color");

      allValues[index] = jQuery.param({"value[texto]": texto, "value[cor]": cor});

      $(this).children("a").attr('data-pk',index)
      $(this).children("a").attr('data-color',cor)
    }
  });
  valuesUrl = jQuery.param(allValues);
  ajax(urlAtualiza+'?name='+id+'&'+valuesUrl, [''], 'target_ajax');
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
            $(this).parent().parent().fadeOut("slow", function() { $(this).remove() })
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
