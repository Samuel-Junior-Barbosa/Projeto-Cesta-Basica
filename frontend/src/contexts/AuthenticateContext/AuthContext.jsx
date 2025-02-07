import React, { createContext, useState, useContext } from "react";

// Cria o contexto
const AuthContext = createContext();

// Hook para facilitar o uso do contexto
export const useAuth = () => {
  return useContext(AuthContext)
};

// Provedor do contexto
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  }); // Simula o estado de login

  // Função para login (exemplo básico)
  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
  };

  // Função para logout
  const logout = () => {
    setIsAuthenticated(false)
    localStorage.setItem("isAuthenticated", "false");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
