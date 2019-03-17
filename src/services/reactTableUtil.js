import { Type } from 'react-bootstrap-table2-editor';

class reactTableUtil{
    static columnParser(cols, groups){
        let result = []
        for(var colName in cols){
            let col = cols[colName]
            if(col.state !== "ignore"){
                if(col.state === "vow"){
                    result.push({
                        dataField: colName,
                        text: "Vœu " + col.vowNum,
                        sort: true
                    });
                }else{
                    result.push({
                        dataField: colName,
                        text: colName,
                        sort: true
                    });
                }
            }else{
                /*result.push({
                    dataField: colName,
                    text: colName,
                    hidden: true
                })*/
            }
        }

        var optionsAffec = [{value:"auto", label:"auto"}]
        for(var groupName in groups){
            optionsAffec.push({
                value: groupName,
                label: groupName
            });
        }
        result.push({
            dataField: 'affecMode',
            text: "Mode d'affectation",
            editor: {
                    type: Type.SELECT,
                    options: optionsAffec
                    }
            });
        return result
    }

}

export default reactTableUtil;
