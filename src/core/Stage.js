
class Stage {
  constructor(application) {
    this.application = application;
    this.children = [];
  }

  add(sprite) {
    this.children.push(sprite);
    sprite.load(this.application);
  }

  readyToRender() {
    return this.children.every(child => child.ready);
  }

}

export default Stage;