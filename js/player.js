/**
 * Abhishek Vira - Player Character Controller
 * Manages player physics, collision resolution, keyboard/mouse/touch inputs,
 * 4-directional animations, and click-to-move navigation.
 */

import { sprites } from './sprites.js';
import { sound } from './sound.js';
import { WORLD_WIDTH, WORLD_HEIGHT } from './map.js';

export class Player {
  constructor(startX = 24 * 32, startY = 18 * 32 + 16) {
    this.x = startX;
    this.y = startY;
    this.w = 24;
    this.h = 32;
    this.speed = 145; // Pixels per second

    this.direction = 'down';
    this.isMoving = false;
    this.animFrame = 0;
    this.animTimer = 0;
    this.stepTimer = 0;

    // Movement targets (mouse / touch)
    this.targetX = null;
    this.targetY = null;

    // Active input states
    this.keys = {
      up: false,
      down: false,
      left: false,
      right: false
    };

    this.virtualDpad = {
      up: false,
      down: false,
      left: false,
      right: false
    };

    this.initKeyboardListeners();
  }

  initKeyboardListeners() {
    window.addEventListener('keydown', (e) => {
      // Don't capture inputs if an input or textarea is active
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      let keyHandled = true;
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          this.keys.up = true;
          this.targetX = null; // Keyboard overrides click target
          this.targetY = null;
          break;
        case 's':
        case 'arrowdown':
          this.keys.down = true;
          this.targetX = null;
          this.targetY = null;
          break;
        case 'a':
        case 'arrowleft':
          this.keys.left = true;
          this.targetX = null;
          this.targetY = null;
          break;
        case 'd':
        case 'arrowright':
          this.keys.right = true;
          this.targetX = null;
          this.targetY = null;
          break;
        default:
          keyHandled = false;
      }
      if (keyHandled && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          this.keys.up = false;
          break;
        case 's':
        case 'arrowdown':
          this.keys.down = false;
          break;
        case 'a':
        case 'arrowleft':
          this.keys.left = false;
          break;
        case 'd':
        case 'arrowright':
          this.keys.right = false;
          break;
      }
    });
  }

  setVirtualInput(dir, isDown) {
    if (this.virtualDpad[dir] !== undefined) {
      this.virtualDpad[dir] = isDown;
      if (isDown) {
        this.targetX = null;
        this.targetY = null;
      }
    }
  }

  moveTo(worldX, worldY) {
    this.targetX = Math.max(16, Math.min(WORLD_WIDTH - 16, worldX));
    this.targetY = Math.max(24, Math.min(WORLD_HEIGHT - 24, worldY));
  }

  stopTarget() {
    this.targetX = null;
    this.targetY = null;
  }

  update(dt, worldMap) {
    let vx = 0;
    let vy = 0;

    // Check keyboard or virtual D-pad
    const up = this.keys.up || this.virtualDpad.up;
    const down = this.keys.down || this.virtualDpad.down;
    const left = this.keys.left || this.virtualDpad.left;
    const right = this.keys.right || this.virtualDpad.right;

    if (up) vy -= 1;
    if (down) vy += 1;
    if (left) vx -= 1;
    if (right) vx += 1;

    // Check click-to-move destination if no keys active
    if (vx === 0 && vy === 0 && this.targetX !== null && this.targetY !== null) {
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 5) {
        vx = dx / dist;
        vy = dy / dist;
      } else {
        this.targetX = null;
        this.targetY = null;
      }
    }

    // Determine movement direction & state
    if (vx !== 0 || vy !== 0) {
      this.isMoving = true;

      // Normalize diagonal velocity
      const mag = Math.hypot(vx, vy);
      const moveX = (vx / mag) * this.speed * dt;
      const moveY = (vy / mag) * this.speed * dt;

      // Update facing direction
      if (Math.abs(vy) > Math.abs(vx)) {
        this.direction = vy > 0 ? 'down' : 'up';
      } else {
        this.direction = vx > 0 ? 'right' : 'left';
      }

      // Try moving X with collision check
      const newX = this.x + moveX;
      if (!this.checkCollision(newX, this.y, worldMap)) {
        this.x = newX;
      } else {
        this.targetX = null; // Stop navigation if wall hit
      }

      // Try moving Y with collision check
      const newY = this.y + moveY;
      if (!this.checkCollision(this.x, newY, worldMap)) {
        this.y = newY;
      } else {
        this.targetY = null;
      }

      // Animation frame step
      this.animTimer += dt;
      if (this.animTimer > 0.16) {
        this.animFrame = (this.animFrame + 1) % 3;
        this.animTimer = 0;
      }

      // Sound step effect
      this.stepTimer += dt;
      if (this.stepTimer > 0.32) {
        sound.playStep();
        this.stepTimer = 0;
      }
    } else {
      this.isMoving = false;
      this.animFrame = 0; // Standing idle frame
      this.animTimer = 0;
      this.stepTimer = 0;
    }
  }

  // Bounding box collision around feet
  checkCollision(x, y, worldMap) {
    const footHalfW = 8;
    const footHalfH = 4;

    const corners = [
      [x - footHalfW, y - footHalfH],
      [x + footHalfW, y - footHalfH],
      [x - footHalfW, y + footHalfH],
      [x + footHalfW, y + footHalfH]
    ];

    for (const [px, py] of corners) {
      if (worldMap.isSolid(px, py)) {
        return true;
      }
    }
    return false;
  }

  render(ctx) {
    const frameIndex = this.isMoving ? (this.animFrame === 0 ? 1 : this.animFrame === 1 ? 0 : 2) : 0;
    const sprite = sprites.sprites.player[this.direction][frameIndex];

    if (sprite) {
      // Draw centered horizontally on (x, y) with feet at (x, y)
      const drawX = Math.floor(this.x - this.w / 2);
      const drawY = Math.floor(this.y - this.h + 2);
      ctx.drawImage(sprite, drawX, drawY);
    }
  }
}
