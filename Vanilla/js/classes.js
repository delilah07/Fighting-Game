import { canvas, ctx, gravity } from '../script.js';

export class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    frameCurrent = 0,
    framesElapsed = 0,
    frameHold = 7,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.frameCurrent = frameCurrent;
    this.framesElapsed = framesElapsed;
    this.frameHold = frameHold;
    this.offset = offset;
  }
  draw() {
    ctx.drawImage(
      this.image,
      this.frameCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }
  animFrames() {
    this.framesElapsed++;

    if (this.framesElapsed % this.frameHold === 0) {
      this.frameCurrent < this.framesMax - 1
        ? this.frameCurrent++
        : (this.frameCurrent = 0);
    }
  }
  update() {
    this.draw();
    this.animFrames();
  }
}

export class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    width = 50,
    height = 150,
    color = 'red',
    // offset,
    imageSrc,
    scale = 1,
    framesMax = 1,
    frameCurrent = 0,
    framesElapsed = 0,
    frameHold = 7,
    offset = { x: 0, y: 0 },
    sprites,
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      frameCurrent,
      framesElapsed,
      frameHold,
      offset,
    });
    this.color = color;
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
    this.sprites = sprites;

    for (const sprite in sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }
  //   draw() {
  //     ctx.fillStyle = this.color;
  //     ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

  //     //attack box
  //     if (this.isAttaking) {
  //       ctx.fillStyle = 'green';
  //       ctx.fillRect(
  //         this.attackBox.position.x,
  //         this.attackBox.position.y,
  //         this.attackBox.width,
  //         this.attackBox.height
  //       );
  //     }
  //   }
  update() {
    this.draw();
    this.animFrames();

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    this.position.x += this.velocity.x;

    //gravity
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
      this.position.y = 330;
    } else this.velocity.y += gravity;
  }

  attack() {
    this.isAttaking = true;
    setTimeout(() => {
      this.isAttaking = false;
    }, 200);
  }
  swithSprite(sprite) {
    switch (sprite) {
      case 'idle':
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.frameCurrent = 0;
        }
        break;
      case 'run':
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.frameCurrent = 0;
        }
        break;
      case 'jump':
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.frameCurrent = 0;
        }
        break;
      case 'fall':
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.frameCurrent = 0;
        }
        break;
    }
  }
}
