import { useState } from 'react';
import { AlterRegistrationChurch } from ".";
import alterChurchData from '../../../../Functions/Church/AlterRegisterChurch';

export function useAlterChurch() {
    const [AlterChurchLoading, setLoading] = useState(false);
    const [AlterChurchMessage, setMessage] = useState(null);
    
    const handleAlterRegistrationChurch = async ( idChurch, churchName, representative, members,  city, neighborhood,  street, buildingNumber,  cep, uf,  registerStatus ) => {
        setLoading(true);
        setMessage(null);

        try {
            const response = await alterChurchData( idChurch,
            churchName,
            representative,
            members,
            city,
            neighborhood,
            street,
            buildingNumber,
            cep,
            uf,
            registerStatus );
            if (response.status === 0) {
                setMessage('Alterado com sucesso')
                
            }
            else {
                setMessage(response.content)
            }
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

    return { handleAlterRegistrationChurch, AlterChurchLoading, AlterChurchMessage };
}