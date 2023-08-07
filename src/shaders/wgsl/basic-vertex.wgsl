struct Uniforms {
  modelViewProjectionMatrix : mat3x3<f32>,
}
@binding(2) @group(0) var<uniform> uniforms : Uniforms;

struct VertexOutput {
    @builtin(position) Position: vec4<f32>,
    @location(0) TexCoords: vec2<f32>
};

@vertex
fn vertexMain(@location(0) position : vec3<f32>, @location(1) texCoords : vec2<f32>) -> VertexOutput {
    var output: VertexOutput;
    var transformedPosition: vec3<f32>;
    // Transform the position to clip space. We assume the positions are already in clip space, 
    // so no transformation is needed. We're just converting the vec2 to a vec4.
    // output.Position = vec4<f32>(position, 0.0, 1.0);

    transformedPosition = uniforms.modelViewProjectionMatrix * position;

    // Convert the transformed vec3 position to vec4, with w-component set to 1.0
    output.Position = vec4<f32>(transformedPosition, 1.0);

    output.TexCoords = texCoords;
    return output;
}
