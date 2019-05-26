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

    /** Create an id for each row */
    static createIds(data){
        var i = 0;
        for(var el in data) data[el].idVent = i++;
        return data;
    }

    static getColumns(data){
        var columns = {};

        for (var el in data[0]){
            if(el !== "" && el !== "\n" && el !== "\r\n"){
                columns[el] = {
                    state: "ignore", //default/wish/ignore(will not be used)
                    wishNum: -1
                };
            }
        }

        return columns;
    }

    /** Find all distinct affectation options */
    static getGroups(data, columns){
        var groups = {};
        var wishCols = [];
        //Get the columns set as wish Columns by the user
        for(var el in columns){
            if(columns[el]["state"] === "wish"){
                wishCols.push(el);
            }
        }
        let groupId = 0;
        //Find all the possible groups
        for(var rowNum in data){ //Go through all the rows
            var row = data[rowNum];
            for(var i in wishCols){ //Go through all the wish columns
                //console.log(row[wishCols[i]])
                if(row[wishCols[i]] !== undefined){
                    if(groups[row[wishCols[i]]] === undefined){
                        groups[row[wishCols[i]]] = {
                            nbStudents : 20, //Total number of places avalaible in this groups
                            nbReservedPlaces : 0, //Places spared for other students
                            id: groupId++ //Group id
                        };
                    }
                }
            }
        }
        return groups;
    }

    static affect(d, groups){
        var data = [...d];
        for (var rowIndex in data) {
            data[rowIndex].result = 1
            data[rowIndex] = {...data[rowIndex], result: 1};
        }
        return data;
    }
}

export default dataHandler;
