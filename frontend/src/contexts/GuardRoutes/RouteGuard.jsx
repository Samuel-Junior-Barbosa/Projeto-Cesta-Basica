import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../AuthenticateContext/AuthContext";


const RouteGuard = ({AllowedRoles, permission = []}) => {
  const { user, role, userPermission } = useAuth();
  
  useEffect(() => {
    //console.log(" ROUTEGUARD: ", user, isAuthenticated)

  }, [])


  if( !user ) {
    return <Navigate to="/login" />;
  }
  //console.log(" ROUTE GUARD PERMISSION: ", permission, permission.length)
  if( permission.length > 0 ) {
    let userPerm = userPermission
    if( typeof(userPermission) === 'string') {
      userPerm = JSON.parse(userPermission) || [];
    }
    if( !userPermission ) {
      return <Navigate to="/nao-autorizado" />;
    }
    //console.log(" USER PERM: ", userPerm)
    const hasPermission = permission.every( p => userPerm.includes(p) )

    //console.log(" hasPermission: ", hasPermission)
    if( !hasPermission ) {
      return <Navigate to="/nao-autorizado" />;
    }
  }
  
  return <Outlet />;
  
};

export default RouteGuard;
