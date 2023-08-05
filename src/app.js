import Application from './core/Application.js';
import Sprite from './core/Sprite.js';

const app = new Application({ width: 800, height: 600 });
window.app = app;

const sprite = new Sprite({src: 'doug.png'});
app.stage.add(sprite);

document.body.appendChild(app.view);