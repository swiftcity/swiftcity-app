/**
 * @author peaonunes / https://github.com/peaonunes
 */

let projectFiles = [];
let projectObjs = [];
let locs = [];

let minMaxLoc = [Number.POSITIVE_INFINITY,0];
let minMaxNom = [Number.POSITIVE_INFINITY,0];
let defaultFileReader = new FileReader();

let lastFileSelected = [];

let scales = {
    "linear" : d3.scaleLinear(),
    "sqrt" : d3.scaleSqrt(),
    "log15" : d3.scaleLog().base(1.5),
    "boxplot" : "boxplot",
    "heightScale" : [],
    "widthScale" : []
};

function updateWithFile() {
    var selectedFile = document.getElementById("fileInput").files[0];
    if(selectedFile == null){
        showToast("You should first select a file!", 4000);
        return;
    } else if (lastFileSelected == selectedFile){
        if(filtersChanged() == false){
            showToast("You just chose the same file!", 2000);
            return;
        }
        appConfiguration.holdCamera = true;
        showToast("Reloading with: "+appConfiguration.filterChanged+"...", 2000);
        restartAppData();
    } else {
        appConfiguration.holdCamera = false;
        restartAppData();
    }
    defaultFileReader.readAsText(selectedFile);
    lastFileSelected = selectedFile;
}

function restartAppData() {
    renderBlockInformation(null);
    scales["heightScale"] = [];
    scales["widthScale"] = [];
    projectFiles = [];
    projectObjs = [];
    locs = [];
    minMaxLoc = [Number.POSITIVE_INFINITY,0];
    minMaxNom = [Number.POSITIVE_INFINITY,0];
    appConfiguration.projectInfo.totalLOC = 0;
    appConfiguration.targetList = [];
}

function filtersChanged() {
    if(appConfiguration.filterChanged != null && appConfiguration.filterChanged != false)
        return true;
    else
        return false;
}

defaultFileReader.onload = function(e) {
    var fileText = e.target.result;
    var fileData = JSON.parse(fileText);
    var project = getProjectFrom(fileData);
    buildProjectFiles(project);
    buildProjectInfo(project);
    renderData();
    renderAppInformation();
};

function buildProjectInfo(project) {
    var projectInfo = appConfiguration.projectInfo;
    projectInfo.minMaxLoc = minMaxLoc;
    projectInfo.minMaxNom = minMaxNom;
    projectInfo.numberOfEnums = project.enums.length;
    projectInfo.numberOfStructs = project.structs.length;
    projectInfo.numberOfExtensions = project.extensions.length;
    projectInfo.numberOfClasses = project.classes.length;
    projectInfo.numberOfProtocols = project.protocols.length;
    appConfiguration.projectInfo = projectInfo;
}

function renderData(){
    clearScene();
    runCity(projectFiles);
}

function clearScene(scene) {
    var scene = appConfiguration.scene;
    scene.children = [];
}

function getProjectFrom(fileData){
    var project;
    Object.keys(fileData).forEach(function (id) {
        project = fileData[id];
    });
    return project;
}

function buildProjectFiles(project) {
    readElements(project.enums, "Enum");
    readElements(project.classes, "Class");
    readElements(project.structs, "Struct");
    readElements(project.protocols, "Protocol");
    readElements(project.extensions, "Extension");

    scales.heightScale = getScale(appConfiguration.filters);
    if(scales.heightScale === "boxplot"){
        var boxplot = getBoxplot(locs);
        scales.heightScale = d3.scaleLinear()
            .domain(boxplot)
            .range([1,4,7,10,12,15]);
    } else {
        scales.heightScale
            .domain(minMaxLoc)
            .range([1, 15]);
    }

    scales.widthScale = d3.scaleLinear()
        .domain(minMaxNom)
        .range([1, 10]);

    var elements; var block;
    var larger; var largerChild;
    var size; var child;

    Object.keys(projectFiles).forEach(function (fileId) {
        elements = projectFiles[fileId].elements;
        for (var i = 0 ; i < elements.length ; i++){
            block = elements[i];

            if(block.children.length > 0){
                block.children = block.children.sort(function(a, b){ return b.nom - a.nom });
                largerChild = block.children[0];
                larger = isGreater(block.nom, largerChild.nom);
                if(!larger){
                    swapBlocks(elements, i, largerChild);
                    block = elements[i];
                }
            }

            size = [scales.widthScale(block.nom), scales.heightScale(block.loc),scales.widthScale(block.nom)];
            block.size = size;
            for (var j = 0; j < block.children.length; j++) {
                child = block.children[j];
                size = [scales.widthScale(child.nom), scales.heightScale(child.loc),scales.widthScale(child.nom)];
                child.size = size;
            }
        }
    });

}

function swapBlocks(elements, i, largerChild) {
    var block = elements[i];
    var newComp = createComponent(largerChild.key, largerChild.nama, largerChild.loc, largerChild.nom, largerChild.methods, []);
    var children = block.children.slice();
    children.shift();
    children.push(block);
    children.sort(compareSizes);
    newComp.children = children;
    elements[i] = newComp;
}

function compareSizes(a,b) {
    if(b.nom == a.nom)
        return b.loc - a.loc;
    return b.nom - a.nom;
}

function isGreater(a, b) {
    if(a > b)
        return true;
    else
        return false;
}

function readElements(array, elementType) {
    var element;
    var fileName;
    var found;
    var match;

    for(var i = 0 ; i < array.length ; i++){
        element = array[i];
        fileName = getFileName(element["source_path"]);

        found = hasFile(projectFiles, fileName);

        var component = createComponent(elementType, element["name"], element["number_of_lines"], element["methods"].length, element["methods"], [], element["start_line"], element["end_line"], fileName);

        if(elementType === "Extension")
        {
            match = isExtensionOf(projectObjs, element["name"]);
            if(match > -1){
                var matchedComponent = projectObjs[match];
                matchedComponent.children.push(component);
            } else {
                addToProject(found, component, fileName);
            }
        } else {
            addToProject(found, component, fileName);
        }
    }
}

function addToProject(found, component, fileName) {
    projectObjs.push(component);

    if(found == -1){
        var fileObj = {
            fileName: fileName,
            elements: [component]
        }
        projectFiles.push(fileObj);
    } else {
        projectFiles[found].elements.push(component)
    }
}

function isExtensionOf(array, extensionName) {
    for (var i = 0 ; i < array.length ; i++){
        if (!(array[i].name === "") && array[i].name === extensionName && array[i].key != "Extension")
            return i;
    }
    return -1;
}

function hasFile(array, fileName){
    for (var i = 0 ; i < array.length ; i++){
        if (!(array[i].fileName === "") && array[i].fileName === fileName)
            return i;
    }
    return -1;
}

function createComponent(keyName, objName, objLoc, objNom, objMethods, objExtensions, objBegin, objEnd, objFileName){
    locs.push(objLoc);
    minMaxLoc[0] = Math.min(objLoc, minMaxLoc[0]);
    minMaxLoc[1] = Math.max(objLoc, minMaxLoc[1]);
    minMaxNom[0] = Math.min(objNom, minMaxNom[0]);
    minMaxNom[1] = Math.max(objNom, minMaxNom[1]);
    appConfiguration.projectInfo.totalLOC += objLoc;

    var obj = {
        key: keyName,
        size:[0,0,0],
        name: objName,
        loc: objLoc,
        nom: objNom,
        startLine: objBegin,
        endLine: objEnd,
        methods: objMethods,
        children: objExtensions,
        color: keyName,
        fileName: objFileName
    }
    return obj;
}

function getFileName(source_path){
    var startName = source_path.lastIndexOf("/") + 1;
    var endName = source_path.length;
    var fileName = source_path.substring(startName, endName);
    return fileName;
}

function getScale(filters){
    var filter;
    var scale;
    for (var i = 0; i < filters.length; i++) {
        filter = filters[i];
        scale = scales[filter];
        if(scale != null)
            return scale;
    }
    console.log(">> ERROR: No scale matched.\n",filters);
}

function showToast(message, duration) {
    Materialize.toast(message, duration);
}
