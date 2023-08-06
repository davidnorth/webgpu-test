// struct Uniforms {
//   modelViewProjectionMatrix : mat4x4<f32>,
// }
// @binding(0) @group(0) var<uniform> uniforms : Uniforms;


struct VertexOutput {
    @builtin(position) Position: vec4<f32>,
    @location(0) TexCoords: vec2<f32>
};


@vertex
fn vertexMain(@location(0) position : vec2<f32>, @location(1) texCoords : vec2<f32>) -> VertexOutput {
    var output: VertexOutput;
    // Transform the position to clip space. We assume the positions are already in clip space, 
    // so no transformation is needed. We're just converting the vec2 to a vec4.
    output.Position = vec4<f32>(position, 0.0, 1.0);
    output.TexCoords = texCoords;
    return output;
}



@group(0) @binding(0) var myTexture: texture_2d<f32>;
@group(0) @binding(1) var mySampler: sampler;

struct FragmentInput {
  @location(0) fragUV: vec2<f32>,
};

@fragment
fn fragmentMain(input: FragmentInput) -> @location(0) vec4<f32> {
    return textureSample(myTexture, mySampler, input.fragUV);
    // return vec4<f32>(1.0, 1.0, 0.0, 1.0);
    // return vec4<f32>(input.fragUV, 1.0, 1.0);
}
