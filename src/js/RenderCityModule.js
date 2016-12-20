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
    var geometry = new THREE.BoxGeometry(floor.width, floor.height, 1);
    var color = pickColor(type);
    var material = new THREE.MeshBasicMaterial( {color: color } );
    var plane = new THREE.Mesh( geometry, material );

    var x = floor.coordinates.x;
    var z = floor.coordinates.z;

    plane.rotation.x = Math.PI/2;
    plane.position.x = x + floor.width/2;
    plane.position.z = z + floor.height/2;
    plane.position.y = getFloorOffeset(type);

    scene.add(plane);

    var geo = new THREE.EdgesGeometry(geometry);
    var mat = new THREE.LineBasicMaterial({ color: pickColor("Wireframe"), linewidth: 0.5 });
    var wireframe = new THREE.LineSegments(geo, mat);

    wireframe.rotation.x = Math.PI/2;
    wireframe.position.x = x + floor.width/2;
    wireframe.position.z = z + floor.height/2;
    wireframe.position.y = getFloorOffeset(type);

    scene.add(wireframe);
}

function getFloorOffeset(type) {
    switch (type) {
        case "CityFloor":
            return -0.3;
        case "DistrictFloor":
            return -0.2;
        case "NeighFloor":
            return 0;
        default:
            return 0;
    }
}

function renderCube(scene, block){
    var coordinates = block.coordinates;
    var size = block.size;
    var key;
    if(appConfiguration.colorEnabled())
        key = block.color;
    else
        key = "DefaultColor";

    var geometry = new THREE.BoxGeometry( size[0], size[1], size[2]);
    var material = new THREE.MeshBasicMaterial( { color: pickColor(key) } );
    var newCube = new THREE.Mesh( geometry, material );

    newCube["blockInformation"] = block;
    addToTargetList(newCube);

    newCube.position.x = coordinates.x;
    newCube.position.y = size[1]/2 + 0.5;
    newCube.position.z = coordinates.z;

    scene.add(newCube);

    var geo = new THREE.EdgesGeometry(geometry); // or WireframeGeometry( geometry )
    var mat = new THREE.LineBasicMaterial({ color: pickColor("Wireframe"), linewidth: 0.5 });
    var wireframe = new THREE.LineSegments(geo, mat);
    wireframe.position.x = coordinates.x;
    wireframe.position.y = size[1]/2 + 0.5;
    wireframe.position.z = coordinates.z;

    scene.add(wireframe);
}

function renderCubeWithExtensions(scene, children, block){
    var coordinates = block.coordinates;
    var size = block.size;
    var key;
    if(appConfiguration.colorEnabled())
        key = block.color;
    else
        key = "DefaultColor";

    var geometry = new THREE.BoxGeometry( size[0], size[1], size[2]);
    var material = new THREE.MeshBasicMaterial( { color: pickColor(key) } );
    var newCube = new THREE.Mesh( geometry, material );

    newCube["blockInformation"] = block;
    addToTargetList(newCube);

    newCube.position.x = coordinates.x;
    newCube.position.y = size[1]/2 + 0.5;
    newCube.position.z = coordinates.z;

    scene.add(newCube);

    var geo = new THREE.EdgesGeometry(geometry); // or WireframeGeometry( geometry )
    var mat = new THREE.LineBasicMaterial({ color: pickColor("Wireframe"), linewidth: 0.5 });
    var wireframe = new THREE.LineSegments(geo, mat);
    wireframe.position.x = coordinates.x;
    wireframe.position.y = size[1]/2 + 0.5;
    wireframe.position.z = coordinates.z;

    scene.add(wireframe);

    var child;
    var block;
    var baseSize = size;
    var baseXYZ = {
        x: coordinates.x,
        y: size[1],
        z: coordinates.z
    };

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
    var geometry = new THREE.BoxGeometry( size[0], size[1], size[2]);
    var material = new THREE.MeshBasicMaterial( { color: appConfiguration.colorEnabled() ? pickColor(key) : pickColor("DefaultColor")} );
    var newCube = new THREE.Mesh( geometry, material );

    newCube["blockInformation"] = block;
    addToTargetList(newCube);

    newCube.position.x = baseXYZ.x;
    newCube.position.y = baseXYZ.y + size[1]/2 + 0.5;
    newCube.position.z = baseXYZ.z;

    var geo = new THREE.EdgesGeometry(geometry); // or WireframeGeometry( geometry )
    var mat = new THREE.LineBasicMaterial({ color: pickColor("Wireframe"), linewidth: 0.5 });
    var wireframe = new THREE.LineSegments(geo, mat);
    wireframe.position.x = baseXYZ.x;
    wireframe.position.y = baseXYZ.y + size[1]/2 + 0.5;
    wireframe.position.z = baseXYZ.z;

    baseXYZ.y = baseXYZ.y + size[1];
    var block = [newCube, wireframe, baseXYZ];
    return block;
}

function addToTargetList(object) {
    appConfiguration.targetList.push(object);
}
