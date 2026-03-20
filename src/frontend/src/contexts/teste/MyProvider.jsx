import React, { useState, createContext, useContext } from 'react';

export const MyNewContext = createContext();

export const NewProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useContext(true);

    return (
        <MyNewContext.Provider value={{authenticated, setAuthenticated}}>
            {children}
        </MyNewContext.Provider>
    );
}

export const useMyContext = () => {
    return useContext(MyNewContext);
}