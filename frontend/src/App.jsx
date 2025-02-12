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
//import Documentacao from '../src/public/Docspage';
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
// ------------------------------------------------------------------------------------------------------

// ------------------------------------- Outros ---------------------------------------------------------
import { AuthProvider,  } from './contexts/AuthenticateContext/AuthContext';
import RouteGuard from './contexts/GuardRoutes/RouteGuard';
import {ProductsDB } from './contexts/ListOfProductsonStock';
// ------------------------------------------------------------------------------------------------------


const App = () => {

  return (
      <div id="app">
        
        <AuthProvider>
        <ProductsDB>
          <Router>
            
            <Routes>
            <Route path="/login" element={<Login />} />
              <Route element={<RouteGuard />}>
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/gerenciar-produtos" element={<GerenciarProdutos />} />
                  <Route path="/register-family" element={<RegistrarFamilia />} />
                  <Route path="/cadastros-de-familias" element={<CadastroDeFamilias />} />
                  <Route path="/registrar-produtos" element={<RegistrarProdutos />} />
                  <Route path="/alterar-dados-produtos" element={<AlterarDadosProduto />} />
                  <Route path="/register-church" element={<RegisterChurch />} />
                  <Route path="/manage-churches" element={<ChurchRecords />} />
                  <Route path="/gerar-relatorios" element={<GerarRelatorios />} />
                  <Route path="/suporte" element={<Suporte />} />
                  <Route path="/metas" element={<MetaPage />} />
                  <Route path="/documentacao" element={ <MetaPage /> } /> {/* Documentacao */}
                  <Route path="/cestas-basicas" element={ <BasicFoodBasket /> } />
                  <Route path="/register-basic-food-basket" element={ <RegisterBasicFoodBasket /> } />
                  
                  <Route path="/change-basic-basket" element={ <ChangeBasicBasket /> } />
                  <Route path="/input-and-output-baskets" element={ <IOBaskets /> } />
                  <Route path="/generate-basic-food-basket" element={ <GenerateBasicFoodBaskets /> } />
                  <Route path="/options" element={ <Options /> } />
                  <Route path="/change-church-registration" element={ <ChangeChurchRegistration /> } />
                  <Route path="/history-basic-food-basket" element={ <HistoryBasicFoodBasket /> } />
                  
                </Route>

                <Route path="/logout" element={<Logout/>} />              
                <Route path="*" element={<NoPage />} />
              </Route>
            </Routes>
          </Router>
        </ProductsDB>
        </AuthProvider>
        
      </div>
    
  );
}

export default App;