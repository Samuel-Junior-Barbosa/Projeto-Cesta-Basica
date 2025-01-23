import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';

import Home from './pages/Home';
import GerenciarProdutos from './pages/GerenciarProdutos';
import RegistrarFamilia from './pages/RegistrarFamilia';
import CadastroDeFamilias from './pages/CadastrosDeFamilias';
import RegistrarProdutos from './pages/RegistrarProdutos';
import AlterarDadosProduto from './pages/AlterarDadosProduto';
import RegisterChurch from './pages/RegisterChurch';
import ChurchRecords from './pages/ChurchRecords';
import GerarRelatorios from './pages/GerarRelatorios';
import Suporte from './pages/Suporte';
import Logout from './pages/Logout';
import NoPage from "./pages/NoPage";
import Login from './pages/Login';
import Documentacao from './pages/Docspage';
import MetaPage from './pages/MetaPage';
import BasicFoodBasket from './pages/RegisterBasicBasket';
import ChangeBasicBasket from './pages/ListOfBasicBasketItems';
import Layout from './pages/Layout';
import IOBasckets from './pages/IOBaskets';
import GenerateBasicFoodBaskets from './pages/GenerateBasicFoodBaskets';
import Options from './pages/Options';
import ChangeChurchRegistration from './pages/ChangeChurchRegistration';

import { AuthProvider,  } from './AuthContext';
import RouteGuard from './RouteGuard';



const App = () => {

  return (
      <div id="app">
        <AuthProvider>
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
                <Route path="/documentacao" element={ <Documentacao /> } />
                <Route path="/cestas-basicas" element={ <BasicFoodBasket /> } />
                <Route path="/change-basic-basket" element={ <ChangeBasicBasket /> } />
                <Route path="/iobasckets" element={ <IOBasckets /> } />
                <Route path="/generate-basic-food-basket" element={ <GenerateBasicFoodBaskets /> } />
                <Route path="/options" element={ <Options /> } />
                <Route path="/change-church-registration" element={ <ChangeChurchRegistration /> } />
                
              </Route>

              <Route path="/logout" element={<Logout/>} />              
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </Router>
        </AuthProvider>
      </div>
    
  );
}

export default App;