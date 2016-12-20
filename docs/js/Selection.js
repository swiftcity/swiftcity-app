function selectBlock(block) {
    var blockInformation = block.blockInformation;
    if(appConfiguration.blockSelection.currentSelection == null){
        selectClickedBlock(block);
    } else if (appConfiguration.blockSelection.currentSelection.blockInformation.id == blockInformation.id){
        deselectCurrentBlock()
        appConfiguration.blockSelection.currentSelection = null;
    } else {
        deselectCurrentBlock()
        selectClickedBlock(block);
    }
}

function selectClickedBlock(block) {
    appConfiguration.blockSelection.lastColor = getColorFromMaterial(block);
    var newMaterial = new THREE.MeshBasicMaterial({color: "#fafafa", side: THREE.DoubleSide});
    block.material = newMaterial;
    appConfiguration.blockSelection.currentSelection = block;
    renderBlockInformation(block);
}

function deselectCurrentBlock() {
    var lastColor = appConfiguration.blockSelection.lastColor;
    var newMaterial = new THREE.MeshBasicMaterial({color: lastColor, side: THREE.DoubleSide});
    appConfiguration.blockSelection.currentSelection.material = newMaterial;
    renderBlockInformation(null);
}

function getColorFromMaterial(block) {
    return "#"+block.material.color.getHexString();
}
