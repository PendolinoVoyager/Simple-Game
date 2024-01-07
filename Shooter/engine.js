import AttackEntity from './attackEntity.js';

/**
 * Updates positions of entities
 * @param {Array} entities
 */
export const calculateNewPositions = function (entities, player) {
  if (!entities.length) return;
  entities.forEach((entity) => {
    entity.position.x += entity.velocity.x - player.velocity.x;
    entity.position.y += entity.velocity.y - player.velocity.y;
  });
};

const directionChangeThreshold = 10;

export const followPlayer = function (entity, player) {
  // Check for horizontal movement with threshold
  if (
    Math.abs(entity.position.x - player.position.x) > directionChangeThreshold
  ) {
    if (entity.position.x < player.position.x) entity.velocity.x = entity.speed;
    else entity.velocity.x = -entity.speed;
  }

  // Check for vertical movement with threshold
  if (
    Math.abs(entity.position.y - player.position.y) > directionChangeThreshold
  ) {
    if (entity.position.y < player.position.y) entity.velocity.y = entity.speed;
    else entity.velocity.y = -entity.speed;
  }
};

export const calculatePlayerVelocity = function (player) {
  // Horizontal movement
  let desiredVelocityX = 0;
  if (player.keys.left) desiredVelocityX -= player.speed;
  if (player.keys.right) desiredVelocityX += player.speed;

  // Vertical movement
  let desiredVelocityY = 0;
  if (player.keys.up) desiredVelocityY -= player.speed;
  if (player.keys.down) desiredVelocityY += player.speed;

  // Normalize the velocity vector if moving diagonally

  // Smooth transition (optional)
  // You can adjust the rate of change to control the acceleration/deceleration
  const rateOfChange = 0.2; // Adjust this value as needed
  player.velocity.x += (desiredVelocityX - player.velocity.x) * rateOfChange;
  player.velocity.y += (desiredVelocityY - player.velocity.y) * rateOfChange;
};

/**
 *
 * @param {Entity} e1 THIS ENTITY WILL BE PUSHED!
 * @param {*} e2 THIS ENTITY WILL REMAIN STATIONARY
 */
export const calculateCollisions = function (e1, e2) {
  const collisions = { x: 0, y: 0 };

  if (
    e1.position.x + e1.width > e2.position.x &&
    e1.position.x < e2.position.x + e2.width &&
    e1.position.y + e1.height > e2.position.y &&
    e1.position.y < e2.position.y + e2.height
  ) {
    // Calculate overlap on both axes
    const overlapX =
      e1.position.x < e2.position.x
        ? e1.position.x + e1.width - e2.position.x
        : e2.position.x + e2.width - e1.position.x;

    const overlapY =
      e1.position.y < e2.position.y
        ? e1.position.y + e1.height - e2.position.y
        : e2.position.y + e2.height - e1.position.y;

    // Determine the primary axis of collision
    if (overlapX < overlapY) {
      collisions.x = e1.position.x < e2.position.x ? -overlapX : overlapX;
    } else {
      collisions.y = e1.position.y < e2.position.y ? -overlapY : overlapY;
    }
    if (!(e1 instanceof AttackEntity || e2 instanceof AttackEntity))
      _collisionHandler(e1, collisions, e2);
    else {
      _attackHandler(e1, e2);
    }
  }
};
const _attackHandler = function (attack, target) {
  attack.finished = true;
  //Knockback
  target.velocity.x += attack.velocity.x * 5;
  target.velocity.y += attack.velocity.y * 5;
  target.hp -= attack.damage;
  if (target.hp === 0) {
    target.death();
  }
};
/**
 *
 * @param {Entity} e1 THIS ENTITY WILL BE PUSHED
 * @param {Entity} e2 THIS ENTITY WILL REMAIN STATIONARY
 *
 */
const _collisionHandler = function (e1, collisions, e2) {
  e1.velocity.x = e1.velocity.y = 0;
  // Apply collision response only on the axis with a collision
  if (collisions.x !== 0) {
    e1.position.x += collisions.x;
  }
  if (collisions.y !== 0) {
    e1.position.y += collisions.y;
  }
  e2.hp--;
  if (e2.hp === 0) e2.game.gameOver();
};
/**
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {*} player
 * @param {*} e
 * @returns
 */
export const constructAttack = function (ctx, player, e) {
  const attack = new AttackEntity(ctx, player.attackSize, player.attackSize);
  const rect = ctx.canvas.getBoundingClientRect();
  const x = player.position.x;
  const y = player.position.y + player.height / 2;
  attack.position.x = x;
  attack.position.y = y;
  attack.damage = player.damage;
  const pixelStyleOffset =
    ctx.canvas.height / parseInt(ctx.canvas.style.height);
  const dx = (e.clientX - rect.left) * pixelStyleOffset;
  const dy = (e.clientY - rect.top) * pixelStyleOffset;
  attack.target = { x: dx - attack.width / 2, y: dy - attack.height / 2 };

  return attack;
};

export const handleAttackTracking = function (attacks) {
  attacks.forEach((attack) => {
    if (!attack.target) return;

    attack.velocity.x += (attack.target.x - attack.position.x) * attack.accel;
    attack.velocity.y += (attack.target.y - attack.position.y) * attack.accel;
  });
};

export const spawnEntities = async function (game) {
  const skelly = game.createEntity(
    game.ctx.canvas.height / 10,
    game.ctx.canvas.width / 10,
    'skelly'
  );
  skelly.setImage('./assets/skelly.png');
  // await new Promise((resolve) => skellyIMG.addEventListener('load', resolve));
  const coords = _getRandomOffScreenPosition(game.ctx.canvas);
  skelly.setPosition(coords.x, coords.y);
};

function _getRandomOffScreenPosition(canvas) {
  const area = Math.floor(Math.random() * 4); // Random number between 0 and 3
  let x, y;

  switch (area) {
    case 0: // Above canvas
      x = Math.random() * canvas.width;
      y = -Math.random() * 120; // Adjust 100 to how far off-screen you want
      break;
    case 1: // Below canvas
      x = Math.random() * canvas.width;
      y = canvas.height + Math.random() * 120;
      break;
    case 2: // Left of canvas
      x = -Math.random() * 120;
      y = Math.random() * canvas.height;
      break;
    case 3: // Right of canvas
      x = canvas.width + Math.random() * 120;
      y = Math.random() * canvas.height;
      break;
  }

  return { x, y };
}
