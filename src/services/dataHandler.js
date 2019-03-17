class dataHandler{
    static preProcess(data){ //brackets, new columns
        for(var row in data){
            for(var el in data[row]){
                var temp = el.replace("[", "{").replace("]", "}");
                if(temp !== el){
                    data[row][temp] = data[row][el];
                    delete data[row][el];
                }
                data[row]["affecMode"] = "auto";
                data[row]["result"] = "non calculé";
            }
        }
        return data;
    }

    static getColumns(data){
        var columns = {};

        for (var el in data[0]){
            if(el !== "" && el !== "\n" && el !== "\r\n"){
                columns[el] = {
                    state: "ignore", //default/vow/ignore(will not be used)
                    vowNum: -1
                };
            }
        }
        
        console.log("COLUMNS");
        console.log(columns);
        return columns;
        
    }

    static getGroups(data, columns){
        var groups = {};
        var vowCols = [];
        //Get the columns set as Vow Columns by the user
        for(var el in columns){
            if(columns[el]["state"] === "vow"){
                vowCols.push(el);
            }
        }
        console.log("GROUPS");
        console.log(vowCols);
        //Find all the possible groups
        for(var rowNum in data){ //Go through all the rows
            var row = data[rowNum];
            for(var i in vowCols){ //Go through all the vow columns
                console.log(row[vowCols[i]])
                if(row[vowCols[i]] !== undefined){
                    if(groups[row[vowCols[i]]] === undefined){
                        groups[row[vowCols[i]]] = {
                            nb:1, //Clumsy stat
                            nbStudents : 20, //Total number of places avalaible in this groups
                            nbReservedPlaces : 0 //Places spared for other students
                        };
                    }else{
                        groups[row[vowCols[i]]].nb++;
                    }
                }
            }
        }
        return groups;
    }

    static createIds(data){
        var i = 0;
        for(var el in data){
            data[el].idVent = i;
            i++;
        }
        return data;
    }
}

export default dataHandler;
