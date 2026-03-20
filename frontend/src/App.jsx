import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';

// ------------------------------------- Paginas principais ---------------------------------------------
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import GerarRelatorios from './pages/GerarRelatorios';
import Suporte from './pages/Suporte';
import Layout from './pages/Layout';
import Options from './pages/Options';
import NoPage from "./pages/NoPage";
import NoAuthorized from './pages/NoAuthorized';
import Documentacao from '../src/public/Docspage';
import MetaPage from './pages/MetaPage';

// ------------------------------------------------------------------------------------------------------

// ------------------------------------- Management of Products  ----------------------------------------
import GerenciarProdutos from './pages/ManagementOfProducts/GerenciarProdutos';
import RegistrarProdutos from './pages/ManagementOfProducts/RegistrarProdutos';
import AlterarDadosProduto from './pages/ManagementOfProducts/AlterarDadosProduto';
// ------------------------------------------------------------------------------------------------------

// ------------------------------------- Managemente of Families  ---------------------------------------
import RegistrarFamilia from './pages/ManagementOfFamilies/RegistrarFamilia';
import CadastroDeFamilias from './pages/ManagementOfFamilies/CadastrosDeFamilias';
import AlterarCadastroDeFamilia from './pages/ManagementOfFamilies/AlterarCadastroDeFamilia';
import PriorityRegistration from './pages/ManagementOfFamilies/PriorityRegistration';
import AddingPriorityRegister from './pages/ManagementOfFamilies/AddingPriorityRegister';
import AlterPrirotityRegister from './pages/ManagementOfFamilies/AlterPrirotityRegister';

// ------------------------------------------------------------------------------------------------------

// ------------------------------------- Management of churches -----------------------------------------
import RegisterChurch from './pages/ManagementOfChurchs/RegisterChurch';
import ChurchRecords from './pages/ManagementOfChurchs/ChurchRecords';
import ChangeChurchRegistration from './pages/ManagementOfChurchs/ChangeChurchRegistration';
import EditingGoalPage from './pages/MetaPage/EditingGoalPage';
import CreateGoalForChurch from './pages/MetaPage/CreateGoalForChurch';
// ------------------------------------------------------------------------------------------------------

// ------------------------------------- Management of Baskets ------------------------------------------
import BasicFoodBasket from './pages/ManagementOfBaskets/ManageBasicBasket';
import RegisterBasicFoodBasket from './pages/ManagementOfBaskets/RegisterBasicFoodBasket';
import ChangeBasicBasket from './pages/ManagementOfBaskets/ListOfBasicBasketItems';
import GenerateBasicFoodBaskets from './pages/ManagementOfBaskets/GenerateBasicFoodBaskets';
import IOBaskets from './pages/ManagementOfBaskets/IOBaskets';
import HistoryBasicFoodBasket from './pages/ManagementOfBaskets/HistoryBasicFoodBasket';
import BasketDeliveryOrder from './pages/ManagementOfBaskets/BasketDeliveryOrder';
import AlterBasketOrder from './pages/ManagementOfBaskets/AlterBasketOrder'
// ------------------------------------------------------------------------------------------------------

// ------------------------------------- Usuarios -------------------------------------------------------
import ManagementUserPage from './pages/ManagementOfUsers/ManagementUserPage';

// ------------------------------------------------------------------------------------------------------


// ------------------------------------- Funções --------------------------------------------------------

import AlterFunctionPage from '/src/pages/ManagementOfFunctions/AlterFunction';


// ------------------------------------------------------------------------------------------------------

// ------------------------------------- Outros ---------------------------------------------------------
import { AuthProvider  } from './contexts/AuthenticateContext/AuthContext';
import RouteGuard from './contexts/GuardRoutes/RouteGuard';
import { ThemeProvider } from './contexts/CurrentTheme';
import { PERMISSIONS } from './Components/UserPermission';


// ------------------------------------------------------------------------------------------------------


const App = () => {
  
  const storage = window.localStorage ?? {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
  };
  return (
      <div id="app">

        <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>

              {/* ROTAS REFERENTE A FAMILIA */}
              <Route element={<RouteGuard permission={[PERMISSIONS.VIEW_CREATE_FAMILY]} />}>
                <Route element={<Layout />}>
                  <Route path="/register-family" element={<RegistrarFamilia />} />
                </Route>
              </Route>
              <Route element={<RouteGuard permission={[PERMISSIONS.VIEW_MANAGE_FAMILY]} />}>
                <Route element={<Layout />}>
                  <Route path="/cadastros-de-familias" element={<CadastroDeFamilias />} />
                </Route>
              </Route>
              <Route element={<RouteGuard permission={[PERMISSIONS.VIEW_MANAGE_FAMILY]} />}>
                <Route element={<Layout />}>
                  <Route path="/cadastros-de-familias" element={<CadastroDeFamilias />} />
                </Route>
              </Route>
              <Route element={<RouteGuard permission={[PERMISSIONS.VIEW_ALTER_FAMILY]} />}>
                <Route element={<Layout />}>
                  <Route path="/alterar-cadastro-familia" element={<AlterarCadastroDeFamilia />} />
                </Route>
              </Route>
              <Route element={<RouteGuard permission={[PERMISSIONS.VIEW_MANAGE_PRIORITY]} />}>
                <Route element={<Layout />}>
                  <Route path="/priority-registration" element={ <PriorityRegistration /> } />
                </Route>
              </Route>
              <Route element={<RouteGuard permission={[PERMISSIONS.VIEW_CREATE_PRIORITY]} />}>
                <Route element={<Layout />}>
                  <Route path="/adding-priority-register" element={ <AddingPriorityRegister /> } />
                </Route>
              </Route>
              <Route element={<RouteGuard permission={[PERMISSIONS.VIEW_ALTER_PRIORITY]} />}>
                <Route element={<Layout />}>
                  <Route path="/alter-priority-register" element={ <AlterPrirotityRegister /> } />
                </Route>
              </Route>
              {/* FIM ROTAS REFERENTE A FAMILIA */}
              {/* ============================= */}
              {/* ROTAS REFERENTE A CONGREGAÇÃO */}
              <Route element={<RouteGuard permission={[PERMISSIONS.VIEW_MANAGE_CHURCH]} />}>
                <Route element={<Layout />}>
                  <Route path="/manage-churches" element={<ChurchRecords />} />
                </Route>
              </Route>
              <Route element={<RouteGuard permission={[PERMISSIONS.VIEW_REGISTER_CHURCH]} />}>
                <Route element={<Layout />}>
                  <Route path="/register-church" element={<RegisterChurch />} />
                </Route>
              </Route>
              <Route element={<RouteGuard permission={[PERMISSIONS.VIEW_ALTER_CHURCH]} />}>
                <Route element={<Layout />}>
                  <Route path="/change-church-registration" element={ <ChangeChurchRegistration /> } />
                </Route>
              </Route>,
              <Route element={<RouteGuard permission={[PERMISSIONS.VIEW_CREATE_CHURCH_GOAL]} />}>
                <Route element={<Layout />}>
                  <Route path='/create-goal-for-church' element= { <CreateGoalForChurch /> } />
                </Route>
              </Route>
              <Route element={<RouteGuard permission={[PERMISSIONS.VIEW_ALTER_CHURCH_GOAL]} />}>
                <Route element={<Layout />}>
                  <Route path="/editing-goal-page" element={ <EditingGoalPage /> } />
                </Route>
              </Route>
              <Route element={<RouteGuard permission={[PERMISSIONS.VIEW_MANAGE_CHURCH_GOAL]} />}>
                <Route element={<Layout />}>
                  <Route path="/metas" element={<MetaPage />} />
                </Route>
              </Route>
              {/* FIM ROTAS REFERENTE A CONGREGAÇÃO */}
              {/* ================================= */}
              {/* ROTAS REFERENTE A PRODUTOS */}
              <Route element={<RouteGuard permission={[PERMISSIONS.VIEW_MANAGE_PRODUCT]} />}>
                <Route element={<Layout />}>
                  <Route path="/gerenciar-produtos" element={<GerenciarProdutos />} />
                </Route>
              </Route>
              <Route element={<RouteGuard permission={[PERMISSIONS.VIEW_EDIT_PRODUCT]} />}>
                <Route element={<Layout />}>
                  <Route path="/alterar-dados-produtos" element={<AlterarDadosProduto />} />
                </Route>
              </Route>
              <Route element={<RouteGuard permission={[PERMISSIONS.VIEW_CREATE_PRODUCT]} />}>
                <Route element={<Layout />}>
                  <Route path="/registrar-produtos" element={<RegistrarProdutos />} />
                </Route>
              </Route>
              {/* FIM ROTAS REFERENTE A PRODUTOS */}
              {/* ============================== */}
              {/* ROTAS REFERENTE A RELATORIOS */}
              <Route element={<RouteGuard permission={[PERMISSIONS.VIEW_REPORT_PAGE]} />}>
                <Route element={<Layout />}>
                  <Route path="/gerar-relatorios" element={<GerarRelatorios />} />
                </Route>
              </Route>
              {/* FIM ROTAS REFERENTE A RELATORIOS */}
              {/* ================================ */}
              {/* ROTAS REFERENTE A CESTAS */}
              <Route element={<RouteGuard permission={[PERMISSIONS.VIEW_CREATE_BASIC_BASKET_FOOD]} />}>
                <Route element={<Layout />}>
                  <Route path="/register-basic-food-basket" element={ <RegisterBasicFoodBasket /> } />
                </Route>
              </Route>
              <Route element={<RouteGuard permission={[PERMISSIONS.VIEW_ALTER_BASIC_BASKET_FOOD]} />}>
                <Route element={<Layout />}>
                  <Route path="/change-basic-basket" element={ <ChangeBasicBasket /> } />
                </Route>
              </Route>
              <Route element={<RouteGuard permission={[PERMISSIONS.VIEW_MANAGE_BASIC_BASKET_FOOD]} />}>
                <Route element={<Layout />}>
                  <Route path="/cestas-basicas" element={ <BasicFoodBasket /> } />
                </Route>
              </Route>
              <Route element={<RouteGuard permission={[PERMISSIONS.VIEW_GENERATE_BASIC_BASKET_FOOD]} />}>
                <Route element={<Layout />}>
                  <Route path="/generate-basic-food-basket" element={ <GenerateBasicFoodBaskets /> } />
                </Route>
              </Route>
              <Route element={<RouteGuard permission={[PERMISSIONS.VIEW_INPUT_BASIC_BASKET_FOOD, PERMISSIONS.VIEW_OUTPUT_BASIC_BASKET_FOOD]} />}>
                <Route element={<Layout />}>
                  <Route path="/input-and-output-baskets" element={ <IOBaskets /> } />
                </Route>
              </Route>
              <Route element={<RouteGuard permission={[PERMISSIONS.VIEW_HISTORY_BASIC_BASKET_FOOD]} />}>
                <Route element={<Layout />}>
                  <Route path="/history-basic-food-basket" element={ <HistoryBasicFoodBasket /> } />
                </Route>
              </Route>
              <Route element={<RouteGuard permission={[PERMISSIONS.VIEW_DELIVERY_BASIC_BASKET_FOOD]} />}>
                <Route element={<Layout />}>
                  <Route path="/basket-delivery-order" element={ <BasketDeliveryOrder /> } />
                </Route>
              </Route>
              <Route element={<RouteGuard permission={[PERMISSIONS.VIEW_ALTER_DELIVERY_BASIC_BASKET_FOOD]} />}>
                <Route element={<Layout />}>
                  <Route path="/alter-basket-order" element={ <AlterBasketOrder /> } />
                </Route>
              </Route>
              {/* FIM ROTAS REFERENTE A CESTAS */}
              {/* ================================ */}
              {/* ROTAS REFERENTE A USUARIOS DO SISTEMA */}
              <Route element={<RouteGuard permission={[PERMISSIONS.VIEW_MANAGE_USER_PAGE]} />}>
                <Route element={<Layout />}>
                  <Route path="/manage-users" element={ <ManagementUserPage /> } />
                </Route>
              </Route>
              <Route element={<RouteGuard permission={[PERMISSIONS.ALTER_USER_FUNCTION]} />}>
                <Route element={<Layout />}>
                  <Route path="/alter-user-function" element={ <AlterFunctionPage /> } />
                </Route>
              </Route>
              
              {/* FIM ROTAS REFERENTE A USUARIOS DO SISTEMA */}
              {/* ================================ */}
              {/* ROTAS REFERENTE A CONFIGURAÇÕES */}
              <Route element={<RouteGuard permission={[PERMISSIONS.VIEW_CONFIGURATION_PAGE]} />}>
                <Route element={<Layout />}>
                  <Route path="/options" element={ <Options /> } />
                </Route>
              </Route>
              {/* FIM ROTAS REFERENTE A CONFIGURAÇÕES */}
              {/* ================================ */}
              {/* OUTRAS ROTAS */}
              <Route element={<RouteGuard permission={[PERMISSIONS.VIEW_HOME]} />}>
                <Route element={<Layout />}>
                  <Route path="/home" element={<Home />} />
                </Route>
              </Route>

              <Route element={<RouteGuard permission={[PERMISSIONS.VIEW_HOME]} />}>
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                </Route>
              </Route>

              
              {/* FIM OUTRAS ROTAS */}
              {/* ================================ */}
              {/* Paginas que TODOS tem acesso */}
              
              <Route element={<Layout />}>
                <Route path="/documentacao" element={ <Documentacao /> } /> {/* Documentacao */}
                <Route path="/suporte" element={<Suporte />} />
                <Route path="/logout" element={<Logout/>} />              
              </Route>

              {/* Paginas que não precissam de acesso e não seguem o Layout*/}
              <Route path="/login" element={<Login />} />
              <Route path="nao-autorizado" element={<NoAuthorized />} />
              <Route path="*" element={<NoPage />} />
            </Routes>
          </Router>

        </AuthProvider>
        </ThemeProvider>

        
      </div>
    
  );
}

export default App;