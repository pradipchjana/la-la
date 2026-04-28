import { ctx } from "./texture.js";

export default class Particle {
  constructor(system, speed, position, life, decay) {
    this.life = life;
    this.max_life = life;
    this.speed = speed.copy();
    this.decay = decay;
    this.parent = system;
    this.position = position.copy();
    system.particles.push(this);
  }

  draw() {
    const alpha = this.life / this.max_life;
    const pos = this.position;
    const size = this.parent.size;
    const textureData = this.parent.textureData;

    let r = 255, g = 0, b = 0;
    if (alpha > 0.5) {
      const t = (alpha - 0.66) / (1 - 0.66);
      g = 165 + 90 * t;
    } else if (alpha > 0.33) {
      const t = (alpha - 0.33) / (0.66 - 0.33);
      g = 165 * t;
    } else {
      const t = alpha / 0.33;
      r = 50 + 205 * t;
      g = 50 + 205 * t * 0.5;
      b = 50 + 205 * t * 0.5;
    }

    const src = textureData.data.data;
    const recolored = ctx.getImageData(
      pos.x - size / 2,
      pos.y - size / 2,
      size,
      size,
    );
    const dst = recolored.data;

    for (let i = 0; i < src.length; i += 4) {
      const sr = src[i];
      const sg = src[i + 1];
      const sb = src[i + 2];

      const isWhite = (sr + sg + sb) / 3;
      if (isWhite >= 6) {
        dst[i] = r;
        dst[i + 1] = g;
        dst[i + 2] = b;
        dst[i + 3] = 250 * alpha;
      }
    }

    ctx.globalComposition = "destination-over";
    ctx.putImageData(recolored, pos.x - size / 2, pos.y - size / 2);
  }

  add_ficker() {
    this.speed.x += (Math.random() - 0.5) * 0.001;
    this.speed.y += (Math.random() - 0.5) * 0.001;
  }

  update() {
    if (this.life > 0) {
      this.add_ficker();
      this.position.add(this.speed);
      this.draw();
      this.life -= this.decay;
    } else {
      const index = this.particles.indexOf(this);
      if (index !== -1) {
        this.particles.splice(index, 1);
      }
    }
  }
}
