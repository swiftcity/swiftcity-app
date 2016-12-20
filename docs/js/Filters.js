/**
 * @author peaonunes / https://github.com/peaonunes
 */

function filterClicked(object) {
    var value = object.value;
    var filterType = getFilterType(value);
    changeFiltersState(value, filterType);
    if(appConfiguration.filterChanged == null)
        appConfiguration.filterChanged = value;
    else
        appConfiguration.filterChanged = appConfiguration.filterChanged == value ? false : true;
    updateWithFile();
}

let scaleRadios = ["linear", "log15", "sqrt", "boxplot"];
let extenRadios = ["stack", "group"];

function getFilterType(value) {
    if(scaleRadios.indexOf(value) > -1)
        return "scale";
    else if(extenRadios.indexOf(value) > -1)
        return "extension";
    else
        return "checkbox";
}

function changeFiltersState(value, filterType) {
    var filters = appConfiguration.filters;

    switch (filterType) {
        case "scale":
            filters = removeFromList(scaleRadios, filters);
            filters.push(value);
            break;
        case "extension":
            filters = removeFromList(extenRadios, filters);
            filters.push(value);
            break;
        case "checkbox":
            var index = listContains(filters, value);
            if(index > -1){
                filters = filters.filter(function(i) {
                	return i != value;
                });
            }else
                filters.push(value);
            break;
        default:
            console.log(">> ERROR: No filter match changed.\n", isRadio, filters);
            break;
    }
    appConfiguration.filters = filters;
}

function removeFromList(array, filters) {
    filters = filters.filter(function(i){
        if(array.indexOf(i) > -1){
            return false;
        } else {
            return true;
        }
    });
    return filters;
}

function listContains(array, element) {
    var index = array.indexOf(element);
    return index;
}
