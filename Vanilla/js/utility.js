import { player, enemy } from '../script.js';
export function rectangularCollision(obj1, obj2) {
  return (
    obj1.attackBox.position.x + obj1.attackBox.width >= obj2.position.x &&
    obj1.attackBox.position.x <= obj2.position.x + obj2.width &&
    player.attackBox.position.y + obj1.attackBox.height >= obj2.position.y &&
    obj1.attackBox.position.y <= obj2.position.y + obj2.height &&
    obj1.isAttaking
  );
}
export function determineWinner({ player, enemy, timerId }) {
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
export let timerId;
export function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector('.canvas__timer span').innerHTML = timer;

    if (timer === 0) {
      determineWinner({ player, enemy, timerId });
    }
  }
}
