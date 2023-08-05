
class Ticker {
  constructor() {
    this.callbacks = [];
    window.requestAnimationFrame(this.update.bind(this));
    this.time = Date.now();
  }

  add(callback) {
    this.callbacks.push(callback);
  }

  update() {
    let delta = Date.now() - this.time;
    this.callbacks.forEach(callback => callback(delta));
    this.time = Date.now();
    window.requestAnimationFrame(this.update.bind(this));
  }
}

export default Ticker;