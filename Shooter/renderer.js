const _renderRect = function (entity, fillStyle) {
  entity.ctx.beginPath();
  entity.ctx.rect(
    entity.position.x,
    entity.position.y,
    entity.width,
    entity.height
  );
  entity.ctx.fillStyle = fillStyle;
  entity.ctx.fill();
  entity.ctx.fillStyle = 'black';
  entity.ctx.fillText(entity.name, entity.position.x, entity.position.y);
  entity.ctx.closePath();
};
function _flipHorizontally(entity, canvasWidth) {
  // Context and entity's center position
  const ctx = entity.ctx;
  const centerX = entity.position.x + entity.width / 2;

  // Translate to the center of the entity
  ctx.translate(centerX, entity.position.y);
  // Flip horizontally
  ctx.scale(-1, 1);
  // Draw the image, considering the width of the entity
  ctx.drawImage(
    entity.image,
    -entity.width / 2,
    0,
    entity.width,
    entity.height
  );

  // Reset transformations
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

const _renderEntity = function (entity) {
  if (!entity.image.src) {
    _renderRect(entity, 'red');

    return;
  }
  if (entity.velocity.x < 0) {
    _flipHorizontally(entity);
  } else {
    entity.ctx.drawImage(
      entity.image,
      entity.position.x,
      entity.position.y,
      entity.width,
      entity.height
    );
  }
};
export const render = function (entities, player) {
  entities.forEach((entity) => _renderEntity(entity));
  _renderEntity(player);
};

export const renderGameOver = function (ctx, text) {
  ctx.beginPath();
  ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fill();
  ctx.fillStyle = 'red';
  ctx.textAlign = 'center';
  ctx.font = '32px arial';

  ctx.fillText(
    `Game over! Score: ${text}`,
    ctx.canvas.width / 2,
    ctx.canvas.height / 2
  );
  ctx.closePath();
};
export const renderHP = function (ctx, hp) {
  ctx.beginPath();
  ctx.rect(ctx.canvas.width / 2 - 200 + hp * 4, 10, 400 - hp * 4, 20);
  ctx.fillStyle = 'black';
  ctx.fill();
  ctx.closePath();
  ctx.beginPath();
  ctx.rect(ctx.canvas.width / 2 - 200, 10, hp * 4, 20);
  ctx.fillStyle = 'red';
  ctx.fill();
  ctx.closePath();
  ctx.stroke();
};
