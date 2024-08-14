import { Sprite, Fighter } from './js/classes.js';
import {
  rectangularCollision,
  determineWinner,
  decreaseTimer,
  timerId,
} from './js/utility.js';

export const canvas = document.querySelector('canvas');
export const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

export const gravity = 0.7;

ctx.fillRect(0, 0, canvas.width, canvas.height);

const bg = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: '../assets/background.png',
});

const shop = new Sprite({
  position: {
    x: 620,
    y: 127,
  },
  imageSrc: '../assets/shop.png',
  scale: 2.75,
  framesMax: 6,
});

export const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: { x: 0, y: 10 },
  imageSrc: '../assets/samuraiMack/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: '../assets/samuraiMack/Idle.png',
      framesMax: 8,
    },
    run: {
      imageSrc: '../assets/samuraiMack/Run.png',
      framesMax: 8,
    },
    jump: {
      imageSrc: '../assets/samuraiMack/Jump.png',
      framesMax: 2,
    },
    fall: {
      imageSrc: '../assets/samuraiMack/Fall.png',
      framesMax: 2,
    },
    attack1: {
      imageSrc: '../assets/samuraiMack/Attack1.png',
      framesMax: 6,
    },
    takeHit: {
      imageSrc: '../assets/samuraiMack/TakeHit.png',
      framesMax: 4,
    },
  },
  attackBox: {
    offset: {
      x: 95,
      y: 50,
    },
    width: 160,
    height: 50,
  },
});

export const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: { x: 0, y: 0 },
  color: 'blue',
  imageSrc: '../assets/kenji/Idle.png',
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167,
  },
  sprites: {
    idle: {
      imageSrc: '../assets/kenji/Idle.png',
      framesMax: 4,
    },
    run: {
      imageSrc: '../assets/kenji/Run.png',
      framesMax: 8,
    },
    jump: {
      imageSrc: '../assets/kenji/Jump.png',
      framesMax: 2,
    },
    fall: {
      imageSrc: '../assets/kenji/Fall.png',
      framesMax: 2,
    },
    attack1: {
      imageSrc: '../assets/kenji/Attack1.png',
      framesMax: 4,
    },
    takeHit: {
      imageSrc: '../assets/kenji/TakeHit.png',
      framesMax: 3,
    },
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 160,
    height: 50,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  bg.update();
  shop.update();

  player.update();
  enemy.update();

  // player movements

  player.velocity.x = 0;
  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x -= 5;
    player.swithSprite('run');
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x += 5;
    player.swithSprite('run');
  } else {
    player.swithSprite('idle');
  }

  // player jump
  if (player.velocity.y < 0) {
    player.swithSprite('jump');
  } else if (player.velocity.y > 0) {
    player.swithSprite('fall');
  }

  //enemy movements
  enemy.velocity.x = 0;
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x -= 5;
    enemy.swithSprite('run');
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x += 5;
    enemy.swithSprite('run');
  } else {
    enemy.swithSprite('idle');
  }
  //enemy jump
  if (enemy.velocity.y < 0) {
    enemy.swithSprite('jump');
  } else if (enemy.velocity.y > 0) {
    enemy.swithSprite('fall');
  }

  //detect collision
  if (rectangularCollision(player, enemy) && player.frameCurrent === 4) {
    enemy.takeHit();
    player.isAttaking = false;
    document.querySelector(
      '.canvas__player2 span'
    ).style.width = `${enemy.health}%`;
  }
  if (player.isAttaking && player.frameCurrent === 4) player.isAttaking = false;

  if (rectangularCollision(enemy, player) && enemy.frameCurrent === 2) {
    player.takeHit();
    enemy.isAttaking = false;
    document.querySelector(
      '.canvas__player1 span'
    ).style.width = `${player.health}%`;
  }
  if (enemy.isAttaking && enemy.frameCurrent === 2) enemy.isAttaking = false;

  //end game
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'd':
      keys.d.pressed = true;
      player.lastKey = 'd';
      break;
    case 'a':
      keys.a.pressed = true;
      player.lastKey = 'a';
      break;
    case 'w':
      keys.w.pressed = true;
      player.velocity.y = -20;
      break;
    case 's':
      player.attack();
      break;
    case 'ArrowRight':
      keys.ArrowRight.pressed = true;
      enemy.lastKey = 'ArrowRight';
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = 'ArrowLeft';
      break;
    case 'ArrowUp':
      keys.ArrowUp.pressed = true;
      enemy.velocity.y = -20;
      break;
    case 'ArrowDown':
      enemy.attack();
      break;
  }
});
window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
    case 'w':
      keys.w.pressed = false;
      break;
    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break;
    case 'ArrowUp':
      keys.ArrowUp.pressed = false;
      break;
  }
});
