import ParticleSystem from "./ParticleSystem.js";
import Vector from "./Vector.js";

const canvas = document.getElementById("canvas");
export const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;

export const create_texture = (size) => {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = size;
  tempCanvas.height = size;
  const ctx = tempCanvas.getContext("2d");

  const centerX = size / 2;
  const centerY = size / 2;
  const blobCount = 300;

  ctx.fillStyle = "transparent";
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < blobCount; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * size * 0.4;

    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    const radius = 0.6 * size * 0.05;

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(255,255,255,${Math.random() * 0.5 + 0.3})`);
    gradient.addColorStop(1, `rgba(255,255,255,0)`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#fff";
  ctx.arc(centerX, centerY + 2, size * 0.4, 0, Math.PI * 2);
  ctx.fill();

  const image = new Image();
  const data = ctx.getImageData(0, 0, size, size);
  image.src = tempCanvas.toDataURL();

  return { texture: image, data: data };
};

// const position = new Vector(width * 0.5, height * 0.8);
// const particle_system = new ParticleSystem(position, 1, 1000, 10);

// const clearScreen = () => {
//   ctx.clearRect(0, 0, width, height);
// };

// const update = (size) => {
//   clearScreen();
//   ctx.globalAlpha = 1;
//   particle_system.update(size);
//   requestAnimationFrame(update);
// };

// update(60);
