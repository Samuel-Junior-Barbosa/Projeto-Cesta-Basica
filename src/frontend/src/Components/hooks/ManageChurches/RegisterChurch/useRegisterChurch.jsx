import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import registerChurchApi from "../../../../Functions/Church/RegisterChurch";

export function useRegisterChurch() {
    const [RegisterChurchLoading, setLoading] = useState(false);
    const [RegisterChurchMessage, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleRegisterChurch = async (churchName, representative, numberOfMembers, city, neighborhood, street, building_number, cep, uf, registrationStatus) => {
        setLoading(true);
        setMessage(null);

        try {
            const response = await registerChurchApi(churchName, representative, numberOfMembers, city, neighborhood, street, building_number, cep, uf, registrationStatus);
            console.log(" REPONSe: ", response)
            let message = ''
            if (response.status === 0) {
                message = 'Cadastrado com sucesso';

            }
            else if( response.status === 2067 ) {
                message = "Essa congregação já está cadastrada"

            }

            else {
                message = response.content
            }
            
            if( message === '' ) {
                message = "erro não identificado: " + String(response.content)
            }

            setMessage( message )

            const timer = setTimeout(() => {
                    setMessage('')
                }, 2000);
            setLoading(false);
            return () => clearTimeout(timer);

            
        } catch (err) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        } 
    }

    return { handleRegisterChurch, RegisterChurchLoading, RegisterChurchMessage };
}