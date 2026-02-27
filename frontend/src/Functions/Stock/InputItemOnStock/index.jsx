import postFunction from "../../PostFunction";



const InputItemOnStock = async (idBasket=null, idFamily=null, idChurch=null, basketQuantity=null, typeOfInput=1, donationFromOutside=false, listProduct) => {

    const url = "http://localhost:8080/input-item-on-stock"

    const param = {
        idBasket,
        idFamily,
        idChurch,
        basketQuantity,
        typeOfInput,
        donationFromOutside,
        listProduct
    }

    const response = await postFunction(url, param)

    //console.log("RETURN ITEM SEARCHED: ", response)
    return {
        "status" : response.status,
        "content" : response.content
    }
}

export default InputItemOnStock;