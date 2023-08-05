import TextureLoader from "./TextureLoader.js";

const BIND_GROUP_LAYOUT = {
  entries: [
    {
      binding: 0,
      visibility: GPUShaderStage.FRAGMENT,
      texture: {
        sampleType: 'float',
      },
    },
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


    // const verticies = this.getVertices();

    // const vertexBuffer = this.device.createBuffer({
    //   label: "Sprite vertices",
    //   size: verticies.byteLength,
    //   usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    // });
    // this.stage.application.device.queue.writeBuffer(vertexBuffer, 0, verticies);

  }

  prepare() {
    const device = Application.instance.device;

    // Assuming you've set up a sampler somewhere:
    this.sampler = device.createSampler({
      magFilter: 'linear',
      minFilter: 'linear',
    });

    const bindGroupLayout = device.createBindGroupLayout(BIND_GROUP_LAYOUT);
    this.bindGroup = device.createBindGroup({
      layout: bindGroupLayout,
      entries: [
        { binding: 0, resource: this.textureLoader.toTexture().createView() },
        { binding: 1, resource: this.sampler },
      ],
    });


  }

  getVertices() {
    return new Float32Array([
      // tri 1 - bottom left
      0, 0,
      0, this.textureLoader.height,
      0, this.textureLoader.width,
      // tri 2 - top right
      0, this.textureLoader.height,
      this.textureLoader.width, this.textureLoader.height,
      this.textureLoader.width, 0
    ]);
  }

}

export default Sprite;