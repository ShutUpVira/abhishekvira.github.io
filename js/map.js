/**
 * Abhishek Vira - 8-Bit World Map Engine
 * Handles 2D tile layout, building coordinates, collision grid,
 * Y-sorted entity rendering, particle systems, and proximity detection.
 */

import { sprites } from './sprites.js';

export const TILE_SIZE = 32;
export const MAP_COLS = 48;
export const MAP_ROWS = 36;
export const WORLD_WIDTH = MAP_COLS * TILE_SIZE; // 1536px
export const WORLD_HEIGHT = MAP_ROWS * TILE_SIZE; // 1152px

// Tile type definitions
export const TILE = {
  GRASS: 0,
  GRASS_FLOWERS: 1,
  PATH: 2,
  WATER: 3,
  BRIDGE: 4
};

export class WorldMap {
  constructor() {
    this.cols = MAP_COLS;
    this.rows = MAP_ROWS;
    this.grid = [];
    this.collisionGrid = [];
    this.waterAnimFrame = 0;
    this.waterTimer = 0;
    this.particles = [];
    this.landmarks = [];
    this.npcs = [];
    this.environmentObjects = [];

    this.initMap();
    this.initLandmarks();
    this.initNPCs();
    this.initEnvironment();
  }

  initMap() {
    // 1. Initialize base grass
    for (let y = 0; y < this.rows; y++) {
      this.grid[y] = [];
      this.collisionGrid[y] = [];
      for (let x = 0; x < this.cols; x++) {
        // Subtle flower patches
        const isFlower = (x + y * 7) % 11 === 0 || (x * 3 + y) % 17 === 0;
        this.grid[y][x] = isFlower ? TILE.GRASS_FLOWERS : TILE.GRASS;
        // Border boundaries are solid
        this.collisionGrid[y][x] = (x === 0 || x >= this.cols - 1 || y === 0 || y >= this.rows - 1);
      }
    }

    // 2. Center Crossroads & Main Avenue Paths
    // Horizontal main street (Y = 18, 19)
    for (let x = 6; x < this.cols - 6; x++) {
      this.grid[18][x] = TILE.PATH;
      this.grid[19][x] = TILE.PATH;
    }
    // Vertical main street (X = 23, 24)
    for (let y = 5; y < this.rows - 5; y++) {
      this.grid[y][23] = TILE.PATH;
      this.grid[y][24] = TILE.PATH;
    }

    // Paths connecting to buildings:
    // To Music House (NW: X = 10, Y = 10)
    for (let y = 13; y <= 18; y++) {
      this.grid[y][11] = TILE.PATH;
      this.grid[y][12] = TILE.PATH;
    }
    for (let x = 11; x <= 23; x++) {
      this.grid[13][x] = TILE.PATH;
    }

    // To The Lab (NE: X = 34, Y = 10)
    for (let y = 13; y <= 18; y++) {
      this.grid[y][35] = TILE.PATH;
      this.grid[y][36] = TILE.PATH;
    }
    for (let x = 24; x <= 36; x++) {
      this.grid[13][x] = TILE.PATH;
    }

    // To Run Club (SW: X = 9, Y = 25)
    for (let y = 19; y <= 26; y++) {
      this.grid[y][11] = TILE.PATH;
      this.grid[y][12] = TILE.PATH;
    }

    // To Me (Loft) (South center: X = 22, Y = 28)
    for (let y = 19; y <= 29; y++) {
      this.grid[y][23] = TILE.PATH;
      this.grid[y][24] = TILE.PATH;
    }

    // To Merch Shop (SE: X = 35, Y = 25)
    for (let y = 19; y <= 26; y++) {
      this.grid[y][36] = TILE.PATH;
      this.grid[y][37] = TILE.PATH;
    }

    // To Services (East: X = 38, Y = 17)
    for (let x = 24; x <= 40; x++) {
      this.grid[18][x] = TILE.PATH;
      this.grid[19][x] = TILE.PATH;
    }

    // 3. Water Pond & Wooden Bridge (West side)
    for (let y = 8; y <= 14; y++) {
      for (let x = 2; x <= 8; x++) {
        // Organic curved pond
        if (!(y === 8 && (x === 2 || x === 8)) && !(y === 14 && (x === 2 || x === 8))) {
          this.grid[y][x] = TILE.WATER;
          this.collisionGrid[y][x] = true;
        }
      }
    }
    // Wooden Bridge across pond at Y = 11
    for (let x = 2; x <= 8; x++) {
      this.grid[11][x] = TILE.BRIDGE;
      this.collisionGrid[11][x] = false; // walkable bridge!
    }

    // Hidden path to secret shrine (North-East grove)
    for (let y = 4; y <= 12; y++) {
      this.grid[y][43] = TILE.PATH;
    }
    for (let x = 36; x <= 43; x++) {
      this.grid[5][x] = TILE.PATH;
    }
  }

  initLandmarks() {
    // Define 6 primary buildings + 1 easter egg secret shrine
    this.landmarks = [
      {
        id: 'music',
        name: 'MUSIC HOUSE',
        subtitle: 'Studio, Tracks & Tour Dates',
        icon: '🎵',
        x: 8 * TILE_SIZE, // 256px
        y: 6 * TILE_SIZE, // 192px
        w: 96,
        h: 96,
        doorX: 8 * TILE_SIZE + 48,
        doorY: 6 * TILE_SIZE + 90,
        doorRadius: 44,
        spriteKey: 'music',
        color: '#9333ea',
        prompt: 'ENTER MUSIC HOUSE'
      },
      {
        id: 'lab',
        name: 'THE LAB',
        subtitle: 'Weird & Useful Builds',
        icon: '💻',
        x: 32 * TILE_SIZE, // 1024px
        y: 6 * TILE_SIZE,
        w: 96,
        h: 96,
        doorX: 32 * TILE_SIZE + 60,
        doorY: 6 * TILE_SIZE + 90,
        doorRadius: 44,
        spriteKey: 'lab',
        color: '#00dfd8',
        prompt: 'ENTER THE LAB'
      },
      {
        id: 'run-club',
        name: 'RUN CLUB',
        subtitle: 'Miles, Community & Coffee',
        icon: '🏃',
        x: 8 * TILE_SIZE,
        y: 22 * TILE_SIZE,
        w: 96,
        h: 96,
        doorX: 8 * TILE_SIZE + 48,
        doorY: 22 * TILE_SIZE + 90,
        doorRadius: 44,
        spriteKey: 'runClub',
        color: '#ea580c',
        prompt: 'ENTER RUN CLUB'
      },
      {
        id: 'merch',
        name: 'MERCH SHOP',
        subtitle: 'Vintage Threads & Vinyl',
        icon: '👕',
        x: 33 * TILE_SIZE,
        y: 22 * TILE_SIZE,
        w: 96,
        h: 96,
        doorX: 33 * TILE_SIZE + 36,
        doorY: 22 * TILE_SIZE + 90,
        doorRadius: 44,
        spriteKey: 'merch',
        color: '#ef4444',
        prompt: 'ENTER MERCH SHOP'
      },
      {
        id: 'services',
        name: 'SERVICES',
        subtitle: 'Growth & Artist Advisory',
        icon: '✦',
        x: 37 * TILE_SIZE,
        y: 14 * TILE_SIZE,
        w: 96,
        h: 96,
        doorX: 37 * TILE_SIZE + 58,
        doorY: 14 * TILE_SIZE + 90,
        doorRadius: 44,
        spriteKey: 'services',
        color: '#f59e0b',
        prompt: 'ENTER SERVICES'
      },
      {
        id: 'about',
        name: 'ME',
        subtitle: 'Abhishek\'s Loft & Bio',
        icon: '👤',
        x: 21 * TILE_SIZE,
        y: 25 * TILE_SIZE,
        w: 96,
        h: 96,
        doorX: 21 * TILE_SIZE + 54,
        doorY: 25 * TILE_SIZE + 90,
        doorRadius: 44,
        spriteKey: 'me',
        color: '#3b82f6',
        prompt: 'VISIT ABHISHEK'
      },
      {
        id: 'secret-shrine',
        name: '??? SECRET SHRINE',
        subtitle: 'A mystical chiptune glade',
        icon: '✨',
        x: 41 * TILE_SIZE,
        y: 2 * TILE_SIZE,
        w: 80,
        h: 80,
        doorX: 41 * TILE_SIZE + 40,
        doorY: 2 * TILE_SIZE + 72,
        doorRadius: 40,
        spriteKey: 'secretShrine',
        color: '#c084fc',
        prompt: 'INSPECT SHRINE'
      }
    ];

    // Mark building footprints as solid in collision grid
    this.landmarks.forEach(lm => {
      const startCol = Math.floor(lm.x / TILE_SIZE);
      const endCol = Math.ceil((lm.x + lm.w) / TILE_SIZE);
      const startRow = Math.floor((lm.y + 24) / TILE_SIZE); // roof allows slight depth
      const endRow = Math.floor((lm.y + lm.h - 8) / TILE_SIZE);

      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c < endCol; c++) {
          if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
            this.collisionGrid[r][c] = true;
          }
        }
      }
    });
  }

  initNPCs() {
    this.npcs = [
      {
        id: 'dog',
        name: 'Buster',
        type: 'dog',
        x: 21 * TILE_SIZE + 10,
        y: 17 * TILE_SIZE + 14,
        w: 24,
        h: 20,
        animFrame: 0,
        animTimer: 0,
        dialogueIndex: 0
      },
      {
        id: 'duck',
        name: 'Philosophical Duck',
        type: 'duck',
        x: 5 * TILE_SIZE + 8,
        y: 12 * TILE_SIZE + 8,
        w: 20,
        h: 16,
        animFrame: 0,
        animTimer: 0,
        dialogueIndex: 0
      }
    ];
  }

  initEnvironment() {
    this.environmentObjects = [];

    // Dense Forest border around map edges
    for (let x = 1; x < this.cols - 1; x += 2) {
      this.addTree(x * TILE_SIZE, 0, (x % 4 === 0) ? 'pine' : 'tree');
      this.addTree(x * TILE_SIZE, (this.rows - 2) * TILE_SIZE, (x % 3 === 0) ? 'pine' : 'tree');
    }
    for (let y = 1; y < this.rows - 2; y += 2) {
      if (y < 8 || y > 14) { // Don't cover pond bridge entrance
        this.addTree(0, y * TILE_SIZE, (y % 4 === 0) ? 'pine' : 'tree');
      }
      this.addTree((this.cols - 2) * TILE_SIZE, y * TILE_SIZE, (y % 3 === 0) ? 'pine' : 'tree');
    }

    // Secret grove shielding the Secret Shrine
    for (let y = 1; y <= 6; y += 2) {
      this.addTree(39 * TILE_SIZE, y * TILE_SIZE, 'tree');
      this.addTree(40 * TILE_SIZE, (y + 1) * TILE_SIZE, 'pine');
    }

    // Street Lanterns at key crossroads
    this.addLamp(21 * TILE_SIZE + 4, 16 * TILE_SIZE);
    this.addLamp(26 * TILE_SIZE + 4, 16 * TILE_SIZE);
    this.addLamp(21 * TILE_SIZE + 4, 21 * TILE_SIZE);
    this.addLamp(26 * TILE_SIZE + 4, 21 * TILE_SIZE);
    this.addLamp(14 * TILE_SIZE, 12 * TILE_SIZE);
    this.addLamp(33 * TILE_SIZE, 12 * TILE_SIZE);

    // Signpost at main intersection
    this.environmentObjects.push({
      type: 'sign',
      x: 25 * TILE_SIZE + 6,
      y: 17 * TILE_SIZE + 4,
      w: 24,
      h: 24,
      ySort: 17 * TILE_SIZE + 24
    });
  }

  addTree(x, y, type = 'tree') {
    const w = type === 'tree' ? 48 : 40;
    const h = type === 'tree' ? 64 : 56;
    this.environmentObjects.push({
      type,
      x,
      y,
      w,
      h,
      ySort: y + h - 6
    });

    // Mark trunk base in collision grid
    const c = Math.floor((x + w / 2) / TILE_SIZE);
    const r = Math.floor((y + h - 8) / TILE_SIZE);
    if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
      this.collisionGrid[r][c] = true;
    }
  }

  addLamp(x, y) {
    this.environmentObjects.push({
      type: 'lamp',
      x,
      y,
      w: 24,
      h: 36,
      ySort: y + 34
    });
  }

  update(dt) {
    // Water animation timer
    this.waterTimer += dt;
    if (this.waterTimer > 0.4) {
      this.waterAnimFrame = (this.waterAnimFrame + 1) % 2;
      this.waterTimer = 0;
    }

    // NPC animations
    this.npcs.forEach(npc => {
      npc.animTimer += dt;
      if (npc.animTimer > 0.35) {
        npc.animFrame = (npc.animFrame + 1) % 2;
        npc.animTimer = 0;
      }
    });

    // Chimney Smoke Particles (Abhishek's Loft at X = 21 * TILE_SIZE + 26, Y = 25 * TILE_SIZE + 4)
    if (Math.random() < 0.15) {
      this.particles.push({
        type: 'smoke',
        x: 21 * TILE_SIZE + 26 + (Math.random() * 4 - 2),
        y: 25 * TILE_SIZE + 6,
        vx: (Math.random() - 0.3) * 8,
        vy: -18 - Math.random() * 10,
        size: 2 + Math.random() * 2,
        alpha: 0.8,
        maxLife: 1.8,
        life: 0
      });
    }

    // Floating Music Notes (Music House at X = 8 * TILE_SIZE + 48, Y = 6 * TILE_SIZE + 10)
    if (Math.random() < 0.08) {
      const notes = ['♪', '♫', '♩'];
      this.particles.push({
        type: 'note',
        char: notes[Math.floor(Math.random() * notes.length)],
        x: 8 * TILE_SIZE + 36 + Math.random() * 24,
        y: 6 * TILE_SIZE + 12,
        vx: (Math.random() - 0.5) * 12,
        vy: -16 - Math.random() * 8,
        alpha: 0.9,
        color: Math.random() > 0.5 ? '#c084fc' : '#00f5d4',
        maxLife: 2.2,
        life: 0
      });
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.alpha = Math.max(0, 1 - p.life / p.maxLife);
      if (p.type === 'smoke') {
        p.size += dt * 1.5;
      }
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      }
    }
  }

  isSolid(worldX, worldY) {
    if (worldX < 0 || worldX >= WORLD_WIDTH || worldY < 0 || worldY >= WORLD_HEIGHT) {
      return true;
    }
    const c = Math.floor(worldX / TILE_SIZE);
    const r = Math.floor(worldY / TILE_SIZE);
    if (r < 0 || r >= this.rows || c < 0 || c >= this.cols) {
      return true;
    }
    return !!this.collisionGrid[r][c];
  }

  getNearbyLandmark(playerX, playerY) {
    for (const lm of this.landmarks) {
      const dx = playerX - lm.doorX;
      const dy = playerY - lm.doorY;
      const dist = Math.hypot(dx, dy);
      if (dist <= lm.doorRadius) {
        return lm;
      }
    }
    return null;
  }

  getNearbyNPC(playerX, playerY) {
    for (const npc of this.npcs) {
      const dx = playerX - (npc.x + npc.w / 2);
      const dy = playerY - (npc.y + npc.h / 2);
      const dist = Math.hypot(dx, dy);
      if (dist <= 36) {
        return npc;
      }
    }
    return null;
  }

  // Draw visible ground tiles (first pass)
  renderGround(ctx, camX, camY, viewW, viewH) {
    const startCol = Math.max(0, Math.floor(camX / TILE_SIZE));
    const endCol = Math.min(this.cols - 1, Math.ceil((camX + viewW) / TILE_SIZE));
    const startRow = Math.max(0, Math.floor(camY / TILE_SIZE));
    const endRow = Math.min(this.rows - 1, Math.ceil((camY + viewH) / TILE_SIZE));

    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const tileType = this.grid[r][c];
        const screenX = c * TILE_SIZE;
        const screenY = r * TILE_SIZE;

        if (tileType === TILE.GRASS) {
          ctx.drawImage(sprites.tiles.grass, screenX, screenY);
        } else if (tileType === TILE.GRASS_FLOWERS) {
          ctx.drawImage(sprites.tiles.grassFlowers, screenX, screenY);
        } else if (tileType === TILE.PATH) {
          ctx.drawImage(sprites.tiles.path, screenX, screenY);
        } else if (tileType === TILE.WATER) {
          ctx.drawImage(sprites.tiles.water[this.waterAnimFrame], screenX, screenY);
        } else if (tileType === TILE.BRIDGE) {
          ctx.drawImage(sprites.tiles.bridge, screenX, screenY);
        }
      }
    }
  }

  // Render ground markings & door mats
  renderDoorMats(ctx) {
    this.landmarks.forEach(lm => {
      // Glow circle at doorway
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.ellipse(lm.doorX, lm.doorY, 16, 8, 0, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // Render particles (smoke, music notes)
  renderParticles(ctx) {
    this.particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      if (p.type === 'smoke') {
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'note') {
        ctx.fillStyle = p.color;
        ctx.font = '14px monospace';
        ctx.fillText(p.char, p.x, p.y);
      }
      ctx.restore();
    });
  }
}
