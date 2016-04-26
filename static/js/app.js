APP = {}

var ambientLight, lights, camera

var geometry, material, sphere

APP.init = function() {
    APP.scene = new THREE.Scene();

    APP.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    APP.camera.position.z = 10;

    APP.renderer = new THREE.WebGLRenderer();
    APP.renderer.setPixelRatio( window.devicePixelRatio );
    APP.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( APP.renderer.domElement );

    ambientLight = new THREE.AmbientLight( 0xff0000 );
    APP.scene.add( ambientLight );

    var lights = [];
    lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

    lights[ 0 ].position.set( 0, 200, 0 );
    lights[ 1 ].position.set( 100, 200, 100 );
    lights[ 2 ].position.set( - 100, - 200, - 100 );

    APP.scene.add( lights[ 0 ] );
    APP.scene.add( lights[ 1 ] );
    APP.scene.add( lights[ 2 ] );
}

APP.addShape = function() {
    geometry = new THREE.SphereGeometry( 2, 9, 12 );
    material = new THREE.MeshBasicMaterial( {color: 0xffcc00} );
    sphere = new THREE.Mesh( geometry, material );
    APP.scene.add( sphere );
}


APP.animate = function() {
    requestAnimationFrame( APP.animate );
    APP.render();
}

APP.render = function() {
    //camera.position.y += ( - mouseY + 200 - APP.camera.position.y ) * .05;
    //camera.lookAt( APP.scene.position );
    APP.renderer.render( APP.scene, APP.camera );
/*
    var time = Date.now() * 0.0001;
    for ( var i = 0; i < scene.children.length; i ++ ) {
        var object = scene.children[ i ];
        if ( object instanceof THREE.Line ) {
            object.rotation.y = time * ( i < 4 ? ( i + 1 ) : - ( i + 1 ) );
            if ( i < 5 ) object.scale.x = object.scale.y = object.scale.z = object.originalScale * (i/5+1) * (1 + 0.5 * Math.sin( 7*time ) );
        }
    }
*/
}

APP.load = function(filename) {
    var loader = new THREE.ColladaLoader();

    loader.options.convertUpAxis = true;

    loader.load( filename, function ( collada ) {
        var dae = collada.scene;

        var skin = collada.skins[ 0 ];

        dae.position.set(0,0,0);//x,z,y- if you think in blender dimensions ;)
        dae.scale.set(1.5,1.5,1.5);
        dae.updateMatrix();

        APP.scene.add(dae);

    });
}

APP.run = function() {
    // Do stuff on the run :D
    APP.init()
    APP.addShape()
    APP.load('static/models/goetheball-single.dae')
    console.log('hey man')
    console.log('lets run it wut')
    APP.render()

}
