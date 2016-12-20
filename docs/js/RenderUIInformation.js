/**
 * @author peaonunes / https://github.com/peaonunes
 */

function renderAppInformation() {
    renderControlsInformation();
    renderProjectDetailsInformation();
}

function renderControlsInformation() {
    d3.select("#content").remove();

    var divInformation = d3.select("#controls")
    .append("div")
    .attr("id", "content");

    var controlsHmlt = "<h5>Basic Controls</h5>"
    + "<div class='col s6 m6 l6'><strong>Mouse</strong>"
    + "<table class='responsive-table stripped'><thead><tr><th>Zoom out</th><th>Zoom In</th><th>Rotation</th><th>Move scene</th><th>Select block</th></tr></thead>"
    + "<tbody><tr><td>Scroll up</td><td>Scroll down</td><td>Pan and move</td><td>Right click</td><td>Left click</td></tr></tbody></table></div>"
    + "<div class='col s6 m6 l6'><strong>Keyboard</strong>"
    + "<table><thead><tr><th>Move up/down</th><th>Move left/right</th><th>Zoom In/Out</th><th>Screenshot</th></tr></thead>"
    + "<tbody><tr><td>UP/Down Arrows</td><td>Left/Right Arrows</td><td>+/-</td><td>P</td></tr></tbody></table></div>";

    divInformation.html(controlsHmlt);
}

function renderProjectDetailsInformation() {
    var projectName = d3.select("#projectName");

    $("#projectName").click();

    var projectInfo = appConfiguration.projectInfo;
    var enableColor = appConfiguration.filters.indexOf("color") > -1 ? true : false;

    projectName
        .text("Project information")
        .attr("class", "collapsible-header active")
        .append("i")
        .attr("class", "material-icons")
        .text("info_outline");

    d3.select("#tableContent").remove();

    var tableContent = d3.select("#tableStats")
        .append("tbody")
        .attr("id", "tableContent");

    renderRowInfo(tableContent, enableColor ? "Class" : "DefaultColor", "Number of Classes: "+projectInfo.numberOfClasses, "Project's total LOC: "+projectInfo.totalLOC);
    renderRowInfo(tableContent, enableColor ? "Struct" : "DefaultColor", "Number of Structs: "+projectInfo.numberOfStructs, "Min LOC in a block: "+projectInfo.minMaxLoc[0]);
    renderRowInfo(tableContent, enableColor ? "Extension" : "DefaultColor", "Number of Extensions: "+projectInfo.numberOfExtensions, "Max LOC in a block: "+projectInfo.minMaxLoc[1]);
    renderRowInfo(tableContent, enableColor ? "Protocol" : "DefaultColor", "Number of Protocols: "+projectInfo.numberOfProtocols, "Min NOM in a block: "+projectInfo.minMaxNom[0]);
    renderRowInfo(tableContent, enableColor ? "Enum" : "DefaultColor", "Number of Enums: "+projectInfo.numberOfEnums, "Max NOM in a block: "+projectInfo.minMaxNom[1]);
}

function renderRowInfo(tableContent, labelType, middleColText, rightColText) {
    var row = tableContent
        .append("tr")
        .attr("class", "valign-wrapper")
        .attr("style", "height: 25px");

    row.append("td")
        .attr("style", "width: 10%")
        .attr("class", "right-align")
        .append("i")
        .attr("class", "material-icons valign tooltipped")
        .attr("style", "color: "+systemColors[labelType])
        .text("label");

    row.append("td")
        .attr("style", "width: 40%;")
        .attr("class", "left-align label-fonts")
        .text(middleColText);

    row.append("td")
        .attr("style", "width: 50%")
        .attr("class", "label-fonts")
        .text(rightColText);
}

function renderBlockInformation(block) {
    if(block == null){
        var blockDetails = d3.select("#blockDetails");
        blockDetails.select("#blockFile").html("Block file name goes here.");
        blockDetails.select("#blockName").html("Block name goes here.");
        blockDetails.select("#blockType").html("Block type goes here.");
        blockDetails.select("#blockLOC").html("Lines of code goes here");
        blockDetails.select("#blockNOM").html("Number of methods goes here");
        blockDetails.select("#blockMethods").html("Methods details");
    } else {
        var blockInformation = block.blockInformation;
        var blockName = blockInformation.name;
        var blockType = blockInformation.key;
        var blockLOC = blockInformation.loc;
        var blockNOM = blockInformation.nom;
        var blockMethods = blockInformation.methods;
        var blockFileName = blockInformation.fileName;

        var blockDetails = d3.select("#blockDetails");
        var fileName = blockDetails.select("#blockFile");
        fileName.html("<strong>File name: </strong>"+blockFileName);

        var detailsName = blockDetails.select("#blockName");
        detailsName.html("<strong>Name: </strong>"+blockName);

        var detailsType = blockDetails.select("#blockType");
        detailsType.html("<strong>Type: </strong>"+blockType);

        var detailsLOC = blockDetails.select("#blockLOC");
        detailsLOC.html("<strong>Lines of code: </strong>"+blockLOC);

        var detailsNom = blockDetails.select("#blockNOM");
        detailsNom.html("<strong>Number of methods: </strong>"+blockNOM);

        var detailsMethods = blockDetails.select("#blockMethods");
        var methodsHtml = "";
        if(blockMethods.length > 0){
            var table = detailsMethods.append("table").attr("class", "responsive-table highlight bordered");
            var header = table.append("thead").append("tr");
            header.append("th").attr("width","50%").text("Name");
            header.append("th").attr("width","10%").text("LOC");
            header.append("th").attr("width","40%").text("Return");
            var body = table.append("tbody");
            var tr;
            body.selectAll("tr").data(blockMethods).enter().each(function (d) {
                tr = body.append("tr");
                tr.append("td").attr("style","text-overflow: ellipsis; max-width: 50px; overflow: hidden;").attr("width","60%").text(d.name);
                tr.append("td").attr("style","overflow: hidden;").attr("width","10%").text(d.number_of_lines);
                tr.append("td").attr("style","overflow: hidden;").attr("width","30%").text(d.return_type);
            });
        } else {
            detailsMethods.html("<strog>There are no methods.</strong>")
        }//.label-fonts
    }
}
