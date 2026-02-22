#!/bin/python3.10
import sqlite3

class GCBBase:
    def __init__(self, dbname):
        self.dbname = dbname
        self.banco_de_dados = sqlite3.connect( self.dbname )
        self.placeholder_type = '?'
        self.church_table_name = 'congregacao'
        self.basket_table_name = 'cesta_basica'
        self.family_table_name = 'familia'
        self.history_adjustment_invetory_table_name = "historico_ajuste_produto"
        self.history_register_church_table_name = 'historico_congregacao'
        self.history_register_family_table_name = 'historico_familia'
        self.history_register_product_table_name = 'historico_produto'
        self.basket_item_table_name = 'item_cesta_basica'
        self.church_goals_table_name = 'meta'
        self.church_item_goals_table_name = 'meta_item'
        self.order_basket_table_name = 'ordem_cesta_basica'
        self.product_table_name = 'produto'
        self.priority_table_name = 'prioridade'
        self.output_table_name = 'saida'
        self.item_output_table_name = 'saida_item'
        self.type_record_table_name = 'tipo_registro'
        self.user_table_name = 'usuario'

        self.init_db()


    def get_connection( self ):
        return sqlite3.connect( self.dbname)

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

            tmp_values = [
                "IGREJA EVANGÉLICA ASSEMBLEIA DE DEUS EM UBATUBA - CENTRAL",
                "ELISEU",
                500,
                "UBATUBA",
                "CENTRO",
                "RUA PROFESSOR THOMAZ GALHARDO",
                485,
                "11680-000",
                "SP",
                True,
                1,
                "2025-12-26",
                "2025-12-26",

            ]

            tmp_placeholders = [ '?' for column in tmp_values]

            tmp_placeholders = ', '.join( tmp_placeholders )

            tmp_sql_query = f"""INSERT INTO {self.church_table_name} (
                                        nome,
                                        representante,
                                        membros,
                                        cidade,
                                        bairro,
                                        rua,
                                        numero,
                                        cep,
                                        uf,
                                        status_cadastro,
                                        id_usuario_responsavel,
                                        data_criacao,
                                        ultima_alteracao

                                    ) VALUES (
                                        { tmp_placeholders }
                                    );
                                    """
            cursor_do_banco.execute( tmp_sql_query, tmp_values )
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
        if not self.exist_table( self.item_output_table_name ):
            cursor_do_banco.execute(f"""
                                    CREATE TABLE {self.item_output_table_name} (
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
        if not self.exist_table( self.product_table_name ):
            cursor_do_banco.execute(f"""
                                    CREATE TABLE {self.product_table_name} (
                                        id_item INTEGER PRIMARY KEY AUTOINCREMENT,
                                        nome_do_produto TEXT NOT NULL,
                                        marca TEXT,
                                        quantidade_do_item INTEGER NOT NULL,
                                        status_cadastro BOOLEAN NOT NULL,
                                        id_usuario_responsavel INTEGER,
                                        data_criacao DATE,
                                        ultima_alteracao DATE,
                                        UNIQUE(id_item, nome_do_produto),
                                        FOREIGN KEY (id_usuario_responsavel) REFERENCES usuario(id_usuario)
                                    )""")
            self.banco_de_dados.commit()

        # ========================================================
        if not self.exist_table( self.user_table_name ):
            cursor_do_banco.execute(f"""
                                    CREATE TABLE {self.user_table_name} (
                                        id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
                                        nome_do_usuario TEXT NOT NULL,
                                        senha VARCHAR(500),
                                        email TEXT,
                                        status_cadastro BOOLEAN,
                                        usuario_responsavel_da_alteracao INTEGER,
                                        usuario_responsavel_pelo_cadastro INTEGER,
                                        data_criacao DATE,
                                        data_alteracao DATE,
                                        UNIQUE(nome_do_usuario),
                                        FOREIGN KEY (usuario_responsavel_da_alteracao) REFERENCES usuario(id_usuario),
                                        FOREIGN KEY (usuario_responsavel_pelo_cadastro) REFERENCES usuario(id_usuario)
                                    );""")
            self.banco_de_dados.commit()


            tmp_values = [
                1,
                "'Admin'",
                "''",
                True,
                "'2026-01-01'",
                "'2026-01-01'",
                1,
                1,
            ]

            tmp_sql_query = f"""
                            INSERT INTO usuario (
                                    id_usuario,
                                    nome_do_usuario,
                                    email,
                                    status_cadastro,
                                    data_criacao,
                                    data_alteracao,
                                    usuario_responsavel_da_alteracao,
                                    usuario_responsavel_pelo_cadastro
                                ) VALUES (
                                    1,
                                    'ADMIN',
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
            cursor_do_banco = self.conn.cursor()
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
            self.banco_de_dados.commit()
            
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
        conn = self.get_connection()
        
        cursor = conn.cursor()
        cursor.execute( delete_query )

        cursor.close()
        conn.close()
        self.banco_de_dados.commit()

        response["status"] = 0
        response["content"] = True

        return response
        

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
            print("ERROR: ", error)
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
            print("sequence: ", sequence_response, flush=1)
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
    print( "db_connection: ", response)