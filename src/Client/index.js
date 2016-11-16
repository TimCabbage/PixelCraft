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

var host = window.document.location.host.replace(/:.*/, '');
var ws = new WebSocket('ws://' + host + ':3000');
ws.onmessage = function (event) {
  console.log(event);
  console.log(JSON.parse(event.data));
};
