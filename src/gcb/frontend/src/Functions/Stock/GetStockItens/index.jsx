import getFunction from "../../GetFunction";
import postFunction from "../../PostFunction";

const get_stock_itens = async () => {
    const urlStock = "http://localhost:8080/get-stock"
    const response =  await getFunction(urlStock)
    return response
}


export default get_stock_itens;