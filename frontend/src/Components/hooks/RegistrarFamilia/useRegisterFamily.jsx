import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerFamily } from './register';


// Um hook para chamar e tratar a função de registro de familia
export function useRegisterFamily() {
    const [loading, setLoading] = useState(false);
    const [warning, setWarning] = useState(null);
    const navigate = useNavigate();

    const handleRegisterFamily = async (representative, members, address, telephone, situation) => {
        setLoading(true);
        setWarning(null);
        try {
            const response = await registerFamily(representative, members, situation, address, telephone);
            if(response === true) {
                setWarning('Familia cadastrada com sucesso!');
            }
            else {
                setWarning(response.message)
            }
        } catch (err) {
            setWarning(err.message);
        }
        finally {
            setLoading(false);
        }
    };

    return { handleRegisterFamily, loading, warning };
}

export default useRegisterFamily;