import postFunction from "../../PostFunction";

const getChurchWithdrawBasketApi = async (initialDate, endDate) => {
    const url = "http://localhost:8080/record-church-withdraw-basket"

    const params = {
        initialDate,
        endDate
    }
    const response =  await postFunction(url, params)
    
    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default getChurchWithdrawBasketApi;