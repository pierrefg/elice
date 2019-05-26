class dataHandler{
    static preProcess(data){ //brackets, new columns
        for(let row in data){
            for(let el in data[row]){
                let temp = el.replace("[", "{").replace("]", "}");
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
        let i = 0;
        for(let el in data) data[el].idVent = i++;
        return data;
    }

    static getColumns(data){
        let columns = {};

        for (let el in data[0]){
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
        let groups = {};
        let wishCols = [];
        //Get the columns set as wish Columns by the user
        for(let el in columns){
            if(columns[el]["state"] === "wish"){
                wishCols.push(el);
            }
        }
        let groupId = 0;
        //Find all the possible groups
        for(let rowNum in data){ //Go through all the rows
            let row = data[rowNum];
            for(let i in wishCols){ //Go through all the wish columns
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
        console.log(groups);
        return groups;
    }

    static affect(d, groups){
        /*let data = [...d];
        for (let rowIndex in data) {
            data[rowIndex] = {...data[rowIndex], result: 1};
        }*/

        //return process([0,2,4,8,16,32], [20,20,20,20,20,20], [20,20,20,20,20,20], d, d);
        //return data;
    }
}

export default dataHandler;
