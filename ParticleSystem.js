import Particle from "./Particle.js";
import { create_texture } from "./texture.js";
import Vector from "./Vector.js";

export default class ParticleSystem {
  constructor(position, emission, max_count, size = 100, life = 1, speed = 1) {
    this.max_count = max_count;
    this.emission = emission;
    this.particles = [];
    this.speed = speed;
    this.life = life + Math.random();
    this.decay = 0.05;
    this.position = position;
    this.size = size;
    this.color_buffer = document.createElement("canvas");
    this.color_buffer.width = size;
    this.color_buffer.height = size;
    this.textureData = create_texture(this.size);
    this.emit();
  }

  emit() {
    for (let i = 0; i < this.emission; i++) {
      this.add();
    }
  }

  add() {
    if (this.particles.length >= this.max_count) return;

    const angle = Math.random() * Math.PI - Math.PI / 2;
    const speed = new Vector(
      (Math.random() * 2 - 1) * 0.2,
      Math.random() * -1,
    );
    speed.scale(this.speed);
    const position = this.position;
    const life = this.life;
    const decay = this.decay;

    new Particle(this, speed, position, life, decay);
  }

  update() {
    this.emit();
    this.particles = this.particles.filter((p) => p.life > 0);
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
    }
  }
}
