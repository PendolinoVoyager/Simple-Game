export default class Entity {
  position = { x: 0, y: 0 };
  velocity = { x: 0, y: 0 };
  speed = 3;
  hp = 5;
  image = new Image();
  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  constructor(ctx, width, height, name) {
    this.width = width;
    this.height = height;
    this.ctx = ctx;
    this.name = name;
  }

  setPosition(x = this.positionx, y = this.positiony) {
    this.position.x = x;
    this.position.y = y;
  }
  setImage(src) {
    this.image.src = src;
  }
  death() {
    this.finished = true;
  }
}
