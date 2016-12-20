/**
 * @author peaonunes / https://github.com/peaonunes
 */

function pickColor(key) {
    if(systemColors[key] != null)
        return systemColors[key];
    else
        return "black";
}

$(document).ready(function() {
  $('.modal-trigger').leanModal();
});

var systemColors = {
    "Class" : "#FF4C63",
    "Enum" : "#42A5F5",
    "Extension" : "#FFC866",
    "Struct" : "#8D6DC4",
    "Protocol" : "#4CFF72",
    "Sky" : "#e3f2fd",
    "CityFloor" : "#757575",
    "DistrictFloor" : "#bdbdbd",
    "NeighFloor" : "#e0e0e0",
    "Wireframe" : "#424242",
    "DefaultColor" : "#C18787"
};

var blocksPallet = {
    "Class" : "#e41a1c",
    "Enum" : "#377eb8",
    "Extension" : "#4daf4a",
    "Struct" : "#984ea3",
    "Protocol" : "#ff7f00",
    "DefaultColor" : "#C18787"
};
