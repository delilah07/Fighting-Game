import { canvas, ctx, gravity } from '../script.js';

export class Sprite {
  constructor({ position, width = 50, height = 150, imageSrc }) {
    this.position = position;
    // this.width = width;
    // this.height = height;
    this.image = new Image();
    this.image.src = imageSrc;
  }
  draw() {
    ctx.drawImage(this.image, this.position.x, this.position.y);
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  update() {
    this.draw();
  }
}

export class Fighter {
  constructor({
    position,
    velocity,
    width = 50,
    height = 150,
    color = 'red',
    offset,
  }) {
    this.color = color;
    this.position = position;
    this.velocity = velocity;
    this.width = width;
    this.height = height;
    this.lastKey;
    this.attackBox = {
      position: { x: this.position.x, y: this.position.y },
      width: 100,
      height: 50,
      offset,
    };
    this.isAttaking;
    this.health = 100;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

    //attack box
    if (this.isAttaking) {
      ctx.fillStyle = 'green';
      ctx.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }
  update() {
    this.draw();

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    this.position.x += this.velocity.x;

    this.position.y += this.velocity.y;
    this.position.y + this.height + this.velocity.y >= canvas.height - 96
      ? (this.velocity.y = 0)
      : (this.velocity.y += gravity);
  }

  attack() {
    this.isAttaking = true;
    setTimeout(() => {
      this.isAttaking = false;
    }, 200);
  }
}
