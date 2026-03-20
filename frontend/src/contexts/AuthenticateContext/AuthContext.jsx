import React, { createContext, useState, useContext } from "react";
import { useEffect } from "react";


// REMOVE
import RemoveAuthenticatedUserToken from "../../Functions/Authentication/RemoveAuthenticatedUserToken";
import RemoveAuthenticatedUserName from "../../Functions/Authentication/RemoveAuthenticatedUserName";
import RemoveAuthenticatedUserFunction from "../../Functions/Authentication/RemoveAuthenticatedUserFunction";
import RemoveAuthenticateduserPermission from "../../Functions/Authentication/RemoveAuthenticatedUserPermission";

// SET
import SetAuthenticatedUserToken from "../../Functions/Authentication/SetAuthenticatedUserToken";
import SetAuthenticatedUserName from "../../Functions/Authentication/SetAuthenticatedUserName";
import SetAuthenticatedUserFunction from "../../Functions/Authentication/SetAuthenticatedUserFunction";
import SetAuthenticatedUserPermission from "../../Functions/Authentication/SetAuthenticatedUserPermission";

// GET
import GetAuthenticatedUserName from "../../Functions/Authentication/GetAuthenticatedUserName";
import GetAuthenticatedUserPermission from "../../Functions/Authentication/GetAuthenticatedUserPermission";
import GetAuthenticatedUserToken from "../../Functions/Authentication/GetAuthenticatedUserToken";
import GetAuthenticatedUserFunction from "../../Functions/Authentication/GetAuthenticatedUserFunction";

// Cria o contexto
const AuthContext = createContext();

// Hook para facilitar o uso do contexto
export const useAuth = () => {
  return useContext(AuthContext)
};

// Provedor do contexto
export const AuthProvider = ({ children }) => {

  const [token, setToken] = useState(() => {
    //let tokenValue = localStorage.getItem("token")
    let tokenValue = GetAuthenticatedUserToken()

    if( !tokenValue || tokenValue == 'undefined') {
      return JSON.parse('null')
    }

    else if( typeof(tokenValue) == 'string' ) {
      return tokenValue
    }

    return JSON.parse(tokenValue)

  });

  const [userRole, setUserRole ] = useState(() => {
    //let roleValue = localStorage.getItem("role")
    let roleValue = GetAuthenticatedUserFunction()
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
    //let permissionList = localStorage.getItem("userPermission")
    let permissionList = GetAuthenticatedUserPermission()
    //console.log(" USER PERMISSION LIS1: ", permissionList)
    if( !permissionList || permissionList == 'undefined'  ) {
      return JSON.parse('null')
    }

    
    else if( typeof(permissionList) == 'string' ) {
      if( permissionList.includes('[') || permissionList.includes(']')) {
        permissionList = JSON.parse( permissionList )
        //console.log(" USER PERMISSION LIST2: ", permissionList)
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
    //let userValue = localStorage.getItem("user")
    let userValue = GetAuthenticatedUserName()
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
    /*
    localStorage.setItem("token", tokenFromApi);
    localStorage.setItem("user", userFromApi);
    localStorage.setItem("role", roleFromApi);
    localStorage.setItem("userPermission", permissionFromApi);
    */
    SetAuthenticatedUserToken( tokenFromApi )
    SetAuthenticatedUserName( userFromApi )
    SetAuthenticatedUserFunction( roleFromApi )
    SetAuthenticatedUserPermission( permissionFromApi )

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
    /*
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("userPermission");
    */
    RemoveAuthenticatedUserToken()
    RemoveAuthenticatedUserName()
    RemoveAuthenticatedUserFunction()
    RemoveAuthenticateduserPermission()

  };


  const updatePermissions = ( newPermissions ) => {
    if( typeof( newPermissions) != 'string' ) {
      //if( newPermissions.includes('[') || newPermissions.includes(']')  ) {
          //newPermissions = JSON.parse( newPermissions )
      //}
      newPermissions = JSON.stringify( newPermissions )
    }

    
    setUserPermission( newPermissions )
    SetAuthenticatedUserPermission( newPermissions )

  }
  
  return (
    <AuthContext.Provider value={{ token, user, userRole, userPermission, isAuthenticated, login, logout, updatePermissions }}>
      {children}
    </AuthContext.Provider>
  );
  
};

