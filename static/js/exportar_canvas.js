$(".exportar_canvas").on("click", function(event) {
    event.preventDefault();
    document.body.style.cursor='wait';
    // escondo para gerar a imagem do canvas sem os botoes
    var tipo = $(this).data("tipo"),
        target = $('#quadro_canvas'),
        adicionarItem = $(".adicionar_item"),
        ajuda = $(".ajuda"),
        botoesCartao = $(".botoes_cartao"),
        tempElement = '<p id="poweredby" style="position: absolute;top: 160px;right: 80px;"><strong style="font-size:20px;margin-right:10px;">Projeto feito com</strong> <span id="logo">web2<span>canvas</span></span></p>';
console.log(tipo);
    adicionarItem.hide();
    ajuda.hide();
    botoesCartao.hide();
    target.append(tempElement);

    setTimeout(function () {
        html2canvas(target, {
            allowTaint: true,
            taintTest: false,
            onrendered: function(canvas) {
                var img = canvas.toDataURL();
                // store in (hidden) element of a form
                $('<form id="storeImgForm" action="' + url.exportar + '&tipo=' + tipo + '"Method="POST" name="storeImgForm"><input type="hidden" name="imgSrc" value="' + img + '"></form>').appendTo('body').submit().remove();

                document.body.style.cursor='default';
                // mostro novamente os botoes
                adicionarItem.show();
                ajuda.show();
                botoesCartao.show();
                var temp = document.getElementById('poweredby');
                temp.parentNode.removeChild(temp);
            }
        });
    }, 1000); // Enable after 500 ms.
});