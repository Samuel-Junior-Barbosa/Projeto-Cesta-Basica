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

// ------------------------------------- Outros ---------------------------------------------------------
import { AuthProvider,  } from './contexts/AuthenticateContext/AuthContext';
import RouteGuard from './contexts/GuardRoutes/RouteGuard';
import {ProductsDB } from './contexts/ListOfProductsonStock';
import { ThemeProvider } from './contexts/CurrentTheme';
import ColorSelectorComp from './Components/ColorSelector';

// ------------------------------------------------------------------------------------------------------


const App = () => {

  return (
      <div id="app">

        <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>

              {/* Paginas que só o ADMIN tem acesso */}
              <Route element={<RouteGuard AllowedRoles={['admin']}/>}>
                <Route element={<Layout />}>
                  <Route path="/gerenciar-produtos" element={<GerenciarProdutos />} />
                  <Route path="/register-family" element={<RegistrarFamilia />} />
                  <Route path="/cadastros-de-familias" element={<CadastroDeFamilias />} />
                  <Route path="/alterar-cadastro-familia" element={<AlterarCadastroDeFamilia />} />
                  
                  <Route path="/alterar-dados-produtos" element={<AlterarDadosProduto />} />
                  <Route path="/register-church" element={<RegisterChurch />} />
                  <Route path="/manage-churches" element={<ChurchRecords />} />
                  <Route path="/gerar-relatorios" element={<GerarRelatorios />} />
                  <Route path="/metas" element={<MetaPage />} />
                  <Route path="/change-church-registration" element={ <ChangeChurchRegistration /> } />
                  <Route path="/priority-registration" element={ <PriorityRegistration /> } />
                  <Route path="/adding-priority-register" element={ <AddingPriorityRegister /> } />
                  <Route path="/alter-priority-register" element={ <AlterPrirotityRegister /> } />    
                </Route>
              </Route>

              {/* Paginas que somente o ADMIN e o OPERADOR tem acesso */}
              <Route element={<RouteGuard AllowedRoles={['admin', 'operator']}/>}>
                <Route element={<Layout />}>
                  <Route path="/register-basic-food-basket" element={ <RegisterBasicFoodBasket /> } />
                  <Route path="/change-basic-basket" element={ <ChangeBasicBasket /> } />
                  <Route path="/generate-basic-food-basket" element={ <GenerateBasicFoodBaskets /> } />
                  <Route path="/cestas-basicas" element={ <BasicFoodBasket /> } />
                  <Route path="/registrar-produtos" element={<RegistrarProdutos />} />
                  <Route path="/input-and-output-baskets" element={ <IOBaskets /> } />
                  <Route path="/history-basic-food-basket" element={ <HistoryBasicFoodBasket /> } />
                  <Route path="/basket-delivery-order" element={ <BasketDeliveryOrder /> } />
                  <Route path="/alter-basket-order" element={ <AlterBasketOrder /> } />
                </Route>
              </Route>

              {/* Paginas que TODOS tem acesso */}
              <Route element={<RouteGuard AllowedRoles={['admin', 'operator', 'visit']}/>}>
                <Route element={<Layout />}>
                  <Route path="/documentacao" element={ <Documentacao /> } /> {/* Documentacao */}
                  <Route path="/options" element={ <Options /> } />
                  <Route path="/suporte" element={<Suporte />} />
                  <Route path="/logout" element={<Logout/>} />              
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} />

                </Route>
              </Route>

              {/* Paginas que não precissam de acesso */}
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