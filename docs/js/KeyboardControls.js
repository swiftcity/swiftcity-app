/**
 * @author peaonunes / https://github.com/peaonunes
 * Using Chrome key configuration.
 */

 // 039 >> Right arrow -> Move camera X to right
 // 037 >> Left arrow -> Move camera X to left
 // 040 >> Down arrow -> Moves down the camera Y
 // 038 >> Up arrow -> Moves up the camera Y
 // 189 >> - key -> Descrease the camera Z
 // 187 >> + key -> Increase the camera Z

var incrementScale = +0.5;
var decrementScale = -0.5;

document.onkeydown = function(event) {
    var camera = appConfiguration.camera;
    switch (event.keyCode) {
        case 37:
            stopPropagationIfValid(event);
            camera.position.x += incrementScale;
            break;
        case 38:
            stopPropagationIfValid(event);
            camera.position.y += decrementScale;
            break;
        case 39:
            stopPropagationIfValid(event);
            camera.position.x += decrementScale;
            break;
        case 40:
            stopPropagationIfValid(event);
            camera.position.y += incrementScale;
            break;
        case 189:
            stopPropagationIfValid(event);
            camera.position.z += incrementScale;
            break;
        case 187:
            stopPropagationIfValid(event);
            camera.position.z += decrementScale;
            break;
        case 80:
            stopPropagationIfValid(event);
            window.open(appConfiguration.renderer.domElement.toDataURL("image/png"), "Final");
            break;
        default:
            console.log(">> Warning:\n>> The following number Key was not recognised: "+event.keyCode);
    }
};

function stopPropagationIfValid(event) {
    event.stopPropagation();
    event.preventDefault();
}
