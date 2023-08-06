class TextureLoader {

  constructor(url) {
    this.ready = false;
    this.url = url;
  }

  async load() {
    return fetch(this.url)
      .then(response => response.blob())
      .then(blob => createImageBitmap(blob))
      .then((imgBitmap) => {
        this.imgBitmap = imgBitmap;
        this.width = imgBitmap.width;
        this.height = imgBitmap.height;
        return imgBitmap;
      });
  }

  toTexture() {

    if(!this.imgBitmap) throw new Error('Image not loaded')
    const device = Application.instance.device;
    if(!device) throw new Error('Device not ready')

    const [width, height] = [this.imgBitmap.width, this.imgBitmap.height];
    this.width = width;
    this.height = height;

    const texture = device.createTexture({
      size: { width, height },
      format: 'rgba8unorm',
      usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT,
    });

    console.log('imgBitmap', this.imgBitmap);
    console.log('texture', texture);

    device.queue.copyExternalImageToTexture(
      { source: this.imgBitmap },
      { texture },
      [width, height]
    );

    return texture;
  }

}

export default TextureLoader;