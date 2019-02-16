class dataHandler{
    constructor(pdata){
        this.data = pdata
    }

    getColumns(){
        var columns = [];

        for (var el in this.data[0]){
            if(el !== "" && el !== "↵"){
                columns.push(el);
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