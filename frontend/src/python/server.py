from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import asyncio
import json

app = FastAPI()


#========================
# Autentication class
#========================

class AuthRequest( BaseModel ):
    username: str
    password: str

class AuthResponse( BaseModel ):
    status: str
    message: str

#===============================================
# Stock
#===============================================
#===============================================
# Family
#===============================================
class SearchRegisterFamilyRequest( BaseModel ):
    representativeRecive : str
    columnName : str
#===============================================
# Church
#===============================================
class SearchRegisterChurchRequest( BaseModel ):
    churchName : str
    columnName : str


class SearchForChurchGoalItem( BaseModel ):
    churchId : int
    goalItemName : str
    columnName : str

#===============================================
# Basket
#===============================================
class SearchRegisterBasketRequest( BaseModel ):
    basketModelName : str
    columnName : str


class SearchRegisterBasketOrderRequest( BaseModel ):
    basketModelName : str
    columnName : str


class SearchBasketItemRequest( BaseModel ):
    basketItemName : str
    columnName : str
#===============================================
# Others Responses
#===============================================
class SearchRequest( BaseModel ):
    itemName : str
    columnName : str
    limit : int

class SearchResponse( BaseModel ):
    status : int
    content : dict

class GetResponse( BaseModel ):
    status : int
    content : dict

class ResponseModel( BaseModel ):
    status: str
    content : list
    
#===============================================


#================================================
#= Autentication
#===================================================
@app.post("/authentication", response_model=AuthResponse)
async def authentication(data: AuthRequest):
    username = await data.username
    password = await data.password

    print("Autenticando: ", username, password)
    #Implementação de uma logica de autenticação
    if username == "Admin" and password == "admin":
        return {"status": 0, "credential" : {"username": username, "role" : "admin"}}
    
    elif username == "Operador" and password == "operador":
        return {"status": 0, "credential" : {"username": username, "role" : "operator"}}

    elif username == "Visitante" and password == "visitante":
        return {"status": 0, "credential" : {"username": username, "role" : "visit"}}


    else:
        return {"status": 90, "credential" : {"username" : "", "role" : ""}}


#==============================================
#= Stock
#===============================================

def get_stock_data():
    try:
        listaDeItens = [
            {"produto": 'AÇUCAR 1KG', "marca": 'GENERICA', "id": 'PD0', "quantidade": 1},
            {"produto": 'ARROZ 5KG', "marca": 'GENERICA', "id": 'PD1', "quantidade": 1},
            {"produto": 'FEIJÃO 1KG',"marca": 'GENERICA', "id": 'PD2', "quantidade": 1},
            {"produto": 'MANTEIGA 500G', "marca": 'GENERICA', "id": 'PD3', "quantidade": 1},
            {"produto": 'ABOBORA CONSERVADA EM LATA COM A MARCA TAL DA SILVA COM 5KG E VALIDO ATÉ AMANHÃ', "marca": "TESTE DE NOME GIGANTE GENERICA MARCA", "id": 'PD4', "quantidade": 1},
            {"produto": 'LEITE 5L', "marca": 'GENERICA', "id": 'PD5', "quantidade": 1},
            {"produto": "MACARRÃO 150G", "marca": 'GENERICA', "id": 'PD6', "quantidade": 1},
            {"produto": 'CAFÉ 500G', "marca": 'GENERICA', "id": 'PD7', "quantidade": 1},
            {"produto": 'CAFÉ 250G',"marca": 'GENERICA', "id": 'PD8', "quantidade": 1},
            {"produto": 'PÃO SOVADO', "marca": 'GENERICA', "id": 'PD9', "quantidade": 1},
            {"produto": 'ÓLEO 1L', "marca": 'GENERICA', "id": 'PD10', "quantidade": 1},
        ]
     
        return {"status": 0, "content" : listaDeItens}
    
    except Exception as error:
        print("OCORREU UM ERRO AO OBTER ESTOQUE: ", error, flush=1)
        return {"status": 90, "content" : None}


@app.get("/get-stock")
async def get_stock():
    return get_stock_data()


@app.post("/search-stock")
async def search_on_stock(data: SearchRequest):
    print(f"search for item... {data.itemName}", flush=1)
    stock_list = get_stock_data()

    columnName = data.columnName
    itemName = data.itemName
    found_itens = []
    if itemName == '':
        return  {"status" : 0, "content" : stock_list['content']}
    try:
        for index in stock_list["content"]:
            #print("index: ", index)
            for key, value in index.items():
                if key == columnName:
                    if itemName in value[:len(itemName)]:
                        #print("ITEM ENCONTRADO: ", index)
                        found_itens.append(index)

    except Exception as error:
        print( error)
        return {"status" : 90, "content" : str(error)}
    
    return {"status" : 0, "content" : found_itens}


#==============================================
#= Family
#===============================================

def get_family_data():
    family_list = [
        {
            "Representante": "ROBERTO DA SILVA RIBEIRO PINHAIS", "Membros": 6, "Cidade": "UBATUBA", "Bairro": "ESTUFA II", "Rua": "RUA MADUREIRA", "Numero Da Casa": "39",
            "Telefone": "(12) 9900-0000", "Prioridade": "Alta", "Congregação": "Estufa II",
        },
        {
            "Representante": "MARCELA RIBEIRO DA PENHA CARNEIRO", "Membros": 3, "Cidade": "UBATUBA", "Bairro": "ESTUFA II", "Rua": "RUA SANTA CRUZ", "Numero Da Casa": "339",
            "Telefone": "(12) 91111-1111", "Prioridade": "Media", "Congregação": "Estufa II",
        }

    ]
    return {"status": 0, "content" : family_list}


@app.get("/get-family-data")
async def get_family_list():
    return get_family_data()


@app.post("/search-for-family")
async def search_on_family_register(data: SearchRegisterFamilyRequest):
    print("search for family...", flush=1)
    family_register_data = get_family_data()
    
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
                    if representativeRecive in value[:len(representativeRecive)]:
                        #print("REGISTRO ENCONTRADO: ", index)
                        found_registers.append(index)

    except Exception as error:
        print( error)
        return {"status" : 90, "content" : str(error)}
    
    return {"status" : 0, "content" : found_registers}


#=================================================


def get_priority_registration_data():
    priority_registration_data = [
        { "Prioridade" : 'Alta', "Descricao": 'A familia precisa com antecedência', "Nivel": 2},
        { "Prioridade" : 'Media', "Descricao": 'A familia tem uma condição de atenção', "Nivel": 1},
        { "Prioridade" : 'Baixa', "Descricao": 'A familia tem uma condição de menos urgência', "Nivel": 0},
    ]
    return {"status": 0, "content" : priority_registration_data}


@app.get("/get-priority-registration")
async def get_family_list():
    return get_priority_registration_data()

#==============================================
#= Church
#===============================================

def get_church_data():
    church_register = [
        {
            "Nome": "ASSEMBLEIA DE DEUS MINISTERIOS DE SANTOS ESTUFA II",
            "Representante": "FULANO DE TAL",
            "Membros": 150,
            "Cidade": "UBATUBA",
            "Bairro": "ESTUFA II",
            "Rua": "RUA SICRANO DA SILVA",
            "Numero": "39",
            "Meta Mensal": 'PENDENTE',
        },
        {
            "Nome": "ASSEMBLEIA DE DEUS MINISTERIOS DE SANTOS ESTUFA I",
            "Representante": "SICRANO DA SILVA",
            "Membros": 100,
            "Cidade": "UBATUBA",
            "Bairro": "ESTUFA I",
            "Rua": "RUA FILADO DA SILVA",
            "Numero": "13",
            "Meta Mensal": 'CONCLUIDA',
        },
    ]   
    return {"status": 0, "content" : church_register}


@app.get("/get-church-list")
async def get_church_list():
    return get_church_data()


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
            #print("index: ", index)
            for key, value in index.items():
                if key == columnName:
                    if churchName in value[:len(churchName)]:
                        #print("REGISTRO ENCONTRADO: ", index)
                        found_registers.append(index)

    except Exception as error:
        print( error)
        return {
            "status" : 90,
            "content" : str(error)
        }
    
    return {"status" : 0, "content" : found_registers}

def get_church_goals_data():
    goals_data = [{
                "produto" : "MACARRAO 150G",
                "id": 'PD6',
                "quantidade": '6',
            }, {
                "produto" : "ARROZ 5KG",
                "id": 'PD1',
                "quantidade": '10',
            }, {
                "produto" : "FEIJÃO 1KG",
                "id": 'PD2',
                "quantidade": '15',
            }, {
                "produto" : "OLEO 1L",
                "id": 'PD10',
                "quantidade": '5',
            }, {
                "produto" : "CAFÉ 250G",
                "id": 'PD5',
                "quantidade": '10',
            }, {
                "produto" : "AÇUCAR 1KG",
                "id": 'PD0',
                "quantidade": '10',
            }]
    return {"status" : 0, "content": goals_data}

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
                    if goalItemName in value[:len(goalItemName)]:
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
#=
#===============================================


def get_basic_basket_food_data():
    try:
        basic_basket_food_data = [
            {
                "NOME DA CESTA" : "MODELO1",
                "id": 1,
                "Quantidade de itens": 10,
                "Quantidade de cestas geradas" : 2,
            }
        ]   
        return {"status": 0, "content" : basic_basket_food_data}

    except Exception as error:
        return {"status": 90, "content" : str(error)}

@app.get("/get-basket-list")
async def get_backet_list():
    response= get_basic_basket_food_data()
    #print("RETURN BASKETS DATA: ", response)
    return response


@app.post("/search-for-basket")
async def search_on_basket_register(data: SearchRegisterBasketRequest):
    print(f" ({data.basketModelName})({data.columnName}) search for basket...", flush=1)
    basket_register_data = get_basic_basket_food_data()

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
                    if basketModelName in value[:len(basketModelName)]:
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
#= Basket
#===============================================


def get_basic_basket_food_order_data():
    try:
        basic_basket_food_order_data = [
            {
                "data": '01/01/2025',
                "destino": 'Congregação do Itaguá',
                "enderecoDeDestino": 'R. Criada agora, N16',
                "itensDaCesta": [{
                                    "produto": 'ARROZ 5KG', "id": "PD1", "quantidade": 1, 
                                },{
                                    "produto": 'FEIJÃO 1KG', "id": "PD2", "quantidade": 3, 
                                }, {
                                    "produto": 'ÓLEO 1L', "id": "PD10", "quantidade": 1, 
                                }, {
                                    "produto": 'MACARRÃO 150G', "id": "PD6", "quantidade": 4
                                }
                ],
                "quemRetirou": 'Fulano da silva',
                "paraQuem": 'Silveira da Silva',
                "entregue": '1',
                'PRAZO DE ENTREGA': '21/01/2025',
            },
            {
                "data": '06/02/2025',
                "destino": 'Congregação do Estufa 2',
                "enderecoDeDestino": 'R. Rua teste, N32',
                "itensDaCesta": [{
                                        "produto": 'AÇUCAR 1KG', "id": "PD0", "quantidade": 1,
                                    },{
                                        "produto": 'PÃO SOVADO', "id": "PD9", "quantidade": 3, 
                                    }, {
                                        "produto": 'CAFÉ 500G', "id": "PD7", "quantidade": 1, 
                                    }, {
                                        "produto": 'MACARRÃO 150g', "id": "PD6", "quantidade": 4
                                    }
                ],
                "quemRetirou": 'Sicrano de Oliveira',
                "paraQuem": 'Oliver Oliveira',
                "entregue": '0',
                'PRAZO DE ENTREGA': '26/02/2025',
                
            },

        ]
        return {
            "status": 0,
            "content" : basic_basket_food_order_data
        }

    except Exception as error:
        return {
            "status": 90,
            "content" : str(error)
        }

@app.get("/get-basket-order-list")
async def get_backet_order_list():
    response= get_basic_basket_food_order_data()
    #print("RETURN BASKETS DATA: ", response)
    return response


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
                    if basketModelName in value[:len(basketModelName)]:
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

def get_basket_model_items():
    try:
        basket_item_list = [
            {
                "NOME DO ITEM" : "FEIJÃO 1KG",
                "id": '01',
                "Quantidade de itens": 10,
            }
        ]
        return {
            "status": 0,
            "content" : basket_item_list
        }

    except Exception as error:
        return {
            "status": 90,
            "content" : str(error)
        }

@app.get("/get-basket-items-list")
async def get_backet_items_list():
    response= get_basket_model_items()
    #print("RETURN BASKETS DATA: ", response)
    return response


@app.post("/search-for-basket-item")
async def search_on_basket_item_register(data: SearchBasketItemRequest):
    print(f" ({data.basketItemName})({data.columnName}) search for basket...", flush=1)
    basket_item_register_data = get_basket_model_items()

    basketItemName = data.basketItemName
    columnName = data.columnName
    found_registers = []
    if basketItemName == '':
        return  {
            "status" : 0,
            "content" : basket_item_register_data["content"]
        }
    
    try:
        for index in basket_item_register_data["content"]:
            #print("index: ", index)
            for key, value in index.items():
                if key == columnName:
                    if basketItemName in value[:len(basketItemName)]:
                        print("REGISTRO ENCONTRADO: ", index)
                        found_registers.append(index)

    except Exception as error:
        print( error)
        return {
            "status" : 90,
            "content" : str(error)
        }
    
    return {
        "status" : 0,
        "content" : found_registers
        }



#==============================================
#=
#===============================================



if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8080, reload=True)