// App configurantion parameters
let appConfiguration = {
    controls : [],
    height : window.innerHeight * 0.75,
    width : window.innerWidth * 0.65,
    camera : [],
    holdCamera : false,
    raycaster : null,
    mouse : null,
    idGenerator : {
        blockId : 0,
        getId : function(){
            this.blockId += 1 ;
            return this.blockId;
        }
    },
    blockSelection : {
        "lastColor" : null,
        "currentSelection" : null
    },
    renderer : [],
    targetList : [],
    filters : ["color", "sort", "linear", "stack"],
    colorEnabled : function() {
        if(this.filters.indexOf("color") > -1)
            return true;
        else
            return false;
    },
    filterChanged : null,
    stackExtensions : function() {
        if(this.filters.indexOf("stack") > -1)
            return true;
        else if (this.filters.indexOf("group") > -1)
            return false;
        else
            return 0;
    },
    projectInfo : {
        totalLOC : 0,
        name:"Project name",
        numberOfEnums:0,
        numberOfStructs:0,
        numberOfExtensions:0,
        numberOfClasses:0,
        numberOfProtocols:0,
        minMaxLoc:[],
        minMaxNom:[]
    }
};
