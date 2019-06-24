import {Type} from 'react-bootstrap-table2-editor';

class reactTableUtil{
    static columnParser(cols, courses) {
        let result = [];
        for(let colName in cols){
            let col = cols[colName];
            if(col.state !== "discard"){
                if(col.state === "wish"){
                    result.push({
                        dataField: colName,
                        text: "Vœu " + col.wishNum,
                        sort: true
                    });
                }else{
                    result.push({
                        dataField: colName,
                        text: colName,
                        sort: true
                    });
                }
            }
        }

        //Adding the affectation mode dropdown field
        let optionsAffec = [{value: "Automatique", label: "Automatique"}];
        for (let courseName of courses.keys()) {
            optionsAffec.push({
                value: courseName,
                label: courseName
            });
        }
        result.push({
            dataField: 'affectationMode',
            text: "Mode d'affectation",
            editor: {
                        type: Type.SELECT,
                        options: optionsAffec
                    }
        });

        //Adding the result column
        result.push({
            dataField: "result",
            text: "Résultat d'affectation",
            sort: true
        });
        return result
    }

}

export default reactTableUtil;
