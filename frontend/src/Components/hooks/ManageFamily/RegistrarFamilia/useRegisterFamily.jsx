import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerFamily } from './register';
import registrationFamilyFunction from "../../../../Functions/Family/RegistrationFamily";


// Um hook para chamar e tratar a função de registro de familia
export function useRegisterFamily() {
    const [RegisterFamilyLoading, setLoading] = useState(false);
    const [registerFamilyMessage, setMessage] = useState(null);
    
    //const handleRegisterFamily = async (representative, members, city, neighborhood, street, builderNumber, telephone, situation, congregation) => {
    const handleRegisterFamily = async ( data ) => {
        setLoading(true);
        setMessage(null);

        try {
            //const response = await registerFamily(representative, members, city, neighborhood, street, builderNumber, telephone, situation, congregation);
            const response = await registrationFamilyFunction( data )
            console.log(" resposta de registro: ", response)
            if(response.status === 0) {
                setMessage('Familia cadastrada com sucesso!');
                setTimeout(() => {
                    setMessage('')
                }, 1500)
            }
            else {
                setMessage(response.content)
            }
        } catch (err) {
            setMessage(err.message);
        }
        finally {
            setLoading(false);
        }
    };

    return { handleRegisterFamily, RegisterFamilyLoading, registerFamilyMessage };
}

export default useRegisterFamily;