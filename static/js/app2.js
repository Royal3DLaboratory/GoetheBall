var container;

var camera, scene, renderer, objects;
var particleLight;
var dae;

var stepsize = 0.523598333;

var XAXIS = new THREE.Vector3(1, 0, 0);
var YAXIS = new THREE.Vector3(0, 1, 0);
var ZAXIS = new THREE.Vector3(0, 0, 1);

var loader = new THREE.ColladaLoader();
loader.options.convertUpAxis = true;
loader.load( 'static/models/goetheball-single.dae', function ( collada ) {

	dae = collada.scene;

	dae.traverse( function ( child ) {

		if ( child instanceof THREE.SkinnedMesh ) {

			var animation = new THREE.Animation( child, child.geometry.animation );
			animation.play();

		}

	} );

	dae.scale.x = dae.scale.y = dae.scale.z = 1;
	dae.updateMatrix();

	dae.rotation.x = 0;

	turn(.5)

	init();
	animate();

} );

function onKeyPress(event) {
    // We want 37 - left and 39 right
    // 38 up - 40 down
    if (event.which == 37) {
        // Left key
        turn(1)
    }

    if (event.which == 39) {
        // Right key
        turn(-1)
    }

	if (event.which == 38) {
		// Up
		//flip(1)
	}

	if (event.which == 40) {
		// Up
		//flip(-1)
	}
}


function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.set( 0, 0, 3 );

	scene = new THREE.Scene();

	// Grid

	var size = 14, step = 1;

	var geometry = new THREE.Geometry();
	var material = new THREE.LineBasicMaterial( { color: 0x303030 } );

	for ( var i = - size; i <= size; i += step ) {

		geometry.vertices.push( new THREE.Vector3( - size, - 0.04, i ) );
		geometry.vertices.push( new THREE.Vector3(   size, - 0.04, i ) );

		geometry.vertices.push( new THREE.Vector3( i, - 0.04, - size ) );
		geometry.vertices.push( new THREE.Vector3( i, - 0.04,   size ) );

	}

	var line = new THREE.LineSegments( geometry, material );
	//scene.add( line );

	// Add the COLLADA

	scene.add( dae );

	//particleLight = new THREE.Mesh( new THREE.SphereGeometry( 4, 8, 8 ), new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
	//scene.add( particleLight );

	// Lights

	scene.add( new THREE.AmbientLight( 0xcccccc ) );

	var directionalLight = new THREE.DirectionalLight(/*Math.random() * 0xffffff*/0xeeeeee );
	directionalLight.position.x = Math.random() - 0.5;
	directionalLight.position.y = Math.random() - 0.5;
	directionalLight.position.z = Math.random() - 0.5;
	directionalLight.position.normalize();
	//scene.add( directionalLight );

	var pointLight = new THREE.PointLight( 0xffffff, 4 );
	//particleLight.add( pointLight );

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );
    window.addEventListener( 'keydown', onKeyPress, false );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

	requestAnimationFrame( animate );

	render();

}

var clock = new THREE.Clock();

function render() {

	var timer = Date.now() * 0.00025;

	//camera.position.x = Math.cos( timer ) * 10;
	//camera.position.y = 2;
	//camera.position.z = Math.sin( timer ) * 10;

	camera.lookAt( scene.position );

	//particleLight.position.x = Math.sin( timer * 4 ) * 3009;
	//particleLight.position.y = Math.cos( timer * 5 ) * 4000;
	//particleLight.position.z = Math.cos( timer * 4 ) * 3009;

	//THREE.AnimationHandler.update( clock.getDelta() );

	renderer.render( scene, camera );

}


// Rotate an object around an axis in object space
function rotateAroundObjectAxis( object, axis, radians ) {

    var rotationMatrix = new THREE.Matrix4();

    rotationMatrix.setRotationAxis( axis.normalize(), radians );
    object.matrix.multiplySelf( rotationMatrix );                       // post-multiply
    object.rotation.getRotationFromMatrix( object.matrix );
}

// Rotate an object around an axis in world space (the axis passes through the object's position)       
function rotateAroundWorldAxis( object, axis, radians ) {

    var rotationMatrix = new THREE.Matrix4();

    rotationMatrix.makeRotationAxis( axis.normalize(), radians );
    rotationMatrix.multiply( object.matrix );                       // pre-multiply
    object.matrix = rotationMatrix;
    object.rotation.setFromRotationMatrix( object.matrix );
	object.updateMatrix();
}


function turn(steps) {
	// Each face is 30 degrees
	// or 0,523598333 radians

	//dae.rotateY( stepsize * steps );
    //dae.updateMatrix()

	rotateAroundWorldAxis( dae, YAXIS, stepsize * steps);
}

function flip(steps) {
	// Each face is 30 degrees
	// or 0,523598333 radians

	rotateAroundWorldAxis( dae, ZAXIS, stepsize * steps);

	// Flip camera up and down??????????

}
