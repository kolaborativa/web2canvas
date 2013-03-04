# -*- coding: utf-8 -*-
# this file is released under public domain and you can use without limitations

#########################################################################
## This is a samples controller
## - index is the default action of any application
## - user is required for authentication and authorization
## - download is for downloading files uploaded in the db (does streaming)
## - call exposes all registered services (none by default)
#########################################################################

def index():
    """Home page
    """
    return dict()


def modelo_canvas():
    """Pagina sobre o canvas
    """
    return dict()


@auth.requires_login()
def projetos():
    """Pagina com opcao de criar projetos
    """
    from datetime import datetime
    pessoa = db((Pessoa.usuario1==auth.user.id) | (Pessoa.usuario2==auth.user.id)).select().first()
    meus_projetos = db(Projeto.criado_por==pessoa.id).select()
    projetos_colaborador = db(Compartilhamento.pessoa_id==pessoa.id).select()

    form = SQLFORM(Projeto, fields=['nome'], submit_button="Criar")

    if form.process().accepted:
        db(Projeto.id==form.vars.id).update(criado_por=pessoa.id, criado_em=datetime.now())
        redirect(URL('projetos'))

    return dict(form=form, meus_projetos=meus_projetos, projetos_colaborador=projetos_colaborador)


@auth.requires_login()
def excluir_projeto():
    """Funcao que exclui um projeto. Somente quem criou o projeto pode
    exclui-lo
    """
    projeto_id = request.vars['projeto_id'] or redirect(URL('index'))
    projeto = db(Projeto.id==projeto_id).select().first()
    pessoa = db((Pessoa.usuario1==auth.user.id) | (Pessoa.usuario2==auth.user.id)).select().first()

    if projeto:
        if pessoa.id == projeto.criado_por:
            db(Projeto.id==projeto_id).delete()

    redirect(URL('projetos'))


@auth.requires_login()
def projeto_canvas():
    """Pagina com o Canvas do projeto, onde os dados serao editados
    """
    import json
    projeto_id = request.args(0) or redirect(URL('index'))
    session.projeto_id = projeto_id
    pessoa = db((Pessoa.usuario1==auth.user.id) | (Pessoa.usuario2==auth.user.id)).select().first()
    pessoas_autorizadas =  [i.criado_por for i in db(Projeto.id==projeto_id).select()]

    for i in db(Compartilhamento.projeto_id==projeto_id).select():
        if not i.pessoa_id in pessoas_autorizadas:
            pessoas_autorizadas.append(i.pessoa_id)

    if pessoa.id in pessoas_autorizadas:
        projeto = db(Projeto.id==projeto_id).select().first()
        time_compartilhamento = db(Compartilhamento.projeto_id==projeto_id).select()
        id_time = [i.pessoa_id for i in time_compartilhamento]
        id_time.append(projeto.criado_por)

        usuarios_para_adicionar = {i.nome:i.id for i in db(db.pessoa).select() if not i.id in id_time}

        return dict(projeto=projeto,
                    time_compartilhamento=time_compartilhamento,
                    pessoa_logada=pessoa.id,
                    usuarios_para_adicionar=usuarios_para_adicionar)
    else:
        redirect(URL('index'))


def editar_dados():
    """Funcao que atualiza dados do projeto
    """
    import json

    if request.vars:
        valor = request.vars.value
        pk = request.vars.pk
        campo = request.vars.name

        dados_banco = db(Projeto.id==session.projeto_id).select().first()

        if dados_banco[campo]:
            dicionario_dados = json.loads(dados_banco[campo])
        else:
            dicionario_dados = {}

        dicionario_dados[pk] = valor
        dados = json.dumps(dicionario_dados)

        Projeto[session.projeto_id]= {campo:dados}

        return dict(success="success",msg="gravado com sucesso!")
    else:
        return dict(error="error",msg="erro ao gravar!")


def remove_item():
    """Funcao que atualiza dados do projeto
    """
    import json

    if request.vars:
        pk = request.vars.pk
        campo = request.vars.name

        dados_banco = db(Projeto.id==session.projeto_id).select().first()

        if dados_banco[campo]:
            dicionario_dados = json.loads(dados_banco[campo])
        else:
            dicionario_dados = {}

        if pk in dicionario_dados:
            del dicionario_dados[pk]
            dados = json.dumps(dicionario_dados)
            Projeto[session.projeto_id]= {campo:dados}

        return True
    else:
        return False


def atualiza_itens():
    """Funcao que atualiza dados do projeto
    """
    import json

    if request.vars:
        campo = request.vars.name
        todas_variaveis = request.vars

        valores =  {}
        for v in todas_variaveis:
            if not v == "name":
                valores[v] = todas_variaveis[v]

        dados_banco = db(Projeto.id==session.projeto_id).select().first()
        dados = json.dumps(valores)

        Projeto[session.projeto_id]= {campo:dados}

        return True
    else:
        return False


@auth.requires_login()
def adicionar_usuario():
    """Funcao que adiciona usuario a um projeto
    """
    projeto_id = request.vars['projeto_id'] or redirect(URL('index'))
    pessoa_id = int(request.vars['pessoa_id']) or redirect(URL('index'))
    pessoa_logada = db((Pessoa.usuario1==auth.user.id) | (Pessoa.usuario2==auth.user.id)).select().first()

    projeto = db(Projeto.id==projeto_id).select().first()

    if projeto.criado_por == pessoa_logada.id:
        Compartilhamento.insert(pessoa_id=pessoa_id,
            projeto_id=projeto_id)
    redirect(URL(c='default', f='projeto_canvas', args=[projeto_id]))


def feedback_form():
    '''Formulario de feedback do site.
    '''
    ## Variaveis importadas
    from data_config import *

    form = SQLFORM.factory(
        Field('email', label= 'E-mail', requires=IS_EMAIL()),
        Field('assunto',
        requires=IS_IN_SET(['Sugestão','Dúvida','Reclamação'], zero='Sobre o que você quer falar?',error_message='Escolha o assunto')),
        Field('titulo_mensagem', requires=IS_NOT_EMPTY(error_message='Prencha o título da sua mensagem')),
        Field('mensagem','text', requires=IS_NOT_EMPTY(error_message='Prencha a sua mensagem')),
        table_name='feedback',
        submit_button="Enviar Ideia")
    if form.accepts(request.vars):
        mensagem = '<strong>Email: </strong>%s<br><strong>Assunto: </strong>%s<br><strong>Titulo: </strong>%s<br><strong>Mensagem:</strong><br>%s<strong>' % (form.vars.email, form.vars.assunto, form.vars.titulo_mensagem, form.vars.titulo_mensagem )

        status = mail.send(to=[CLIENT_EMAIL],reply_to=form.vars.email,
                subject='Email recebido "Feedback Web2Canvas": %s - %s' % (form.vars.email, form.vars.assunto) ,
                message=[None,mensagem])

        if status == True:
            return dict(form=form, status='sucess')
        else:
            return dict(form=form, status='error')

    return dict(form=form)


def login():
    if request.vars:
        if request.vars['rede'] == 'facebook':
            session.auth_with = 'facebook'

    redirect(URL('_cadastrar_pessoa'))


@auth.requires_login()
def _cadastrar_pessoa():
    nome = '%s %s' % (session.auth.user.first_name, session.auth.user.last_name)
    count = db((Pessoa.usuario1==session.auth.user.id) | (Pessoa.usuario2==session.auth.user.id)).count()
    if count == 0:
        pessoa_id = Pessoa.insert(
                        nome=nome.strip(),
                        usuario1=session.auth.user.id,
                        )

    redirect(URL('projetos'))


def user():
    """
    exposes:
    http://..../[app]/default/user/login
    http://..../[app]/default/user/logout
    http://..../[app]/default/user/register
    http://..../[app]/default/user/profile
    http://..../[app]/default/user/retrieve_password
    http://..../[app]/default/user/change_password
    use @auth.requires_login()
        @auth.requires_membership('group name')
        @auth.requires_permission('read','table name',record_id)
    to decorate functions that need access control
    """
    if request.args(0) == 'register':
        import random
        form = auth.register()
        form.element(_name='username')['_value'] = "%s" %random.random()

        return dict(form=form)        

    elif request.args(0) == 'logout':
        session.clear()

    return dict(form = auth())




def download():
    """
    allows downloading of uploaded files
    http://..../[app]/default/download/[filename]
    """
    return response.download(request, db)


def call():
    """
    exposes services. for example:
    http://..../[app]/default/call/jsonrpc
    decorate with @services.jsonrpc the functions to expose
    supports xml, json, xmlrpc, jsonrpc, amfrpc, rss, csv
    """
    return service()


@auth.requires_signature()
def data():
    """
    http://..../[app]/default/data/tables
    http://..../[app]/default/data/create/[table]
    http://..../[app]/default/data/read/[table]/[id]
    http://..../[app]/default/data/update/[table]/[id]
    http://..../[app]/default/data/delete/[table]/[id]
    http://..../[app]/default/data/select/[table]
    http://..../[app]/default/data/search/[table]
    but URLs must be signed, i.e. linked with
      A('table',_href=URL('data/tables',user_signature=True))
    or with the signed load operator
      LOAD('default','data.load',args='tables',ajax=True,user_signature=True)
    """
    return dict(form=crud())
