import React, { useState } from 'react';

import { SearchOnDB } from ".";

export function useSearchOnDB() {
    const [SearchOnDBLoading, setLoading] = useState(false);
    const [SearchOnDBMessage, setMessage] = useState(null);
    
    const handleSearchOnDB = async (nameProduct) => {
        setLoading(true);
        setMessage(null);
        try {
            const response = await SearchOnDB(nameProduct = nameProduct);
            if (response === true) {
                setMessage('Produto encontrado com sucesso')
                const timer = setTimeout(() => {
                    setMessage('')
                }, 2000);
                setLoading(false);
                return () => clearTimeout(timer);
            }
            else {
                setMessage(response.message)
            }
            
            
        } catch (err) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        } 
    }
    return { handleSearchOnDB, SearchOnDBLoading, SearchOnDBMessage };
}