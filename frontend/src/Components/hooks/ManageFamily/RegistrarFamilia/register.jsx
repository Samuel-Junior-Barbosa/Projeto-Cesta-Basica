import registrationFamilyFunction from "../../../../Functions/Family/RegistrationFamily";

// Função para simular uma validação de um banco de dados
const comparateInformation = (information) => {
    /*
    const bancoDeDadosFamilias = {
        'familia1': {
            representante: 'Mario',
            membros: 5,
            situacao: 'prioridade',
            endereco: 'Rua oliveira, 39',
            telefone: '(12) 1234-5678'
        },
        'familia2': {
            representante: 'João',
            membros: 7,
            situacao: 'prioridade',
            endereco: 'Rua são paulo, 09',
            telefone: '(12) 1234-0000'
        }
    }
    */

    for (let name in bancoDeDadosFamilias) {
        for (let info in bancoDeDadosFamilias[name]) {
            if (information === bancoDeDadosFamilias[name][info]) {
                return true;
            }
        }
    }
    return false;
}

// Função para simular um registro de familia
//export async function registerFamily(representative, members, city, neighborhood, street, builderNumber, telephone, situation, congregation) {
export async function registerFamily( registrationData ) {
    /*
    if ((comparateInformation(representative) == true) && (comparateInformation(members) == true )) {
        return new Error("Dados duplicados");
    }
    else {
        return true;
    }
    */

    const response = await registrationFamilyFunction( registrationData )
    return response
}

export default registerFamily;