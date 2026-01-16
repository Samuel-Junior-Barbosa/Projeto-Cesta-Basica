import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../AuthenticateContext/AuthContext";
import { getCurrentUser } from "../../Components/hooks/Authenticator/auth";


const RouteGuard = ({AllowedRoles}) => {
  const { isAuthenticated } = useAuth();
  const [ user, setUser ] = useState(null);

  
  const userLogged = getCurrentUser();

  
  if( !isAuthenticated ) {
    return <Navigate to="/login" />;
  }

  else if( AllowedRoles ) {
    if( !AllowedRoles.includes(userLogged.role) ) {
      return <Navigate to="/nao-autorizado" />;
    }
  }
  
  return <Outlet />;
  
  
  // Verifica autenticação antes de renderizar a rota
  //return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default RouteGuard;
