

// create a new Sprite using the texture
const bunny = new Sprite(texture);

// center the sprite's anchor point
bunny.anchor.x = 0.5;
bunny.anchor.y = 0.5;

// move the sprite to the center of the screen
bunny.position.x = Math.floor(Math.random()*800);
bunny.position.y = Math.floor(Math.random()*600);

stage.addChild(bunny);

// start animating
animate();
function animate() {
    requestAnimationFrame(animate);

    // just for fun, let's rotate mr rabbit a little
    bunny.rotation += 0.1;

    // render the container
    renderer.render(stage);
}

bunny.interactive = true;
bunny.on('mousedown', onDown);
bunny.on('touchstart', onDown);

function onDown (eventData) {
    bunny.scale.x += 0.3;
    bunny.scale.y += 0.3;
}
