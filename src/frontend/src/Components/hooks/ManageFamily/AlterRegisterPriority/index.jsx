import alterPriorityData from "../../../../Functions/Family/AlterPriorityData"

export async function AlterRegistrationPriority( data ) {
    // chama uma função do backend para alterar os dados do produto no Banco de dados.

    const response = await alterPriorityData( data )
    if( response.status === 0 ) {
        return {
            "status" : response.status,
            "content" : response.content
        }
    }

    
    return new Error("Dados invalidos.")
    
}
