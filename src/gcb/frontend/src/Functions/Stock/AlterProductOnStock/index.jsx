import postFunction from "../../PostFunction";



const AlterProductOnStock = async (idProduct, productName, marchName, quantity, registerStatus) => {

    const url = "http://localhost:8080/alter-product-on-stock"

    const param = {
        idProduct,
        productName,
        marchName,
        quantity,
        registerStatus
    }

    const response = await postFunction(url, param)

    //console.log("RETURN ITEM SEARCHED: ", response)
    return {
        "status" : response.status,
        "content" : response.content
    }
}

export default AlterProductOnStock;