import * as PIXI from '~/Pixi'

import World from './World'
import NetworkHandler from './NetworkHandler'
import PlayerAvatar from './PlayerAvatar'

const desiredWidth = 400;
const desiredHeight = 300;

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
const renderer = new PIXI.CanvasRenderer(800, 600, {backgroundColor : 0x000000});

// create the root of the scene graph
const stage = new PIXI.Container();
stage.scale.x = 2;
stage.scale.y = 2;

var addEvent = function(object, type, callback) {
    if (object == null || typeof(object) == 'undefined') return;
    if (object.addEventListener) {
        object.addEventListener(type, callback, false);
    } else if (object.attachEvent) {
        object.attachEvent("on" + type, callback);
    } else {
        object["on"+type] = callback;
    }
};

const getWindowSize = function(){
  if(window.innerHeight){
    return [window.innerWidth, window.innerHeight]
  }
  if(document.body.clientHeight){
    return [document.body.clientWidth, document.body.clientHeight]
  }
  if(document.documentElement.clientHeight){
    return [document.documentElement.clientWidth, document.documentElement.clientHeight]
  }
  console.log('uhh... window size not available? WT..')
  return [800, 600];
}

function resizeWindow(event){
  const ws = getWindowSize();
  renderer.resize(ws[0], ws[1]);
  let wr = ws[0] / desiredWidth;
  let wh = ws[1] / desiredHeight;
  let scale = Math.min(wr, wh);
  if((wr>=1)&&(wh>=1)) {
    scale = Math.floor(Math.min(wr, wh))
  }
  stage.scale.x = scale;
  stage.scale.y = scale;
  stage.position.x = Math.floor(ws[0] / 2);
  stage.position.y = Math.floor(ws[1] / 2);
  stage.windowSize = ws;
}
addEvent(window, "resize", resizeWindow);
resizeWindow();

document.body.appendChild(renderer.view);

const world = new World(stage);

const texture = PIXI.Texture.fromImage('assets/bunny.png');

let myBunny = false;

// start animating
animate();
function animate() {
    requestAnimationFrame(animate);

    renderer.render(stage);
}

function centerBunny(x, y){
  stage.position.x = Math.floor(stage.windowSize[0] / 2 - x * stage.scale.x);
  stage.position.y = Math.floor(stage.windowSize[1] / 2 - y * stage.scale.x);
}

function setSpritePos(sprite, pos, center = false){
  sprite.position.x = pos[0]*16;
  sprite.position.y = pos[1]*16;
  sprite.realPos = pos;
  if(center){
    centerBunny(pos[0]*16 + 8, pos[1]*16 + 8);
  }
}

function createBunny(pos, mine){
  // create a new Sprite using the texture
  const bunny = new PIXI.Sprite(texture);

  // move the sprite to the center of the screen
  setSpritePos(bunny, pos, mine)

  bunny.tint = 0xFFAAAA;

  if(mine){
    myBunny = bunny;
    bunny.tint = 0xAAFFAA;
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
    newbun.id = json.id;

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

  if(json.type==='move'){
    const bun = bunnies[json.id];
    // move the sprite to the center of the screen
    setSpritePos(bun.sprite, [json.x, json.y], bun===myBunny)
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

//The `keyboard` helper function
function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };
  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };
  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}

function sendMove(bunny){
  ws.send(JSON.stringify({
    id: bunny.id,
    type: 'move',
    x: bunny.realPos[0],
    y: bunny.realPos[1]
  }))
}

//Capture the keyboard arrow keys
var left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40);
//Left arrow key `press` method
left.press = function() {
  setSpritePos(myBunny, [myBunny.realPos[0] - 1, myBunny.realPos[1]], true)
  sendMove(myBunny);
};
//Left arrow key `release` method
left.release = function() {};
//Up
up.press = function() {
  setSpritePos(myBunny, [myBunny.realPos[0], myBunny.realPos[1] - 1], true)
  sendMove(myBunny);
};
up.release = function() {};
//Right
right.press = function() {
  setSpritePos(myBunny, [myBunny.realPos[0] + 1, myBunny.realPos[1]], true)
  sendMove(myBunny);
};
right.release = function() {};
//Down
down.press = function() {
  setSpritePos(myBunny, [myBunny.realPos[0], myBunny.realPos[1] + 1], true)
  sendMove(myBunny);
};
down.release = function() {};
