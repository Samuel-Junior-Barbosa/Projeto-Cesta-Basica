import alterChurchData from "../../../../Functions/Church/AlterRegisterChurch"

export async function AlterRegistrationChurch( data ) {
    // chama uma função do backend para alterar os dados do produto no Banco de dados.
    //console.log("ALTER: ", data)
    let idChurch = data.idChurch
    let churchName = data.churchName
    let representative = data.representative
    let members = data.members
    let city = data.city
    let neighborhood = data.neighborhood
    let street = data.street
    let buildingNumber = data.buildingNumber

    const response = await alterChurchData( idChurch, churchName, representative, members, city, neighborhood, street, buildingNumber)
    if( response.status === 0 ) {
        return {
            "status" : response.status,
            "content" : response.content
        }
    }

    
    return new Error("Dados invalidos.")
    
}
