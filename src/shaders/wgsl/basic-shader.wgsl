// [[block]] struct Uniforms {
//     transform: mat4x4<f32>;
// };

// define the output of the vertex shader which is input for the fragment shader
struct VertexOutput {
    [[builtin(position)]] Position: vec4<f32>;
    [[location(0)]] TexCoords: vec2<f32>;
};

[[binding(0), group(0)]] var<uniform> uniforms: Uniforms;

[[stage(vertex)]]
fn main([[location(0)]] position : vec2<f32>, [[location(1)]] texCoords : vec2<f32>)
       -> VertexOutput {
    // Initialize output struct
    var output: VertexOutput;

    // Transform the position to clip space. We assume the positions are already in clip space, 
    // so no transformation is needed. We're just converting the vec2 to a vec4.
    output.Position = vec4<f32>(position, 0.0, 1.0);

    // Pass the texture coordinates to the fragment shader
    output.TexCoords = texCoords;

    return output;
}



@binding(0) var texture: texture_2d<f32>;
@binding(1) var sampler: sampler;

@input
struct FragmentInput {
  [[location(0)]] texCoords: vec2<f32>;
};

@output
struct FragmentOutput {
  [[location(0)]] color: vec4<f32>;
};

@fragment
fn main(input: FragmentInput) -> FragmentOutput {
    var output: FragmentOutput;
    output.color = texture.sample(sampler, input.texCoords);
    return output;
}