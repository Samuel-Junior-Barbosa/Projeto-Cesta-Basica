import TabelaListaDeProdutos from "../../Components/TabelaListaDeProdutos";

const LogsBasicFoodBaskets = () => {
    const listaDeLogs = [
        {
            "data": "01/01/2025",
            "tipo de ação": "Retirada",
            "quantidade": 4,
            "Destino": "Estufa II",
        }
    ]
    return (
        <TabelaListaDeProdutos listaDeItens={listaDeLogs}/>
    );
}

export default LogsBasicFoodBaskets;