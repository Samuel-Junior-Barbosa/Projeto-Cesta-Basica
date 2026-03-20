import postFunction from "../../PostFunction";

const OutputBasketFunction = async ( idBasket, idFamily, idChurch, itemList, basketQuantity, observation, outDonation ) => {
    const url = "http://localhost:8080/output-basket"

    const params = {
        idBasket,
        itemList,
        idFamily,
        idChurch,
        basketQuantity,
        observation,
        outDonation
    }

    const response =  await postFunction(url, params)
    //console.log("RETURN OF GET BAsCKET DATA: ", response)
    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default OutputBasketFunction;