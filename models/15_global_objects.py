# -*- coding: utf-8 -*-

'''Global objects and methods declaration.

Unvolatile data fits better here, than in a db table.
Some structures are immutable. Days of week, for example.

As well as methods used throughout your app.

Here is their sweet home.
'''

## Global functions

def g_pagina_atual(url, classe, vazio=''):
    '''retorna a classe caso esteja na url. Senao retorna vazio'''
    url_server = '%s/%s' % (request.controller, request.function)
    if url == url_server:
        return classe
    else:
        return vazio
