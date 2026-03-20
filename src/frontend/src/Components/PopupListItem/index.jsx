const PopupListItem = (headerList, bodyValueList) => {
    if( !headerList ) {
        return null;
    }


    return (
        <div className={StyleSheet.popupListDiv}>
            <table>
                <thead>
                    <tr>
                        {headerList.map((index, value) => (
                            <td> {value} </td>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    { bodyValueList.map((index, value) => (
                        <tr key={index}>
                            { value.map((index2, value2) => (
                                <td key={index2}> {value2} </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}


export default PopupListItem;