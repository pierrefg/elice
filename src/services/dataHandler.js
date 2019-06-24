class dataHandler {

    static sanitizeColumnName(name) {
        return name.replace("[", "{").replace("]", "}").replace(".", "_");
    }

    static preProcess(data) { //brackets, new columns
        for (let row in data) {
            data[row]["id"] = row;
            data[row]["affectationMode"] = "Automatique";
            data[row]["result"] = "Non calculé";
        }
        return data;
    }

    static extractColumns(meta) {
        let columns = new Map();

        let wishCount = 1;
        for (let i in meta.fields) {
            let name = meta.fields[i];
            if (name !== "" && name !== "\n" && name !== "\r\n") {
                let lowercaseName = name.toLowerCase();
                let state = "discard";  //information/discard(will not be used)/wish/appeal
                let wishNum = -1;
                if (lowercaseName.includes("voeux") || lowercaseName.includes("vœux")) {
                    state = "wish";
                    wishNum = wishCount++;
                }
                else if (lowercaseName.includes("attrait"))
                    state = "appeal";
                else if (lowercaseName.includes("nom") || lowercaseName.includes("adresse") || lowercaseName.includes("mail"))
                    state = "information";

                columns.set(name, {
                    state: state,
                    wishNum: wishNum,
                    appealNum: -1
                });
            }
        }

        return columns;
    }

    /** Find all distinct affectation options */
    static updatedCourses(courses, data, columns) {
        courses = new Map(courses.entries());

        let wishCols = [];
        //Get the columns set as wish Columns by the user
        for (let el of columns.keys()) {
            if (columns.get(el).wishNum !== -1) {
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
