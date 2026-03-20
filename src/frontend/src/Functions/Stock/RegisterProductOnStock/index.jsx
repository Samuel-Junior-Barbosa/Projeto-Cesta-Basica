import postFunction from "../../PostFunction";

const RegisterProductOnStock = async (idProduct, productName, marchName, quantity, productWeight) => {

    const url = "http://localhost:8080/register-product-on-stock"

    const param = {
        idProduct,
        productName,
        marchName,
        quantity,
        productWeight
    }

    const response = await postFunction(url, param)

    //console.log("RETURN ITEM SEARCHED: ", response)
    return {
        "status" : response.status,
        "content" : response.content
    }
}

export default RegisterProductOnStock;