import Entity from './entity.js';
import Player from './player.js';
import AttackEntity from './attackEntity.js';
import * as Engine from './engine.js';
import * as Renderer from './renderer.js';
import { renderBackground } from './backgroundRenderer.js';
//////INIT
const canvas = document.getElementById('game');
canvas.width = 320 * 3;
canvas.height = 180 * 3;
const aspectRatio = canvas.width / canvas.height;

///////

class Game {
  /**
   * @type {CanvasRenderingContext2D} ctx
   */
  ctx = canvas.getContext('2d');
  entities = [];
  attacks = [];
  #gameLoopRequest;
  #spawner;
  startTime = Date.now();
  constructor() {
    ['resize', 'load'].forEach((ev) =>
      window.addEventListener(ev, this._resizeCanvas)
    );
    this.player = new Player(
      this.ctx,
      canvas.width / 15 / aspectRatio,
      canvas.width / 15,
      this
    );
    this.player.setPosition(
      (canvas.width - this.player.width) / 2,
      (canvas.height - this.player.height) / 2
    );
    this.player.setImage('./assets/char.webp');
    this.player.addAttackHandler(this._handlePlayerAttack, this);
    this.#spawner = setInterval(() => Engine.spawnEntities(this), 1500);
  }

  gameLoop() {
    if (this.paused) {
      cancelAnimationFrame(this.#gameLoopRequest);
      return;
    }

    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.attacks.forEach((attack) => {
      if (attack.finished) {
        this.attacks.splice(this.attacks.indexOf(attack), 1);
      }
    });
    this.entities.forEach((entity) => {
      if (entity.finished) {
        this.entities.splice(this.entities.indexOf(entity), 1);
      }
    });

    Engine.calculatePlayerVelocity(this.player);
    this.entities.forEach((entity) => {
      Engine.calculateCollisions(entity, this.player);
      Engine.followPlayer(entity, this.player);
    });
    this.attacks.forEach((attack) => {
      this.entities.forEach((entity) =>
        Engine.calculateCollisions(attack, entity)
      );
    });
    Engine.calculateNewPositions(
      [...this.entities, ...this.attacks],
      this.player
    );
    Engine.handleAttackTracking(this.attacks);
    renderBackground(this.ctx, this.player);
    Renderer.render([...this.entities, ...this.attacks], this.player);
    Renderer.renderHP(this.ctx, this.player.hp);
    this.#gameLoopRequest = requestAnimationFrame(this.gameLoop.bind(this));
  }

  createEntity(width, height, name) {
    const newEntity = new Entity(this.ctx, width, height, name);
    this.entities.push(newEntity);
    return newEntity;
  }
  _handlePlayerAttack(e) {
    const attack = Engine.constructAttack(this.ctx, this.player, e);
    attack.setImage('./assets/firebolt.png');
    this.attacks.push(attack);
  }
  _resizeCanvas() {
    // Calculate the available width and height with a margin
    let availableWidth = window.innerWidth * 0.9;
    let availableHeight = window.innerHeight * 0.9;

    // Calculate the width and height while maintaining the aspect ratio
    let newWidth, newHeight;

    if (availableWidth / availableHeight > aspectRatio) {
      // Window is wider than the desired aspect ratio
      newHeight = availableHeight;
      newWidth = newHeight * aspectRatio;
    } else {
      // Window is taller than the desired aspect ratio
      newWidth = availableWidth;
      newHeight = newWidth / aspectRatio;
    }
    // Apply the new width and height to the canvas style
    canvas.style.width = newWidth + 'px';
    canvas.style.height = newHeight + 'px';
  }
  pause() {
    this.paused = true;
    cancelAnimationFrame(this.#gameLoopRequest);
  }
  gameOver() {
    this.paused = true;
    clearInterval(this.#spawner);
    cancelAnimationFrame(this.#gameLoopRequest);
    const score = (Date.now() - this.startTime) / 1000;
    setTimeout(() => Renderer.renderGameOver(this.ctx, score), 100);
  }
}

const game = new Game();

game.gameLoop();
