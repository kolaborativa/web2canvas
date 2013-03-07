Guidelines Web2Canvas
=======================

Aqui vai alguns requisitos e dicas de linha de desenvolvimento do **Web2Canvas**.

---------------------------------------

Bibliotecas JS
----------------

*Front-End:*

- jQuery [link](http://jquery.com/)
- jQuery UI [link](http://jqueryui.com/)
- Twitter Bootstrap [link](http://twitter.github.com/bootstrap/)
- Autocomplete for jQuery [link](http://www.devbridge.com/projects/autocomplete/jquery/)
- X-editable [link](http://github.com/vitalets/x-editable/)
- Modernizr [link](http://modernizr.com/)


	                +------------------+
	                | layout_base.html |
	                +------------------+
		                     |
	       +-----------------+---------------+----------------------+
	       |                 |               |						|
	+------------+   +-----------+   +---------------+   +---------------------+
	| index.html |   | user.html |   | projetos.html |   | projeto_canvas.html |
	+------------+   +-----------+   +---------------+   +---------------------+


	/layout_base.html
	|
	|
	+-- jQuery(1.9.0) =>  jquery-1.9.0.min.js
		Twitter Bootstrap(2.3.0) =>  bootstrap.min.js
		Modernizr(2.6.2) =>  modernizr.custom.js
				
	/index.html
	|
	|
	+-- Javascript =>  theme.js

	/user.html
	|
	|
	+-- web2py =>  web2py.js
				
	/projeto_canvas.html
	|
	|
	+-- jQuery UI(1.10) =>  jquery-ui.min.js
		X-editable(1.4.1) =>  bootstrap-editable.min.js
		Autocomplete(1.2.4) =>  jquery.autocomplete.js
		web2py =>  web2py.js
		Javascript =>  projeto_canvas.js
		Javascript =>  mover_item.js






---------------------------------------

layout_base.html
------------

*Observações importantes:*

 Existem variáveis globais para serem acessadas posteriormente dentro dos arquivos JS:

-urlStatic
-urlRemove
-urlMove
-urlJson


---------------------------------------

projeto_canvas.html
------------

*Observações importantes:*

- A DIV que comtém os cartões gerados dinamicamente possui a classe "itens" e o plugin X-editable apartir daí os gera, tendo assim exclusividade do uso da tag A(link) dentro no escopo dessa DIV.

*editar_item.js* - função statusItem(id,indice,bool) => primeiro parametro é o id do elemento no DOM, o segundo parametro é o indice dele no Bloco canvas e o terceiro parametro diz se o elemento sera deletado no DOM com "true"

*uso servidor de cache na porta 8080, por isso criei essa condicional para limpar a URL no callback do login com redes sociais.

