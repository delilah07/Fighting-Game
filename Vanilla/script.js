const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

ctx.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.2;

class Sprite {
  constructor({ position, velocity, height = 150 }) {
    this.position = position;
    this.velocity = velocity;
    this.height = height;
  }
  draw() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.position.x, this.position.y, 50, this.height);
  }
  update() {
    this.draw();
    this.position.y += this.velocity.y;

    this.position.y + this.height + this.velocity.y >= canvas.height
      ? (this.velocity.y = 0)
      : (this.velocity.y += gravity);
  }
}
const player = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  velocity: { x: 0, y: 10 },
});

const enemy = new Sprite({
  position: {
    x: 400,
    y: 100,
  },
  velocity: { x: 0, y: 0 },
});

function animate() {
  window.requestAnimationFrame(animate);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();
}

animate();
