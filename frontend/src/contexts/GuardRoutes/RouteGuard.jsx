import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../AuthenticateContext/AuthContext";

const RouteGuard = () => {
  const { isAuthenticated } = useAuth();

  // Verifica autenticação antes de renderizar a rota
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default RouteGuard;
