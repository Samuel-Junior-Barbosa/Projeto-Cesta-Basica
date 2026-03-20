import postFunction from "../../PostFunction";

const deleteProductFromStock = async (idProduct) => {
    const url = "http://localhost:8080/delete-product-from-stock"
    const params = {
        idProduct,
    }
    const response = await postFunction(url, params)
    //console.log("RETURN ITEM DELTEDE: ", response)
    return {
        "status" : response.status,
        "content" : response.content
    }
}

export default deleteProductFromStock;