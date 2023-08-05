import basicShader from './wgsl/basic-shader.wgsl';

const basicShaderModule = device.createShaderModule({
  label: "Cell shader",
  code: basicShader
});


export default basicShaderModule;