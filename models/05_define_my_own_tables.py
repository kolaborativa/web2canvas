if not "auth_user" in db.tables:
    db.define_table("auth_user",
        migrate="auth_user.table")

if not "projeto" in db.tables:
    Projeto = db.define_table("projeto",
        Field("nome", "string", length=200, default=None),
        Field("criado_por", db.auth_user, default=None),
        Field("criado_em", "datetime", default=None),
        Field("parcerias_principais", "text", default=None),
        Field("atividades_principais", "text", default=None),
        Field("recursos_principais", "text", default=None),
        Field("proposta_valor", "text", default=None),
        Field("relacionamento_clientes", "text", default=None),
        Field("canais", "text", default=None),
        Field("segmento_clientes", "text", default=None),
        Field("estrutura_custos", "text", default=None),
        Field("receitas", "text", default=None),
        format='%(nome)s',
        migrate="projeto.table")

if not "compartilhamento" in db.tables:
    Compartilhamento = db.define_table("compartilhamento",
        Field("usuario_id", db.auth_user, default=None),
        Field("projeto_id", db.projeto, default=None),
        migrate="compartilhamento.table")

""" Relations between tables (remove fields you don't need from requires) """
db.projeto.criado_por.requires = IS_IN_DB(db, 'auth_user.id', db.auth_user._format)
db.compartilhamento.usuario_id.requires = IS_IN_DB(db, 'auth_user.id', db.auth_user._format)
db.compartilhamento.projeto_id.requires = IS_IN_DB(db, 'projeto.id', db.projeto._format)

