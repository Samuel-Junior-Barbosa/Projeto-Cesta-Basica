import TabelaListaDeProdutos from "/src/Components/TabelaListaDeProdutos";

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
        <TabelaListaDeProdutos nameClass={styles.tabelaLogBaskets} listaDeItens={listaDeLogs}/>
    );
}

export default LogsBasicFoodBaskets;