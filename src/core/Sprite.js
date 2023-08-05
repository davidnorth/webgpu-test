import TextureLoader from "./TextureLoader.js";

const VERTEX_BUFFER_LAYOUT = {
  arrayStride: 16,  // 2 floats per vertex position + 2 floats for UV. 4 bytes per float
  attributes: [
    {
      shaderLocation: 0,
      offset: 0,
      format: "float32x2",
    },
    {
      shaderLocation: 1,
      offset: 8,
      format: "float32x2",
    }
  ],
};

class Sprite {

  constructor ({src}) {
    this.src = src;
    this.ready = false;
    this.vertexBufferLayout = VERTEX_BUFFER_LAYOUT;
  }

  load(device) {
    console.log('Load sprite');
    console.log('device: ', device);
    console.log(this.src);
    this.device = device;
    this.textureLoader = new TextureLoader(this.device, this.src);
    this.textureLoader.load().then(this.onLoad.bind(this));
  }

  onLoad(texture) {
    this.texture = texture;
    this.width = this.textureLoader.width;
    this.height = this.textureLoader.height;

    console.log('sprite onload', this.width, this.height);
    console.log(texture);

    const verticies = this.getVertices();
    const vertexBuffer = this.device.createBuffer({
      label: "Sprite vertices",
      size: verticies.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    this.stage.application.device.queue.writeBuffer(vertexBuffer, 0, verticies);
    this.ready = true;
  }

  getVertices() {
    return new Float32Array([
      // tri 1 - bottom left
      0,0,
      0,this.height,
      0,this.width,
      // tri 2 - top right
      0, this.height, 
      this.width, this.height,
      this.width, 0
    ]);
  }

}

export default Sprite;