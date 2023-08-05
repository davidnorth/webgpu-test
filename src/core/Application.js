import Stage from "./Stage";
import Ticker from "./Ticker";
import basicShader from "bundle-text:../shaders/wgsl/basic-shader.wgsl"

class Application {

  constructor({width, height}) {
    if (Application.instance) {
      return Application.instance;
    }
    Application.instance = this;

    this.ready = false;
    this.prepared = false;
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = width;
    this.height = height;

    this.stage = new Stage(this);
    this.ticker = new Ticker();
    this.ticker.add(this.update.bind(this));
    this.initGPU();
    this.update();
  }

  // App has to be ready, also all children in the stage
  readyToRender() {
    return this.ready && this.stage.readyToRender();
  }

  async initGPU() {
    if (!navigator.gpu) {
      throw new Error("WebGPU not supported on this browser.");
    }
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      throw new Error("No adapter found.");
    }
    this.device = await adapter.requestDevice();
    this.context = this.canvas.getContext("webgpu");

    // const swapChainFormat = "bgra8unorm"; 
    this.context.configure({
      device: this.device,
      format: navigator.gpu.getPreferredCanvasFormat(),
    });

    this.commandEncoder = this.device.createCommandEncoder();
    this.ready = true;

  }

  update (delta) {
    if(!this.readyToRender()) { return }
    if(!this.prepared) {
      this.stage.prepare();
      this.prepared = true;
      this.pipeline ||= this.createPipeline();
      return;
    }


    // this.commandEncoder.beginRenderPass({ });
  }

  createPipeline() {

    const currentTexture = this.context.getCurrentTexture();


    const renderPassDescriptor = {
      colorAttachments: [{
          view: currentTexture.createView(),
          loadValue: [0, 0, 0, 1],  // Clear to black. Adjust this value if you want to clear to a different color.
          storeOp: 'store'  // This means the result will be stored (not discarded) after rendering.
      }],
    };

    return;
    const basicShaderModule = this.device.createShaderModule({
      label: "Basic shader",
      code: basicShader
    });


    const pipelineLayout = this.device.createPipelineLayout({
      bindGroupLayouts: [this.stage.children[0].bindGroupLayout],
    });

    return this.device.createRenderPipeline({
      layout: pipelineLayout,
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