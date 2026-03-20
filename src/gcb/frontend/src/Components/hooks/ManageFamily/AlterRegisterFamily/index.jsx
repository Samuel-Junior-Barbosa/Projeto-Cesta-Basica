import alterFamilyhData from "../../../../Functions/Family/AlterFamilyData"

export async function AlterRegistrationFamily( data ) {
    // chama uma função do backend para alterar os dados do produto no Banco de dados.

    console.log(" ALTERING: ", data)
    
    //const response = await alterFamilyhData( idChurch, churchName, representative, members, city, neighborhood, street, buildingNumber)
    const response = await alterFamilyhData( data )
    if( response.status === 0 ) {
        return {
            "status" : response.status,
            "content" : response.content
        }
    }

    
    return new Error("Dados invalidos.")
    
}
