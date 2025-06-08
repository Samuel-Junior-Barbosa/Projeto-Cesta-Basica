import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerFamily } from './register';


// Um hook para chamar e tratar a função de registro de familia
export function useRegisterFamily() {
    const [RegisterFamilyLoading, setLoading] = useState(false);
    const [registerFamilyMessage, setMessage] = useState(null);
    
    const handleRegisterFamily = async (representative, members, city, neighborhood, street, builderNumber, telephone, situation, congregation) => {
        setLoading(true);
        setMessage(null);

        try {
            const response = await registerFamily(representative, members, city, neighborhood, street, builderNumber, telephone, situation, congregation);
            if(response === true) {
                setMessage('Familia cadastrada com sucesso!');
                setTimeout(() => {
                    setMessage('')
                }, 1500)
            }
            else {
                setMessage(response.message)
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