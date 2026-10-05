/**
 * Abhishek Vira - Main Game Engine
 * Orchestrates the canvas render loop, camera viewport, depth-sorting,
 * proximity HUD, mobile touch D-Pad, and input dispatching.
 */

import { WorldMap, WORLD_WIDTH, WORLD_HEIGHT } from './map.js';
import { Player } from './player.js';
import { sprites } from './sprites.js';
import { sound } from './sound.js';
import { NavigationManager } from './navigation.js';

export class Game {
  constructor() {
    this.canvas = document.getElementById('world-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    // Viewport dimensions
    this.viewW = 640;
    this.viewH = 400;

    // Camera position (top-left of viewport in world coordinates)
    this.camX = 0;
    this.camY = 0;

    // Core systems
    this.map = new WorldMap();
    this.player = new Player(24 * 32, 19 * 32);
    this.navManager = new NavigationManager(this);
    window.navManager = this.navManager; // Global reference for inline event handlers

    // Proximity state
    this.currentPrompt = null;
    this.promptElement = document.getElementById('proximity-prompt');
    this.welcomeBanner = document.getElementById('welcome-banner');

    this.lastTime = performance.now();
    this.firstMoveRecorded = false;

    this.initCanvasSize();
    this.initMouseInput();
    this.initMobileControls();
    this.initEnterInteraction();

    // Start game loop
    requestAnimationFrame(this.loop.bind(this));

    // Welcome banner auto-dismiss
    setTimeout(() => {
      if (this.welcomeBanner) {
        this.welcomeBanner.classList.add('fade-out');
      }
    }, 6000);
  }

  initCanvasSize() {
    const resize = () => {
      const container = document.getElementById('map-viewport');
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      // Base game resolution (keep pixel aspect ratio crisp)
      const aspect = rect.width / rect.height;
      if (aspect > 1.4) {
        this.viewW = 640;
        this.viewH = Math.round(640 / aspect);
      } else {
        this.viewW = Math.round(440 * aspect);
        this.viewH = 440;
      }

      this.canvas.width = this.viewW;
      this.canvas.height = this.viewH;
      this.ctx.imageSmoothingEnabled = false;
    };

    window.addEventListener('resize', resize);
    resize();
  }

  initMouseInput() {
    this.canvas.addEventListener('click', (e) => {
      if (this.navManager.currentView !== 'map') return;

      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.viewW / rect.width;
      const scaleY = this.viewH / rect.height;

      const clickScreenX = (e.clientX - rect.left) * scaleX;
      const clickScreenY = (e.clientY - rect.top) * scaleY;

      const worldX = clickScreenX + this.camX;
      const worldY = clickScreenY + this.camY;

      // Check if clicked directly on an NPC
      const clickedNPC = this.map.npcs.find(npc => {
        return (
          worldX >= npc.x &&
          worldX <= npc.x + npc.w &&
          worldY >= npc.y &&
          worldY <= npc.y + npc.h
        );
      });

      if (clickedNPC) {
        const dist = Math.hypot(this.player.x - (clickedNPC.x + clickedNPC.w / 2), this.player.y - (clickedNPC.y + clickedNPC.h / 2));
        if (dist <= 60) {
          this.navManager.showNPCDialogue(clickedNPC);
          return;
        }
      }

      // Check if clicked on a Landmark building
      const clickedLandmark = this.map.landmarks.find(lm => {
        return (
          worldX >= lm.x &&
          worldX <= lm.x + lm.w &&
          worldY >= lm.y &&
          worldY <= lm.y + lm.h
        );
      });

      if (clickedLandmark) {
        const dist = Math.hypot(this.player.x - clickedLandmark.doorX, this.player.y - clickedLandmark.doorY);
        if (dist <= clickedLandmark.doorRadius + 20) {
          // Enter directly if already close
          this.navManager.navigateTo(clickedLandmark.id);
          return;
        } else {
          // Walk toward door
          this.player.moveTo(clickedLandmark.doorX, clickedLandmark.doorY);
          return;
        }
      }

      // Default: Walk to clicked world coordinates
      this.player.moveTo(worldX, worldY);
      this.onFirstMovement();
    });
  }

  initMobileControls() {
    const bindBtn = (id, dir) => {
      const el = document.getElementById(id);
      if (!el) return;

      const start = (e) => {
        e.preventDefault();
        this.player.setVirtualInput(dir, true);
        this.onFirstMovement();
      };
      const end = (e) => {
        e.preventDefault();
        this.player.setVirtualInput(dir, false);
      };

      el.addEventListener('touchstart', start, { passive: false });
      el.addEventListener('touchend', end, { passive: false });
      el.addEventListener('touchcancel', end, { passive: false });
      el.addEventListener('mousedown', start);
      el.addEventListener('mouseup', end);
      el.addEventListener('mouseleave', end);
    };

    bindBtn('dpad-up', 'up');
    bindBtn('dpad-down', 'down');
    bindBtn('dpad-left', 'left');
    bindBtn('dpad-right', 'right');

    // Action A Button (Enter / Interact)
    const btnA = document.getElementById('dpad-a');
    if (btnA) {
      btnA.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.triggerCurrentAction();
      }, { passive: false });
      btnA.addEventListener('click', () => {
        this.triggerCurrentAction();
      });
    }
  }

  initEnterInteraction() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (this.navManager.currentView !== 'map') return;

      if (e.key === 'Enter' || e.key === ' ' || e.key.toLowerCase() === 'e') {
        this.triggerCurrentAction();
      }
    });

    // Clicking the proximity HUD banner enters the building
    if (this.promptElement) {
      this.promptElement.addEventListener('click', () => {
        this.triggerCurrentAction();
      });
    }
  }

  triggerCurrentAction() {
    if (this.currentPrompt) {
      if (this.currentPrompt.type === 'landmark') {
        this.navManager.navigateTo(this.currentPrompt.data.id);
      } else if (this.currentPrompt.type === 'npc') {
        this.navManager.showNPCDialogue(this.currentPrompt.data);
      }
    }
  }

  onFirstMovement() {
    if (!this.firstMoveRecorded) {
      this.firstMoveRecorded = true;
      if (this.welcomeBanner) {
        this.welcomeBanner.classList.add('fade-out');
      }
    }
  }

  update(dt) {
    if (this.navManager.currentView !== 'map') return;

    this.player.update(dt, this.map);
    this.map.update(dt);

    if (this.player.isMoving) {
      this.onFirstMovement();
    }

    // Camera smoothly follows player
    const targetCamX = this.player.x - this.viewW / 2;
    const targetCamY = this.player.y - this.viewH / 2;

    this.camX += (targetCamX - this.camX) * 0.15;
    this.camY += (targetCamY - this.camY) * 0.15;

    // Clamp camera within world bounds
    this.camX = Math.max(0, Math.min(WORLD_WIDTH - this.viewW, this.camX));
    this.camY = Math.max(0, Math.min(WORLD_HEIGHT - this.viewH, this.camY));

    // Check Landmark proximity
    const nearLandmark = this.map.getNearbyLandmark(this.player.x, this.player.y);
    const nearNPC = this.map.getNearbyNPC(this.player.x, this.player.y);

    if (nearLandmark) {
      this.currentPrompt = { type: 'landmark', data: nearLandmark };
      this.showPrompt(`${nearLandmark.icon} ${nearLandmark.prompt} [ENTER]`);
    } else if (nearNPC) {
      this.currentPrompt = { type: 'npc', data: nearNPC };
      const npcIcon = nearNPC.type === 'dog' ? '🐕' : '🦆';
      this.showPrompt(`${npcIcon} TALK TO ${nearNPC.name.toUpperCase()} [ENTER]`);
    } else {
      this.currentPrompt = null;
      this.hidePrompt();
    }
  }

  showPrompt(text) {
    if (this.promptElement) {
      this.promptElement.textContent = text;
      this.promptElement.classList.remove('hidden');
    }
  }

  hidePrompt() {
    if (this.promptElement) {
      this.promptElement.classList.add('hidden');
    }
  }

  render() {
    if (this.navManager.currentView !== 'map') return;

    this.ctx.clearRect(0, 0, this.viewW, this.viewH);

    this.ctx.save();
    // Offset context by camera position
    this.ctx.translate(-Math.floor(this.camX), -Math.floor(this.camY));

    // 1. Pass: Ground tiles & Paths
    this.map.renderGround(this.ctx, this.camX, this.camY, this.viewW, this.viewH);

    // 2. Pass: Door mats / entrance glow
    this.map.renderDoorMats(this.ctx);

    // 3. Pass: Y-sorted Renderables (Buildings, Trees, Lamps, Player, NPCs)
    const renderList = [];

    // Add Player
    renderList.push({
      ySort: this.player.y,
      render: () => this.player.render(this.ctx)
    });

    // Add NPCs
    this.map.npcs.forEach(npc => {
      renderList.push({
        ySort: npc.y + npc.h,
        render: () => {
          const spriteList = (npc.type === 'dog') ? sprites.sprites.dog : sprites.sprites.duck;
          const s = spriteList[npc.animFrame];
          if (s) {
            this.ctx.drawImage(s, Math.floor(npc.x), Math.floor(npc.y));
          }
        }
      });
    });

    // Add Landmark Buildings
    this.map.landmarks.forEach(lm => {
      renderList.push({
        ySort: lm.y + lm.h,
        render: () => {
          const bSprite = sprites.buildings[lm.spriteKey];
          if (bSprite) {
            // Draw building shadow
            this.ctx.fillStyle = 'rgba(0,0,0,0.2)';
            this.ctx.fillRect(lm.x + 6, lm.y + lm.h - 6, lm.w - 12, 6);

            // Draw building
            this.ctx.drawImage(bSprite, lm.x, lm.y);

            // Building Name Sign Header (8-bit label over roof)
            this.ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            this.ctx.fillRect(lm.x + lm.w / 2 - 44, lm.y - 14, 88, 14);
            this.ctx.fillStyle = lm.color;
            this.ctx.font = '8px "Press Start 2P", monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(lm.name, lm.x + lm.w / 2, lm.y - 4);
          }
        }
      });
    });

    // Add Environment Objects (Trees, Lamps, Signs)
    this.map.environmentObjects.forEach(obj => {
      renderList.push({
        ySort: obj.ySort,
        render: () => {
          const s = sprites.decorations[obj.type];
          if (s) {
            this.ctx.drawImage(s, obj.x, obj.y);
          }
        }
      });
    });

    // Sort by Y position for proper 2.5D depth
    renderList.sort((a, b) => a.ySort - b.ySort);
    renderList.forEach(item => item.render());

    // 4. Pass: Floating Particles (smoke, music notes)
    this.map.renderParticles(this.ctx);

    this.ctx.restore();
  }

  loop(timestamp) {
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    this.update(dt);
    this.render();

    requestAnimationFrame(this.loop.bind(this));
  }
}

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.game = new Game();
});
