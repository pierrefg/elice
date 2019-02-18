class dataHandler{
    preProcess(data){ //brackets, new columns
        for(var row in data){
            for(var el in data[row]){
                var temp = el.replace("[", "{");
                temp = temp.replace("]", "}");
                if(temp !== el){
                    data[row][temp] = data[row][el]
                    delete data[row][el]
                }
                data[row]["affecMode"] = "auto"
                data[row]["result"] = "non calculé"
            }
        }
        return data
    }


    getColumns(data){
        var columns = {};

        for (var el in data[0]){
            if(el !== "" && el !== "↵"){
                let temp = {
                    state: "ignore", //default/vow/ignore(will not be used)
                    vowNum: -1
                }
                columns[el] = temp;
            }
        }
        console.log(columns);
        return columns;
        
    }

    getGroups(data, columns){
        var groups = {}
        var vowAtts = []
        for(var el in columns){
            if(columns[el]["state"] === "vow"){
                vowAtts.push(el)
            }
        }
        console.log("GROUPS")
        console.log(vowAtts)
        for(var rowNum in data){
            var row = data[rowNum]
            for(var i in vowAtts){
                console.log(row[vowAtts[i]])
               if(groups[row[vowAtts[i]]] === undefined){
                    groups[row[vowAtts[i]]] = {
                       "nb":1
                    }
               }else{
                    groups[row[vowAtts[i]]]["nb"]++
               }
            }
        }
        return groups
    }

    createIds(data){
        var i =0;
        for(var el in data){
            data[el].idVent = i;
            i++;
        }
        return data;
    }
}

export default dataHandler;