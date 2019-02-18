class dataHandler{
    constructor(pdata){
        this.data = pdata
    }

    getColumns(){
        var columns = {};

        for (var el in this.data[0]){
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

    getGroups(){
        console.log("calculting groups...")
        //console.log(this.data)

        //var groups = [];
        
    }
}

export default dataHandler;