import { mat4, mat3, vec2, vec3 } from 'wgpu-matrix';
import Stage from "./Stage";
import Ticker from "./Ticker";
import basicVertex from "bundle-text:../shaders/wgsl/basic-vertex.wgsl"
import basicFragment from "bundle-text:../shaders/wgsl/basic-fragment.wgsl"

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

    this.ready = true;

    this.elapsed = 0.0;

  }

  update (delta) {
    this.elapsed += delta;

    if(!this.readyToRender()) { return }
    if(!this.prepared) {
      this.stage.prepare();
      this.prepared = true;
      this.createPipeline();
      return;
    }

    const scaleRatio = 2/700; // clip space width / canvas width
    const transformMatrix = mat3.identity();
    mat3.translate(transformMatrix, [100 * scaleRatio, 100 * scaleRatio], transformMatrix)
    mat3.scale(transformMatrix, [scaleRatio, scaleRatio], transformMatrix)
  
    // const transformMatrix = mat3.scaling([scaleRatio, scaleRatio]);

    //  mat3.scaling([scaleRatio, scaleRatio]);
    // mat3.translation([100, 100], transformMatrix);

    this.device.queue.writeBuffer(
      this.stage.children[0].uniformBuffer,
      0,
      transformMatrix.buffer,
      transformMatrix.byteOffset,
      transformMatrix.byteLength
    )

    this.renderPassDescriptor.colorAttachments[0].view = this.context.getCurrentTexture().createView();

    const commandEncoder = this.device.createCommandEncoder();
    const passEncoder = commandEncoder.beginRenderPass(this.renderPassDescriptor);
    passEncoder.setPipeline(this.renderPipeline);

    passEncoder.setBindGroup(0, this.stage.children[0].bindGroup);
    passEncoder.setVertexBuffer(0, this.stage.children[0].vertexBuffer);

    // TODO: don't hard code 6 for vertex count
    passEncoder.draw(6);
    passEncoder.end();
    this.device.queue.submit([commandEncoder.finish()]);


  }

  createPipeline() {
    this.renderPassDescriptor = {
      colorAttachments: [{
          view: undefined, // need to redefine on each frame to avoid destroyed texture error
          clearValue: [0, 0, 0, 1],  // Clear to black. Adjust this value if you want to clear to a different color.
          loadOp: 'clear',
          storeOp: 'store',
      }],
    };

    const basicVertexShaderModule = this.device.createShaderModule({
      label: "Basic shader vertex",
      code: basicVertex
    });

    const basicFragmentShaderModule = this.device.createShaderModule({
      label: "Basic shader fragment",
      code: basicFragment
    });



    const pipelineLayout = this.device.createPipelineLayout({
      bindGroupLayouts: [this.stage.children[0].bindGroupLayout],
    });

    this.renderPipeline = this.device.createRenderPipeline({
      layout: pipelineLayout,
      vertex: {
        module: basicVertexShaderModule,
        entryPoint: 'vertexMain',
        buffers: [this.stage.children[0].vertexBufferLayout],
      },
      fragment: {
        module: basicFragmentShaderModule,
        entryPoint: 'fragmentMain',
        targets: [
          {
            format: navigator.gpu.getPreferredCanvasFormat()
          },
        ],
      },
      primitive: {
        topology: 'triangle-list', 
        // cullMode: 'back',
      },
    });
  }
    



}

export default Application;