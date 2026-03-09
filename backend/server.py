from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBearer
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from pathlib import Path
from pydantic import BaseModel
import uvicorn
from datetime import date, datetime, timedelta
import calendar
import os
import sys
import time
import threading


import db_conection
import webview

load_dotenv()



from jose import jwt, JWTError
from passlib.context import CryptContext

SECRET_KEY = os.getenv("SECRET_KEY")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 8

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

security = HTTPBearer()


# Detecta se está rodando empacotado
if getattr(sys, "frozen", False):
    BASE_DIR = sys._MEIPASS
else:
    BASE_DIR = os.path.dirname(__file__)


static_path = os.path.join(BASE_DIR, "static")

data_base_address = str( Path(__file__).parent ) + '/db_banco.db'

#print("static_path: ", data_base_address, flush=1)
base_de_dados = db_conection.GCBBase( data_base_address )

app = FastAPI()



origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5173/*",
    "http://127.0.0.1:5173/*",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:8080/*",
    "http://127.0.0.1:8080/*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



__USER_LOGGED = {
    "username" : "",
    "role" : "",
    "id_user" : 1
}

INPUT_TYPE = 1
OUTPUT_TYPE = 2
REGISTRATION_TYPE = 3
ALTERATION_TYPE = 4
ADJUST_TYPE = 5
DELETE_TYPE = 6

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
#================================================


# =========================
# schemas
# =========================

class LoginInput(BaseModel):
    username: str
    password: str

# =========================
# helper: carregar permissões
# =========================



async def load_user_permissions(user_id: int):
    response = {
        'status' : 90,
        'content' : []
    }
    user_table_name = base_de_dados.user_table_name
    role_permission_table_name = base_de_dados.role_permission_table_name
    permisson_table_name = base_de_dados.permission_table_name

    sql_query = f"""
        SELECT 
            rp.id_permissao
        FROM {user_table_name} u
        LEFT JOIN {role_permission_table_name} rp
        ON rp.id_funcao = u.id_funcao
        LEFT JOIN {permisson_table_name} p
        ON p.id_permissao = rp.id_permissao
        WHERE u.id_usuario = {user_id};"""

    response = await base_de_dados.query( sql_query )

    return response

# =========================
# LOGIN
# =========================



async def get_user_list():
    response = {
        'status' : 90,
        'content' : []
    }

    table_name = base_de_dados.user_table_name

    sql_query = f''' 
    SELECT
        nome_do_usuario
    FROM {table_name}
    WHERE status_cadastro = 1;'''

    response = await base_de_dados.query(sql_query)
    for i in range(0, len(response['content'])):
        response['content'][i] = list(response["content"][i])

    return response


@app.post('/get-user-list')
async def get_user_list_api():
    response =  await get_user_list()
    #print(" GET USER LIST RESPONSE: ", response)
    return response


#@app.post("/login")
@app.post("/authentication")
async def login( data: dict):
    response = {
        'status' : 90,
        'content' : []
    }
    #print(" AUTH DATa: ", data,flush=1)

    username = data['username']
    password = data['password']

    user_table_name = base_de_dados.user_table_name
    role_table_name = base_de_dados.role_table_name


    sql_query = f"""
        SELECT
            u.id_usuario,
            u.nome_do_usuario,
            u.senha,
            u.id_funcao,
            rl.nome,
            status_cadastro
        FROM {user_table_name} u
        LEFT JOIN {role_table_name} rl
        ON rl.id_funcao = u.id_funcao
        WHERE nome_do_usuario = '{username}'
            AND status_cadastro = 1;"""
    user = await base_de_dados.query( sql_query )
    #print(" Sql: ", sql_query)
    #print(f" USER RESPONSE: ", data, ' ---- ', user, flush=1)
    if user['status'] == 0:
        if len(user["content"]) > 0:
            user = user["content"][0]
        
        else:
            user = user['content']
    
    if not user:
        raise HTTPException(401, "Usuário ou senha inválidos")

    if not verify_password(password, user[2]):
        raise HTTPException(401, "Usuário ou senha inválidos")

    permissions = await load_user_permissions(user[0])
    permissions = permissions['content']
    #print(" PERMISSIONS RESPONSE: ", permissions)
    permissions = [row[0] for row in permissions]
    
    token_data = {
        "id_user": user[0],
        "username": user[1],
        "permissions": permissions
    }

    access_token = create_access_token(token_data)
    #print( ' token data: ', token_data)

    __USER_LOGGED = {
        "access_token": access_token,
        "user": {
            "id_user": user[0],
            "username": user[1],
            "role" : user[4],
            "permissions": permissions
        }
    }

    response = {
        'status' : 0,
        'content' : __USER_LOGGED
    }

    #print(' AUTH REspONSe? ', response)

    return response 



# =========================
# senha
# =========================

def hash_password(password: str) -> str:
    hash_password = pwd_context.hash(password)
    return hash_password


def verify_password(password: str, password_hash: str) -> bool:
    result= pwd_context.verify(password, password_hash) 
    return result

# =========================
# token
# =========================

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None




# =========================
# usuário logado
# =========================

def get_current_user(credentials=Depends(security)):
    response = {
        'status' : 90,
        'content' : []
    }
    token = credentials.credentials
    payload = decode_token(token)

    response = {
        "id": payload["id_user"],
        "username": payload["username"],
        "permissions": payload["permissions"]
    }

    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido")

    return response

# =========================
# verificação de permissão
# =========================

def require_permission(permission_id: int):
    def checker(user=Depends(get_current_user)):
        print(" checker user: ", user)
        user_perms = set(user.get("permissions", []))

        if permission_id not in user_perms:
            raise HTTPException(status_code=403, detail="Sem permissão")

        return user

    return checker


async def test_user():
    sql_query = f'''

SELECT rp.id_permissao
FROM usuario u
JOIN funcao_permissao rp ON rp.id_funcao = u.id_funcao
WHERE u.id_usuario = 1;
    '''







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
    table_name = base_de_dados.product_table_name

    sql_query = f'''
    SELECT
        id_item,
        nome_do_produto,
        marca,
        quantidade_do_item
    FROM {table_name};'''

    response = await base_de_dados.query( sql_query )

    return response


async def record_register_product(id_product, quantity, id_user):
    response = {
        "status" : 90,
        "content" : "Error"
    }

    current_date = date.today()
    if not id_user:
        id_user = __USER_LOGGED['user']['id_user']

    table_name = base_de_dados.history_register_product_table_name
    column_list = [
        'id_produto',
        'quantidade',
        'id_usuario_responsavel',
        'tipo_registro',
        'data'
    ]

    value_list = [
        id_product,
        quantity,
        id_user,
        REGISTRATION_TYPE,
        current_date
    ]

    #print(" REGISTRANDO NO HISTORICO DE PRODUTOS: ", value_list, flush=1)
    response = await base_de_dados.insert( table_name, column_list, value_list)
    

    return response


async def register_product_on_stock(id_product = 0, product_name = '', march_name = '', quantity = '', product_weight = 0, id_user = None):
    response = {
        "status" : 90,
        "content" : "Error"
    }

    product_table_name = base_de_dados.product_table_name
    
    if id_product <= 0:
        sequence_query = await base_de_dados.getSequence( product_table_name )
        if sequence_query['content'] > 0:
            id_product = sequence_query['content']

    id_product = id_product + 1

    if not id_user:
        id_user = __USER_LOGGED['id_user']

    if not product_name or not march_name or not quantity:
        response['status'] = 90
        empty_column = []
        if not product_name:
            empty_column.append("Nome do produto")

        if not march_name:
            empty_column.append("Marca do produto")

        if not quantity:
            empty_column.append("Quantidade")
        
        response['content'] = f'Você tentou cadastrar um produto faltando as seguintes informações: {", ".join(empty_column)}'
        return response

    #print(" last sequence: ", id_product, await base_de_dados.getSequence("produto"), flush=1)

    valid = await search_for_duplicate_product_name( product_name )
    #print(" SEARCHING ON STOCK: ", valid, len(valid['content']) > 0)
    if len(valid['content']) > 0:
        response["status"] = 2067
        response['content'] = "Existe um produto com o mesmo nome"
        return response

    

    column_list = []

    column_list = [
        'id_item',
        'nome_do_produto',
        'marca',
        'quantidade_do_item',
        'peso',
        'status_cadastro',
        'id_usuario_responsavel',
        'data_criacao',
        'ultima_alteracao'
    ]

    value_list = [
        id_product,
        product_name,
        march_name,
        quantity,
        product_weight,
        True,
        id_user,
        date.today(),
        date.today()
    ]

    #if id_product <= 0:
        #column_list.pop(0)
        #value_list.pop(0)
    #print(" REGISTRANDO PRODUTO: ", value_list)
    response = await base_de_dados.insert("produto", column_list, value_list)
    #print(" REGISTER PRODUCT RESPONSE: ", response)
    if response['status'] == 0:
        response = await record_register_product(id_product, quantity, id_user)
        if response['status'] != 0:
            message_error = response['content']
            response["content"] = f"Ocorreu um erro ao registrar o historico de cadastro do produto {message_error}"

    #print(" REGISTER: ", response)
    return response
    

@app.post("/register-product-on-stock")
async def register_product_on_stock_api(data : dict):
    response = {
        "status" : 90,
        "content": "Error"
    }

    #print(" DaTA: ", data)

    id_product = data["idProduct"]
    product_name = data["productName"]
    march_name = data["marchName"]
    quantity = data["quantity"]
    product_weight = data['productWeight']


    try:
        id_product = int(id_product)

    except Exception as error:
        id_product = 0

    #print(" OLD ID_PRODUTO: ", id_product)
    response = await register_product_on_stock(id_product, product_name, march_name, quantity, product_weight)

    #print(" RESPONSE REGISTRATION: ", response)
    return response


async def search_for_duplicate_product_name( name ):
    response = {
        "status" : 90,
        "content" : []
    }

    table_name = base_de_dados.product_table_name

    sql_query = f"""
    SELECT
        id_item,
        nome_do_produto
    FROM {table_name} WHERE nome_do_produto = '{name}';
"""
    
    

    response = await base_de_dados.query( sql_query )

    #print(" duplicados: ", response)

    return response


async def search_on_stock( item_name ):
    
    response = {
        "status" : 90,
        "content" : "Error"
    }
    table_name = base_de_dados.product_table_name

    sql_query = f"""
    SELECT
        *
    FROM { table_name }
    WHERE nome_do_produto LIKE '{item_name}%'; """

    response = await base_de_dados.query(sql_query)

    return response


async def search_on_stock_preview( item_name ):
    
    response = {
        "status" : 90,
        "content" : "Error"
    }
    table_name = base_de_dados.product_table_name

    sql_query = f"""
    SELECT
        id_item,
        nome_do_produto,
        marca,
        quantidade_do_item

    FROM { table_name }
    WHERE nome_do_produto LIKE '{item_name}%'; """

    response = await base_de_dados.query(sql_query)

    return response


@app.post("/search-stock")
async def search_on_stock_api(data : dict):
    item_name = data['itemName']

    response = await search_on_stock_preview( item_name )

    return response


@app.post("/alter-product-on-stock")
async def alter_product_on_stock( data : dict ):
    response = {
        "status" : 90,
        "content": "Error"
    }

    #print("alter product on stock: ", data, flush=1)

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

    await base_de_dados.alter(table=base_de_dados.product_table_name, columns=column_list, values=value_list, column_name='id_item', id_value= id_product)

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

    #print(" DELETE PRODUCT: ", data)

    if not data:
        return response
    
    idProduct = data["idProduct"]


    response = await delete_product_from_stock( idProduct )

    return response


async def record_history_product(type_register, id_product, quantity, id_user = None, observation = ''): 
    response = {
        "status" : 90,
        "content" : []
    }
    
    if not id_user:
        id_user = __USER_LOGGED["id_user"]

    current_date = date.today()
    table_name = base_de_dados.history_register_product_table_name


    column_list = [
        'tipo_registro',
        'id_produto',
        'quantidade',
        'id_usuario_responsavel',
        'observacao',
        'data'
    ]

    value_list = [
        type_register,
        id_product,
        quantity,
        id_user,
        observation,
        current_date
    ]

    response = await base_de_dados.insert( table_name, column_list, value_list)

    return response


async def inventory_adjustment( id_product, type_of_adjustment, adjust_value, id_user = None, observation=''):
    global INPUT_TYPE, OUTPUT_TYPE
    if not id_user:
        id_user = None

    #print(" INVENTORY ADJUSTMENT... ")
    response = {
        "status" : 90,
        "content" : "Error"
    }
    column_list = [
        'quantidade_do_item'
    ]
    value_list = []


    try:
        type_of_adjustment = int( type_of_adjustment )
    
    except Exception as error:
        response["content"] = f"Ocorreu um erro ao processar o valor do tipo de ajuste: {error}"
        return response


    try:
        adjust_value = float( adjust_value )
    
    except Exception as error:
        response["content"] = f"Ocorreu um erro ao processar o valor da nova quantidade: {error}"
        return response


    sql_query = f" SELECT quantidade_do_item FROM {base_de_dados.product_table_name} WHERE id_item = {id_product};"
    old_quantity =  await base_de_dados.query(sql_query)
    old_quantity = float( old_quantity["content"][0][0])

    new_quantity = 0
    
    if type_of_adjustment == INPUT_TYPE:
        new_quantity = old_quantity + adjust_value 

        value_list.append(  new_quantity )
        response = await base_de_dados.alter( base_de_dados.product_table_name, column_list, value_list, column_name='id_item', id_value=id_product)


    elif type_of_adjustment == OUTPUT_TYPE:
        new_quantity = old_quantity - adjust_value
        value_list.append( new_quantity ) 
        response = await base_de_dados.alter( base_de_dados.product_table_name, column_list, value_list, column_name='id_item', id_value=id_product)


    elif type_of_adjustment == ADJUST_TYPE:
        value_list.append(adjust_value)
        response = await base_de_dados.alter( base_de_dados.product_table_name, column_list, value_list, column_name='id_item', id_value=id_product)





    await record_inventory_adjustment_history(id_product, type_of_adjustment, old_quantity, adjust_value, new_quantity, observation)
    await record_history_product(type_of_adjustment, id_product, adjust_value, id_user, observation)

    #print( "RESPONSE: ", response)
    return response
    

@app.post("/inventoty-adjustment")
async def inventory_adjustment_api( data : dict ):
    response = {
        "status" : 90,
        "content" : "Error"
    }
    #print(" inventory_adjustment_api DATA: ", data)
    id_product = data["idProduct"]
    type_of_adjustment = data['typeOfAdjustment']
    new_quantity = data["newQuantity"]
    observation = data["observation"]
    id_user = __USER_LOGGED["id_user"]

    try:
        type_of_adjustment = int( type_of_adjustment )
    
    except Exception as error:
        response["content"] = f"Ocorreu um erro ao processar o valor do tipo de ajuste: {error}"
        return response


    try:
        new_quantity = float( new_quantity )
    
    except Exception as error:
        response["content"] = f"Ocorreu um erro ao processar o valor da nova quantidade: {error}"
        return response

    response = await inventory_adjustment(id_product, type_of_adjustment, new_quantity, id_user, observation = observation)

    return response



async def input_item_on_stock( id_basket, id_family, id_church, basket_quantity, type_of_input, donation_from_outside, list_product, id_user):
    response = {
        'status' : 90,
        'content' : None
    }

    current_data = str(date.today())

    last_id_input = await base_de_dados.getSequence('entrada')
    last_id_input = int(last_id_input['content']) + 1
    #print(" LAST ID: ", last_id_input)
    #print(" current_data: ", current_data)
    input_table_name = base_de_dados.input_table_name
    input_item_table_name = base_de_dados.input_item_table_name

    column_list = [
        'id_entrada',
        'id_cesta',
        'id_familia',
        'id_congregacao',
        'quantidade_cesta',
        'data_entrada',
        'tipo_entrada',
        'doacao_fora',
        'id_usuario'
    ]

    value_list = [
        last_id_input,
        id_basket,
        id_family,
        id_church,
        basket_quantity,
        current_data,
        type_of_input,
        donation_from_outside,
        id_user
    ]

    response = await base_de_dados.insert( input_table_name, column_list, value_list)
    #if response['status'] == 0:
        

    column_list_item = [
        'id_entrada',
        'id_usuario',
        'id_produto',
        'quantidade'
    ]

    for item in list_product:
        id_product = item[0]
        product_quantity = item[1]
        value_list_item = [
            last_id_input,
            id_user,
            id_product,
            product_quantity

        ]

        response = await base_de_dados.insert( input_item_table_name, column_list_item, value_list_item)
        if response['status'] == 0:
            await inventory_adjustment(id_product, type_of_input, product_quantity, id_user)

    return response


@app.post('/input-item-on-stock')
async def input_item_on_stock_api( data : dict ):
    response = {
        'status' : 90,
        'content' : []
    }

    #print(" DATA: ", data)

    id_basket = data['idBasket']
    id_family = data['idFamily']
    id_church = data['idChurch']
    basket_quantity = data['basketQuantity']
    type_of_input = data['typeOfInput']
    donation_from_outside = data['donationFromOutside']
    list_product = data['listProduct']

    id_user = __USER_LOGGED["id_user"]

    response = await input_item_on_stock( id_basket, id_family, id_church, basket_quantity, type_of_input, donation_from_outside, list_product, id_user)


    return response



async def record_inventory_adjustment_history( id_product, type_of_adjustment, old_quantity, adjust_value, new_quantity, id_user = None):
    response = {
        "status" : 90,
        "content" : "Error"
    }

    if not id_user:
        id_user = __USER_LOGGED['id_user']

    column_list = [
        "tipo_ajuste",
        "id_produto",
        "valor_anterior",
        "valor_do_ajuste",
        "valor_atual",
        "id_usuario_responsavel",
        "data"        
    ]

    value_list = [
        id_product,
        old_quantity,
        adjust_value,
        new_quantity,
        type_of_adjustment,
        id_user,
        date.today()

    ]

    response = await base_de_dados.insert(
        base_de_dados.history_adjustment_invetory_table_name, column_list, value_list
    )

    return response

@app.post("/record_inventory_adjustment_history")
async def record_inventory_adjustment_history_api( data : dict ):

    response = {
        "status" : 90,
        "content" : "Error"
    }
    
    id_user = __USER_LOGGED["id_user"]

    id_product = data["idProduct"]
    type_of_adjustment = data["typeOfAdjustment"]
    old_quantity = data["oldQuantity"]
    adjust_quantity = data["oldQuantity"]
    new_quantity = data["newQuantity"]
    

    response = await record_inventory_adjustment_history( id_product, type_of_adjustment, old_quantity, adjust_quantity, new_quantity, id_user )

    return response



async def record_withdraw_item( id_saida, id_product, quantity ):
    response = {
        "status" : 90,
        "content" : "Error"
    }

    id_user = __USER_LOGGED['id_user']
    current_date = date.today()

    column_values = [
        'id_saida',
        'id_usuario',
        'id_produto',
        'quantidade',
        'data_saida'
    ]

    value_list = [
        id_saida,
        id_user,
        id_product,
        quantity,
        current_date
    ]

    table_name = base_de_dados.item_output_table_name

    response = await base_de_dados.insert(
        table_name,
        column_values,
        value_list
    )

    return response


@app.post("/record-withdraw-item")
async def record_withdraw_item_api( data : dict ):
    response = {
        'status' : 90,
        'content' : "Error"
    }

    id_cesta = data["idBasket"]
    id_product = data["idProduct"]
    quantity = data["quantity"]

    response = await record_withdraw_item(id_cesta, id_product, quantity, OUTPUT_TYPE)

    return response


async def record_outputs( id_basket, id_family, id_church, output_type, basket_quantity, out_donation, id_user = None ):
    response = {
        "stauts" : 90,
        "content" : "Error"
    }
    if not id_user:
        id_user = __USER_LOGGED["id_user"]
    
    current_date = date.today()
    table_name = base_de_dados.output_table_name

    last_id_output = await base_de_dados.getSequence('saida')
    last_id_output = last_id_output["content"]
    #print(" LAST ID: ", last_id_output)
    new_id_output = last_id_output +1 
    #print(" CURRENT ID: ", new_id_output)
    column_list = [
        "id_saida",
        'id_cesta',
        "id_usuario",
        "id_familia",
        "id_congregacao",
        'quantidade_cesta',
        "data_saida",
        "tipo_saida",
        "doacao_fora"
    ]

    value_list = [
        new_id_output,
        id_basket,
        id_user,
        id_family,
        id_church,
        basket_quantity,
        current_date,
        output_type,
        out_donation
    ]

    response = await base_de_dados.insert(
        table_name,
        column_list,
        value_list
    )
    #print(" RESPONSE : ", response)
    response["content"] = new_id_output

    return response

@app.post("/record-outputs")
async def record_outputs_api( data : dict ):
    response = {
        "status" : 90,
        "content" : "Error"
    }

    output_type = data["outputType"]
    
    response = await record_outputs(
        output_type
    )

    return response


async def register_item_issue():
    pass

#==================================================
#= Stock - Graph Function
#===============================================






async def get_collection_report( initial_date= '', end_date='' ):

    response = {
        'status' : 90,
        'content' : []
    }

    

    input_table_name = base_de_dados.input_table_name
    input_item_table_name = base_de_dados.input_item_table_name
    church_table_name = base_de_dados.church_table_name
    product_table_name = base_de_dados.product_table_name

    # QUERY ALTERNATIVA PARA O RELATORIO
    """
            
SELECT 
    strftime('%Y-%m', s.data_entrada) AS mes,
    church.nome,
    SUM(s.quantidade_cesta) AS total_cestas,
    ROUND(SUM(i.quantidade * IFNULL(p.peso, 0), 2) AS peso_total
FROM entrada s
LEFT JOIN congregacao church
    ON s.id_congregacao = church.id_congregacao
LEFT JOIN entrada_item i
    ON i.id_entrada = s.id_entrada
LEFT JOIN produto p
    ON p.id_item = i.id_produto
WHERE s.tipo_entrada IN (1)
GROUP BY 
    strftime('%Y-%m', s.data_entrada),
    church.nome
ORDER BY 
    mes,
    church.nome;
    """


    sql_query= f'''
SELECT 
    church.id_congregacao,
    church.nome,
    SUM(exit.quantidade_cesta) AS 'total de cestas',
    SUM(si.quantidade * p.peso) AS peso_total
FROM {input_table_name} exit
LEFT JOIN {church_table_name} church
ON exit.id_congregacao = church.id_congregacao
LEFT JOIN {input_item_table_name} si
ON exit.id_entrada = si.id_entrada
LEFT JOIN {product_table_name} p
ON p.id_item = si.id_produto
WHERE ( exit.tipo_entrada = {INPUT_TYPE} )

    '''

    if initial_date and end_date:
        sql_query += f" AND exit.data_entrada BETWEEN '{initial_date}' AND '{end_date}' "


    elif initial_date:
        sql_query = f" AND exit.data_entrada > '{initial_date}' "
        

    elif end_date:
        sql_query = f" AND exit.data_entrada > '{end_date}' "



    sql_query += ''' GROUP BY
	church.id_congregacao,
    church.nome; '''

    response = await base_de_dados.query(sql_query)


    return response


@app.post('/get-collection-report')
async def get_collection_report_api( data : dict):
    response = {
        'status' : 90,
        'content' : []
    }

    initial_date = data['initialDate']
    end_date = data['endDate']

    response = await get_collection_report(initial_date, end_date)
    #print(" COLLECT REPORT RESOPNSE: ", response)
    for i in range(len(response['content'])):
        response['content'][i] = list(response['content'][i])
        data = response['content'][i]

        if  data[0] == None: 
            data[0] = 0
            data[1] = "ORIGEM NÃO ESPECIFICADA"

        response['content'][i] = data
        

    return response



async def get_collection_report_data_for_dashboard(initial_date='', end_date=''):
    
    response = {
        'status' : 90,
        'content' : []
    }

    

    output_table_name = base_de_dados.output_table_name
    output_item_table_name = base_de_dados.item_output_table_name
    church_table_name = base_de_dados.church_table_name
    product_table_name = base_de_dados.product_table_name

    sql_query= f'''
SELECT 
    SUM(si.quantidade * p.peso) AS peso_total
FROM {output_table_name} exit
LEFT JOIN {church_table_name} church
ON exit.id_congregacao = church.id_congregacao
LEFT JOIN {output_item_table_name} si
ON exit.id_saida = si.id_saida
LEFT JOIN {product_table_name} p
ON p.id_item = si.id_produto
WHERE ( exit.tipo_saida = {INPUT_TYPE} )

    '''

    if initial_date and end_date:
        sql_query += f" AND exit.data_saida BETWEEN '{initial_date}' AND '{end_date}' "


    elif initial_date:
        sql_query = f" AND exit.data_saida > '{initial_date}' "
        

    elif end_date:
        sql_query = f" AND exit.data_saida > '{end_date}' "



    sql_query += ''' GROUP BY
	church.id_congregacao,
    church.nome; '''

    response = await base_de_dados.query(sql_query)


    return response


async def get_collection_data_for_graph( ):
    response = {
        'status' : 90,
        'content' : []
    }

    current_year = date.today().year
    current_month = int(str(date.today().month))
    current_month = f'0{current_month}' if int(current_month) < 10 else current_month
    
    #print(f"current date: YEAR: {current_year} -- MONTH: {current_month}")
    months = [f'0{month}' if month < 10 else month for month in range(1, int(current_month)+1)]
    last_days = [calendar.monthrange(current_year, month)[1] for month in range(1, int(current_month)+1)]

    #print( 'months -- last_days: ', months, last_days, flush=1)

    

    collection_count_month = []
    for i in range(len(months)):
        query_data = {}
        date_initial = f'{current_year}-{months[i]}-01'
        date_finaly = f'{current_year}-{months[i]}-{last_days[i]}'
        #print(" (get_collection_data_for_graph) SEARCH FOR DATA: ", date_initial, date_finaly, flush=1)
        query_data = await get_collection_report(date_initial, date_finaly)

        if query_data['status'] != 0:
            return query_data
        
        

        collection_count = 0
        #print(" DATA FOUND: ", query_data, flush=1)
        for data in query_data['content']:

            if data[3]:
                collection_count += float(data[3])

           

        #print(f" MONTH: {months[i]} - F: ", family_helped_count, query_data)
        collection_count_month.append(collection_count)
    
    response['status'] = 0
    response['content'] = collection_count_month


    #print("(get_collection_data_for_graph) collection_count_month: ", collection_count_month)
    return response


@app.post('/get-collection-data-for-graph')
async def get_collection_data_for_graph_api( data : dict, user=Depends(require_permission(1)) ):
    response = {
        'status' : 90,
        'content' : []
    }
    print(" OBTENDO DADOS PARA GRAFICO, USUARIO AUTENTICADO: ", user)
    initial_date = data['initialDate']
    end_date = data['endDate']

    response = await get_collection_data_for_graph()

    return response


async def get_collection_report_for_circle_graph( initial_date='', end_date=''):
    response = {
        'status' : 90,
        'content' : None
    }

    current_year = date.today().year
    current_month = int(str(date.today().month))
    last_days = [calendar.monthrange(current_year, current_month)]
    current_month = f'0{current_month}' if int(current_month) < 10 else str(current_month)

    current_day = date.today().today

    

    if not initial_date and not end_date:
        initial_date = f'{current_year}-{current_month}-01'
        end_date = f'{current_year}-{current_month}-{last_days}'

    elif not initial_date:
        initial_date = f'{current_year}-{current_month}-01'

    elif not end_date:
        end_date = f'{current_year}-{current_month}-{last_days}'


    response = await get_collection_report(initial_date, end_date)

    return response


@app.post('/get-collection-report-for-circle-graph-api')
async def get_collection_report_for_circle_graph_api( data : dict ):
    response = {
        'status' : 90,
        'content' : None
    }

    initial_date = data['initialDate']
    end_date = data['endDate']

    response = await get_collection_report_for_circle_graph(initial_date, end_date)

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
    #print(" VERIFICATION: ", verification, type(verification['content']), flush=1)
    if type(verification['content']).__name__ != 'str':
        if len(verification['content']) > 0:
            response["content"] = "Existe Familias com essa prioridade cadastrada. Para remover, ninguem deve estar utilizando essa prioridade"
            return response


    #sql_query = f'DELETE FROM prioridade WHERE id_prioridade= {id_priority}'
    table = "prioridade"
    param = f"id_prioridade= {id_priority}"
    response = await base_de_dados.delete( table, param )
    #print(" RETORNO: ", response)
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
    #print("IDVALUE: ", id_value, type(id_value), flush=1)
    for priority in priority_list:
        #print("Priority ID: ", priority['id'], flush=1)    
        if id_value == priority['id']:
            #print("Priority: ", priority, flush=1)    
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
    #print("DATA: ", namePriority)
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


async def get_family_data(user=Depends(require_permission(6))):
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


async def get_all_family_data(user=Depends(require_permission(6))):
    #get_family_list = family_list.copy()
    response = await base_de_dados.query(" SELECT * FROM familia")
    for I in range( len(response['content']) ):
        #print(" RESPONSE: ", list(response["content"][I]))
        response['content'][I] = list(response['content'][I])

    return response


@app.get("/get-family-data")
async def get_family_list(user=Depends(require_permission('VIEW_FAMILY_REGISTER')) ):

    response = {
        "status" : 90,
        "content" : []
    }
    family_table_name = base_de_dados.family_table_name
    church_table_name = base_de_dados.church_table_name
    priority_table = base_de_dados.priority_table_name

    sql_query = f"""
        SELECT
            f.id_familia,
            f.representante,
            f.membros,
            f.cidade,
            f.bairro,
            f.rua,
            f.numero_da_casa,
            f.uf,
            f.cep,
            f.telefone,
            p.descricao,
            c.nome
        FROM {family_table_name} as f
        LEFT JOIN {church_table_name} as c
        ON c.id_congregacao = f.id_congregacao
        LEFT JOIN {priority_table} as p
        ON p.id_prioridade = f.id_prioridade;"""

    family_data_list = await base_de_dados.query(sql_query)

    for I in range( len(family_data_list['content']) ):
        #print(" RESPONSE: ", list(family_data_list["content"][I]))
        family_data_list['content'][I] = list(family_data_list['content'][I])
    
    response['status'] = family_data_list['status']
    response['content'] = family_data_list['content']

    return response


@app.get("/get-family-data-resolve-ids")
async def get_family_list_resolved( user=Depends(require_permission(6)) ):
    response = {
        "status" : 90,
        "content" : []
    }

    family_table_name = base_de_dados.family_table_name
    church_table_name = base_de_dados.church_table_name
    priority_table = base_de_dados.priority_table_name

    sql_query = f"""
        SELECT
            f.id_familia,
            f.representante,
            f.membros,
            f.cidade,
            f.bairro,
            f.rua,
            f.numero_da_casa,
            f.uf,
            f.cep,
            f.telefone,
            p.descricao,
            c.nome
        FROM {family_table_name} as f
        LEFT JOIN {church_table_name} as c
        ON f.id_congregacao=  c.id_congregacao
        LEFT JOIN {priority_table} as p
        ON f.id_prioridade= p.id_prioridade;"""
    
    family_data_list = await base_de_dados.query(sql_query)
    #print(" RESpONSe OF REsoLVING FAmILY DATA: ", family_data_list)
    if family_data_list['status'] != 0:
        return family_data_list
    
    
    for I in range( len(family_data_list['content']) ):
        #print(" RESPONSE: ", list(family_data_list["content"][I]), flush=1)
        family_data_list['content'][I] = list(family_data_list['content'][I])
    
    response['status'] = family_data_list['status']
    response['content'] = family_data_list['content']

    
    return family_data_list        


@app.post("/search-for-family")
async def search_on_family_register(data: SearchRegisterFamilyRequest, user=Depends(require_permission(6))):
    response = {
        "status" : 90,
        "content" : []
    }
    #print("search for family...", flush=1)
    #family_register_data = await get_family_data()
    
    representativeRecive = data.representativeRecive

    if representativeRecive == '':
        #print("Return all data")
        tmp_family_data = await get_family_list_resolved()
        return  {"status" : 0, "content" : tmp_family_data["content"]}
    
    family_table_name = base_de_dados.family_table_name
    church_table_name = base_de_dados.church_table_name
    priority_table = base_de_dados.priority_table_name

    sql_query = f"""
        SELECT
            f.id_familia,
            f.representante,
            f.membros,
            f.cidade,
            f.bairro,
            f.rua,
            f.numero_da_casa,
            f.cep,
            f.uf,
            f.telefone,
            p.descricao,
            c.nome
        FROM {family_table_name} as f
        LEFT JOIN {church_table_name} as c
        ON c.id_congregacao = f.id_congregacao
        LEFT JOIN {priority_table} as p
        ON p.id_prioridade = f.id_prioridade
        WHERE f.representante LIKE '{representativeRecive}%'; """

    response = await base_de_dados.query( sql_query )
    return response


async def search_for_duplicate_family( representative, city, neighborhood, street, building_number, uf, cep ):
    response = {
        "status" : 90,
        "content" : []
    }

    table_name = base_de_dados.family_table_name

    sql_query = f"""
    SELECT
        id_familia, representante
    FROM {table_name}
    WHERE
        representante = {representative}
        AND cidade = {city}
        AND bairro = {neighborhood}
        AND rua = {street}
        AND numero_da_cada = {building_number}
        AND uf = {uf}
        AND cep = {cep}
    """

    response = await base_de_dados.query(sql_query)

    return response



@app.post("/search-for-family-by-id")
async def search_on_family_register_by_id(data: SearchRegisterFamilyByIdRequest, user=Depends(require_permission(6)) ):
    #print("search for family...", data, flush=1)
    
    
    idFamily = data.idFamily
    #print(" idFamily: ", idFamily)
    found_registers = []
    if idFamily == '':
        #print("Return all data")
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
                familia.cep,
                familia.uf,
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
async def search_on_family_register_by_id_resolved(data: SearchRegisterFamilyByIdRequest, user=Depends(require_permission(6)) ):
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
# = Family - Record
# =============================

async def record_history_family( id_family, type_register, id_user):
    response = {
        "status" : 90,
        "content" : []
    }

    if not id_user:
        id_user = __USER_LOGGED["id_user"]

    table_name = base_de_dados.history_register_family_table_name
    current_date = date.today()

    column_list = [
        'tipo_registro',
        'id_familia',
        'id_usuario_responsavel',
        'data'
    ]

    value_list = [
        type_register,
        id_family,
        id_user,
        current_date
    ]

    response = await base_de_dados.insert( table_name, column_list, value_list)


    return response


async def record_alter_family(id_family, id_user):
    response = {
        "status" : 90,
        "content" : []
    }

    response = await record_history_family( id_family, ALTERATION_TYPE, id_user)

    return response

async def alter_family_register(id_family, representative, members, city, neighborhood, street, building_number, cep, uf, telephone, priority_id, id_church, id_user= None):
    response = {
        "status" : 90,
        "content" : []
    }

    if not id_user:
        id_user = __USER_LOGGED["id_user"]


    current_date = date.today()

    column_list = [
        'representante',
        'membros',
        'cidade',
        'bairro',
        'rua',
        'numero_da_casa',
        'cep',
        'uf',
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
        cep,
        uf,
        telephone,
        priority_id,
        id_church,
        current_date
    ]

    
    response = await base_de_dados.alter( 'familia', column_list, values, 'id_familia', id_family )
    if response['status'] == 0:
        await record_alter_family(id_family, id_user)


    return response

@app.post("/alter-family-data")
async def alter_family_data(data : dict = None, user=Depends(require_permission(4)) ):
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
    cep                = data['cep']
    uf                 = data['uf']
    telephone          = data["telephoneNumber"]
    priority_id        = data["currentPriority"]
    print(" PRIORITY ID: ", priority_id, type(priority_id))
    if type(priority_id).__name__ != 'int':
        if not priority_id:
            priority_id = 0
        else:
            priority_id = int(priority_id)

    id_user = __USER_LOGGED["id_user"]

    response = await alter_family_register( id_family, representative, members, city, neighborhood, street, building_number, cep, uf, telephone, priority_id, id_church, id_user )

    return response



async def record_register_family( id_family, id_user = None ):
    response = {
        "status" : 90,
        "content" : "Error"
    }

    if not id_user:
        id_user = __USER_LOGGED["id_user"]

    table_name = base_de_dados.history_register_family_table_name
    current_date = date.today()


    column_list = [
        'tipo_registro',
        'id_familia',
        'id_usuario_responsavel',
        'data'
    ]

    value_list = [
        REGISTRATION_TYPE,
        id_family,
        id_user,
        current_date
    ]

    response = await base_de_dados.insert( table_name, column_list, value_list )

    return response


async def registration_family(church_id, representative, city, members, neighborhood, street, building_number, cep, uf, telephone, priority_id, registration_status, id_user = None):
    #global family_list
    response = {
        "status" : 90,
        "content" : "Erro"
    }

    if not id_user:
        id_user = __USER_LOGGED["id_user"]

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
    

    valid = await search_for_duplicate_family( representative, city, neighborhood, street, building_number, uf, cep )
    if len(valid['content']) > 0 :
        response['status'] = 2067
        response['content'] = "Já existe uma familia cadastrada com essas informações"

    id_family = await base_de_dados.getSequence( base_de_dados.family_table_name )
    if id_family['content']:
        id_family = id_family["content"] + 1

    else:
        id_family = 1



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
                    'cep',
                    'uf',
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
                    cep,
                    uf,
                    telephone,
                    registration_status,
                    str(date.today()),
                    str(date.today())
                ]

    registration_response = await base_de_dados.insert("familia", column_list, value_list)
    if registration_response["status"] == 0:
        response["status"] = 0
        response["content"] = "Registro adicionado com sucesso!"

        await record_register_family( id_family, id_user )
        return response


    return registration_response

@app.post("/registration-family-data")
async def registration_family_data(data : dict = None, user=Depends(require_permission(3)) ):
    response = {
        "status" : 90,
        "content" : "Error"
    }

    #print(" ( registration family data ): ", data)

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
    cep = data["cep"]
    uf = data['uf']

    id_user = __USER_LOGGED["id_user"]

    response = await registration_family(church_id, representative, city, members, neighborhood, street, building_number, cep, uf, telephone, priority_id, registration_status, id_user)

    return response


@app.post("/delete-family-data")
async def delete_family_data( data : dict = None, user=Depends(require_permission(5)) ):
    response = {
        "status" : 90,
        "content" : "Error"
    }

    if not data:
        response["content"] = "ID invalido"
        return response
    
    id_family = data["id_family"]

    param = f"id_familia= {id_family}"

    db_response = await base_de_dados.delete(base_de_dados.family_table_name, param)

    type_register_table_name = base_de_dados.type_record_table_name
    delete_type = await base_de_dados.query(f"""
    SELECT
        id_tipo,
        nome
    FROM {type_register_table_name}
    WHERE nome = 'REMOCAO';""")

    delete_type = delete_type['content'][0][0]

    if db_response["status"] == 0:
        response["status"] = 0
        response["content"] = "Deletado com sucesso"

        response = await record_history_family(id_family, delete_type, id_user=None)

    return response

#================================================
#= Family - Graph Function
#==================================================

async def get_data_family_helped_for_graph( initial_date = '', end_date = '' ):
    response = {
        'status' : 90,
        'content' : []
    }
    current_year = date.today().year
    current_month = int(str(date.today().month))
    current_month = f'0{current_month}' if int(current_month) < 10 else current_month
    
    #print(f"current date: YEAR: {current_year} -- MONTH: {current_month}")
    months = [f'0{month}' if month < 10 else month for month in range(1, int(current_month)+1)]
    last_days = [calendar.monthrange(current_year, month)[1] for month in range(1, int(current_month)+1)]

    #print( 'months -- last_days: ', months, last_days, flush=1)

    

    family_helped_count_month = []
    for i in range(len(months)):
        query_data = {}
        date_initial = f'{current_year}-{months[i]}-01'
        date_finaly = f'{current_year}-{months[i]}-{last_days[i]}'
        #print(" SEARCH FOR DATA: ", date_initial, date_finaly, flush=1)
        query_data = await get_all_input_and_output_basket(date_initial, date_finaly)

        if query_data['status'] != 0:
            return query_data
        
        

        family_helped_count = 0
        #print(" DATA FOUND: ", query_data, flush=1)
        for data in query_data['content']:
            
            if data[2]:
                family_helped_count += 1

        #print(f" MONTH: {months[i]} - F: ", family_helped_count, query_data)
        family_helped_count_month.append(family_helped_count)
    
    response['status'] = 0
    response['content'] = family_helped_count_month


    #print("get_data_family_helped_for_graph: ", family_helped_count_month)
    return response


@app.post('/get-data-family-helped-for-graph')
async def get_data_family_helped_for_graph_api( data : dict, user=Depends(require_permission(1)) ):
    response = {
        'status' : 90,
        'content' : []
    }

    initial_date = data['initialDate']
    end_date = data['endDate']

    response = await get_data_family_helped_for_graph(initial_date, end_date)

    return response


# =================================================


#==============================================
#= Church
#===============================================

# ================
# = CHURCH - Data =
# ================
async def get_church_data():
    response = await base_de_dados.query("SELECT * FROM congregacao")
    return response


@app.get("/get-church-list")
async def get_church_data_for_display(user=Depends(require_permission(14)) ):

    sql_query = f"""
    SELECT
        id_congregacao,
        nome,
        representante,
        membros,
        cidade,
        bairro,
        rua,
        numero,
        cep,
        uf
    FROM congregacao
    """
    response = await base_de_dados.query( sql_query )

    return response


@app.get("/get-church-list-raw-data")
async def get_church_list(user=Depends(require_permission(14))):
    return await get_church_data()


    # ===============
    # = Search =
    # ===============


async def register_church(church_name, representative, member_number, city, neighborhood, street, building_number, cep, uf, registration_status, id_user = None ):
    response = {
        "status" : 90,
        "content" : 'Error'
    }

    if id_user == None:
        id_user = __USER_LOGGED["id_user"]

    if not church_name or not representative or not member_number or not city or not neighborhood or not street or not building_number or not cep or not uf:
        empty_column = []

        if not church_name:
            empty_column.append('nome')

        if not representative:
            empty_column.append('representante')

        if not member_number:
            empty_column.append('membros')

        if not city:
            empty_column.append('cidade')

        if not neighborhood:
            empty_column.append('bairro')

        if not street:
            empty_column.append('rua')

        if not building_number:
            empty_column.append('numero')

        if not cep:
            empty_column.append('cep')

        if not uf:
            empty_column.append('uf')

        response["content"] = f"Valores vazios não são aceitos para cadastro. Corrigir os valores de:\n ({', '.join(empty_column)})"
        return response

    current_sequence_id_church = await base_de_dados.getSequence('congregacao')
    if not current_sequence_id_church["content"]:
        current_sequence_id_church["content"] = 0

    id_church = current_sequence_id_church['content'] + 1
    #print(" ID_CHURCH: ", id_church)
    current_data = date.today()

    column_list = [
        'id_congregacao',
        'nome',
        'representante',
        'membros',
        'cidade',
        'bairro',
        'rua',
        'numero',
        'cep',
        'uf',
        'status_cadastro',
        'id_usuario_responsavel',
        'data_criacao',
        'ultima_alteracao',
    ]

    value_list = [
        id_church,
        church_name,
        representative,
        member_number,
        city,
        neighborhood,
        street,
        building_number,
        cep,
        uf,
        registration_status,
        id_user,
        current_data,
        current_data,
    ]

    table_name = base_de_dados.church_table_name
    
    register_response = await base_de_dados.insert(table_name, column_list, value_list)

    if register_response['status'] == 0:
        await record_register_church(id_church, id_user)

    response = register_response

    return response


@app.post("/register-church")
async def register_church_api( data : dict, user=Depends(require_permission(11)) ):
    response = {
        "status" : 90,
        "content" : "Error"
    }


    #print(f" registration_church_api: ", data, flush=1)
    church_name = data["churchName"]
    representative = data["representative"]
    member_number = data["memberNumber"]
    city = data["city"]
    neighborhood = data["neighborhood"]
    street = data["street"]
    building_number = data["buildingNumber"]
    cep = data['cep']
    uf = data['uf']
    registration_status = data['registrationStatus']

    id_user = __USER_LOGGED["id_user"]

    response = await register_church( church_name, representative, member_number, city, neighborhood, street, building_number, cep, uf, registration_status, id_user)

    return response


async def alter_church_data(id_church, church_name, representative, city, members, neighborhood, street, building_number, cep, uf, register_status, id_user = None):
    response = {
        'status' : 90,
        'content' : []
    }

    current_date = date.today()

    if not id_user:
        id_user = __USER_LOGGED["id_user"]

    table_name = base_de_dados.church_table_name

    column_list = [
        'nome',
        'representante',
        'membros',
        'cidade',
        'bairro',
        'rua',
        'numero',
        'cep',
        'uf',
        'status_cadastro',
        'id_usuario_responsavel',
        'ultima_alteracao'
    ]

    value_list = [
        church_name,
        representative,
        members,
        city,
        neighborhood,
        street,
        building_number,
        cep,
        uf,
        register_status,
        id_user,
        current_date
    ]


    condition = f'id_congregacao = {id_church}'
    response = await base_de_dados.alter(table_name, column_list, value_list, conditions = condition)
    print(" ALTER CHURHC DATA: ", response)
    return response

#+ Precisa refatorar
@app.post("/alter-church-data")
async def alter_church_data_api(data : dict = None, user=Depends(require_permission(12)) ):
    response = {
        'status' : 90,
        'content' : []
    }

    print( 'alter church data: ', data)

    id_church           = data['idChurch']
    church_name         = data['churchName']
    representative     = data['representative']
    city               = data['city']
    members            = data['members']
    neighborhood       = data['neighborhood']
    street             = data['street']
    building_number     = data['buildingNumber']
    cep = data['cep']
    uf = data['uf']
    register_status = data['registerStatus']
    id_user = __USER_LOGGED["id_user"]

    response = await alter_church_data(id_church, church_name, representative, city, members, neighborhood, street, building_number, cep, uf, register_status, id_user)


    return response


async def delete_church_register( id_church ):
    response = {
        'status': 90,
        'content' : []
    }

    table_name = base_de_dados.church_table_name
    condition = f'id_congregacao = {id_church}'
    response = await base_de_dados.delete(table_name, condition)

    return response


@app.post('/delete-church-register')
async def delete_church_register_api( data : dict, user=Depends(require_permission(13)) ): 
    response = {
        'status': 90,
        'content' : []
    }

    id_church = data['idChurch']

    response = await delete_church_register(id_church)

    return response



# =======================
# = CHURCH - SEARCH = 
# ========================

@app.post("/search-for-church")
async def search_on_church_register(data: SearchRegisterChurchRequest, user=Depends(require_permission(14))):
    #print(f" ({data.churchName}) search for church...", flush=1)
    church_register_data = get_church_data()

    churchName = data.churchName
    columnName = data.columnName
    found_registers = []
    if churchName == '':
        return  {"status" : 0, "content" : church_register_data["content"]}
    
    try:
        for index in church_register_data["content"]:
            #print("index: ", index)
            for key, value in index.items():
                if key == columnName:
                    if churchName == value[:len(churchName)]:
                        #print("REGISTRO ENCONTRADO: ", index)
                        found_registers.append(index)

    except Exception as error:
        print( error)
        return {
            "status" : 90,
            "content" : str(error)
        }
    
    return {"status" : 0, "content" : found_registers}


@app.post("/search-for-church-by-id")
async def search_church_by_id(data : SearchRegisterChurchByIdRequest, user=Depends(require_permission(14))):
    response = {
        "status" : 90,
        "content" : None
    } 

    table_name = base_de_dados.church_table_name
    print( "DATA: ", data)
    idChurch = data.idChurch
    sql_query = f"""
                SELECT *
                FROM {table_name}
                WHERE id_congregacao= {idChurch}
                """
    church_data = await base_de_dados.query(sql_query)
    
    if church_data['status'] == 0:
        response["status"] = 0
        response["content"] = church_data["content"]
    print(" RESPONSE: ", response)
    return response



@app.post("/search-for-church-goals-item")
async def search_on_church_goals(data: SearchForChurchGoalItem, user=Depends(require_permission(14))):
    #print(f" ({data.churchId})({data.goalItemName}) search for basket...", flush=1)
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
                        #print("REGISTRO ENCONTRADO: ", index)
                        found_registers.append(index)

    except Exception as error:
        print( error)
        return {
            "status" : 90,
            "content" : str(error)
        }
    
    return {"status" : 0, "content" : found_registers}




# =======================
# = CHURCH - Goals = 
# ========================

async def get_church_goals_data(id_church, date_init, date_end, resolve_church_name=0):
    response = {
        "status" : 90,
        "content": []
    }

    await update_church_goal()

    cdate = str(date.today())
    current_date = datetime.strptime(cdate, "%Y-%m-%d")
    table_name = base_de_dados.church_goals_table_name
    sql_query = f'''
    SELECT
        id_meta,
        id_congregacao,
        status,
        data_criacao,
        prazo
    FROM {table_name}
'''
    if resolve_church_name:
        table_church_name = base_de_dados.church_table_name
        sql_query = f'''
    SELECT
        mt.id_meta,
        c.nome,
        mt.status,
        mt.data_criacao,
        mt.prazo
    FROM {table_name} mt
    INNER JOIN {table_church_name} c
    ON mt.id_congregacao = c.id_congregacao
'''
    if date_init or date_end:
        sql_query += f"""
    WHERE mt.id_congregacao = {id_church} AND mt.data_criacao BETWEEN '{date_init}' AND '{date_end}';
"""
    else:
        sql_query += f"""
    WHERE mt.id_congregacao = {id_church};
"""

    response = await base_de_dados.query( sql_query )
    #print("RESPONSE : ", response)
    for i in range( len( response['content'] ) ):
        response["content"][i] = list(response["content"][i])

    return response

@app.post("/get-church-goals")
async def get_church_goals_api( data : dict, user=Depends(require_permission(15)) ):
    response = {
        "status" : 90,
        "content" : []
    }

    #print(" Data: ", data)

    id_church = data['idChurch']
    date_init = data['dateInitial']
    date_end  = data['dateEnd']
    viewParams = data['viewParams']
    resolve_status = data['resolveStatus']
    resolve_church_name = data['resolveChurchName']

    response = await get_church_goals_data(id_church, date_init, date_end, resolve_church_name)
    #print("goals response1: ", response)
    if resolve_status == 1:
        for i, goal in enumerate(response['content']):
            
            try:
                goal[2] = int(goal[2])

            except:
                goal[2] = 0
            
            match goal[2]:
                case 0:
                    goal[2] = 'CANCELADA'

                case 1:
                    goal[2] = 'ATRASADA'

                case 2:
                    goal[2] = 'PENDENTE'    

                case 3:
                    goal[2] = 'COMPLETA'

            response['content'][i] = goal
    
    
    #print("goals response2: ", response)
    return response


async def get_church_goal_by_id( id_goal, id_church):
    response = {
        'status' : 90,
        'content' : []
    }
    ctime = str(date.today())
    current_date = datetime.strptime(ctime, "%Y-%m-%d")

    table_name = base_de_dados.church_goals_table_name

    sql_query = ''
    if id_goal:
        sql_query = f'''
    SELECT
        id_meta,
        id_congregacao,
        status,
        data_criacao,
        prazo
    
    FROM {table_name}
    WHERE id_meta = {id_goal}
    AND id_congregacao = {id_church};
    '''
    else:
        sql_query = f'''
    SELECT
        id_meta,
        id_congregacao,
        status,
        data_criacao,
        prazo
    
    FROM {table_name}
    WHERE id_congregacao = {id_church};

        '''    


    response = await base_de_dados.query( sql_query )
    for i, goal in enumerate(response['content']):
        response['content'][i] = list(response['content'][i])

    for i, goal in enumerate(response['content']):
        tmpGoalStatus = response['content'][i][2]
        if tmpGoalStatus == 0:
            continue
        tmpGoalTime = goal[4]
        #print("DATAS: ", current_date, tmpGoalTime, flush=1)
        try:
            goal_date = datetime.strptime(tmpGoalTime, "%Y-%m-%d")
        
        except:
            goal_date = 0

        if goal_date == 0:
            tmpGoalStatus = 0

        elif current_date > goal_date:
            tmpGoalStatus = 1

        else:
            tmpGoalStatus = 2

        

        response["content"][i][2] = tmpGoalStatus
                

    return response


@app.post('/get-church-goal-by-id')
async def get_church_goal_by_id_api( data : dict, user=Depends(require_permission(15)) ):
    response = {
        "status" : 90,
        "content" : []
    }

    id_goal = data['idGoal']
    id_church = data['idChurch']


    response = await get_church_goal_by_id( id_goal, id_church )

    return response


async def get_goal_list_item( id_goal, id_church):
    response = {
        'status' : 90,
        'content' : []
    }
    table_name = base_de_dados.church_item_goals_table_name
    goal_table_name = base_de_dados.church_goals_table_name
    product_table_name = base_de_dados.product_table_name

    sql_query = f'''
SELECT
    mi.id_produto,
    p.nome_do_produto,
    mi.quantidade
FROM {table_name} mi
INNER JOIN { goal_table_name } mt
ON mi.id_meta = mt.id_meta
INNER JOIN {product_table_name} p
ON mi.id_produto = p.id_item
WHERE mt.id_congregacao = {id_church}
    AND mi.id_meta = {id_goal};
    '''

    response = await base_de_dados.query( sql_query )
    

    return response


@app.post('/get-goal-list-item')
async def get_goal_list_item_api( data : dict, user=Depends(require_permission(15)) ):
    response = {
        'status' : 90,
        'content' : []
    }
    #print("(get_goal_list_item_api) : ", data)
    id_goal = data['idGoal']
    id_church = data['idChurch']

    response = await get_goal_list_item(id_goal, id_church)

    return response



async def get_all_church_goal():
    response = {
        'status' : 90,
        'content' : []
    }

    table_name = base_de_dados.church_goals_table_name
    church_table_name = base_de_dados.church_table_name

    sql_query = f'''
    SELECT 
        meta.id_meta,
        ch.nome,
        meta.status,
        meta.quantidade_alimento,
        prazo
    FROM {table_name} meta
    LEFT JOIN { church_table_name } ch
    ON meta.id_congregacao = ch.id_congregacao
    '''

    response = await base_de_dados.query( sql_query )

    return response



@app.post('/get-all-church-goal')
async def get_all_church_goal_api( ):
    response = {
        'status' : 90,
        'content' : []
    }

    response = await get_all_church_goal()

    return response
    


async def change_church_goal_list( id_goal, id_church, new_goal_list, goal_time, goal_status ):
    response = {
        'status' : 90,
        'content' : []
    }


    table_goal_table = base_de_dados.church_goals_table_name
    coditions = [
        f'id_meta = {id_goal} AND id_congregacao = {id_church}'
    ]

    column_list = [
        'status',
        'prazo'
    ]

    value_list = [
        goal_status,
        goal_time
    ]


    responseAlterTime = await base_de_dados.alter( table_goal_table, column_list, value_list, conditions=coditions )
    #print(" SQL : ", responseAlterTime)

    old_goal_list = await get_goal_list_item( id_goal, id_church )
    old_goal_list = old_goal_list['content']
    
    
    old_list_id = [line[0] for line in old_goal_list ]
    new_list_id = [line[0] for line in new_goal_list]
    item_found = []
    for line in old_list_id:    
        for new_line in new_goal_list:
            if line == new_line[0]:
                item_found.append(new_line[0])
                
    #print(" OLD GOAL: ", old_list_id)
    #print('NEW LIST: ', new_list_id)
    #print(" FOUND IDS: ", item_found, flush=1)


    table_name = base_de_dados.church_item_goals_table_name


    for line in new_goal_list:
        #print(" NEW ID: ", line)
        if line[0] in item_found:
            tmp_quantity = float(line[2])
            tmp_sql_query = f'''
                UPDATE {table_name} SET 
                    quantidade = {tmp_quantity}
                WHERE
                    id_meta = {id_goal}
                    AND id_produto = {line[0]};
            '''
            await base_de_dados.query(tmp_sql_query )

        else:
            #print(" ADITIONING NEW ID: ", line)
            await add_item_on_goal_list(id_goal, line[0], line[2])
            #print( 'insertResponse: ', insertResponse)

    for line in old_list_id:
        if not line in new_list_id:
            #print(" REMOVENDO : ", line, flush=1)
            await remove_item_of_goal_list(id_goal, line)


    return response


@app.post('/change-church-goal-list')
async def change_church_goal_list_api( data : dict, user=Depends(require_permission(16)) ):
    response = {
        'status' : 90,
        'content' : []
    }

    id_goal = data['idGoal']
    id_church = data['idChurch']
    new_goal_list = data['newGoalList']
    goal_time = data['goalTime']
    goal_status = data['goalStatus']

    response = await change_church_goal_list(id_goal, id_church, new_goal_list, goal_time, goal_status)

    return response


async def create_church_goal( id_church, end_time, goal_status, goal_item_list):
    response = {
        'status' : 90,
        'content' : []
    }

    table_name = base_de_dados.church_goals_table_name
    table_item_name = base_de_dados.church_item_goals_table_name
    current_date = date.today()
    id_user = __USER_LOGGED["id_user"]
    last_id_goal = await base_de_dados.getSequence('meta')
    last_id_goal = last_id_goal['content']
    id_goal = last_id_goal + 1

    column_list = [
        'id_meta',
        'id_congregacao',
        'status',
        'id_usuario_responsavel',
        'data_criacao',
        'prazo'
    ]

    value_list = [
        id_goal,
        id_church,
        goal_status,
        id_user,
        current_date,
        end_time
    ]

    response = await base_de_dados.insert( table_name, column_list, value_list)
    if response['status'] == 0:

        column_list = [
            'id_meta',
            'id_produto',
            'quantidade'
        ]

        for item in goal_item_list:
            value_list = [
                id_goal,
                item[0],
                item[2]

            ]
            response = await base_de_dados.insert( table_item_name, column_list, value_list)
            if response['status'] != 0:
                return response

    if response['status'] == 0:
        response['content'] = id_goal

    return response



async def add_item_on_goal_list(id_goal, id_product, quantity):
    response = {
        'status' : 90,
        'content' : []
    }

    quantity = float(quantity)

    table_name = base_de_dados.church_item_goals_table_name
    column_list = [
        'id_meta',
        'id_produto',
        'quantidade'
    ]

    value_list = [
        id_goal,
        id_product,
        quantity
    ]

    response = await base_de_dados.insert(table_name, column_list, value_list)

    return response


@app.post('/add-item-on-goal-list')
async def add_item_on_goal_list_api( data : dict, user=Depends(require_permission(16))):
    response = {
        'status' : 90,
        'content' : []
    }

    id_goal = data['idGoal']
    id_product = data['idProduct']
    quantity = data['quantity']

    response = await add_item_on_goal_list(id_goal, id_product, quantity)

    return response



async def remove_item_of_goal_list(id_goal, id_product):
    response = {
        'status' : 90,
        'content' : []
    }

    table_name = base_de_dados.church_item_goals_table_name

    condition = f'id_meta = {id_goal} AND id_produto = {id_product}'

    response = await base_de_dados.delete(table_name, condition)

    return response


@app.post('/remove-item-of-goal-list')
async def remove_item_of_goal_list_api( data : dict, user=Depends(require_permission(17)) ):
    response = {
        'status' : 90,
        'content' : []
    }

    id_goal = data['idGoal']
    id_product = data['idProduct']

    response = await remove_item_of_goal_list( id_goal, id_product )

    return response

@app.post('/create-church-goal-list')
async def create_church_goal_api( data : dict, user=Depends(require_permission(18)) ):
    response = {
        "status" : 90,
        'content' : []
    }

    id_church = data['idChurch']
    end_time = data['endTime']
    goal_status = data['goalStatus']
    goal_item_list = data['goalItemList']


    response = await create_church_goal(id_church, end_time, goal_status, goal_item_list)

    return response


async def remove_goal_of_church(id_goal, id_church):
    response = {
        'status' : 90,
        'content' : []
    }

    table_name = base_de_dados.church_goals_table_name

    params = f'id_meta = {id_goal} AND id_congregacao = {id_church}'

    response = await base_de_dados.delete(table_name, params)

    return response



@app.post('/remove-goal-of-church')
async def remove_goal_of_church_api( data : dict, user=Depends(require_permission(17)) ):
    response = {
        'status' : 90,
        'content' : []
    }
    id_goal = data['idGoal']
    id_church = data['idChurch']

    response = await remove_goal_of_church(id_goal, id_church)
    print(" REMOVE GOAL OF CHURHC: ", response)
    return response




async def update_church_goal():
    response = {
        'status' : 90,
        'content' : []
    }

    table_name = base_de_dados.church_goals_table_name

    sql_query = f'''
    SELECT
        id_meta,
        id_congregacao,
        status,
        prazo
    FROM {table_name};
    '''

    current_date = datetime.strptime(str(date.today()), "%Y-%m-%d")

    response = await base_de_dados.query( sql_query )

    #print(" RESPONSE : ", response)

    for i in range( len( response['content'] ) ):
        response["content"][i] = list(response["content"][i])

        tmpGoalStatus = response['content'][i][2]
        if tmpGoalStatus == 0 or tmpGoalStatus == 3:
            continue

        tmpGoalTime = response['content'][i][3]
        #print("DATAS: ", current_date, tmpGoalTime, flush=1)
        try:
            goal_date = datetime.strptime(tmpGoalTime, "%Y-%m-%d")
        
        except:
            goal_date = 0

        if goal_date == 0:
            tmpGoalStatus = 0

        elif current_date > goal_date:
            tmpGoalStatus = 1

        else:
            tmpGoalStatus = 2

        response["content"][i][2] = tmpGoalStatus

    column_list = [
        'status',
        'prazo'
    ]

    for i in range(len(response["content"])):
        value_list = [
            response["content"][i][2],
            response['content'][i][3]
        ]
        condition = f'id_meta = {response["content"][i][0]} AND id_congregacao = {response["content"][i][1]}'
        await base_de_dados.alter(table_name, column_list, value_list, conditions=condition)

    #print( response, flush=1)

    return response


@app.post('/update-churches-goals')
async def update_church_goal_api():
    response = {
        'status' : 90,
        'content' : []
    }

    response = await update_church_goal()


    return response



# =======================
# = CHURCH - RECORDS = 
# ========================

async def record_register_church( id_church, id_user = None):
    response = {
        "status" : 90,
        "content" : "Error"
    }

    if id_user == None:
        id_user = __USER_LOGGED['id_user']

    current_data = date.today()

    table_name = base_de_dados.history_register_church_table_name

    column_list = [
        'id_congregacao',
        'tipo_registro',
        'id_usuario_responsavel',
        'data'
    ]

    value_list = [
        id_church,
        REGISTRATION_TYPE,
        id_user,
        current_data
    ]

    response = await base_de_dados.insert(table_name, column_list, value_list)


    return response


async def record_church_goals_completed(initial_date = '', end_date = ''):
    response = {
        'status' : 90,
        'content' : []
    }

    table_name = base_de_dados.church_goals_table_name
    church_table_name = base_de_dados.church_table_name
    sql_query = f'''
    SELECT
        mt.id_meta,
        c.nome,
        mt.prazo,
        mt.status
    FROM {table_name} mt
    INNER JOIN {church_table_name} c
    ON mt.id_congregacao = c.id_congregacao
    WHERE status = 3 '''
    
    if initial_date and end_date:
        sql_query += f" AND prazo BETWEEN '{initial_date}' AND '{end_date}'"

    elif initial_date:
        sql_query += f" AND prazo => '{initial_date}'"
    
    elif end_date:
        sql_query += f" AND prazo <= '{end_date}'"


    sql_query += f' ;'
    

    #print(" SQL QUERY: ", sql_query)
    response = await base_de_dados.query( sql_query )
    #print(" RETORNO METAS: ", response)
    if len(response['content']) == 0:
        return response
    
    for i, goal in enumerate(response['content']):
        response['content'][i] = list(response['content'][i])
        tmpStatus = ''
        match goal[3]:
            case 0:
                tmpStatus = 'CANCELADO'
            
            case 1:
                tmpStatus = 'ATRASADO'

            case 2:
                tmpStatus = 'PENDENTE'
            
            case 3:
                tmpStatus = 'COMPLETO'

        
        
        response['content'][i][3] = tmpStatus


    return response

@app.post('/record-church-goal-completed')
async def record_church_goals_completed_api( data : dict, user=Depends(require_permission(19))):
    response = {
        'status' : 90,
        'content' : []
    }
    #print(" record GOALS COMPLETED: ", data)
    initial_date = data['initialDate']
    end_date = data['endDate']

    response = await record_church_goals_completed(initial_date, end_date)

    return response



async def record_church_withdraw_basket(initial_date = '', end_date = ''):
    global OUTPUT_TYPE
    response = {
        'status' : 90,
        'content' : []
    }

    table_name = base_de_dados.output_table_name
    table_item_name = base_de_dados.item_output_table_name
    church_table_name = base_de_dados.church_table_name
    user_table_name = base_de_dados.user_table_name
    product_table_name = base_de_dados.product_table_name

    ''' 
    SELECT 
        exit.id_saida,
        ch.nome,
        exit.quantidade_cesta,
        exit.data_saida,
        exit.doacao_fora,
        user.nome_do_usuario
        SUM(ti.quantidade) as total_saida
    FROM {table_name} exit
        LEFT JOIN {church_table_name} ch
        ON exit.id_congregacao = ch.id_congregacao
        LEFT JOIN {user_table_name} user
        ON exit.id_usuario = user.id_usuario
        LEFT JOIN {table_item_name} ti
        ON exit.id_produto = ti.id_produto
        LEFT JOIN {product_table_name} p
        ON ti.id_produto = p.id_item
    
    WHERE exit.tipo_saida = {OUTPUT_TYPE} '''

    sql_query = f'''
SELECT
    s.id_saida,
    c.nome,
    s.quantidade_cesta,
    ROUND(SUM(i.quantidade * IFNULL(p.peso, 0)), 2) AS peso_total_saida,
    s.doacao_fora,
    s.data_saida,
    u.nome_do_usuario
FROM {table_name} s
LEFT JOIN {table_item_name} i
    ON i.id_saida = s.id_saida
LEFT JOIN {product_table_name} p
    ON p.id_item = i.id_produto
LEFT JOIN { church_table_name } c
	ON c.id_congregacao = s.id_congregacao
LEFT JOIN {user_table_name } u
    ON u.id_usuario = s.id_usuario
WHERE ( s.tipo_saida IN (1, 2) ) 

   '''

    if initial_date and end_date:
        sql_query += f" AND exit.data_saida BETWEEN '{initial_date}' AND '{end_date}' "

    elif initial_date:
        sql_query += f" AND exit.data_saida >= '{initial_date}'"

    elif end_date:
        sql_query += f" AND exit.data_saida <= '{end_date}'"

    sql_query += '''
GROUP BY s.id_saida
ORDER BY s.id_saida'''
    sql_query += f' ;'


    response = await base_de_dados.query( sql_query )
    #print(" RESPONSE: ", response, sql_query)
    if response['status'] != 0:
        return response
    

    for i, output in enumerate(response["content"]):
        response["content"][i] = list(response["content"][i])
        if output[4] == 1:
            response["content"][i][4] = 'EXTERNA'
        
        else:
            response['content'][i][4] = 'INTERNA'


    return response

@app.post('/record-church-withdraw-basket')
async def record_church_withdraw_basket_api( data : dict, user=Depends(require_permission(20)) ):
    response = {
        'status' : 90,
        'content' : []
    }

    initial_date = data['initialDate']
    end_date = data['endDate']

    response = await record_church_withdraw_basket(initial_date, end_date)

    return response


#==============================================
#= Church - Graph Function
#===============================================



@app.post('/get-all-church-goal-data-graph')
async def get_all_church_goal_data_graph_api( user=Depends(require_permission(20)) ):
    response = {
        'status' : 90,
        'content' : []
    }

    query_data = await get_all_church_goal()

    if query_data['status'] != 0:
        return query_data

    goal_data = query_data['content']

    goal_completed_count = 0
    goal_incompleted_count = 0


    for goal in goal_data:
        if goal[2] == 3:
            goal_completed_count += 1

        else:
            goal_incompleted_count += 1


    total = goal_completed_count + goal_incompleted_count
    porcentage = 0
    if total > 0 and goal_completed_count > 0:
        porcentage = int((goal_completed_count / total) * 100)

    response['status'] = 0
    response['content'] = [goal_completed_count, goal_incompleted_count, porcentage]

    return response


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
    #print(" RESPONSE INSERT: ", responseInsert)
    responseBasket = await search_on_basket_register_by_name(nameBasicFoodBasket)
    #print(" RESPONSE BaSkET: ", responseBasket)
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

    #print(" register_item_on_basket_model: ", data, flush=1)
    idProduct = data["idProduct"]
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

    response = await base_de_dados.insert("item_cesta_basica", column_list, value_list)

    return response


@app.post("/remove-registration-basket-model")
async def remove_registration_basket_model(data : dict):
    response = {
        "status" : 90,
        "content" : "Error"
    }
    idBasket = data["idBasket"]
    #print("DATA: ", idBasket)

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
    idProduct = int(idProduct)
    idBasket = int(idBasket)

    param = f'id_item= {idProduct} AND id_cesta= {idBasket} '
    table_name = base_de_dados.basket_item_table_name


    response = await base_de_dados.delete(table_name, param)
    #print(" DELETING ITEM OF BASKET MODEL RESPONSE: ", response)
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
    sql_query = f"""
        SELECT
            icb.id_item,
            produto.nome_do_produto,
            produto.marca,
            icb.quantidade_do_item
        FROM item_cesta_basica AS icb
        LEFT JOIN produto ON
            icb.id_item = produto.id_item
        WHERE icb.id_cesta = {idBasket};
    """
    response = await base_de_dados.query(sql_query)


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


async def get_history_basket_models_data():
    response = {
        'status' : 90,
        'content' : []
    }

    table_name = base_de_dados.basket_table_name

    sql_query = f'''
    SELECT
        id_cesta,
        nome_da_cesta,
        cadastro_ativo
    FROM {table_name}
    WHERE cadastro_ativo = 1;
    '''

    response = await base_de_dados.query( sql_query )
    
    return response


@app.get("/get-history-basket-models-data")
async def get_history_basket_models():
    response = {
        'status' : 90,
        'content' : []
    }

    response = await get_history_basket_models_data()

    return response


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

#================================================
# ==== IO BASKET
#===============================================


async def output_basket( id_basket, id_family, id_church, item_list, basket_quantity, observation = '', out_donation = 0 ):
    response = {
        "status" : 90,
        "content" : "Error"
    }

    register_output = await record_outputs( id_basket, id_family, id_church, OUTPUT_TYPE, basket_quantity, out_donation )
    #print(" REGISTER OUTPUT: ", register_output, flush=1)
    #print(" item_list : ", item_list, flush=1)
    id_output = register_output['content']
    for item in item_list:
        id_product = item[0]
        quantity_product = item[3]


        await inventory_adjustment( id_product, OUTPUT_TYPE, quantity_product, observation=observation)
        await record_withdraw_item( id_output, id_product, quantity_product)

    response["status"] = 0
    response['content'] = id_output
    return response


@app.post("/output-basket")
async def output_basket_api( data : dict):
    response = {
        "status" : 90,
        "content" : "Error"
    }

    #print(" Output Basket...")
    print(" DATA: ", data)
    id_family, id_church, id_basket = None, None, None
    item_list = data["itemList"]

    if data.get('idBasket'):
        id_basket = data["idBasket"]
    if data.get('idFamily'):
        id_family = data["idFamily"]
    
    if data.get("idChurch"):
        id_church = data["idChurch"]

    basket_quantity = data["basketQuantity"]
    observation = data["observation"]
    out_donation = data["outDonation"]

    response = await output_basket(id_basket, id_family, id_church, item_list, basket_quantity, observation, out_donation)

    return response
    
# Futura implementação
#Implementar uma função para gerar relatorios de saida de cestas
async def basket_delivery_report():
    pass


@app.post("/basket-delivery-report")
async def basket_delivery_report_api( data : dict ):
    response = {
        "status" : 90,
        "content" : "Error"
    }

    response = await  basket_delivery_report()

    return response



#==============================================
# = IO - RECORDS
# ============================================


async def get_all_input_and_output_basket(initial_date = '', end_date = ''):
    global INPUT_TYPE, OUTPUT_TYPE
    response = {
        'status' : 90,
        'content' : []
    }
    table_name = base_de_dados.output_table_name
    church_table_name = base_de_dados.church_table_name

    sql_query = f'''
    SELECT 
        exit.id_saida,
        exit.id_cesta,
        exit.id_familia,
        church.nome,
        exit.quantidade_cesta,
        exit.tipo_saida,
        exit.doacao_fora,
        exit.data_saida
    FROM { table_name } exit
    LEFT JOIN {church_table_name} church
    ON exit.id_congregacao = church.id_congregacao
    WHERE ( exit.tipo_saida = {OUTPUT_TYPE} OR exit.tipo_saida = {INPUT_TYPE} ) '''
    if initial_date and end_date:
        sql_query += f" AND exit.data_saida BETWEEN '{initial_date}' AND '{end_date}' "


    elif initial_date:
        sql_query = f" AND exit.data_saida > '{initial_date}' "
        

    elif end_date:
        sql_query = f" AND exit.data_saida > '{end_date}' "


    sql_query += f';'
    #print(' SQL QUERY: ', sql_query)
    response = await base_de_dados.query( sql_query )
    #print(" get_all_input_and_output_basket: ", response)
    return response


async def input_and_output_basket_data_graph():
    response = {
        'status' : 90,
        'content' : []
    }


    query_data = await get_all_input_and_output_basket()
    #print("input_and_output_basket_data_graph1 - query_data: ", query_data)
    if query_data['status'] != 0:
        return query_data
    
    ioData = query_data["content"]
    
    output_counts = 0
    input_counts = 0

    for action in ioData:
        if action[5] == 1:
            input_counts += 1

        elif action[5] == 2:
            output_counts += 1

    total = input_counts + output_counts
    porcentage = 0
    if total > 0 and porcentage > 0:
        porcentage = int((output_counts / total) * 100)

    response['status'] = 0
    response['content'] = [input_counts, output_counts, porcentage]

    #print("input_and_output_basket_data_graph-2: ", response, flush=1)

    return response


@app.post('/get-all-input-and-output-data-graph')
async def input_and_output_basket_data_graph_api():
    response = {
        'status' : 90,
        'content' : []
    }

    response = await input_and_output_basket_data_graph()
    #print("input_and_output_basket_data_graph_api: ", response)
    return response







#==============================================
#=
#===============================================




app.mount(
    "/assets",
    StaticFiles(directory=os.path.join(static_path, "assets")),
    name="assets"
)


@app.get("/")
async def root():
    return FileResponse(os.path.join(static_path, "index.html"))


@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    file_path = os.path.join(static_path, full_path)

    # se for arquivo real, serve ele
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)

    # senão retorna index.html (SPA)
    return FileResponse(os.path.join(static_path, "index.html"))

def start_server():
    #uvicorn.run(app, host="127.0.0.1", port=8080)
    uvicorn.run('server:app', host="127.0.0.1", port=8080, reload=True)

if __name__ == "__main__":

    start_server()    

    '''
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()


    time.sleep(1.5)


    webview.create_window(
        "Meu Sistema",
        "http://127.0.0.1:8080"
        
    )
    webview.start(private_mode=False)
    '''
    print("Aplicação encerrada")

