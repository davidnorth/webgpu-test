import Stage from "./Stage";
import Ticker from "./Ticker";
import basicShader from '../shaders/wgsl/basic-shader.wgsl'

class Application {

  constructor({width, height}) {
    if (Application.instance) {
      return Application.instance;
    }
    Application.instance = this;

    this.ready = false;
    this.view = document.createElement('canvas');
    this.view.width = width;
    this.view.height = height;
    this.width = width;
    this.height = height;

    this.stage = new Stage(this);
    this.ticker = new Ticker();
    this.ticker.add(this.update.bind(this));
    this.initWebGPU();
    this.update();
  }

  // App has to be ready, also all children in the stage
  readyToRender() {
    return this.ready && this.stage.readyToRender();
  }

  async initWebGPU() {
    if (!navigator.gpu) {
      throw new Error("WebGPU not supported on this browser.");
    }
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      throw new Error("No adapter found.");
    }
    this.device = await adapter.requestDevice();
    this.context = this.view.getContext("webgpu");
    this.context.configure({
      device: this.device,
      format: navigator.gpu.getPreferredCanvasFormat(),
    });
    this.commandEncoder = this.device.createCommandEncoder();
    this.ready = true;
  }

  update (delta) {
    if(!this.readyToRender()) return;

    // this.pipeline ||= this.createPipeline();

    // this.commandEncoder.beginRenderPass({ });
  }

  createPipeline() {
    const basicShaderModule = this.device.createShaderModule({
      label: "Cell shader",
      code: basicShader
    });
    return this.device.createRenderPipeline({
      vertex: {
        module: basicShaderModule,
        entryPoint: 'main',
        buffers: [this.stage.children[0].vertexBufferLayout],
      },
      fragment: {
        module: basicShaderModule,
        entryPoint: 'main',
        targets: [
          {
            format: navigator.gpu.getPreferredCanvasFormat()
          },
        ],
      },
      primitive: {
        topology: 'triangle-list', 
      },
    });
  }
    



}

export default Application;