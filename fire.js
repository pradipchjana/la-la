const canvas = document.getElementById("canvas");
export const ctx = canvas.getContext("2d");
ctx.globalCompositeOperation = "lighter";
const width = canvas.width;
const height = canvas.height;
let speed = 0;
let particles = [];
let max = 0;
let size = 20;

const update = (x, y) => {
  for (let i = 0; i < 10; i++) {
    let p = {
      x,
      y,
      xs: (Math.random() * 2 * speed - speed) / 2,
      ys: 0 - Math.random() * 2 * speed,
      life: 0,
    };
    particles.push(p);
  }

  console.log("here", particles[0]);
  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < particles.length; i++) {
    ctx.fillStyle = "rgba(" + (260 - (particles[i].life * 2)) + "," +
      ((particles[i].life * 2) + 50) + "," + (particles[i].life * 2) + "," +
      (((max - particles[i].life) / max) * 0.4) + ")";

    ctx.beginPath();
    ctx.arc(
      particles[i].x,
      particles[i].y,
      (max - particles[i].life) / max * (size / 2) + (size / 2),
      0,
      2 * Math.PI,
    );
    ctx.fill();

    particles[i].x += particles[i].xs;
    particles[i].y += particles[i].ys;

    particles[i].life++;

    if (particles[i].life >= max) {
      particles.splice(i, 1);
      i--;
    }
  }
};

update(width / 2, height / 2);
