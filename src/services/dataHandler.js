class dataHandler {
    static preProcess(data) { //brackets, new columns
        for (let row in data) {
            for (let col in data[row]) {
                let sanitizedCol = col.replace("[", "{").replace("]", "}").replace(".", "_");
                if (sanitizedCol !== col) {
                    data[row][sanitizedCol] = data[row][col];
                    delete data[row][col];
                }
            }

            data[row]["affectMode"] = "Automatique";
            data[row]["result"] = "Non calculé";
        }
        return data;
    }

    /** Create an id for each row */
    static createIds(data) {
        let i = 0;
        for (let el in data) data[el].idVent = i++;
        return data;
    }

    static extractColumns(data) {
        let columns = {};

        for (let el in data[0]) {
            if (el !== "" && el !== "\n" && el !== "\r\n") {
                columns[el] = {
                    state: "discard", //display/discard(will not be used)
                    wishNum: -1
                };
            }
        }

        return columns;
    }

    /** Find all distinct affectation options */
    static getCourses(data, columns) {
        let courses = {};
        let wishCols = [];
        //Get the columns set as wish Columns by the user
        for (let el in columns) {
            if (columns[el].wishNum !== -1) {
                wishCols.push(el);
            }
        }

        let courseId = 0;
        //Find all the possible courses
        for (let rowNum in data) { //Go through all the rows
            let row = data[rowNum];
            for (let i in wishCols) { //Go through all the wish columns
                //console.log(row[wishCols[i]])
                if (row[wishCols[i]] !== undefined) {
                    if (courses[row[wishCols[i]]] === undefined) {
                        courses[row[wishCols[i]]] = {
                            nbStudents: 42, //Total number of places available in this course
                            nbReservedPlaces: 0, //Places spared for other students
                            id: courseId++ //Course id
                        };
                    }
                }
            }
        }
        return courses;
    }
}

export default dataHandler;
