import * as PIXI from '~/Pixi'

import World from './World'
import NetworkHandler from './NetworkHandler'
import PlayerAvatar from './PlayerAvatar'

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
const renderer = new PIXI.CanvasRenderer(800, 600, {backgroundColor : 0x000000});

document.body.appendChild(renderer.view);

// create the root of the scene graph
const stage = new PIXI.Container();
stage.scale.x = 2;
stage.scale.y = 2;

const world = new World(stage);

const texture = PIXI.Texture.fromImage('assets/bunny.png');

let myBunny = false;

// start animating
animate();
function animate() {
    requestAnimationFrame(animate);

    if(myBunny){
      // just for fun, let's rotate mr rabbit a little
      myBunny.rotation += 0.1;
    }

    // render the container
    renderer.render(stage);
}

function createBunny(pos, mine){
  // create a new Sprite using the texture
  const bunny = new PIXI.Sprite(texture);

  // center the sprite's anchor point
  bunny.anchor.x = 0.5;
  bunny.anchor.y = 0.5;

  // move the sprite to the center of the screen
  bunny.position.x = pos[0];
  bunny.position.y = pos[1];

  bunny.tint = 0xFFAAAA;

  if(mine){
    myBunny = bunny;
    bunny.tint = 0xAAFFAA;
    function onDown (eventData) {
      console.log('click');
      bunny.scale.x += 0.3;
      bunny.scale.y += 0.3;
    }

    bunny.interactive = true;
    bunny.on('mousedown', onDown);
    bunny.on('touchstart', onDown);
  }

  stage.addChild(bunny);
  return bunny;
}

const bunnies = {};

var host = window.document.location.host.replace(/:.*/, '');
var ws = new WebSocket('ws://' + host + ':3000');
ws.onmessage = function (event) {
  const json = JSON.parse(event.data);
  console.log(json, bunnies);
  if(json.type==='login'){
    const newbun = createBunny(json.pos, true);
    bunnies[json.id] = {
      id: json.id,
      pos: json.pos,
      sprite: newbun
    }

    for(var i in json.others){
      const newbunz = createBunny(json.others[i].pos);
      bunnies[json.others[i].id] = {
        id: json.others[i].id,
        pos: json.others[i].pos,
        sprite: newbunz
      }
    }
  }

  if(json.type==='remove'){
    const bun = bunnies[json.id];
    stage.removeChild(bun.sprite);
    delete bunnies[json.id];
  }

  if(json.type==='add'){
    const newbunz = createBunny(json.pos);
    bunnies[json.id] = {
      id: json.id,
      pos: json.pos,
      sprite: newbunz
    }
  }
  console.log(json, bunnies);
};

const keepAliveInterval = setInterval(function () {
  ws.send('{}');
}, 15000);
