import TextureLoader from "./TextureLoader.js";

const BIND_GROUP_LAYOUT = {
  entries: [
    // texture
    {
      binding: 0,
      visibility: GPUShaderStage.FRAGMENT,
      texture: {
        sampleType: 'float',
      },
    },
    // sampler
    {
      binding: 1,
      visibility: GPUShaderStage.FRAGMENT,
      sampler: {},
    },
  ],
}

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
    this.application = null;
  }

  load(application) {
    this.application = application;
    console.log('Load sprite');
    console.log(this.src);

    this.textureLoader = new TextureLoader(this.src);
    this.textureLoader.load().then(this.onLoad.bind(this));
  }

  onLoad() {
    this.ready = true;
    console.log('sprite onload', this.textureLoader.width, this.textureLoader.height);

    // this.texture = this.textureLoader.toTexture();


  }

  prepare() {
    const device = Application.instance.device;

    const verticies = this.getVertices();
    this.vertexBuffer = device.createBuffer({
      label: "Sprite vertices",
      size: verticies.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(this.vertexBuffer, 0, verticies);

    this.sampler = device.createSampler({
      magFilter: 'linear',
      minFilter: 'linear',
    });

    this.bindGroupLayout = device.createBindGroupLayout(BIND_GROUP_LAYOUT);

    const texture = this.textureLoader.toTexture();

    this.bindGroup = device.createBindGroup({
      layout: this.bindGroupLayout,
      entries: [
        { binding: 0, resource: texture.createView() },
        { binding: 1, resource: this.sampler },
      ],
    });

  }

  getVertices() {
    return new Float32Array([
      // tri 1 - bottom left
      0, 0, 0, 0,   // Position (x, y) + UV (u, v)
      0, this.textureLoader.height, 0, 1,
      this.textureLoader.width, 0, 1, 0,

      // tri 2 - top right
      0, this.textureLoader.height, 0, 1,
      this.textureLoader.width, this.textureLoader.height, 1, 1,
      this.textureLoader.width, 0, 1, 0
    ]);
  }

}

export default Sprite;