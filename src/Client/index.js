import CanvasRenderer from '~/Pixi/core/renderers/canvas/CanvasRenderer'
import Container from '~/Pixi/core/display/Container'
import Texture from '~/Pixi/core/textures/Texture'
import SpriteRenderer from '~/Pixi/core/sprites/canvas/CanvasSpriteRenderer'
import Sprite from '~/Pixi/core/sprites/Sprite'

import World from './World'
import NetworkHandler from './NetworkHandler'
import PlayerAvatar from './PlayerAvatar'

const renderer = new CanvasRenderer(800, 600, {backgroundColor : 0x000000});

document.body.appendChild(renderer.view);

// create the root of the scene graph
const stage = new Container();

const world = new World(stage);

const texture = Texture.fromImage('assets/bunny.png');

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


var host = window.document.location.host.replace(/:.*/, '');
var ws = new WebSocket('ws://' + host + ':3000');
ws.onmessage = function (event) {
  console.log(event);
  console.log(JSON.parse(event.data));
};
const keepAliveInterval = setInterval(function () {
  ws.send('asdasdasd', {}, function(res){
    console.log('send callback', res)
  });
}, 1000);
