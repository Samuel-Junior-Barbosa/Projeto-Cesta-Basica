import sqlite3

class GCBBase:
    def __init__(self, dbname = "/home/limin/Documentos/gcb_banco.db"):
        self.dbname = dbname
        self.banco_de_dados = sqlite3.connect( self.dbname )
        self.placeholder_type = '?'
        self.family_table_name = 'familia'
        self.basket_item_table_name = 'item_cesta_basica'
        self.product_table_name = 'produto'

        self.init_db()


    def init_db(self):
        cursor_do_banco = self.banco_de_dados.cursor()
        if not self.exist_table( f"{self.family_table_name}" ):
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
                                    telefone TEXT NOT NULL,
                                    status_cadastro BOOLEAN NOT NULL,
                                    data_cadastro DATE,
                                    ultima_alteracao DATE
                                    )""")
            self.banco_de_dados.commit()
        

        if not self.exist_table( "congregacao" ):
            cursor_do_banco.execute("""
                                    CREATE TABLE congregacao (
                                    id_congregacao INTEGER PRIMARY KEY AUTOINCREMENT,
                                    nome TEXT NOT NULL,
                                    representante TEXT NOT NULL,
                                    membros INTEGER,
                                    cidade TEXT NOT NULL,
                                    bairro TEXT NOT NULL,
                                    rua INTEGER NOT NULL,
                                    numero INTEGER NOT NULL,
                                    cep TEXT,
                                    uf TEXT NOT NULL
                                    status_cadastro BOOLEAN NOT NULL,
                                    data_criacao DATE,
                                    ultima_alteracao DATE,
                                    UNIQUE( nome )
                                    )""")
            self.banco_de_dados.commit()
            cursor_do_banco.execute("""INSERT INTO congregacao (
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
                                        data_criacao,
                                        ultima_alteracao
                                    ) VALUES (
                                        "IGREJA EVANGÉLICA ASSEMBLEIA DE DEUS EM UBATUBA - CENTRAL",
                                        "ELISEU",
                                        500,
                                        "UBATUBA",
                                        "CENTRO",
                                        "RUA PROFESSOR THOMAZ GALHARDO",
                                        485,
                                        "11680-000",
                                        "SP",
                                        true,
                                        "2025-12-26",
                                        "2025-12-26",
                                    )
                                    """)
            self.banco_de_dados.commit()


        if not self.exist_table( "cesta_basica" ):
            cursor_do_banco.execute("""
                                    CREATE TABLE cesta_basica (
                                    id_cesta INTEGER PRIMARY KEY AUTOINCREMENT,
                                    nome_da_cesta TEXT NOT NULL,
                                    cadastro_ativo BOOLEAN NOT NULL,
                                    UNIQUE(nome_da_cesta)
                                    )""")
            self.banco_de_dados.commit()


        if not self.exist_table( "item_cesta_basica" ):
            cursor_do_banco.execute("""
                                    CREATE TABLE item_cesta_basica (
                                        id_item INTEGER NOT NULL,
                                        id_cesta INTEGER NOT NULL,
                                        quantidade_do_item INTEGER NOT NULL
                                    )""")
            self.banco_de_dados.commit()


        if not self.exist_table( "ordem_cesta_basica" ):
            cursor_do_banco.execute("""
                                    CREATE TABLE ordem_cesta_basica (
                                        id_ordem INTEGER NOT NULL,
                                        data_criacao INTEGER NOT NULL,
                                        prazo_entrega INTEGER NOT NULL,
                                        status INTEGER NOT NULL
                                    )""")
            self.banco_de_dados.commit()



        if not self.exist_table( "saida" ):
            cursor_do_banco.execute("""
                                    CREATE TABLE saida (
                                        id_cesta INTEGER,
                                        id_produto INTEGER NOT NULL,
                                        id_usuario INTEGER NOT NULL,
                                        quantidade INTEGER NOT NULL,
                                        data_saida DATE,
                                        tipo_saida INTEGER NOT NULL
                                    )""")
            self.banco_de_dados.commit()

        if not self.exist_table( "produto" ):
            cursor_do_banco.execute("""
                                    CREATE TABLE produto (
                                        id_item INTEGER PRIMARY KEY AUTOINCREMENT,
                                        nome_do_produto TEXT NOT NULL,
                                        marca TEXT,
                                        quantidade_do_item INTEGER NOT NULL,
                                        status_cadastro BOOLEAN NOT NULL,
                                        data_criacao DATE,
                                        ultima_alteracao DATE,
                                        UNIQUE(nome_do_produto)
                                    )""")
            self.banco_de_dados.commit()


        if not self.exist_table( "usuario" ):
            cursor_do_banco.execute("""
                                    CREATE TABLE usuario (
                                        id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
                                        nome_do_usuario TEXT NOT NULL,
                                        email TEXT,
                                        status_cadastro BOOLEAN,
                                        data_criacao DATE,
                                        data_alteracao DATE,
                                        UNIQUE(nome_do_usuario)
                                    )
                                """)
            self.banco_de_dados.commit()


        if not self.exist_table( "prioridade" ):
            cursor_do_banco.execute("""
                                    CREATE TABLE prioridade (
                                    id_prioridade INTEGER PRIMARY KEY AUTOINCREMENT,
                                    descricao TEXT NOT NULL UNIQUE,
                                    nivel_prioridade INTEGER,
                                    data_criacao DATE,
                                    data_alteracao DATE
                                    )""")
            self.banco_de_dados.commit()
            cursor_do_banco.execute("""INSERT INTO prioridade (
                                        descricao, nivel_prioridade, data_criacao, data_alteracao
                                    ) VALUES (
                                        'Baixo', 1, date('now'), date('now')
                                    )""")
            cursor_do_banco.execute("""INSERT INTO prioridade (
                                        descricao, nivel_prioridade, data_criacao, data_alteracao
                                    ) VALUES (
                                        'Medio', 2, date('now'), date('now')
                                    )""")
            cursor_do_banco.execute("""INSERT INTO prioridade (
                                        descricao, nivel_prioridade, data_criacao, data_alteracao
                                    ) VALUES (
                                        'Alta', 3, date('now'), date('now')
                                    )""")
            self.banco_de_dados.commit()

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

    async def query(self, sql_query = ''):

        response = {
            "status" : 90,
            "content" : "Error"
        }

        if not sql_query:
            return response


        try:
            cursor_do_banco = self.banco_de_dados.cursor()
            cursor_do_banco.execute(sql_query)
            res = cursor_do_banco.fetchall()
            #print(" FUNCTION: ", res)
            response["content"] = res
            cursor_do_banco.close()

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
        print(" SQL: ", sql_query)
        try:
            cursor_do_banco = self.banco_de_dados.cursor()
            cursor_do_banco.execute(sql_query, values)
            res = cursor_do_banco.fetchall()
            self.banco_de_dados.commit()
            cursor_do_banco.close()
            print(" FUNCTION: ", res)
            response["status"] = 0
            response["content"] = True
            return response

        except sqlite3.IntegrityError as error:
            print("ERROR: ", error, type(error))
            response["status"] = 2067
            response["content"] = str(error)
            return response


        except Exception as error:
            print("ERROR: ", error, type(error))
            response["content"] = str(error)
            return response


    async def alter( self, table = '', columns = None, values = None, id_column = None, id_value = None):
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
        
        sql_query = f'UPDATE {table} SET {", ".join([f"{col}=?" for col in columns])} { f"WHERE {id_column}={id_value}" if id_column else ""} '
        print(" ALTER QUERY: ", sql_query)
        cursor = self.banco_de_dados.cursor()
        cursor.execute(sql_query, values)
        self.banco_de_dados.commit()
        cursor.close()

        response["status"] = 0
        response["content"] = True

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
        cursor = self.banco_de_dados.cursor()
        cursor.execute( delete_query )
        cursor.close()
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
            cursor_do_banco = self.banco_de_dados.cursor()
            cursor_do_banco.execute(sql_query)
            res = cursor_do_banco.fetchall()
            #print(" FUNCTION: ", res)
            response["content"] = res
            cursor_do_banco.close()

            response["status"] = 0
            return response

        except Exception as error:
            print("ERROR: ", error)
            response["content"] = str(error)
            return response

if __name__ == "__main__":
    db_connection = GCBBase()
    response = db_connection.query("SELECT * FROM familia")
    print( "db_connection: ", response)