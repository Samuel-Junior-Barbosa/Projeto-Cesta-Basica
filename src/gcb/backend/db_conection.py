#!/bin/python3.10
import sqlite3

class GCBBase:
    def __init__(self, dbname):
        self.dbname = dbname
        self.banco_de_dados = sqlite3.connect( self.dbname )
        self.placeholder_type = '?'
        self.church_table_name = 'congregacao'
        self.basket_table_name = 'cesta_basica'
        self.input_table_name = 'entrada'
        self.input_item_table_name = 'entrada_item'
        self.family_table_name = 'familia'
        self.role_table_name = 'funcao'
        self.role_permission_table_name = 'funcao_permissao'
        self.history_adjustment_invetory_table_name = "historico_ajuste_produto"
        self.history_register_church_table_name = 'historico_congregacao'
        self.history_register_family_table_name = 'historico_familia'
        self.history_register_product_table_name = 'historico_produto'
        self.basket_item_table_name = 'item_cesta_basica'
        self.church_goals_table_name = 'meta'
        self.church_item_goals_table_name = 'meta_item'
        self.order_basket_table_name = 'ordem_cesta_basica'
        self.permission_table_name = 'permissoes'
        self.product_table_name = 'produto'
        self.priority_table_name = 'prioridade'
        self.output_table_name = 'saida'
        self.item_output_table_name = 'saida_item'
        self.type_record_table_name = 'tipo_registro'
        self.user_table_name = 'usuario'

        self.init_db()


    def get_connection( self ):
        return sqlite3.connect( self.dbname )

    def init_db(self):
        cursor_do_banco = self.banco_de_dados.cursor()

        # ========================================================
        if not self.exist_table( self.family_table_name ):
            cursor_do_banco.execute(f"""
                                    CREATE TABLE {self.family_table_name} (
                                        id_familia INTEGER PRIMARY KEY AUTOINCREMENT,
                                        id_congregacao INTEGER NOT NULL,
                                        id_prioridade INTEGER NOT NULL,
                                        representante TEXT NOT NULL,
                                        membros INTEGER NOT NULL,
                                        cidade TEXT NOT NULL,
                                        bairro TEXT NOT NULL,
                                        rua TEXT NOT NULL,
                                        numero_da_casa INTEGER NOT NULL,
                                        uf VARCHAR(2),
                                        cep VARCHAR(8),
                                        telefone TEXT NOT NULL,
                                        status_cadastro BOOLEAN NOT NULL,
                                        data_cadastro DATE,
                                        ultima_alteracao DATE,
                                        UNIQUE( representante )
                                    )""")
            self.banco_de_dados.commit()
        
        # ========================================================
        if not self.exist_table( self.church_table_name ):
            cursor_do_banco.execute(f"""
                                    CREATE TABLE {self.church_table_name} (
                                        id_congregacao INTEGER PRIMARY KEY AUTOINCREMENT,
                                        nome TEXT NOT NULL,
                                        representante TEXT NOT NULL,
                                        membros INTEGER,
                                        cidade TEXT NOT NULL,
                                        bairro TEXT NOT NULL,
                                        rua INTEGER NOT NULL,
                                        numero INTEGER NOT NULL,
                                        cep TEXT,
                                        uf TEXT NOT NULL,
                                        status_cadastro BOOLEAN NOT NULL,
                                        id_usuario_responsavel INTEGER,
                                        data_criacao DATE,
                                        ultima_alteracao DATE,
                                        UNIQUE( id_congregacao, nome ),
                                        FOREIGN KEY (id_usuario_responsavel) REFERENCES usuario(id_usuario)
                                    )
                                    """)
            self.banco_de_dados.commit()


        # ========================================================
        if not self.exist_table( self.basket_table_name ):
            cursor_do_banco.execute(f"""
                                    CREATE TABLE {self.basket_table_name} (
                                    id_cesta INTEGER PRIMARY KEY AUTOINCREMENT,
                                    nome_da_cesta TEXT NOT NULL,
                                    cadastro_ativo BOOLEAN NOT NULL,
                                    id_usuario_responsavel INTEGER,
                                    UNIQUE(nome_da_cesta),
                                    FOREIGN KEY (id_usuario_responsavel) REFERENCES usuario(id_usuario)
                                    )""")
            self.banco_de_dados.commit()

        # ========================================================
        if not self.exist_table( self.basket_item_table_name ):
            cursor_do_banco.execute(f"""
                                    CREATE TABLE {self.basket_item_table_name} (
                                        id_item INTEGER NOT NULL,
                                        id_cesta INTEGER NOT NULL,
                                        quantidade_do_item INTEGER NOT NULL,
                                        FOREIGN KEY (id_item) REFERENCES produto(id_item),
                                        FOREIGN KEY (id_cesta) REFERENCES cesta_basica(id_cesta)
                                    )""")
            self.banco_de_dados.commit()

        # ========================================================
        if not self.exist_table( self.order_basket_table_name ):
            cursor_do_banco.execute(f"""
                                    CREATE TABLE {self.order_basket_table_name} (
                                        id_ordem INTEGER NOT NULL,
                                        id_congregacao INTEGER,
                                        data_criacao INTEGER NOT NULL,
                                        prazo_entrega INTEGER NOT NULL,
                                        status INTEGER NOT NULL,
                                        FOREIGN KEY (id_congregacao) REFERENCES congregacao(id_congregacao)
                                    )""")
            self.banco_de_dados.commit()

        # ========================================================
        if not self.exist_table( self.output_table_name ):
            cursor_do_banco.execute(f"""
                                    CREATE TABLE {self.output_table_name} (
                                        id_saida INTEGER PRIMARY KEY AUTOINCREMENT,
                                        id_cesta INTEGER,
                                        id_familia INTEGER,
                                        id_congregacao INTEGER,
                                        quantidade_cesta INTEGER NOT NULL,
                                        data_saida DATE NOT NULL,
                                        tipo_saida INTEGER NOT NULL,
                                        doacao_fora BOOLEAN,
                                        id_usuario INTEGER NOT NULL,
                                        UNIQUE(id_saida),
                                        FOREIGN KEY (id_cesta) REFERENCES cesta(id_cesta),
                                        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
                                        FOREIGN KEY (id_familia) REFERENCES familia(id_familia),
                                        FOREIGN KEY (id_congregacao) REFERENCES congregacao(id_congregacao)
                                    )""")
            self.banco_de_dados.commit()


        # ========================================================
        if not self.exist_table( self.item_output_table_name ):
            cursor_do_banco.execute(f"""
                                    CREATE TABLE {self.item_output_table_name} (
                                        id_saida INTEGER NOT NULL,
                                        id_usuario INTEGER NOT NULL,
                                        id_produto INTEGER NOT NULL,
                                        quantidade INTEGER NOT NULL,
                                        data_saida DATE,
                                        FOREIGN KEY (id_saida) REFERENCES saida(id_saida),
                                        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
                                        FOREIGN KEY (id_produto) REFERENCES produto(id_item)
                                    )""")
            self.banco_de_dados.commit()



        # ========================================================
        if not self.exist_table( self.input_table_name ):
            cursor_do_banco.execute(f"""
                                    CREATE TABLE {self.input_table_name} (
                                        id_entrada INTEGER PRIMARY KEY AUTOINCREMENT,
                                        id_cesta INTEGER,
                                        id_familia INTEGER,
                                        id_congregacao INTEGER,
                                        quantidade_cesta INTEGER NOT NULL,
                                        data_entrada DATE NOT NULL,
                                        tipo_entrada INTEGER NOT NULL,
                                        doacao_fora BOOLEAN,
                                        id_usuario INTEGER NOT NULL,
                                        UNIQUE(id_entrada),
                                        FOREIGN KEY (id_cesta) REFERENCES cesta(id_cesta),
                                        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
                                        FOREIGN KEY (id_familia) REFERENCES familia(id_familia),
                                        FOREIGN KEY (id_congregacao) REFERENCES congregacao(id_congregacao)
                                    )""")
            self.banco_de_dados.commit()


        # ========================================================
        if not self.exist_table( self.input_item_table_name ):
            cursor_do_banco.execute(f"""
                                    CREATE TABLE {self.input_item_table_name} (
                                        id_entrada INTEGER NOT NULL,
                                        id_produto INTEGER NOT NULL,
                                        quantidade INTEGER NOT NULL,
                                        id_usuario INTEGER NOT NULL,
                                        FOREIGN KEY (id_entrada) REFERENCES entrada(id_entrada),
                                        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
                                        FOREIGN KEY (id_produto) REFERENCES produto(id_item)
                                    )""")
            self.banco_de_dados.commit()



        # ========================================================
        if not self.exist_table( self.product_table_name ):
            cursor_do_banco.execute(f"""
                                    CREATE TABLE {self.product_table_name} (
                                        id_item INTEGER PRIMARY KEY AUTOINCREMENT,
                                        nome_do_produto TEXT NOT NULL,
                                        marca TEXT,
                                        quantidade_do_item INTEGER NOT NULL,
                                        peso INTEGE,
                                        status_cadastro BOOLEAN NOT NULL,
                                        id_usuario_responsavel INTEGER,
                                        data_criacao DATE,
                                        ultima_alteracao DATE,
                                        UNIQUE(id_item, nome_do_produto),
                                        FOREIGN KEY (id_usuario_responsavel) REFERENCES {self.user_table_name}(id_usuario)
                                    )""")
            self.banco_de_dados.commit()


        if not self.exist_table( self.permission_table_name ):
            self.banco_de_dados.execute(f'''
                                    CREATE TABLE { self.permission_table_name } (
                                        id_permissao INTEGER PRIMARY KEY AUTOINCREMENT,
                                        nome TEXT,
                                        descricao TEXT,
                                        UNIQUE( id_permissao )
                                    );
                                    ''')
            self.banco_de_dados.commit()

            tmp_permission_list = [
                [1,'DASHBOARD_VIEW','VISUALIZAR DASHBOARDS'],
                [2,'REPORT_VIEW','VISUALIZAR RELATORIOS'],
                [3,'CREATE_FAMILY','PERMITIR CRIAR CADASTRO DE FAMILIA'],
                [4,'ALTER_FAMILY','PERMITIR ALTERAR CADASTRO DE FAMILIA'],
                [5,'DELETE_FAMILY','PERMITIR DELETAR CADASTRO DE FAMILIA'],
                [6,'VIEW_FAMILY_REGISTER','PERMITIR VISUALIZAR CADASTROS DE FAMILIA'],
                [7,'CREATE_PRODUCT','PERMITIR CRIAR PRODUTOS'],
                [8,'ALTER_PRODUCT','PERMITIR ALTERAR PRODUTOS'],
                [9,'DELETE_PRODUCT','PERMITIR DELETAR PRODUTOS'],
                [10,'VIEW_PRODUCT_REGISTER','PERMITIR VISUALIZAR LISTA DE PRODUTOS'],
                [11,'CREATE_CHURCH','PERMITIR CRIAR CADASTRO DE CONGREGAÇÃO'],
                [12,'ALTER_CHURCH','PERMITIR ALTERAR CADASTRO DE CONGREGAÇÃO'],
                [13,'DELETE_CHURCH','PERMITIR DELETAR CADASTROD DE CONGREGAÇÃO'],
                [14,'VIEW_CHURCH_REGISTER','PERMITIR VISUALIZAR CADASTRO DE CONGREGAÇÕES'],
                [15,'VIEW_CHURCH_GOAL_REGISTER','PERMITIR VISUALIZAR CADASTRO DE METAS'],
                [16,'ALTER_CHURCH_GOAL_REGISTER','PERMITIR ALTERAR METAS'],
                [17,'DELETE_CHURCH_GOAL_REGISTER','PERMITIR DELETAR METAS'],
                [18,'CREATE_CHURCH_GOAL_REGISTER','PERMITIR CRIAR METAS'],
                [19,'VIEW_CHURCH_GOAL_RECORD','PERMITIR GERAR RELATORIOS DE METAS POR CONGREGAÇÃO'],
                [20,'VIEW_CHURCH_RECORD','PERMITIR GERAR RELATORIO DE CONGREGAÇÃO'],
                [21,'VIEW_HOME_PAGE','PERMITIR ACESSAR A PAGINA PRINCIPAL'],
                [22,'VIEW_DELETE_USER_PAGE','PERMITIR ACESSAR A PAGINA DE REMOVER USUARIO'],
                [23,'VIEW_GENERATE_REPORT_PAGE','PERMITIR VISUALIZAR A PAGINA DE RELATORIOS'],
                [24,'VIEW_MANAGE_CHURCH_PAGE','PERMITIR VISUALIZAR PAGINA DE GERENCIAR CONGREGAÇÃO'],
                [25,'VIEW_MANAGE_PRODUCT_PAGE','PERMITIR VISUALIZAR PAGINA DE GERENCIAR PRODUTOS'],
                [26,'VIEW_MANAGE_FAMILY_PAGE','PERMITIR VISUALIZAR PAGINA DE GERENCIARDE FAMILIA'],
                [27,'VIEW_REGISTER_FAMILY_PAGE','PERMITIR VISUALIZAR PAGINA DE CADASTRO DE FAMILIA'],
                [28,'VIEW_ALTER_PRODUCT_PAGE','PERMITIR VISUALIZAR PAGINA DE ALTERAR PRODUTO'],
                [29,'VIEW_ALTER_FAMILY_PAGE','PERMITIR VISUALIZAR PAGINA DE ALTERAR FAMILIA'],
                [30,'VIEW_ALTER_CHURCH_PAGE','PERMITIR VISUALIZAR PAGINA DE ALTERAR CONGREGAÇÃO'],
                [31,'VIEW_REGISTER_CHURCH_PAGE','PERMITIR VISUALIZAR PAGINA DE CADASTRO DE CONGREGAÇÃO'],
                [32,'VIEW_ALTER_CHURCH_GOAL_PAGE','PERMITIR VISUALIZAR PAGINA DE ALTERAR METAS'],
                [33,'VIEW_MANAGE_CHURCH_GOAL_PAGE','PERMITIR VISUALIZAR PAGINA DE GESTÃO DE METAS'],
                [34,'VIEW_MANAGE_PRIORITY_PAGE','PERMITIR VISUALIZAR GERENCIAR PRIORIDADE'],
                [35,'VIEW_CREATE_PRIORITY_PAGE','PERMITIR VISUALIZAR PAGINA DE CRIAÇÃO DE PRIORIDADE'],
                [36,'VIEW_ALTER_PRIORITY_PAGE','PERMITIR VISUALIZAR ALTERAR PRIORIDADE'],
                [37,'VIEW_MANAGE_BASIC_BASKET_FOOD_PAGE','PERMITIR VISUALIZAR PAGINA GERENCIAR CESTA BASICA'],
                [38,'VIEW_CREATE_BASIC_BASKET_FOOD_PAGE','PERMITIR VISUALIZAR PAGINA DE CADASTRO DE CESTA BASICA'],
                [39,'VIEW_ALTER_BASIC_BASKET_FOOD_PAGE','PERMITIR VISUALIZAR PAGINA DE ALTERAÇÃO DE CESTA BASICA'],
                [40,'VIEW_DELETE_BASIC_BASKET_FOOD_PAGE','PERMITIR VISUALIZAR PAGINA DE REMOÇÃO DE CESTA BASICA'],
                [41,'VIEW_CREATE_PRODUCT_PAGE','PERMITIR VISUALIZAR PAGINA DE CRIAÇÃO DE PRODUTO'],
                [42,'VIEW_GENERATE_BASIC_BASKET_FOOD_PAGE','PERMITIR VISUALIZAR PAGINA PARA GERAR CESTA BASICA'],
                [43,'VIEW_INPUT_BASIC_BASKET_FOOD_PAGE','PERMITIR VISUALIZAR PAGINA DE ENTRADA DE CESTA E PRODUTOS'],
                [44,'VIEW_OUTPUT_BASIC_BASKET_FOOD_PAGE','PERMITIR VISUALIZAR PAGINA DE SAIDA DE CESTA E PRODUTOS'],
                [45,'VIEW_DELIVERY_BASIC_BASKET_FOOD_PAGE','PERMITIR VISUALIZAR PAGINA DE ORDENS DE ENTREGA'],
                [46,'VIEW_ALTER_DELIVERY_BASIC_BASKET_FOOD_PAGE','PERMITIR VISUALIZAR PAGINA DE ALTERAÇÃO DE ORDENS DE ENTREGA'],
                [47,'VIEW_CREATE_DELIVERY_BASIC_BASKET_FOOD_PAGE','PERMITIR VISUALIZAR PAGINA DE CRIAÇÃO DE ORDENS DE ENTREGA'],
                [48,'VIEW_DELETE_DELIVERY_BASIC_BASKET_FOOD_PAGE','PERMITIR VISUALIZAR PAGINA DE REMOÇÃO DE ORDENS DE ENTREGA'],
                [49,'VIEW_HISTORY__BASIC_BASKET_FOOD_PAGE','PERMITIR VISUALIZAR PAGINA DE HISTORICO DE CESTAS BASICAS'],
                [50,'VIEW_CONFIGURATION_PAGE','PERMITIR VISUALIZAR PAGINA DE CONFIGURAÇÃO'],
                [51,'VIEW_INVENTORY_REPORT','PERMITIR VISUALIZAR RELATORIO DE INVENTARIO'],
                [52,'VIEW_WITHDRAW_REPORT','PERMITIR VISUALIZAR RELATORIO DE SAIDAS DE ITENS'],
                [53,'VIEW_COLLECTION_REPORT','PERMITIR VISUALIZAR RELATORIO DE ARRECADAÇÃO'],
                [54,'CREATE_PRIORITY','PERMITIR CADASTRO PRIORIDADE'],
                [55,'ALTER_PRIORITY','PERMITIR ALTERAR PRIORIDADE'],
                [56,'DELETE_PRIORITY','PERMITIR REMOVER PRIORIDADE'],
                [57,'VIEW_PRIORITY_REGISTER','PERMITIR VISUALIZAR REGISTROS DE PRIORIDADES'],
                [58,'CREATE_BASIC_BASKET_FOOD','PERMITIR CADASTRO DE CESTA BASICA'],
                [59,'ALTER_BASIC_BASKET_FOOD','PERMITIR ALTERAR CESTA BASICA'],
                [60,'DELETE_BASIC_BASKET_FOOD','PERMITIR REMOVER CESTA BASICA'],
                [61,'VIEW_BASIC_BASKET_FOOD_REGISTER','PERMITIR VISUALIZAR REGISTRO DE CESTA BASICA'],
                [62,'CREATE_BASKET_ORDER','PERMITIR CRIAR ORDEM DE ENTREGA'],
                [63,'ALTER_BASKET_ORDER','PERMITIR ALTERAR ORDEM DE ENTREGA'],
                [64,'DELETE_BASKET_ORDER','PERMITIR REMOVER ORDEM DE ENTREGA'],
                [65,'VIEW_BASKET_ORDER_REGISTER','PERMITIR VISUALIZAR REGISTRO DE ORDEM DE ENTREGA'],
                [66,'OUTPUT_BASKET','PERMITIR FAZER SAIDA DE PRODUTOS'],
                [67,'INPUT_BASKET','PERMITIR FAZER ENTRADA DE PRODUTOS'],
                [68,'BASKET_DELIVERY_REPORT','PERMITIR VISUALIZAR RELATORIO DE ENTREGAS'],
                [69,'CREATE_USER','PERMITIR CADASTRAR USUARIO'],
                [70,'ALTER_USER','PERMITIR ALTERAR USUARIO'],
                [71,'REMOVE_USER','PERMITIR REMOVER USUARIO'],
                [72,'VIEW_USER_LIST','PERMITIR VISUALIZAR LISTA DE USUARIOS CADASTRADOS'],
                [73,'VIEW_MANAGE_USER_PAGE','PERMITIR VISUALIZAR PAGINA DE GESTÃO DE USUARIOS'],
                [74,'CREATE_USER_FUNCTION','PERMITIR CRIAR FUNÇÕES DE USUARIOS'],
                [75,'ALTER_USER_FUNCTION','PERMITIR ALTERAR FUNÇÕES'],
                [76,'DELETE_USER_FUNCTION','PERMITIR DELETAR FUNÇÕES'],
                [77,'VIEW_USER_FUNCTION','PERMITIR VISUALIZAR FUNÇÕES CRIADAS'],
                [78,'FUNCTION_PERMISSION_LIST','PERMITIR VISUALIZAR FUNÇÕES CRIADAS'],
            ]

            tmp_sql_query = f''' INSERT INTO {self.permission_table_name} (id_permissao, nome, descricao) VALUES (?, ?, ?);'''

            for p in tmp_permission_list:
                value_list = [
                    p[0],
                    p[1],
                    p[2]
                ]

                self.banco_de_dados.execute( tmp_sql_query, value_list)
                self.banco_de_dados.commit()


        if not self.exist_table( self.role_table_name ):
            cursor_do_banco.execute(f'''
                                    CREATE TABLE { self.role_table_name } (
                                        id_funcao INTEGER PRIMARY KEY AUTOINCREMENT,
                                        nome TEXT,
                                        descricao TEXT
                                    );
                                    ''')
            
            self.banco_de_dados.commit()
            tmp_sql_query = f''' INSERT INTO {self.role_table_name} (id_funcao, nome, descricao) VALUES (?, ?, ?)'''
            self.banco_de_dados.execute(tmp_sql_query, [1, 'ADMIN', 'ADMINISTRADOR DO SISTEMA'])
            self.banco_de_dados.execute(tmp_sql_query, [2, 'OPERADOR', 'OPERADOR DO ESTOQUE'])
            self.banco_de_dados.execute(tmp_sql_query, [3, 'VISITANTE', 'USUARIO DE TESTE'])

            self.banco_de_dados.commit()
            

        if not self.exist_table( self.role_permission_table_name ):
            cursor_do_banco.execute(f"""
                                    CREATE TABLE { self.role_permission_table_name } (
                                        id_funcao INTEGER,
                                        id_permissao INTEGER,
                                        FOREIGN KEY(id_funcao) REFERENCES {self.role_table_name}(id_funcao),
                                        FOREIGN KEY(id_permissao) REFERENCES {self.permission_table_name}(id_permissao)
                                    ) """)
            
            self.banco_de_dados.commit()

            column_list = [
                'id_funcao',
                'id_permissao'
            ]
            tmp_sql_query = f'INSERT INTO {self.role_permission_table_name} (id_funcao, id_permissao) VALUES (?, ?)'
            for i in range(1, 79 ):
                value_list = [
                    1,
                    i
                ]
                #self.banco_de_dados.insert( self.role_permission_table_name, column_list, value_list )
                self.banco_de_dados.execute(tmp_sql_query, value_list)
                self.banco_de_dados.commit()

            self.banco_de_dados.execute(tmp_sql_query, [2, 21])
            self.banco_de_dados.execute(tmp_sql_query, [2, 37])
            self.banco_de_dados.execute(tmp_sql_query, [2, 43])
            self.banco_de_dados.execute(tmp_sql_query, [2, 44])
            self.banco_de_dados.commit()


        # ========================================================
        if not self.exist_table( self.user_table_name ):
            cursor_do_banco.execute(f"""
                                    CREATE TABLE {self.user_table_name} (
                                        id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
                                        id_funcao INTEGER,
                                        nome_do_usuario TEXT NOT NULL,
                                        senha VARCHAR(500),
                                        email TEXT,
                                        status_cadastro BOOLEAN,
                                        usuario_responsavel_da_alteracao INTEGER,
                                        usuario_responsavel_pelo_cadastro INTEGER,
                                        data_criacao DATE,
                                        data_alteracao DATE,
                                        UNIQUE(nome_do_usuario),
                                        FOREIGN KEY (usuario_responsavel_da_alteracao) REFERENCES {self.user_table_name}(id_usuario),
                                        FOREIGN KEY (usuario_responsavel_pelo_cadastro) REFERENCES {self.user_table_name}(id_usuario),
                                        FOREIGN KEY (id_funcao) REFERENCES funcao(id_funcao)
                                    );""")
            self.banco_de_dados.commit()

            tmp_sql_query = f"""
                            INSERT INTO usuario (
                                    id_usuario,
                                    id_funcao,
                                    nome_do_usuario,
                                    senha,
                                    email,
                                    status_cadastro,
                                    data_criacao,
                                    data_alteracao,
                                    usuario_responsavel_da_alteracao,
                                    usuario_responsavel_pelo_cadastro
                                ) VALUES (
                                    1,
                                    1,
                                    'ADMIN',
                                    '$argon2id$v=19$m=65536,t=3,p=4$PEeIUeodo/T+f+/9H+N8rw$Ylumk9mv+96kxC2UQN3VlEGseQrKJTbyjpWgpZ3bTIU',
                                    '',
                                    true,
                                    '2026-01-01',
                                    '2026-01-01',
                                    1,
                                    1
                                )
                                """
            self.banco_de_dados.execute(tmp_sql_query)
            self.banco_de_dados.commit()



        # ========================================================
        if not self.exist_table( self.priority_table_name ):
            cursor_do_banco.execute(f"""
                                    CREATE TABLE {self.priority_table_name} (
                                    id_prioridade INTEGER PRIMARY KEY AUTOINCREMENT,
                                    descricao TEXT NOT NULL UNIQUE,
                                    nivel_prioridade INTEGER,
                                    data_criacao DATE,
                                    data_alteracao DATE
                                    )""")
            self.banco_de_dados.commit()
            cursor_do_banco.execute(f"""INSERT INTO {self.priority_table_name} (
                                        descricao, nivel_prioridade, data_criacao, data_alteracao
                                    ) VALUES (
                                        'Baixo', 1, date('now'), date('now')
                                    )""")
            cursor_do_banco.execute(f"""INSERT INTO {self.priority_table_name} (
                                        descricao, nivel_prioridade, data_criacao, data_alteracao
                                    ) VALUES (
                                        'Medio', 2, date('now'), date('now')
                                    )""")
            cursor_do_banco.execute(f"""INSERT INTO {self.priority_table_name} (
                                        descricao, nivel_prioridade, data_criacao, data_alteracao
                                    ) VALUES (
                                        'Alta', 3, date('now'), date('now')
                                    )""")
            self.banco_de_dados.commit()

        # ========================================================
        if not self.exist_table( self.history_adjustment_invetory_table_name ):
            cursor_do_banco.execute(f"""
                                    CREATE TABLE {self.history_adjustment_invetory_table_name} (
                                        id_historico INTEGER PRIMARY KEY AUTOINCREMENT,
                                        tipo_ajuste INTEGER NOT NULL,
                                        id_produto INTEGER NOT NULL,
                                        valor_anterior INTEGER NOT NULL,
                                        valor_do_ajuste INTEGER NOT NULL,
                                        valor_atual INTEGER NOT NULL,
                                        id_usuario_responsavel INTERGER NOT NULL,
                                        data DATE,
                                        FOREIGN KEY (id_produto) REFERENCES produto(id_item),
                                        FOREIGN KEY (id_usuario_responsavel) REFERENCES usuario(id_usuario)
                                    
                                    )""")
            self.banco_de_dados.commit()

        # ========================================================
        if not self.exist_table( self.history_register_product_table_name ):
            cursor_do_banco.execute(f"""
                                    CREATE TABLE {self.history_register_product_table_name} (
                                        id_historico INTEGER PRIMARY KEY AUTOINCREMENT,
                                        tipo_registro INTEGER NOT NULL,
                                        id_produto INTEGER NOT NULL,
                                        quantidade INTEGER NOT NULL,
                                        id_usuario_responsavel INTERGER NOT NULL,
                                        observacao TEXT,
                                        data DATE,
                                        FOREIGN KEY (id_produto) REFERENCES produto(id_item),
                                        FOREIGN KEY (id_usuario_responsavel) REFERENCES usuario(id_usuario),
                                        FOREIGN KEY (tipo_registro) REFERENCES tipo_registro(id_tipo)
                                    )""")
            self.banco_de_dados.commit()

        # ========================================================
        if not self.exist_table( self.history_register_church_table_name ):
            cursor_do_banco.execute(f"""
                                    CREATE TABLE {self.history_register_church_table_name} (
                                        id_historico INTEGER PRIMARY KEY AUTOINCREMENT,
                                        tipo_registro INTEGER NOT NULL,
                                        id_congregacao INTEGER NOT NULL,
                                        id_usuario_responsavel INTERGER NOT NULL,
                                        data DATE,
                                        FOREIGN KEY (id_congregacao) REFERENCES congregacao(id_congregacao),
                                        FOREIGN KEY (id_usuario_responsavel) REFERENCES usuario(id_usuario),
                                        FOREIGN KEY (tipo_registro) REFERENCES tipo_registro(id_tipo)
                                    )""")
            self.banco_de_dados.commit()

        # ========================================================
        if not self.exist_table( self.history_register_family_table_name ):
            cursor_do_banco.execute(f"""
                                    CREATE TABLE {self.history_register_family_table_name} (
                                        id_historico INTEGER PRIMARY KEY AUTOINCREMENT,
                                        tipo_registro INTEGER NOT NULL,
                                        id_familia INTEGER NOT NULL,
                                        id_usuario_responsavel INTERGER NOT NULL,
                                        data DATE,
                                        FOREIGN KEY (id_familia) REFERENCES familia(id_familia),
                                        FOREIGN KEY (id_usuario_responsavel) REFERENCES usuario(id_usuario),
                                        FOREIGN KEY (tipo_registro) REFERENCES tipo_registro(id_tipo)
                                    )""")
            self.banco_de_dados.commit()

        # ========================================================
        if not self.exist_table( self.type_record_table_name ):
            cursor_do_banco.execute(f"""
                        CREATE TABLE {self.type_record_table_name} (
                            id_tipo INTEGER PRIMARY KEY AUTOINCREMENT,
                            nome TEXT,
                            UNIQUE( id_tipo, nome )
                        )""")
            self.banco_de_dados.commit()

            tmp_sql_query = f"""INSERT INTO {self.type_record_table_name} (
                id_tipo,
                nome
            ) VALUES (
                1,
                'ENTRADA'
                )"""
            self.banco_de_dados.execute(tmp_sql_query)
            self.banco_de_dados.commit()

            tmp_sql_query = f"""INSERT INTO {self.type_record_table_name} (
                id_tipo,
                nome
            ) VALUES (
                2,
                'SAIDA'
                )"""
            self.banco_de_dados.execute(tmp_sql_query)
            self.banco_de_dados.commit()

            tmp_sql_query = f"""INSERT INTO {self.type_record_table_name} (
                id_tipo,
                nome
            ) VALUES (
                3,
                'CADASTRO'
                )"""
            self.banco_de_dados.execute(tmp_sql_query)
            self.banco_de_dados.commit()

            tmp_sql_query = f"""INSERT INTO {self.type_record_table_name} (
                id_tipo,
                nome
            ) VALUES (
                4,
                'ALTERACAO'
                )"""
            self.banco_de_dados.execute(tmp_sql_query)
            self.banco_de_dados.commit()

        # ========================================================
        if not self.exist_table( self.church_goals_table_name ):
            cursor_do_banco.execute(f'''
                            CREATE TABLE {self.church_goals_table_name} (
                                id_meta INTEGER PRIMARY KEY AUTOINCREMENT,
                                id_congregacao INTEGER,
                                status INTEGER,
                                quantidade_alimento INTEGER,
                                id_usuario_responsavel INTEGER,
                                data_criacao DATE,
                                prazo DATE,
                                UNIQUE(id_meta),
                                FOREIGN KEY (id_congregacao) REFERENCES congregacao(id_congregacao),
                                FOREIGN KEY (id_usuario_responsavel) REFERENCES usuario(id_usuario)
                            )
                        ''')
            
       # ========================================================
        if not self.exist_table( self.church_item_goals_table_name ):
            cursor_do_banco.execute(f'''
                            CREATE TABLE {self.church_item_goals_table_name} (
                                id_meta_item INTEGER PRIMARY KEY AUTOINCREMENT,
                                id_meta INTEGER,
                                id_produto INTEGER,
                                quantidade INTEGER,
                                FOREIGN KEY (id_meta) REFERENCES meta(id_meta),
                                FOREIGN KEY (id_produto) REFERENCES produto(id_item)
                            )
                        ''')


        cursor_do_banco.close()
    #===========================================================================
    # =
    #===========================================================================


    def exist_table(self, nome):
        cursor = self.banco_de_dados.cursor()
        cursor.execute("""
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name=?;
        """, (nome,))
        
        existe = cursor.fetchone()

        if existe:
            print(f"Tabela '{nome}' já existe.")
            return True
        
        else:
            return False

    async def query(self, sql_query = '', value_list = None):
        response = {
            "status" : 90,
            "content" : "Error"
        }

        if not value_list:
            value_list = []


        if not sql_query:
            return response


        try:
            conn = self.get_connection()
            cursor_do_banco = conn.cursor()
            if value_list:
                cursor_do_banco.execute(sql_query, value_list)

            else:
                cursor_do_banco.execute(sql_query)

            res = cursor_do_banco.fetchall()
            #print(" FUNCTION: ", res)
            response["content"] = res
            cursor_do_banco.close()
            conn.close()

            response["status"] = 0
            return response

        except Exception as error:
            print("ERROR: ", error)
            response["content"] = str(error)
            return response


    async def insert(self, table = '', columns = None, values = None):
        response = {
            "status" : 90,
            "content" : None
        }

        if not columns:
            columns = []

        if not values:
            values = []
        
        sql_query = f"""INSERT INTO {table} ({', '.join([str(column) for column in columns])}) VALUES ({', '.join([ self.placeholder_type for value in range(len(values))]) });"""
        #print(" SQL: ", sql_query)
        try:
            conn = self.get_connection()
            cursor_do_banco = conn.cursor()
            cursor_do_banco.execute(sql_query, values)
            #res = cursor_do_banco.fetchall()
            conn.commit()

            cursor_do_banco.close()
            conn.close()

            #print(" FUNCTION: ", res)
            response["status"] = 0
            response["content"] = True
            return response

        except sqlite3.IntegrityError as error:
            error_code = error.args[0]
    
            if "NOT NULL constraint failed" in error_code:
                response['status'] = 1299
                response["content"] = f"Você tentou efetuar um registro, mas faltando informação."

            elif "UNIQUE constraint failed" in error_code:
                response['status'] = 2067
                response["content"] = f"Você tentou registrar uma informação com dados duplicados na tabela: {table}"

            else:
                response["content"] = error_message

            return response


        except Exception as error:
            error_code = error.args[0]
            error_message = error.args[1] if len(error.args) > 1 else ''
            response['status'] = error_code
            print(" CODIGO DO ERRO: ", error_code, flush=1)
            if error_code == 2067:
                response["content"] = f"Você tentou registrar uma informação com dados duplicados na tabela: {table}"

            else:
                response["content"] = error_message


    async def alter( self, table = '', columns = None, values = None, column_name = None, id_value = None, conditions = None):
        response = {
            "status" : 90,
            "content" : None
        }
        if not table:
            return response

        if not columns:
            columns = []

        if not values:
            values = []

        if not conditions:
            conditions = []
            
        sql_query = ''
        if column_name and id_value:
            sql_query = f'UPDATE {table} SET {", ".join([f"{col}=?" for col in columns])} { f"WHERE {column_name}={id_value}" if column_name else None}; '

        elif conditions:
            sql_query = f'UPDATE {table} SET {", ".join([f"{col}=?" for col in columns])} WHERE {"".join([condition for condition in conditions])}; '

        else:
            sql_query = f'UPDATE {table} SET {", ".join([f"{col}=?" for col in columns])};'
        
        #print(" ALTER QUERY: ", sql_query)
        try:
            conn = self.get_connection()
            cursor = conn.cursor()

            cursor.execute(sql_query, values)
            conn.commit()
            
            cursor.close()
            conn.close()

            response["status"] = 0
            response["content"] = True

        except sqlite3.IntegrityError as error:
            response['status'] = 2067
            response["content"] = "Você tentou registrar uma informação com dados duplicados"
            return response
        
        except Exception as error:
            response['status'] = 90
            response['content'] = str(error)
            return response

        return response


    async def delete(self, table, param):
        #print(" DELETE FUNCTION")
        #print(" PARAMS : TABLE= ", table, " PARAM: ", param)
        response = {
            "status" : 90,
            "content" : None
        }


        if not table:
            return response
        
        if not param:
            param = ''

        condition = ''

        if param:
            condition = f'WHERE {param}'
    
        delete_query = f"DELETE FROM {table} {condition};"

        try:
            #print(" Delete query: ", delete_query, flush=1)
            conn = self.get_connection()
            cursor = conn.cursor()
            cursor.execute( delete_query )
            conn.commit()

            cursor.close()
            conn.close()

            response["status"] = 0
            response["content"] = True
            

            return response
        
        except sqlite3.Error as error:
            response['status'] = 90
            response["content"] = str(error)
            return response
        
        except Exception as error:
            response["status"] = 90,
            response['content'] = error


    async def getAllData( self, table ):
        response = {
            "status" : 90,
            "content" : "Error"
        }

        if not table:
            response["content"] = "Nenhuma coluna especificada"
            return response

        sql_query = f"SELECT * FROM {table}"

        try:
            conn = self.get_connection()
            
            cursor_do_banco = conn.cursor()

            cursor_do_banco.execute(sql_query)
            res = cursor_do_banco.fetchall()
            
            #print(" FUNCTION: ", res)
            response["content"] = res
            
            
            cursor_do_banco.close()
            conn.close()

            response["status"] = 0
            return response

        except Exception as error:
            #print("ERROR: ", error)
            response["content"] = str(error)
            return response

    async def getSequence( self, table ):
        response = {
            "status" : 90,
            "content" : "Error"
        }

        sql_query = f"SELECT seq FROM sqlite_sequence WHERE name = ?;"
        values = [
            table
        ]
        try:
            conn = self.get_connection()
            cursor = conn.cursor()

            cursor.execute( sql_query, values )
            sequence_response = cursor.fetchall()
            
            response["status"] = 0
            #print("sequence: ", sequence_response, flush=1)
            if sequence_response:
                sequence_response = sequence_response[0][0]

            else:
                sequence_response = 0

            response['content'] = sequence_response

            cursor.close()
            conn.close()

        except Exception as error:
            response["status"] = 90
            response["content"] = error

        
        return response


if __name__ == "__main__":
    db_connection = GCBBase()
    response = db_connection.query("SELECT * FROM familia")
    #print( "db_connection: ", response)