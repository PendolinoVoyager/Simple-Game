import Entity from './entity.js';
export default class AttackEntity extends Entity {
  finished = false;
  duration = 2000;
  accel = 0.001;
  constructor(ctx, width, height) {
    super(ctx, width, height, 'attack');

    setTimeout(() => (this.finished = true), this.duration);
  }
  handleAttackEnd() {
    this.finished = true;
  }
}
