class TextureLoader {

  constructor(device, url) {
    this.ready = false;
    this.device = device;
    this.url = url;
  }

  async load() {
    const response = await fetch(this.url);
    const blob = await response.blob();
    const imgBitmap = await createImageBitmap(blob);

    const [width, height] = [imgBitmap.width, imgBitmap.height];
    this.width = width;
    this.height = height;
  
    const texture = this.device.createTexture({
      size: { width, height, depth: 1 },
      format: 'rgba8unorm',
      usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.SAMPLED,
    });
  
    device.queue.copyImageBitmapToTexture(
      { imageBitmap: imgBitmap },
      { texture },
      { width, height, depth: 1 }
    );

    return texture;
  }

}

export default TextureLoader;