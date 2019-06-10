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
        let columns = new Map();

        for (let el in data[0]) {
            if (el !== "" && el !== "\n" && el !== "\r\n") {
                columns[el] = {
                    state: "discard", //information/discard(will not be used)/wish/appeal
                    wishNum: -1,
                    appealNum: -1
                };
            }
        }

        return columns;
    }

    /** Find all distinct affectation options */
    static updatedCourses(courses, data, columns) {
        courses = new Map(courses.entries());

        let wishCols = [];
        //Get the columns set as wish Columns by the user
        for (let el in columns) {
            if (columns[el].wishNum !== -1) {
                wishCols.push(el);
            }
        }

        let found = new Set();

        //Find all the possible courses
        for (let rowNum in data) { //Go through all the rows
            let row = data[rowNum];
            for (let i in wishCols) { //Go through all the wish columns
                if (row[wishCols[i]] !== undefined) {
                    found.add(row[wishCols[i]]);
                }
            }
        }

        for (let course of found) {
            if (!courses.has(course)) {
                courses.set(course, {
                    minPlaces: Math.floor(data.length/found.size-5), //Min places in this course
                    maxPlaces: Math.floor(data.length/found.size+5), //Max places in this course
                    reservedPlaces: 0, //Places spared for other students
                });
            }
        }


        // Remove old courses
        for (let course of courses.keys()) {
            if (!found.has(course))
                courses.delete(course);
        }

        return courses;
    }
}

export default dataHandler;
