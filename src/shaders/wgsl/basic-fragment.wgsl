


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
