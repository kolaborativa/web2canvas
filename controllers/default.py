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
    """Home page com opcao de criar projetos
    """
    from datetime import datetime
    projetos = db(Projeto.criado_por==auth.user.id).select()

    form = SQLFORM(Projeto, fields=['nome'], submit_button="Criar")

    if form.process().accepted:
        db(Projeto.id==form.vars.id).update(criado_por=auth.user.id, criado_em=datetime.now())
        redirect(URL('index'))
    return dict(form=form, projetos=projetos)


def projeto():
    """Pagina do Projeto, onde os dados serao editados
    """
    projeto_id = request.args(0) or redirect(URL('index'))
    projeto = db(Projeto.id==projeto_id).select().first()


    return dict(projeto=projeto)


def editar_dados():
    """Funcao que atualiza dados do projeto
    """
    tipo = request.vars['tipo']
    dado = request.vars['dado']

    msg = "tipo de dado: %s | dado: %s" % (tipo, dado)


    return dict(message=msg)


def new_post():
    print request.vars
    if request.vars:
        print request.vars.name
        return dict(success="success",msg="gravado com sucesso!")
    else:
        return dict(error="error",msg="erro ao gravar!")


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
