import Entity from './entity.js';
export default class Player extends Entity {
  keys = { up: false, down: false, right: false, left: false };
  speed = 2;
  attackSize = 30;
  damage = 1;
  attackSpeed = 200;
  accelSpeed = 1000;
  attackCooldown = false;
  accelCooldown = false;
  hp = 100;
  score = 0;
  constructor(ctx, width, height, game) {
    super(ctx, width, height, 'player');

    document.addEventListener('keydown', this._keyDownHandler.bind(this));
    document.addEventListener('keyup', this._keyUpHandler.bind(this));
    this.game = game;
  }
  _keyDownHandler(e) {
    if (['w', 'ArrowUp'].includes(e.key)) {
      this.keys.up = true;
    }
    if (['s', 'ArrowDown'].includes(e.key)) {
      this.keys.down = true;
    }
    if (['d', 'ArrowRight'].includes(e.key)) {
      this.keys.right = true;
    }
    if (['a', 'ArrowLeft'].includes(e.key)) {
      this.keys.left = true;
    }
    if (e.key === ' ') {
      this._accelerate();
    }
  }
  _keyUpHandler(e) {
    if (['w', 'ArrowUp'].includes(e.key)) {
      this.keys.up = false;
    }
    if (['s', 'ArrowDown'].includes(e.key)) {
      this.keys.down = false;
    }
    if (['d', 'ArrowRight'].includes(e.key)) {
      this.keys.right = false;
    }
    if (['a', 'ArrowLeft'].includes(e.key)) {
      this.keys.left = false;
    }
  }
  addAttackHandler(handler, game) {
    let isMouseDown = false;
    let lastMousePosition = null;

    // Track mouse movement
    this.ctx.canvas.addEventListener('mousemove', (e) => {
      lastMousePosition = e;
    });

    // Start attack on mouse down
    this.ctx.canvas.addEventListener('mousedown', (e) => {
      if (this.attackCooldown) return;
      isMouseDown = true;
      handler.call(game, e);
      this.attackCooldown = true;
      this.continueAttack = setInterval(() => {
        if (lastMousePosition && isMouseDown) {
          handler.call(game, lastMousePosition);
        }
      }, this.attackSpeed);
    });

    // Stop attack on mouse up
    this.ctx.canvas.addEventListener('mouseup', () => {
      isMouseDown = false;
      clearInterval(this.continueAttack);
      this.attackCooldown = false;
    });

    // Optional: Stop attack if mouse leaves the canvas
    this.ctx.canvas.addEventListener('mouseleave', () => {
      isMouseDown = false;
      clearInterval(this.continueAttack);
      this.attackCooldown = false;
    });
  }
  _accelerate() {
    if (this.accelCooldown) return;
    this.velocity.x *= 20;
    this.velocity.y *= 20;
    this.accelCooldown = true;
    new Promise((resolve) => {
      setTimeout(() => {
        this.accelCooldown = false;
        resolve();
      }, this.accelSpeed);
    });
  }
}
