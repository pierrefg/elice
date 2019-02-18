import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';

class reactTableUtil{
    constructor(pdata){
        this.data = pdata
    }

    columnParser(cols, groups){
        let result = []
        for(var el in cols){
            let temp = cols[el]
            if(temp.state !== "ignore"){
                if(temp.state === "vow"){
                    result.push({
                        dataField: el,
                        text: "Voeu" + temp.vowNum,
                        sort: true
                    })
                }else{
                    result.push({
                        dataField: el,
                        text: el,
                        sort: true
                    })
                }
            }else{
                result.push({
                    dataField: el,
                    text: el,
                    hidden: true
                })
            }
        }
        var optionsAffec = []
        for(var i in groups){
            optionsAffec.push({
                value:i,
                label:i
            })
        }
        result.push({
            dataField: 'affecMode',
            text: "Mode d'affectation",
            editor: {
                    type: Type.SELECT,
                    options: optionsAffec
                    }
            })
        return result
    }

}

export default reactTableUtil;