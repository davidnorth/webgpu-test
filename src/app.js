import Application from './core/Application.js';
import Sprite from './core/Sprite.js';

const app = new Application({ width: 700, height: 700 });
const sprite = new Sprite({src: 'doug.png'});
app.stage.add(sprite);


 let elapsed = 0.0;
 app.ticker.add((delta) => {
   elapsed += delta;
 });

document.body.appendChild(app.canvas);

window.Application = Application