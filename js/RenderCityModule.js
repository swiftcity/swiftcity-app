/**
 * @author peaonunes / https://github.com/peaonunes
 */

 let floors = {
     "0" : "CityFloor",
     "1" : "DistrictFloor",
     "2" : "NeighFloor"
 };

function insertRender(renderer){
    var cityDiv = d3.select("#city");
    cityDiv.node().appendChild(renderer.domElement);
}

function renderSceneProperties(){
    var scene = appConfiguration.scene;
    scene.background = new THREE.Color(pickColor("Sky"));
}

function renderCamareProperties(x, y, z){
    if(appConfiguration.holdCamera)
        return;
    var camera = appConfiguration.camera;
    var renderer = appConfiguration.renderer;
    camera.position.set(x,y,z);
    appConfiguration.camera.lookAt(appConfiguration.scene.position);
    var orbit = new THREE.OrbitControls(camera, renderer.domElement);
}

function renderCity(cityMatrix, dimension) {
    var scene = appConfiguration.scene;
    var district;
    for(var i = 0 ; i < dimension ; i++){
        for(var j = 0 ; j < dimension ; j++){
            district = cityMatrix[i][j];
            if(district == -1)
                continue;
            renderDistrict(district.blocks, district.dimension, scene, district.file);
        }
    }

    renderFloor(cityMatrix.floor, scene, floors["0"]);
}

function renderDistrict(blocksMatrix, dimension, scene, file){
    for(var i = 0 ; i < dimension ; i++){
        for(var j = 0 ; j < dimension ; j++){
            var block = blocksMatrix[i][j];
            if(block == -1)
                continue;

            if(appConfiguration.stackExtensions()){
                if(block.children.length > 0){
                    renderCubeWithExtensions(scene, block.children, block);
                } else {
                    renderCube(scene, block);
                }
            }
            else {
                if(block.blocks != null){
                    renderNeigh(block.blocks, block.dimension, scene, block.file, block);
                } else {
                    renderCube(scene, block);
                }
            }
        }
    }

    renderFloor(blocksMatrix.floor, scene, floors["1"]);
}

function renderNeigh(neighMatrix, dimension, scene, file, block){
    var coordinates;
    var size;
    var key;
    for(var i = 0 ; i < dimension ; i++){
        for(var j = 0 ; j < dimension ; j++){
            var block = neighMatrix[i][j];
            if(block == -1)
                continue;

            renderCube(scene, block);
        }
    }

    renderFloor(neighMatrix.floor, scene, floors["2"]);
}

function renderFloor(floor, scene, type) {
    var plane = createCube([floor.width, floor.height, getFloorHeight(type)], type, [0,0,0]);
    var x = floor.coordinates.x;
    var z = floor.coordinates.z;

    plane.rotation.x = Math.PI/2;
    plane.position.x = x + floor.width/2;
    plane.position.z = z + floor.height/2;
    plane.position.y = getFloorOffeset(type);

    scene.add(plane);

    var wireframe = createWireFrame(plane.geometry, [floor.width, floor.height, getFloorHeight(type)], [0,0,0]);

    wireframe.rotation.x = Math.PI/2;
    wireframe.position.x = x + floor.width/2;
    wireframe.position.z = z + floor.height/2;
    wireframe.position.y = getFloorOffeset(type);

    scene.add(wireframe);
}

function getFloorHeight(type) {
    switch (type) {
        case "CityFloor":
            return 1.0;
        case "DistrictFloor":
            return 1.35;
        case "NeighFloor":
            return 1.25;
        default:
            return 0;
    }
}

function getFloorOffeset(type) {
    switch (type) {
        case "CityFloor":
            return -0.5;
        case "DistrictFloor":
            return -0.25;
        case "NeighFloor":
            return -0.15;
        default:
            return 0;
    }
}

function renderCube(scene, block){
    var coordinates = block.coordinates;
    var size = block.size;
    var key = block.color;

    var newCube = createCube(size, key, coordinates);
    // Add to the cube the block information and assings the block to the watchlist of raycaster.
    newCube["blockInformation"] = block;
    addToTargetList(newCube);
    var wireframe = createWireFrame(newCube.geometry, size, coordinates);
    scene.add(newCube);
    scene.add(wireframe);
}

function renderCubeWithExtensions(scene, children, block){
    var coordinates = block.coordinates;
    var size = block.size;
    var key = block.color;

    var newCube = createCube(size, key, coordinates);
    // Add to the cube the block information and assings the block to the watchlist of raycaster.
    newCube["blockInformation"] = block;
    addToTargetList(newCube);
    var wireframe = createWireFrame(newCube.geometry, size, coordinates);
    scene.add(newCube);
    scene.add(wireframe);

    var child;
    var block;
    var baseSize = size;
    var baseXYZ = {
        x: coordinates.x,
        y: size[1],
        z: coordinates.z
    };

    // Get and add children
    for (var i = 0; i < children.length; i++) {
        child = children[i];
        block = getBlockFrom(baseXYZ, child.size, child.key, child);
        scene.add(block[0]);
        scene.add(block[1]);
        baseXYZ = block[2];
        baseCube = block[0]
    }
}

function getBlockFrom(baseXYZ, size, key, block) {
    var newCube = createCube(size, key, baseXYZ);
    // Add to the cube the block information and assings the block to the watchlist of raycaster.
    newCube["blockInformation"] = block;
    addToTargetList(newCube);
    var wireframe = createWireFrame(newCube.geometry, size, baseXYZ);
    // Update the base height
    baseXYZ.y = baseXYZ.y + size[1];
    var block = [newCube, wireframe, baseXYZ];
    return block;
}

function addToTargetList(object) {
    appConfiguration.targetList.push(object);
}

function createCube(size, key, coordinates) {
    var geometry = new THREE.BoxGeometry( size[0], size[1], size[2]);
    var material = new THREE.MeshBasicMaterial( { color: getCubeColor(key) } );
    var newCube = new THREE.Mesh(geometry, material);

    newCube.position.x = coordinates.x;
    newCube.position.y = coordinates.y + size[1]/2 + 0.5;
    newCube.position.z = coordinates.z;

    return newCube;
}

function createWireFrame(geo, size, coordinates) {
    var geometry = new THREE.EdgesGeometry(geo);
    var material = new THREE.LineBasicMaterial({ color: pickColor("Wireframe"), linewidth: 0.5 });
    var wireframe = new THREE.LineSegments(geometry, material);

    wireframe.position.x = coordinates.x;
    wireframe.position.y = coordinates.y + size[1]/2 + 0.5;
    wireframe.position.z = coordinates.z;

    return wireframe;
}

function getCubeColor(key) {
    if (key == "CityFloor" || key == "DistrictFloor" || key == "NeighFloor")
        return pickColor(key);
    else if(appConfiguration.colorEnabled())
        return pickColor(key);
    else
        return pickColor("DefaultColor");
}
