import React, { createContext, useState, useContext } from "react";
import { useEffect } from "react";

// Cria o contexto
const AuthContext = createContext();

// Hook para facilitar o uso do contexto
export const useAuth = () => {
  return useContext(AuthContext)
};

// Provedor do contexto
export const AuthProvider = ({ children }) => {

  const [token, setToken] = useState(() => {
    let tokenValue = localStorage.getItem("token")

    if( !tokenValue || tokenValue == 'undefined') {
      return JSON.parse('null')
    }

    else if( typeof(tokenValue) == 'string' ) {
      return tokenValue
    }

    return JSON.parse(tokenValue)

  });

  const [userRole, setUserRole ] = useState(() => {
    let roleValue = localStorage.getItem("role")
    if( !roleValue || roleValue == 'undefined'  ) {
      return JSON.parse('null')
    }

    else if( typeof(roleValue) == 'string' ) {
      return roleValue
    }

    JSON.parse( roleValue )

    }
  );
  

  const [userPermission, setUserPermission ] = useState(() => {
    let permissionList = localStorage.getItem("userPermission")
    if( !permissionList || permissionList == 'undefined'  ) {
      return JSON.parse('null')
    }

    
    else if( typeof(permissionList) == 'string' ) {
      if( permissionList.includes('[') || permissionList.includes(']')) {
        permissionList = JSON.parse( permissionList )
        return permissionList
      }

      let userPerm =  permissionList.split(',')
      //console.log(" PERMISSION LIST: ", userPerm)
      userPerm = userPerm.map((item, index) => {
          return Number(item)
      })

      return userPerm
    }

    

    }
  );
  

  const [user, setUser] = useState(() => {
    let userValue = localStorage.getItem("user") 
    if( !userValue || userValue == 'undefined'  ) {
      return JSON.parse('null')
    }

    else if( typeof( userValue ) == 'string' ) {
      return userValue
    }

    return JSON.parse( userValue )

    });

  //console.log(" auth provider: ", localStorage, localStorage.getItem('role'))
  const isAuthenticated = !!token;
  //console.log(" isAuthenticated: ", isAuthenticated, token)

  // Função para login
  const login = (tokenFromApi, userFromApi, roleFromApi, permissionFromApi) => {
    //console.log(" LOGIN: ", tokenFromApi, userFromApi, roleFromApi, permissionFromApi)
    if( typeof( userFromApi) != 'string' ) {
      userFromApi = JSON.stringify(userFromApi)
    }
    if( typeof(roleFromApi ) != 'string' ) {
      roleFromApi = JSON.stringify(roleFromApi)
    }

    if( Array.isArray(permissionFromApi) ) {
      //console.log(" TYPE OF PERMISSION LIST: ", typeof(permissionFromApi))
      permissionFromApi = JSON.stringify( permissionFromApi )
    }

    localStorage.setItem("token", tokenFromApi);
    localStorage.setItem("user", userFromApi);
    localStorage.setItem("role", roleFromApi);
    localStorage.setItem("userPermission", permissionFromApi);

    setToken(tokenFromApi);
    setUser(userFromApi);
    setUserRole(roleFromApi)
    setUserPermission(permissionFromApi)

    
  };

  // Função para logout
  const logout = () => {
    setToken(null);
    setUser(null);
    setUserRole(null)
    setUserPermission(null)

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("userPermission");
  };

  
  return (
    <AuthContext.Provider value={{ token, user, userRole, userPermission, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
  
};

