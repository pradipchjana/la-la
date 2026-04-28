import ParticleSystem from "./ParticleSystem.js";
import Vector from "./Vector.js";

globalThis.onload = () => {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  const firePosition = new Vector(width / 2, height / 2);
  const fireSystem = new ParticleSystem(firePosition, 1, 1000, 10);

  let fruits = [
    { x: 150, y: 200, r: 30 },
    { x: 300, y: 150, r: 30 },
    { x: 500, y: 300, r: 30 },
  ];

  // setInterval(() => {
  //   const x = Math.floor(Math.random() * 500);
  //   const y = Math.floor(Math.random() * 500);
  //   fruits.push({ x, y, r: 30 });
  // }, 1000);

  const hands = new Hands({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });

  hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7,
  });

  const isThumbsUp = (landmarks) => {
    const thumbTip = landmarks[4];
    const thumbIP = landmarks[3];

    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];

    const indexMCP = landmarks[5];
    const middleMCP = landmarks[9];
    const ringMCP = landmarks[13];
    const pinkyMCP = landmarks[17];

    const thumbUp = thumbTip.y < thumbIP.y;

    const fingersFolded = indexTip.y > indexMCP.y &&
      middleTip.y > middleMCP.y &&
      ringTip.y > ringMCP.y &&
      pinkyTip.y > pinkyMCP.y;

    return thumbUp && fingersFolded;
  };

  const isTouchingFruit = (thumb, fruit) => {
    const dx = thumb.x * canvas.width - fruit.x;
    const dy = thumb.y * canvas.height - fruit.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < fruit.r;
  };

  hands.onResults((results) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
    const multiHandLandmarks = results.multiHandLandmarks;

    if (multiHandLandmarks) {
      ctx.fillStyle = "green";
      for (const landmarks of multiHandLandmarks) {
        drawConnectors(ctx, landmarks, HAND_CONNECTIONS);
        drawLandmarks(ctx, landmarks);
      }
    }

    if (multiHandLandmarks && multiHandLandmarks.length === 2) {
      const hand1 = multiHandLandmarks[0][8];
      const hand2 = multiHandLandmarks[1][8];

      const x1 = hand1.x * canvas.width;
      const y1 = hand1.y * canvas.height;
      const x2 = hand2.x * canvas.width;
      const y2 = hand2.y * canvas.height;

      const dx = x1 - x2;
      const dy = y1 - y2;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      fireSystem.position.x = midX;
      fireSystem.position.y = midY;

      fireSystem.size = Math.min(Math.max(distance / 2, 20), 150);
      fireSystem.speed = distance / 150;
      fireSystem.emission = Math.min(Math.floor(distance / 10), 50);
    }
    fireSystem.update();
  });

  const camera = new Camera(video, {
    onFrame: async () => {
      await hands.send({ image: video });
    },
    width: 640,
    height: 480,
  });

  camera.start();
};
