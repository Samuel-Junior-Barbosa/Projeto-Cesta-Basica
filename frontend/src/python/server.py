from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import asyncio
import json
from fastapi import Depends
from datetime import date


import db_conection

base_de_dados = db_conection.GCBBase()

app = FastAPI()

#========================
# Autentication class
#========================

class AuthRequest( BaseModel ):
    username: str
    password: str

class AuthResponse( BaseModel ):
    status: str
    content: dict

#===============================================
# Stock
#===============================================


# =========
# Priority
# =========

class DeletePriorityRegistration( BaseModel ):
    id_priority : str


class RegistrationPriority( BaseModel ):
    descricao : str
    nivel : int

#===============================================
# Family
#===============================================

class SearchRegisterFamilyRequest( BaseModel ):
    representativeRecive : str
    columnName : str

class SearchRegisterFamilyByIdRequest( BaseModel ):
    idFamily : str

#===============================================
# Church
#===============================================
class SearchRegisterChurchRequest( BaseModel ):
    churchName : str
    columnName : str


class SearchRegisterChurchByIdRequest( BaseModel ):
    idChurch : int


class SearchForChurchGoalItem( BaseModel ):
    churchId     : int
    goalItemName : str
    columnName   : str





#===============================================
# Basket
#===============================================
class SearchRegisterBasketRequest( BaseModel ):
    basketModelName : str
    columnName      : str


class SearchRegisterBasketOrderRequest( BaseModel ):
    basketModelName : str
    columnName      : str


class SearchBasketItemRequest( BaseModel ):
    searchValue : str
    columnName     : str

class SearchByHistoryBasketModel( BaseModel ):
    idBasket : str


class GetHistoryBasketModelItem( BaseModel ):
    idBasket  : str

class GetBasketModelItemList( BaseModel ):
    idBasket  : str


#===============================================
# Others Responses
#===============================================
class SearchRequest( BaseModel ):
    itemName   : str
    columnName : str
    limit      : int


class SearchResponse( BaseModel ):
    status : int
    content : dict


class GetResponse( BaseModel ):
    status  : int
    content : dict


class ResponseModel( BaseModel ):
    status  : str
    content : list
    
#===============================================
#=
#===============================================

class ResponseRequest:

    def __init__(self, status = 90, content = 'Error'):
        self.status = status
        self.content = content

    
    def set_status( self, new_status ):
        self.status = new_status
    
    def get_status( self ):
        return self.status


    def set_content( self, new_content ):
        self.content = new_content

    def get_content( self ):
        return self.content

  
#===============================================
#=
#===============================================


#================================================
#= Autentication
#===================================================
@app.post("/authentication")
async def authentication(data: AuthRequest):
    username = data.username
    password = data.password
    response = None
    #print("Autenticando: ", username, password)

    #Implementação de uma logica de autenticação
    if username == "Admin" and password == "admin":
        response= {
            "status": 0,
            "content" : {"username": username, "role" : "admin"}
        }
    
    elif username == "Operador" and password == "operador":
        response= {
            "status": 0,
            "content" : {"username": username, "role" : "operator"}
        }

    elif username == "Visitante" and password == "visitante":
        response= {
            "status": 0,
            "content" : {"username": username, "role" : "visit"}
        }

    else:
        response=  {
            "status": 90,
            "content" : {"username" : "", "role" : ""},
        }
    
    #print("AUTENTICATION FUNCTION RETURN: ", response)
    return response

#==============================================
#= Stock
#===============================================


@app.get("/get-all-stock-data")
async def get_stock_data():
    try:
        #get_lista_de_itens = listaDeItens.copy()
        get_lista_de_itens = await base_de_dados.getAllData("produto")
     
        return {"status": 0, "content" : get_lista_de_itens["content"]}
    
    except Exception as error:
        print("OCORREU UM ERRO AO OBTER ESTOQUE: ", error, flush=1)
        return {"status": 90, "content" : None}


@app.get("/get-stock")
async def get_stock():
    response = await base_de_dados.query(f'''
    SELECT
        id_item,
        nome_do_produto,
        marca,
        quantidade_do_item
    FROM produto''')

    return response


async def register_product_on_stock(id_product, product_name, march_name, quantity):
    response = {
        "status" : 90,
        "content" : "Error"
    }
    if type(id_product).__name__ == 'str':
        if id_product == '':
            id_product = 0
        
        else:
            try:
                id_product = int(id_product)
            
            except:
                id_product = 0

    column_list = []

    column_list = [
        'id_item',
        'nome_do_produto',
        'marca',
        'quantidade_do_item',
        'status_cadastro',
        'data_criacao',
        'ultima_alteracao'
    ]

    value_list = [
        id_product,
        product_name,
        march_name,
        quantity,
        True,
        date.today(),
        date.today()
    ]

    if id_product <= 0:
        column_list.pop(0)
        value_list.pop(0)

    response = await base_de_dados.insert("produto", column_list, value_list)
    return response
    


@app.post("/register-product-on-stock")
async def register_product_on_stock_api(data : dict):
    response = {
        "status" : 90,
        "content": "Error"
    }

    print(" DaTA: ", data)

    id_product = data["idProduct"]
    product_name = data["productName"]
    march_name = data["marchName"]
    quantity = data["quantity"]

    response = await register_product_on_stock(id_product, product_name, march_name, quantity)
    return response

#PRECISA REFATORAR
@app.post("/search-stock")
async def search_on_stock(data : dict):
    print(f"search for item... {data['itemName']}", flush=1)
    columnName = data['columnName']
    itemName = data['itemName']
    response = {
        "status" : 90,
        "content" : "Error"
    }

    sql_query = f"""
    SELECT
        *
    FROM produto
    WHERE nome_do_produto LIKE '{itemName}%'
    """

    response = await base_de_dados.query(sql_query)


    return response


@app.post("/alter-product-on-stock")
async def alter_product_on_stock( data : dict ):
    response = {
        "status" : 90,
        "content": "Error"
    }

    print("alter product on stock: ", data, flush=1)

    id_product = data['idProduct']
    product_name = data['productName']
    march_name = data["marchName"]    
    quantidade = data['quantity']
    status_register = data['registerStatus']
    
    alter_data = date.today()

    column_list = [
        'nome_do_produto',
        'marca',
        'quantidade_do_item',
        'status_cadastro',
        'ultima_alteracao'
    ]

    value_list = [
        product_name,
        march_name,
        quantidade,
        status_register,
        alter_data
    ]

    await base_de_dados.alter(table=base_de_dados.product_table_name, columns=column_list, values=value_list, id_column='id_item', id_value= id_product)

    return response


async def delete_product_from_stock( idProduct ):
    response = {
        "status" : 90,
        "content" : "Error"
    }

    if not idProduct:
        return response
    
    param = f'id_item = {idProduct}'
    response = await base_de_dados.delete(base_de_dados.product_table_name, param=param )

    return response


@app.post("/delete-product-from-stock")
async def delete_product_from_stock_api(data : dict):
    response = {
        "status" : 90,
        "content" : "Error"
    }

    print(" DELETE PRODUCT: ", data)

    if not data:
        return response
    
    idProduct = data["idProduct"]


    response = await delete_product_from_stock( idProduct )

    return response


#==============================================
#= Family
#===============================================
   
    #======================
    #====== Priority ======
    #======================

async def get_priority_registration_data():
    #priority_registration_list_data = priority_registration_data.copy()
    priority_registration_list_data = await base_de_dados.query("SELECT * FROM prioridade")
    #print(" Priority data: ", priority_registration_list_data)
    return {
        "status": 0,
        "content" : priority_registration_list_data['content']
        }


@app.post("/alter-priority-data")
async def alter_priority_registration_data(data : dict):
    response = {
        "status" : 90,
        "content" : None
    }


    priorityId          = data['priorityId']
    priorityDescription = data['priorityDescription']
    priorityLevel       = data['priorityLevel']
    alterationData      = date.today()

    column_list = [
        'id_prioridade', 
        'descricao',
        'nivel_prioridade',
        'data_alteracao'
        ]

    values_list = [
        priorityId,
        priorityDescription,
        priorityLevel,
        alterationData
    ]

    response = await base_de_dados.alter('prioridade', column_list, values_list, 'id_prioridade', id_value=priorityId)
    
    return response


@app.post("/delete-priority-registration")
async def delete_priority_registration( data : DeletePriorityRegistration ):
    response = {
        "status" : 90,
        "content" : None
    }
    id_priority = int(data.id_priority)


    verification = await base_de_dados.query(f"SELECT * FROM familia WHERE id_prioridade = {id_priority}")
    print(" VERIFICATION: ", verification, type(verification['content']), flush=1)
    if type(verification['content']).__name__ != 'str':
        if len(verification['content']) > 0:
            response["content"] = "Existe Familias com essa prioridade cadastrada. Para remover, ninguem deve estar utilizando essa prioridade"
            return response


    #sql_query = f'DELETE FROM prioridade WHERE id_prioridade= {id_priority}'
    table = "prioridade"
    param = f"id_prioridade= {id_priority}"
    response = await base_de_dados.delete( table, param )
    print(" RETORNO: ", response)
    return response

    
    
@app.post("/registration-priority-data")
async def registration_priority_data( data : RegistrationPriority ):
    response = {
        "status" : 90,
        "content" : None
    }


    description = data.descricao
    level = data.nivel

    column_list = [
        "descricao",
        "nivel_prioridade",
        "data_criacao",
        "data_alteracao"
    ]

    value_list = [
        description,
        level,
        date.today(),
        date.today()
    ]

    response = await base_de_dados.insert("prioridade", column_list, value_list)

    return response

def get_priority_registration_value_by_id_func( id_value ):
    if type(id_value).__name__ != 'str':
        id_value = str(id_value)

    priority_data = get_priority_registration_data()
    priority_list = priority_data['content']
    #print("IDVALUE: ", id_value, type(id_value), flush=1)
    for priority in priority_list:
        #print("Priority ID: ", priority['id'], flush=1)    
        if id_value == priority['id']:
            #print("Priority: ", priority, flush=1)    
            return priority['Nivel']

    return None


def get_priority_registration_name_by_id_func( id_value ):
    if type(id_value).__name__ != 'str':
        id_value = str(id_value)

    priority_data = get_priority_registration_data()
    priority_list = priority_data['content']
    print("IDVALUE: ", id_value, type(id_value), flush=1)
    for priority in priority_list:
        print("Priority ID: ", priority['id'], flush=1)    
        if id_value == priority['id']:
            print("Priority: ", priority, flush=1)    
            return priority['Prioridade']

    return None


def get_priority_registration_id_by_name_func( name_priority ):
    if type(name_priority).__name__ != 'str':
        name_priority = str(name_priority)

    priority_data = get_priority_registration_data()
    priority_list = priority_data['content']
    #print("IDVALUE: ", name_priority, type(name_priority), flush=1)
    for priority in priority_list:
        #print("Priority ID: ", priority['Prioridade'], flush=1)    
        if name_priority == priority['Prioridade']:
            #print("Priority: ", priority, flush=1)    
            return priority['id']

    return None


@app.get("/get-priority-registration-value-by-id")
async def get_priority_registration_value_by_id( data : str = '' ):
    if not data:
        return {
            'status' : 90,
            'content' : None
        }
    id_value = data['idValue']
    if type(id_value).__name__ != 'str':
        id_value = str(id_value)

    response = await get_priority_registration_value_by_id_func( id_value )
    return {
        'status' : 0,
        'content' : response
    }


@app.get("/get-priority-registration-name-by-id")
async def get_priority_registration_name_by_id( data : str = '' ):
    if not data:
        return {
            'status' : 90,
            'content' : None
        }
    id_value = data['idValue']
    if type(id_value).__name__ != 'str':
        id_value = str(id_value)

    response = await get_priority_registration_name_by_id_func( id_value )
    return {
        'status' : 0,
        'content' : response.content
    }

@app.get("/get-priority-registration-id-by-name")
async def get_priority_registration_id_by_name( namePriority ):
    print("DATA: ", namePriority)
    if not namePriority:
        return {
            'status' : 90,
            'content' : None
        }
    name_priority = namePriority
    if type(name_priority).__name__ != 'str':
        name_priority = str(name_priority)

    response = get_priority_registration_id_by_name_func( name_priority )
    return {
        'status' : 0,
        'content' : response
    }


@app.get("/get-priority-registration-data")
async def get_priority_family_list():
    return await get_priority_registration_data()

@app.get("/get-priority-registration-value")
async def get_priority_family_information(data):
    if not data:
        return {
            'status' : 90,
            'content' : None
        }
    priority_id = data['id']
    return get_priority_registration_data(priority_id)




#==================================================================================

    #==================================================
    # = Obter lista de familias cadastradas
    #==================================================


async def get_family_data():
    #get_family_list = family_list.copy()
    response = await base_de_dados.query("""
                        SELECT
                            id_familia,
                            id_prioridade,
                            representante,
                            membros,
                            cidade,
                            bairro,
                            rua,
                            numero_da_casa,
                            telefone,
                            id_congregacao              
                        FROM familia""")
    for I in range( len(response['content']) ):
        #print(" RESPONSE: ", list(response["content"][I]))
        response['content'][I] = list(response['content'][I])
    

    return response


async def get_all_family_data():
    #get_family_list = family_list.copy()
    response = await base_de_dados.query(" SELECT * FROM familia")
    for I in range( len(response['content']) ):
#        print(" RESPONSE: ", list(response["content"][I]))
        response['content'][I] = list(response['content'][I])

    return response


@app.get("/get-family-data")
async def get_family_list():
    #family_data_list = await get_family_data()
    #priority_list = await get_priority_registration_data()
    #print("PRIOLIST: ", priority_list, flush=1)
    #print("family LIST1: ", family_data_list['content'])
    sql_query= """
        SELECT
            id_familia,
            representante,
            membros,
            cidade,
            bairro,
            rua,
            numero_da_casa,
            telefone,
            id_prioridade,
            id_congregacao
        FROM familia"""
    family_data_list = await base_de_dados.query(sql_query)
    for I in range( len(family_data_list['content']) ):
        #print(" RESPONSE: ", list(family_data_list["content"][I]))
        family_data_list['content'][I] = list(family_data_list['content'][I])
    
    return family_data_list        


@app.get("/get-family-data-resolve-ids")
async def get_family_list_resolved():
    #family_data_list = await get_family_data()
    #priority_list = await get_priority_registration_data()
    #print("PRIOLIST: ", priority_list, flush=1)
    #print("family LIST1: ", family_data_list['content'])
    sql_query= """
        SELECT
            familia.id_familia,
            familia.representante,
            familia.membros,
            familia.cidade,
            familia.bairro,
            familia.rua,
            familia.numero_da_casa,
            familia.telefone,
            prioridade.descricao,
            congregacao.nome
        FROM familia
        INNER JOIN prioridade
        ON familia.id_prioridade = prioridade.id_prioridade
        INNER JOIN congregacao
        ON familia.id_congregacao = congregacao.id_congregacao """
    family_data_list = await base_de_dados.query(sql_query)
    for I in range( len(family_data_list['content']) ):
        #print(" RESPONSE: ", list(response["content"][I]))
        family_data_list['content'][I] = list(family_data_list['content'][I])
    
    return family_data_list        


@app.post("/search-for-family")
async def search_on_family_register(data: SearchRegisterFamilyRequest):
    print("search for family...", data, flush=1)
    family_register_data = await get_family_data()
    
    representativeRecive = data.representativeRecive
    columnName = data.columnName
    found_registers = []
    if representativeRecive == '':
        print("Return all data")
        return  {"status" : 0, "content" : family_register_data["content"]}
    
    try:
        for index in family_register_data["content"]:
            #print("index: ", index)
            for key, value in index.items():
                if key == columnName:
                    #print(" register: ", str(value[:len(representativeRecive)]), str(value[:len(representativeRecive)]) == representativeRecive)
                    if representativeRecive == value[:len(representativeRecive)]:
                        #print("REGISTRO ENCONTRADO: ", index)
                        found_registers.append(index)

    except Exception as error:
        print( error)
        return {"status" : 90, "content" : str(error)}
    
    #print("Return result of search: ", found_registers)
    return {"status" : 0, "content" : found_registers}



@app.post("/search-for-family-by-id")
async def search_on_family_register_by_id(data: SearchRegisterFamilyByIdRequest ):
    print("search for family...", data, flush=1)
    
    
    idFamily = data.idFamily
    #print(" idFamily: ", idFamily)
    found_registers = []
    if idFamily == '':
        print("Return all data")
        #family_register_data = await get_family_data()
        #return  {"status" : 0, "content" : family_register_data["content"]}
        return await get_all_family_data()
    
    try:
        found_registers = await base_de_dados.query(f"""
            SELECT
                familia.id_familia,
                familia.representante,
                familia.membros,
                familia.cidade,
                familia.bairro,
                familia.rua,
                familia.numero_da_casa,
                familia.telefone,
                familia.id_prioridade,
                familia.id_congregacao
            FROM familia
            WHERE id_familia = {idFamily} """)
        found_registers = found_registers["content"]


    except Exception as error:
        print( error)
        return {"status" : 90, "content" : str(error)}
    
    #print("Return result of search: ", found_registers)
    return {"status" : 0, "content" : found_registers}


@app.post("/search-for-family-by-id-resolve-ids")
async def search_on_family_register_by_id_resolved(data: SearchRegisterFamilyByIdRequest ):
    print("search for family...", data, flush=1)
    
    
    idFamily = data.idFamily
    #print(" idFamily: ", idFamily)
    found_registers = []
    if idFamily == '':
        print("Return all data")
        #family_register_data = await get_family_data()
        #return  {"status" : 0, "content" : family_register_data["content"]}
        return await get_all_family_data()
    
    try:
        found_registers = await base_de_dados.query(f"""
            SELECT
                familia.id_familia,
                familia.representante,
                familia.membros,
                familia.cidade,
                familia.bairro,
                familia.rua,
                familia.numero_da_casa,
                familia.telefone,
                prioridade.descricao,
                congregacao.nome
            FROM familia
            INNER JOIN prioridade
            ON familia.id_prioridade = prioridade.id_prioridade
            INNER JOIN congregacao
            ON familia.id_congregacao = congregacao.id_congregacao 
            WHERE id_familia = {idFamily} """)
        found_registers = found_registers["content"]


    except Exception as error:
        print( error)
        return {"status" : 90, "content" : str(error)}
    
    #print("Return result of search: ", found_registers)
    return {"status" : 0, "content" : found_registers}


#=================================================




@app.post("/alter-family-data")
async def alter_family_data(data : dict = None ):
    #global family_list
    #print("data: ", data)

    if not data:
        return {
            "status" : 90,
            "content" : "error"
        }
    
    id_family          = data["idFamily"]
    id_church          = data['idChurch']
    #church_name        = data['churchName']
    representative     = data['representative']
    city               = data['city']
    members            = data['members']
    neighborhood       = data['neighborhood']
    street             = data['street']
    building_number    = data['buildingNumber']
    telephone          = data["telephoneNumber"]
    priority_id        = data["currentPriority"]
    print(" PRIORITY ID: ", priority_id, type(priority_id))
    if type(priority_id).__name__ != 'int':
        if not priority_id:
            priority_id = 0
        else:
            priority_id = int(priority_id)

    #response = await get_family_data()
    #family_data = response['content']

    column_list = [
        'representante',
        'membros',
        'cidade',
        'bairro',
        'rua',
        'numero_da_casa',
        'telefone',
        'id_prioridade',
        'id_congregacao',
        'ultima_alteracao'
        ]
    values = [
        representative,
        members,
        city,
        neighborhood,
        street,
        building_number,
        telephone,
        priority_id,
        id_church,
        date.today()
    ]

    
    await base_de_dados.alter( 'familia', column_list, values )
    

    return {
        "status" : 0,
        "content" : True
    }


@app.post("/registration-family-data")
async def registration_family_data(data : dict = None ):
    #global family_list
    response = {
        "status" : 90,
        "content" : "Erro"
    }
    print("data: ", data)

    if not data:
        response["content"] = "Sem informação para adicionar"
        return response
    
    church_id          = data["idChurch"]
    representative     = data['representative']
    city               = data['city']
    members            = data['members']
    neighborhood       = data['neighborhood']
    street             = data['street']
    building_number    = data['buildingNumber']
    telephone          = data["telephoneNumber"]
    priority_id        = data["currentPriority"]
    registration_status = data["registrationStatus"]
    
    if type(priority_id).__name__ != 'int' and priority_id != '':
        print(" priority_id: ", priority_id, type(priority_id))
        priority_id = int( priority_id )
        #para alguma mensagem personalizada, adicione algo no "content" do response
        response["content"] = "ID de prioridade invalido"
        return response

    if type(church_id).__name__ != 'int' and church_id != '':
        church_id = int( church_id )
        response["content"] = "ID da congregação invalido"
        return response

    #id = len(family_list) + 1
    column_list = [
                    'id_congregacao',
                    'id_prioridade',
                    'representante',
                    'membros',
                    'cidade',
                    'bairro',
                    'rua',
                    'numero_da_casa',
                    'telefone',
                    'status_cadastro',
                    'data_cadastro',
                    'ultima_alteracao'
                 ]
    value_list = [
                    church_id,
                    priority_id,
                    representative,
                    members,
                    city,
                    neighborhood,
                    street, 
                    building_number,
                    telephone,
                    registration_status,
                    str(date.today()),
                    str(date.today())
                ]

    registration_response = await base_de_dados.insert("familia", column_list, value_list)
    if registration_response["status"] == 0:
        response["status"] = 0
        response["content"] = "Registro adicionado com sucesso!"
        return response


    return registration_response


@app.post("/delete-family-data")
async def delete_family_data( data : dict = None ):
    response = {
        "status" : 90,
        "content" : "Error"
    }

    if not data:
        response["content"] = "ID invalido"
        return response
    
    id_family = data["if_family"]

    param = f"id_familia= {id_family}"

    db_response = await base_de_dados.delete(base_de_dados.family_table_name, param)
    if db_response["status"] == 0:
        response["status"] = 0
        response["content"] = "Deletado com sucesso"
    
    return response



#==============================================
#= Church
#===============================================

async def get_church_data():
    response = await base_de_dados.query("SELECT * FROM congregacao")
    #for I in range( len(response['content']) ):
#        print(" RESPONSE: ", list(response["content"][I]))
    #    response['content'][I] = list(response['content'][I])

    #print(" RESPONSE: ", response)
    return response


@app.get("/get-church-list")
async def get_church_list():
    return await get_church_data()


@app.post("/search-for-church")
async def search_on_church_register(data: SearchRegisterChurchRequest):
    print(f" ({data.churchName}) search for church...", flush=1)
    church_register_data = get_church_data()

    churchName = data.churchName
    columnName = data.columnName
    found_registers = []
    if churchName == '':
        return  {"status" : 0, "content" : church_register_data["content"]}
    
    try:
        for index in church_register_data["content"]:
            print("index: ", index)
            for key, value in index.items():
                if key == columnName:
                    if churchName == value[:len(churchName)]:
                        print("REGISTRO ENCONTRADO: ", index)
                        found_registers.append(index)

    except Exception as error:
        print( error)
        return {
            "status" : 90,
            "content" : str(error)
        }
    
    return {"status" : 0, "content" : found_registers}


@app.post("/search-for-church-by-id")
async def search_church_by_id(data : SearchRegisterChurchByIdRequest):
    response = {
        "status" : 90,
        "content" : None
    }    
    #print( "DATA: ", data)
    idChurch = data.idChurch
    church_data = await base_de_dados.query(f"""
                                      SELECT *
                                      FROM congregacao
                                      WHERE id_congregacao= {idChurch}
                                      """)
    
    response["status"] = 0
    response["content"] = church_data["content"][0]
    #print(" RESPONSE: ", response)
    return response


def get_church_goals_data():
    get_goals_data = goals_data.copy()
    return {"status" : 0, "content": get_goals_data}

@app.get("/get-church-goals")
def get_church_goals():
    return get_church_goals_data()

@app.post("/search-for-church-goals-item")
async def search_on_church_goals(data: SearchForChurchGoalItem):
    print(f" ({data.churchId})({data.goalItemName}) search for basket...", flush=1)
    goal_items_data = get_church_goals_data()

    churchId = data.churchId
    goalItemName = data.goalItemName
    columnName = data.columnName
    found_registers = []
    if goalItemName == '':
        return  {
            "status" : 0, "content" : goal_items_data["content"]
            }
    
    try:
        for index in goal_items_data["content"]:
            #print("index: ", index)
            for key, value in index.items():
                if key == columnName:
                    if goalItemName == value[:len(goalItemName)]:
                        print("REGISTRO ENCONTRADO: ", index)
                        found_registers.append(index)

    except Exception as error:
        print( error)
        return {
            "status" : 90,
            "content" : str(error)
        }
    
    return {"status" : 0, "content" : found_registers}

#================================================
#================================================


@app.post("/alter-church-data")
async def alter_church_data(data : dict = None ):

    id_church           = data['idChurch']
    church_name         = data['churchName']
    representative     = data['representative']
    city               = data['city']
    members            = data['members']
    neighborhood       = data['neighborhood']
    street             = data['street']
    building_number     = data['buildingNumber']

    response = get_church_data()
    church_data = response['content']
    for index in range(len(church_data)):
        print(church_data)
        if  church_data[index]['id'] == id_church:
            church_data[index]['id'] = id_church
            church_data[index]['Nome'] = church_name
            church_data[index]['Representante'] = representative
            church_data[index]['Membros'] = members
            church_data[index]['Cidade'] = city
            church_data[index]['Bairro'] = neighborhood
            church_data[index]['Rua'] = street
            church_data[index]['Numero'] = building_number
            church_register[index] = church_data[index]
            print(church_register)
            return {
                "status" : 0,
                "content" : True
            }

    
    return {
        "status" : 90,
        "content" : False
    }


#==============================================
#= Basket
#===============================================

async def get_basic_basket_food_data():
    try:
        #get_basic_basket_food_data = basic_basket_food_data.copy()   
        get_basic_basket_food_data = await base_de_dados.query("SELECT * FROM cesta_basica")
        return {"status": 0, "content" : get_basic_basket_food_data["content"]}

    except Exception as error:
        return {"status": 90, "content" : str(error)}


@app.get("/get-basket-list")
async def get_bascket_list():
    response = {
        "status" : 90,
        "content" : "Error"
    }

    response = await base_de_dados.query(f'''
    SELECT 
        id_cesta,
        nome_da_cesta
    FROM cesta_basica''')

    return response
    


@app.post("/register-basket-food-model")
async def register_basket_food_model(data : dict):
    response = {
        "status" : 90,
        "content" : "Error"
    }
    data = data["basketData"]
    #print("BASKETS DATA: ", data)
    nameBasicFoodBasket = data["nameBasicFoodBasket"]

    column_list = [
        'nome_da_cesta',
        'cadastro_ativo'
    ]

    value_list = [
        nameBasicFoodBasket,
        True
    ]

    responseInsert = await base_de_dados.insert("cesta_basica", column_list, value_list)
    print(" RESPONSE INSERT: ", responseInsert)
    responseBasket = await search_on_basket_register_by_name(nameBasicFoodBasket)
    print(" RESPONSE BaSkET: ", responseBasket)
    #basket_item_list.append(basketItemForRegister)
    if responseInsert['status'] == 0:
        response["status"] = 0
        if responseBasket["content"]:
            response["content"] = responseBasket["content"][0]

        return response

    response["status"] = responseInsert["status"]
    response["content"] = responseInsert["content"]

    return response


@app.post("/register-item-on-basket-model")
async def register_item_on_basket_model( data : dict ):
    response = {
        "status" : 90,
        "content" : None
    }
    data = data["basketData"]

    print(" register_item_on_basket_model: ", data, flush=1)
    idProduct = data["productId"]
    idBasket = data["idBasket"]
    nameItem = data["productName"]
    quantityProduct = data["productQuantity"]

    if not data:
        return response

    column_list = [
        'id_item',
        'id_cesta',
        'quantidade_do_item'
    ]

    value_list = [
        idProduct,
        idBasket,
        quantityProduct
    ]

    valid = await base_de_dados.query(f"SELECT * FROM item_cesta_basica WHERE id_cesta = {idBasket} and id_item= {idProduct}")
    if len(valid["content"]) > 0:
        response["status"] = 2067
        response["content"] = "O Item já está adicionado a essa cesta"
        return response

    result = await base_de_dados.insert("item_cesta_basica", column_list, value_list)

    response["status"] = result['status']
    response["content"] = result['content']
    return response


@app.post("/remove-registration-basket-model")
async def remove_registration_basket_model(data : dict):
    response = {
        "status" : 90,
        "content" : "Error"
    }
    idBasket = data["idBasket"]
    print("DATA: ", idBasket)

    param = f'id_cesta= {idBasket}'

    result_delete_basket = await base_de_dados.delete("cesta_basica", param)
    result_delete_item_basket = await base_de_dados.delete("item_cesta_basica", param)

    if result_delete_basket["status"] == 0 and result_delete_item_basket["status"] == 0:
        response["status"] = 0
        response["content"] = "Deletado com sucesso"

    return response


async def search_on_basket_register_by_name(basket_name):
    response = {
        "status" : 90,
        "content" : "Erro"
    }

    sql_query = f"SELECT * FROM cesta_basica where nome_da_cesta= '{basket_name}'"

    if not basket_name:
        sql_query = f"SELECT * FROM cesta_basica"

    search_result = await base_de_dados.query(sql_query)
    response["status"] = search_result["status"]
    response["content"] = search_result["content"]

    return response



@app.post("/search-for-basket")
async def search_on_basket_register_api(data: SearchRegisterBasketRequest):
    response = {
        "status" : 90,
        "content" : "Error"
    }
    
    
    return response

    print(f" ({data.searchValue})({data.columnName}) search for basket...", flush=1)
    basket_register_data = get_basic_basket_food_data()

    searchValue = data.basketModelName
    columnName = data.columnName
    found_registers = []
    if searchValue == '':
        return  {"status" : 0, "content" : basket_register_data["content"]}
    
    try:
        for index in basket_register_data["content"]:
            print("index: ", index)
            for key, value in index.items():
                if key == columnName:
                    if searchValue == value[:len(searchValue)]:
                        print("REGISTRO ENCONTRADO: ", index)
                        found_registers.append(index)

    except Exception as error:
        print( error)
        return {
            "status" : 90,
            "content" : str(error)
        }
    
    return {"status" : 0, "content" : found_registers}


@app.post("/remove-item-from-basket-model")
async def remove_item_from_basket_model_api( data : dict ):
    response = {
        "status" : 90,
        "content" : None
    }
    print( "remove-item-from-basket-model: ", data)
    idBasket = data["idBasket"]
    idProduct = data["productId"]

    response = await remove_item_from_basket_model(idBasket, idProduct)

    return response


async def remove_item_from_basket_model( idBasket, idProduct ):
    response = {
        "status" : 90,
        "content" : None
    }
    param = f'id_item = {idProduct} and id_cesta= {idBasket}'

    response = await base_de_dados.delete(base_de_dados.basket_item_table_name, param)

    return response


# PRECISA REFATORAR
def get_basic_basket_food_order_data():
    try:
        get_basic_basket_food_order_data = basic_basket_food_order_data.copy()
        return {
            "status": 0,
            "content" : get_basic_basket_food_order_data
        }

    except Exception as error:
        return {
            "status": 90,
            "content" : str(error)
        }



# PRECISA REFATORAR
@app.get("/get-basket-order-list")
async def get_backet_order_list():
    response= get_basic_basket_food_order_data()
    #print("RETURN BASKETS DATA: ", response)
    return response


# PRECISA REFATORAR
async def get_item_of_history_basket_model_order_data():
    get_item = history_basket_models_item_data.copy()
    response = {
        "status" : 0,
        "content" : get_item
    }
    return response


# PRECISA REFATORAR
async def get_item_of_history_basket_model_order_func( idOrder ):
    response = {
        "status" : 90,
        "status" : None
    }

    print(" idOrder: ", idOrder, flush=1)
    if not idOrder:
        return response
       

    get_item = await get_item_of_history_basket_model_order_data()
    get_item = get_item["content"]
    list_item = []
    for i in range( len(get_item ) ):
        #print(" GETITEM FORRING: ", get_item[i], flush=1)
        if idOrder == get_item[i]["iddaordem"]:
            list_item.append( get_item[i] )

    response["status"] = 0
    response["content"] = list_item
    return response


# PRECISA REFATORAR
@app.get("/get-item-of-history-basket-model-order")
async def get_item_of_history_basket_model_order( idOrder ):
    response = {
        "status" : 90,
        "content" : None
    }
    print(" GET ITEM: ", idOrder, flush=1)
    if not idOrder:
        return response
    
    
    get_item = await get_item_of_history_basket_model_order_func( idOrder )
    get_item = get_item["content"]

    response["status"] = 0
    response["content"] = get_item

    return response


# PRECISA REFATORAR
@app.post("/search-for-basket-order")
async def search_on_basket_order_register(data: SearchRegisterBasketOrderRequest):
    print(f" ({data.basketModelName})({data.columnName}) search for basket...", flush=1)
    basket_register_data = get_basic_basket_food_order_data()

    basketModelName = data.basketModelName
    columnName = data.columnName
    found_registers = []
    if basketModelName == '':
        return  {"status" : 0, "content" : basket_register_data["content"]}
    
    try:
        for index in basket_register_data["content"]:
            #print("index: ", index)
            for key, value in index.items():
                if key == columnName:
                    if basketModelName == value[:len(basketModelName)]:
                        print("REGISTRO ENCONTRADO: ", index)
                        found_registers.append(index)

    except Exception as error:
        print( error)
        return {
            "status" : 90,
            "content" : str(error)
        }
    
    return {"status" : 0, "content" : found_registers}


#==============================================
#===============================================

async def get_basket_model_items_func( idBasket ):
    global basket_item_list
    try:
        response = {
            "status" : 90,
            "content" : None
        }
        if not idBasket:
            return response
        
        get_basket_item_list = basket_item_list.copy()

        basket_item_list = []
        for i in range( len( get_basket_item_list ) ):
            if get_basket_item_list[i]["id da cesta"] == idBasket:
                basket_item_list.append(get_basket_item_list[i])


        response["status"] = 0
        response["content"] = basket_item_list
        return response

    except Exception as error:
        return {
            "status": 90,
            "content" : str(error)
        }


async def get_basket_model_items_data_func():
    global basket_item_list
    try:
        #get_basket_item_list = basket_item_list.copy()
        get_basket_item_list = await base_de_dados.getAllData("item_cesta_basica")
        return {
            "status": 0,
            "content" : get_basket_item_list["content"]
        }

    except Exception as error:
        return {
            "status": 90,
            "content" : str(error)
        }


@app.get("/get-basket-items-list-data")
async def get_backet_items_list_data():
    response= get_basket_model_items_data_func()
    #print("RETURN BASKETS DATA: ", response)
    return response


@app.get("/get-basket-items-list")
async def get_backet_items_list( data : GetBasketModelItemList = Depends() ):
    #print("Data: ", data)
    response = {
        "status" : 90,
        "content" : None
    }
    if not data:
        return response
    
    idBasket = data.idBasket
    
    response = await base_de_dados.query(f"""
        SELECT
            icb.id_item,
            produto.nome_do_produto,
            produto.marca,
            icb.quantidade_do_item
        FROM item_cesta_basica AS icb
        INNER JOIN produto ON
            icb.id_item = produto.id_item
        WHERE icb.id_cesta = {idBasket}

    """)


    #print("RETURN BASKETS DATA: ", response)
    return response


# PRECISA REFATORAr
async def get_history_basket_model_item_data():
    #get_history_basket_model_item = history_basket_models_item_data.copy()
    response = await base_de_dados.query('SELECT * FROM cesta_basica')

    return response



# PRECISA REFATORAr
@app.get("/get-all-history-basket-model-item-data")
async def get_all_history_basket_model_item():
    response = get_history_basket_model_item_data()
    return response

# PRECISA REFATORAr
@app.get("/get-history-basket-model-item-data")
async def get_history_basket_model_item(data : GetHistoryBasketModelItem = Depends()):
    print("idBasket: ", data.idBasket, flush=1)
    idBasket = data.idBasket
    found_item_list = []
    history_model_data = await get_history_basket_model_item_data()
    
    for i in range( len(history_model_data["content"]) ):
        #print("RESPONSE: I : ", response["content"], flush=1)
        if history_model_data["content"][i]["iddacesta"] == idBasket:
            found_item_list.append(history_model_data["content"][i])

    

    response = {
        "status" : 0,
        "content" : found_item_list
    }
    return response


# PRECISA REFATORAr
@app.post("/search-for-basket-item")
async def search_on_basket_item_register(data: SearchBasketItemRequest):
    print(f" ({data.searchValue})({data.columnName}) search for basket item...", flush=1)
    response = {
        "status" : 90,
        "content" : "Error"
    }

    
    searchValue = data.searchValue
    columnName = data.columnName

    sql_query = f"""
    SELECT 
        icb.id_item,
        produto.nome_do_produto,
        icb.quantidade_do_item
    FROM item_cesta_basica AS icb
    INNER JOIN produto ON
        icb.id_item = produto.id_item
    WHERE produto.nome_do_produto LIKE '{searchValue}%'
"""

    response = await base_de_dados.query(sql_query)


    return response


#==============================================
#==============================================

# PRECISA REFATORAR
def get_history_basket_models_data():
    get_history_basket_models_data = history_basket_models_data.copy()
    
    return {
        "status" : 0,
        "content" : get_history_basket_models_data
    }

# PRECISA REFATORAR
@app.get("/get-history-basket-models-data")
async def get_history_basket_models():
    return get_history_basket_models_data()


# PRECISA REFATORAR
async def get_history_basket_model_items_func( idBasket ):
    if not idBasket:
        return {
            "status" : 0,
            "content" : None
        }
    
    modelSelected = []
    status_code = 0
    historyModelResponse = get_history_basket_models_data()
    historyModel = []
    #print("Response: ", historyModelResponse)
      
    if historyModelResponse["status"] == 0:
        historyModel = historyModelResponse["content"]
    
    else:
        status_code = historyModelResponse["status"]

    if idBasket == '':
        return {
            "status" : 0,
            "content" : historyModelResponse["content"]
        }

    if status_code == 0:
        for model in historyModel:
            print("get_history_basket_model_items_func: ", model, flush=1)
            if model['id'] == idBasket:
                modelSelected = model
                break
    
    if not modelSelected:
        status_code = 90

    response = {
        "status" : status_code,
        "content" : modelSelected
    }

    print("get_history_basket_model_items_func returned: ", response)
    return response

# PRECISA REFATORAR
@app.get("/get-history-model")
async def get_history_basket_model_items(data : SearchByHistoryBasketModel = Depends()):
    if not data:
        return {
            "status" : 90,
            "content" : None
        }
    idBasket = data["idBasket"]
    response = get_history_basket_model_items_func( idBasket )
    return response

#=============================================
#==============================================




#==============================================
#=
#===============================================


if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8080, reload=True)