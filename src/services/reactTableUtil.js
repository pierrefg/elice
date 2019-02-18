class reactTableUtil{
    constructor(pdata){
        this.data = pdata
    }

    columnParser(cols){
        let result = []
        let vows = {
            Header:"Voeux",
            columns:[]
        }
        for(var el in cols){
            let temp = cols[el]
            if(temp.state !== "ignore"){
                if(temp.state==="vow"){
                    vows.columns.push({
                        Header: el,
                        accessor: el
                    })
                }else if(temp.state==="default"){
                    result.push({
                        Header: el,
                        accessor: el
                    })
                }
            }
        }
        result.push(vows)
        console.log("RESULT")
        console.log(result)
        return result
    }
}

export default reactTableUtil;