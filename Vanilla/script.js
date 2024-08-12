const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

ctx.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

class Sprite {
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
    this.position.y + this.height + this.velocity.y >= canvas.height
      ? (this.velocity.y = 0)
      : (this.velocity.y += gravity);
  }

  attack() {
    this.isAttaking = true;
    setTimeout(() => {
      this.isAttaking = false;
    }, 500);
  }
}

const player = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  velocity: { x: 0, y: 10 },
  offset: { x: 0, y: 0 },
});

const enemy = new Sprite({
  position: {
    x: 400,
    y: 100,
  },
  velocity: { x: 0, y: 0 },
  color: 'blue',
  offset: { x: -50, y: 0 },
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

function rectangularCollision(obj1, obj2) {
  return (
    obj1.attackBox.position.x + obj1.attackBox.width >= obj2.position.x &&
    obj1.attackBox.position.x <= obj2.position.x + obj2.width &&
    player.attackBox.position.y + obj1.attackBox.height >= obj2.position.y &&
    obj1.attackBox.position.y <= obj2.position.y + obj2.height &&
    obj1.isAttaking
  );
}
function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  document.querySelector('.canvas__gameOver').style.display = 'block';
  if (player.health === enemy.health) {
    document.querySelector('.canvas__gameOver span').innerHTML = 'Tie';
  } else if (player.health > enemy.health) {
    document.querySelector('.canvas__gameOver span').innerHTML =
      'Player 1 wins';
  } else if (player.health < enemy.health) {
    document.querySelector('.canvas__gameOver span').innerHTML =
      'Player 2 wins';
  }
}
let timer = 60;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector('.canvas__timer span').innerHTML = timer;

    if (timer === 0) {
      determineWinner({ player, enemy, timerId });
    }
  }
}
decreaseTimer();
function animate() {
  window.requestAnimationFrame(animate);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  // player movements
  player.velocity.x = 0;
  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x -= 5;
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x += 5;
  }

  //enemy movements
  enemy.velocity.x = 0;
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x -= 5;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x += 5;
  }

  //detect collision
  if (rectangularCollision(player, enemy)) {
    player.isAttaking = false;
    enemy.health -= 10;
    document.querySelector(
      '.canvas__player2 span'
    ).style.width = `${enemy.health}%`;
    console.log('player hits enemy');
  }
  if (rectangularCollision(enemy, player)) {
    enemy.isAttaking = false;
    player.health -= 10;
    document.querySelector(
      '.canvas__player1 span'
    ).style.width = `${player.health}%`;
    console.log('enemy hits player');
  }

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
