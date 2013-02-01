# -*- coding: utf-8 -*-
# this file is released under public domain and you can use without limitations

#########################################################################
## This is a samples controller
## - index is the default action of any application
## - user is required for authentication and authorization
## - download is for downloading files uploaded in the db (does streaming)
## - call exposes all registered services (none by default)
#########################################################################

@auth.requires_login()
def index():
    """Home page com opcao de criar projetos
    """
    from datetime import datetime
    meus_projetos = db(Projeto.criado_por==auth.user.id).select()
    projetos_colaborador = db(Compartilhamento.usuario_id==auth.user).select()

    form = SQLFORM(Projeto, fields=['nome'], submit_button="Criar")

    if form.process().accepted:
        db(Projeto.id==form.vars.id).update(criado_por=auth.user.id, criado_em=datetime.now())
        redirect(URL('index'))

    return dict(form=form, meus_projetos=meus_projetos, projetos_colaborador=projetos_colaborador)

@auth.requires_login()
def projeto():
    """Pagina do Projeto, onde os dados serao editados
    """
    import json
    projeto_id = request.args(0) or redirect(URL('index'))
    session.projeto_id = projeto_id
    usuarios_autorizados =  [i.criado_por for i in db(Projeto.id==projeto_id).select()]

    for i in db(Compartilhamento.projeto_id==projeto_id).select():
        if not i.usuario_id in usuarios_autorizados:
            usuarios_autorizados.append(i.usuario_id)

    if auth.user.id in usuarios_autorizados:
        projeto = db(Projeto.id==projeto_id).select().first()
        time_compartilhamento = db(Compartilhamento.projeto_id==projeto_id).select()
        return dict(projeto=projeto, time_compartilhamento=time_compartilhamento)
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


@auth.requires_login()
def adicionar_usuario():
    """Funcao que adiciona usuario a um projeto
    """
    projeto_id = request.vars['projeto_id'] or redirect(URL('index'))
    usuario_id = request.vars['usuario_id'] or redirect(URL('index'))

    projeto = db(Projeto.id==projeto_id).select().first()

    if projeto.criado_por == auth.user.id:
        Compartilhamento.insert(usuario_id=usuario_id,
            projeto_id=projeto_id)
    redirect(URL(c='default', f='projeto', args=[projeto_id]))


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
    return dict(form=auth())


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
