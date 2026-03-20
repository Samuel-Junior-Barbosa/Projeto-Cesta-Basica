import postFunction from "../../PostFunction";



const inventoryAdjustment = async (idProduct, typeOfAdjustment, newQuantity, observation='') => {

    const url = "http://localhost:8080/inventoty-adjustment"

    const param = {
        idProduct,
        typeOfAdjustment,
        newQuantity,
        observation
    }

    const response = await postFunction(url, param)

    //console.log("RETURN ITEM SEARCHED: ", response)
    return {
        "status" : response.status,
        "content" : response.content
    }
}

export default inventoryAdjustment;