let backgroundImage = new Image();
backgroundImage.src = './assets/bg.jpg';
await new Promise((resolve) => {
  backgroundImage.addEventListener('load', resolve);
});

let positions = [
  { x: 0, y: 0 }, // Top-left
  { x: backgroundImage.width, y: 0 }, // Top-right
  { x: 0, y: backgroundImage.height }, // Bottom-left
  { x: backgroundImage.width, y: backgroundImage.height }, // Bottom-right
];
function updateBackground(scrollSpeedX, scrollSpeedY) {
  for (let pos of positions) {
    pos.x -= scrollSpeedX;
    pos.y -= scrollSpeedY;

    // Horizontal wrapping
    if (pos.x <= -backgroundImage.width) pos.x += 2 * backgroundImage.width;
    if (pos.x >= backgroundImage.width) pos.x -= 2 * backgroundImage.width;

    // Vertical wrapping
    if (pos.y <= -backgroundImage.height) pos.y += 2 * backgroundImage.height;
    if (pos.y >= backgroundImage.height) pos.y -= 2 * backgroundImage.height;
  }
}

export function renderBackground(ctx, player) {
  updateBackground(player.velocity.x, player.velocity.y);
  for (let pos of positions) {
    ctx.drawImage(backgroundImage, pos.x, pos.y);
  }
}
