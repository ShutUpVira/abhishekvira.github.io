/**
 * Abhishek Vira - Procedural Pixel Art Sprite Generator
 * Generates crisp 8-bit sprites (player, NPCs, buildings, tiles, environment)
 * on offscreen canvases for blazing-fast 60fps rendering without external asset loading.
 */

// Helper: Create an offscreen canvas
function createPixelCanvas(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  return { canvas, ctx };
}

// Draw a pixel rect on a context
function drawPixel(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
}

// Draw pixel block (scale = 1 or 2)
function drawRect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
}

export class SpriteManager {
  constructor() {
    this.sprites = {};
    this.buildings = {};
    this.tiles = {};
    this.decorations = {};
    this.init();
  }

  init() {
    this.generateTiles();
    this.generatePlayerSprites();
    this.generateNPCSprites();
    this.generateBuildings();
    this.generateEnvironmentSprites();
  }

  // --- 1. TILES (32x32) ---
  generateTiles() {
    // Grass Tile
    const { canvas: grassCanvas, ctx: gCtx } = createPixelCanvas(32, 32);
    gCtx.fillStyle = '#489849'; // Base lush green
    gCtx.fillRect(0, 0, 32, 32);
    // Grass blades and shade
    gCtx.fillStyle = '#3c823d';
    const blades = [
      [3, 5], [4, 6], [12, 18], [13, 19], [22, 8], [23, 9],
      [8, 25], [9, 26], [26, 22], [27, 23], [16, 11], [17, 12]
    ];
    blades.forEach(([x, y]) => {
      gCtx.fillRect(x, y, 2, 2);
    });
    gCtx.fillStyle = '#56ac57'; // Highlight blades
    const highlights = [[5, 4], [14, 17], [24, 7], [10, 24], [28, 21]];
    highlights.forEach(([x, y]) => {
      gCtx.fillRect(x, y, 2, 2);
    });
    this.tiles.grass = grassCanvas;

    // Grass with wildflowers
    const { canvas: flowerCanvas, ctx: fCtx } = createPixelCanvas(32, 32);
    fCtx.drawImage(grassCanvas, 0, 0);
    // Yellow/white flowers
    const flowers = [[8, 8, '#f7d070'], [10, 9, '#ffffff'], [20, 22, '#ff6b8b'], [22, 21, '#ffffff']];
    flowers.forEach(([x, y, c]) => {
      fCtx.fillStyle = c;
      fCtx.fillRect(x, y, 3, 3);
      fCtx.fillStyle = '#ffd166';
      fCtx.fillRect(x + 1, y + 1, 1, 1);
    });
    this.tiles.grassFlowers = flowerCanvas;

    // Cobblestone / Dirt Path Tile
    const { canvas: pathCanvas, ctx: pCtx } = createPixelCanvas(32, 32);
    pCtx.fillStyle = '#dfba87'; // Warm sand/cobble base
    pCtx.fillRect(0, 0, 32, 32);
    // Stone outlines
    pCtx.fillStyle = '#c79f6c';
    pCtx.fillRect(0, 0, 32, 1);
    pCtx.fillRect(0, 16, 32, 1);
    pCtx.fillRect(8, 0, 1, 16);
    pCtx.fillRect(24, 0, 1, 16);
    pCtx.fillRect(16, 16, 1, 16);
    // Stone highlights & pebbles
    pCtx.fillStyle = '#eed6ab';
    pCtx.fillRect(2, 2, 4, 3);
    pCtx.fillRect(10, 2, 5, 3);
    pCtx.fillRect(18, 18, 5, 3);
    pCtx.fillStyle = '#b08754';
    pCtx.fillRect(6, 14, 2, 2);
    pCtx.fillRect(22, 30, 2, 2);
    this.tiles.path = pathCanvas;

    // Water Tile (Animated frame 0 & frame 1)
    this.tiles.water = [];
    for (let f = 0; f < 2; f++) {
      const { canvas: wCanvas, ctx: wCtx } = createPixelCanvas(32, 32);
      wCtx.fillStyle = '#2b75d6'; // Deep retro blue
      wCtx.fillRect(0, 0, 32, 32);
      // Wave crests
      wCtx.fillStyle = '#59a2ff';
      const offset = f * 4;
      wCtx.fillRect((4 + offset) % 32, 6, 8, 2);
      wCtx.fillRect((18 + offset) % 32, 18, 10, 2);
      wCtx.fillRect((8 + offset) % 32, 26, 6, 2);
      // Highlights
      wCtx.fillStyle = '#ffffff';
      wCtx.fillRect((6 + offset) % 32, 6, 2, 1);
      wCtx.fillRect((22 + offset) % 32, 18, 3, 1);
      this.tiles.water.push(wCanvas);
    }

    // Wood Bridge Plank
    const { canvas: bridgeCanvas, ctx: bCtx } = createPixelCanvas(32, 32);
    bCtx.fillStyle = '#8f5728';
    bCtx.fillRect(0, 0, 32, 32);
    bCtx.fillStyle = '#6e3f1a';
    bCtx.fillRect(0, 7, 32, 2);
    bCtx.fillRect(0, 15, 32, 2);
    bCtx.fillRect(0, 23, 32, 2);
    bCtx.fillRect(0, 31, 32, 1);
    bCtx.fillStyle = '#ba7b44';
    bCtx.fillRect(2, 2, 28, 2);
    bCtx.fillRect(2, 10, 28, 2);
    bCtx.fillRect(2, 18, 28, 2);
    bCtx.fillRect(2, 26, 28, 2);
    this.tiles.bridge = bridgeCanvas;
  }

  // --- 2. PLAYER SPRITES (Abhishek - 24x32, 4 directions, 3 frames each) ---
  generatePlayerSprites() {
    this.sprites.player = {
      down: [],
      up: [],
      left: [],
      right: []
    };

    const directions = ['down', 'up', 'left', 'right'];

    directions.forEach(dir => {
      for (let frame = 0; frame < 3; frame++) {
        const { canvas, ctx } = createPixelCanvas(24, 32);

        // Frame offsets for walking bob
        const legOffset = (frame === 1) ? -2 : (frame === 2) ? 2 : 0;
        const bob = (frame === 1 || frame === 2) ? -1 : 0;

        // Shadow under feet
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(12, 30, 8, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Abhishek's palette:
        const skinTone = '#ffcba4';
        const hairColor = '#1f1b24';
        const glassesColor = '#111111';
        const glassesLens = '#00f5d4'; // Cool retro teal sunglasses
        const jacketColor = '#1e3a8a'; // Deep indigo streetwear jacket
        const jacketInner = '#f59e0b'; // Amber yellow tee
        const pantsColor = '#374151'; // Charcoal cargo pants
        const shoesColor = '#ffffff'; // White sneakers
        const shoeAccent = '#ef4444'; // Red sneaker stripe

        const yBase = 4 + bob;

        if (dir === 'down') {
          // Hair
          drawRect(ctx, 7, yBase, 10, 5, hairColor);
          drawRect(ctx, 6, yBase + 2, 2, 5, hairColor);
          drawRect(ctx, 16, yBase + 2, 2, 5, hairColor);
          // Face
          drawRect(ctx, 8, yBase + 4, 8, 7, skinTone);
          // Sunglasses
          drawRect(ctx, 7, yBase + 5, 10, 3, glassesColor);
          drawRect(ctx, 8, yBase + 6, 3, 1, glassesLens);
          drawRect(ctx, 13, yBase + 6, 3, 1, glassesLens);
          // Smile
          drawRect(ctx, 11, yBase + 9, 2, 1, '#b91c1c');

          // Torso / Jacket
          drawRect(ctx, 6, yBase + 11, 12, 9, jacketColor);
          drawRect(ctx, 10, yBase + 11, 4, 8, jacketInner); // Inner shirt
          // Arms
          drawRect(ctx, 4, yBase + 12, 2, 6, jacketColor);
          drawRect(ctx, 18, yBase + 12, 2, 6, jacketColor);
          drawRect(ctx, 4, yBase + 18, 2, 2, skinTone);
          drawRect(ctx, 18, yBase + 18, 2, 2, skinTone);

          // Legs & Shoes
          if (frame === 0) {
            drawRect(ctx, 7, yBase + 20, 4, 6, pantsColor);
            drawRect(ctx, 13, yBase + 20, 4, 6, pantsColor);
            drawRect(ctx, 6, yBase + 26, 5, 3, shoesColor);
            drawRect(ctx, 13, yBase + 26, 5, 3, shoesColor);
            drawRect(ctx, 7, yBase + 26, 3, 1, shoeAccent);
            drawRect(ctx, 14, yBase + 26, 3, 1, shoeAccent);
          } else if (frame === 1) { // Left leg forward
            drawRect(ctx, 6, yBase + 19, 4, 7, pantsColor);
            drawRect(ctx, 14, yBase + 20, 4, 5, pantsColor);
            drawRect(ctx, 5, yBase + 26, 5, 3, shoesColor);
            drawRect(ctx, 14, yBase + 25, 4, 3, shoesColor);
          } else { // Right leg forward
            drawRect(ctx, 6, yBase + 20, 4, 5, pantsColor);
            drawRect(ctx, 14, yBase + 19, 4, 7, pantsColor);
            drawRect(ctx, 6, yBase + 25, 4, 3, shoesColor);
            drawRect(ctx, 14, yBase + 26, 5, 3, shoesColor);
          }
        } else if (dir === 'up') {
          // Back of head & full hair
          drawRect(ctx, 7, yBase, 10, 8, hairColor);
          drawRect(ctx, 6, yBase + 3, 12, 7, hairColor);
          // Neck
          drawRect(ctx, 10, yBase + 10, 4, 2, skinTone);
          // Jacket back
          drawRect(ctx, 6, yBase + 11, 12, 9, jacketColor);
          drawRect(ctx, 9, yBase + 13, 6, 5, '#172554'); // Darker back crease
          // Arms
          drawRect(ctx, 4, yBase + 12, 2, 6, jacketColor);
          drawRect(ctx, 18, yBase + 12, 2, 6, jacketColor);

          // Legs & Shoes
          if (frame === 0) {
            drawRect(ctx, 7, yBase + 20, 4, 6, pantsColor);
            drawRect(ctx, 13, yBase + 20, 4, 6, pantsColor);
            drawRect(ctx, 7, yBase + 26, 4, 3, shoesColor);
            drawRect(ctx, 13, yBase + 26, 4, 3, shoesColor);
          } else if (frame === 1) {
            drawRect(ctx, 6, yBase + 19, 4, 6, pantsColor);
            drawRect(ctx, 14, yBase + 21, 4, 5, pantsColor);
            drawRect(ctx, 6, yBase + 25, 4, 3, shoesColor);
            drawRect(ctx, 14, yBase + 26, 4, 3, shoesColor);
          } else {
            drawRect(ctx, 6, yBase + 21, 4, 5, pantsColor);
            drawRect(ctx, 14, yBase + 19, 4, 6, pantsColor);
            drawRect(ctx, 6, yBase + 26, 4, 3, shoesColor);
            drawRect(ctx, 14, yBase + 25, 4, 3, shoesColor);
          }
        } else if (dir === 'left') {
          // Profile left
          drawRect(ctx, 7, yBase, 8, 5, hairColor);
          drawRect(ctx, 13, yBase + 2, 3, 5, hairColor);
          // Face
          drawRect(ctx, 6, yBase + 4, 6, 7, skinTone);
          // Glasses profile
          drawRect(ctx, 5, yBase + 5, 5, 3, glassesColor);
          drawRect(ctx, 5, yBase + 6, 3, 1, glassesLens);
          // Body
          drawRect(ctx, 7, yBase + 11, 8, 9, jacketColor);
          // Arm swing
          const armX = 9 + legOffset;
          drawRect(ctx, armX, yBase + 12, 3, 6, jacketColor);
          drawRect(ctx, armX, yBase + 18, 3, 2, skinTone);
          // Legs
          drawRect(ctx, 7 - legOffset, yBase + 20, 4, 6, pantsColor);
          drawRect(ctx, 10 + legOffset, yBase + 20, 4, 6, pantsColor);
          drawRect(ctx, 5 - legOffset, yBase + 26, 5, 3, shoesColor);
          drawRect(ctx, 9 + legOffset, yBase + 26, 5, 3, shoesColor);
        } else if (dir === 'right') {
          // Profile right
          drawRect(ctx, 9, yBase, 8, 5, hairColor);
          drawRect(ctx, 8, yBase + 2, 3, 5, hairColor);
          // Face
          drawRect(ctx, 12, yBase + 4, 6, 7, skinTone);
          // Glasses profile
          drawRect(ctx, 14, yBase + 5, 5, 3, glassesColor);
          drawRect(ctx, 16, yBase + 6, 3, 1, glassesLens);
          // Body
          drawRect(ctx, 9, yBase + 11, 8, 9, jacketColor);
          // Arm swing
          const armX = 11 - legOffset;
          drawRect(ctx, armX, yBase + 12, 3, 6, jacketColor);
          drawRect(ctx, armX, yBase + 18, 3, 2, skinTone);
          // Legs
          drawRect(ctx, 13 + legOffset, yBase + 20, 4, 6, pantsColor);
          drawRect(ctx, 9 - legOffset, yBase + 20, 4, 6, pantsColor);
          drawRect(ctx, 14 + legOffset, yBase + 26, 5, 3, shoesColor);
          drawRect(ctx, 10 - legOffset, yBase + 26, 5, 3, shoesColor);
        }

        this.sprites.player[dir].push(canvas);
      }
    });
  }

  // --- 3. NPC SPRITES (Buster the Dog & Duck) ---
  generateNPCSprites() {
    this.sprites.dog = [];
    for (let f = 0; f < 2; f++) {
      const { canvas, ctx } = createPixelCanvas(24, 20);
      // Dog shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.ellipse(12, 18, 8, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      const fur = '#e5a65c';
      const ear = '#b4732b';
      // Body
      drawRect(ctx, 6, 8, 11, 7, fur);
      // Head
      drawRect(ctx, 14, 4, 8, 7, fur);
      // Ears (wagging)
      drawRect(ctx, 13, 2 + f, 3, 5, ear);
      // Snout & Nose
      drawRect(ctx, 20, 7, 3, 3, '#fbe4c7');
      drawRect(ctx, 22, 6, 2, 2, '#222222');
      // Eye
      drawRect(ctx, 17, 5, 2, 2, '#222222');
      // Tail wagging
      if (f === 0) {
        drawRect(ctx, 3, 6, 4, 3, fur);
        drawRect(ctx, 2, 4, 2, 3, ear);
      } else {
        drawRect(ctx, 3, 8, 4, 3, fur);
        drawRect(ctx, 1, 9, 3, 2, ear);
      }
      // Paws
      drawRect(ctx, 7, 15, 3, 4, fur);
      drawRect(ctx, 14, 15, 3, 4, fur);
      this.sprites.dog.push(canvas);
    }

    // Duck
    this.sprites.duck = [];
    for (let f = 0; f < 2; f++) {
      const { canvas, ctx } = createPixelCanvas(20, 16);
      const bob = f === 1 ? -1 : 0;
      // Body
      drawRect(ctx, 4, 7 + bob, 10, 6, '#ffffff');
      // Head
      drawRect(ctx, 12, 3 + bob, 5, 5, '#ffffff');
      // Beak
      drawRect(ctx, 17, 5 + bob, 3, 2, '#f59e0b');
      // Eye
      drawRect(ctx, 14, 4 + bob, 1, 1, '#111111');
      // Wing
      drawRect(ctx, 6, 8 + bob, 5, 3, '#e2e8f0');
      this.sprites.duck.push(canvas);
    }
  }

  // --- 4. BUILDINGS (Detailed 8-bit landmarks, size: 96x96 or 112x96) ---
  generateBuildings() {
    // 1. MUSIC HOUSE (96 x 96)
    const { canvas: musicCanvas, ctx: mCtx } = createPixelCanvas(96, 96);
    // Roof (Synth studio purple tiles)
    drawRect(mCtx, 16, 16, 64, 24, '#6b21a8');
    drawRect(mCtx, 12, 36, 72, 6, '#581c87');
    // Neon music note badge on roof
    drawRect(mCtx, 42, 4, 12, 12, '#111827');
    mCtx.strokeStyle = '#a855f7';
    mCtx.strokeRect(42, 4, 12, 12);
    drawRect(mCtx, 45, 7, 2, 7, '#00f5d4');
    drawRect(mCtx, 50, 6, 2, 6, '#00f5d4');
    drawRect(mCtx, 45, 6, 7, 2, '#00f5d4');
    drawRect(mCtx, 43, 11, 4, 3, '#00f5d4');
    drawRect(mCtx, 48, 10, 4, 3, '#00f5d4');
    // Studio Walls
    drawRect(mCtx, 16, 42, 64, 46, '#f3e8ff');
    // Studio speakers on porch
    drawRect(mCtx, 20, 62, 10, 18, '#1e1b4b');
    drawRect(mCtx, 22, 65, 6, 6, '#312e81');
    drawRect(mCtx, 23, 73, 4, 4, '#4f46e5');
    drawRect(mCtx, 66, 62, 10, 18, '#1e1b4b');
    drawRect(mCtx, 68, 65, 6, 6, '#312e81');
    drawRect(mCtx, 69, 73, 4, 4, '#4f46e5');
    // Doorway
    drawRect(mCtx, 38, 54, 20, 34, '#3b0764');
    drawRect(mCtx, 40, 56, 16, 32, '#581c87');
    drawRect(mCtx, 52, 72, 2, 2, '#facc15'); // Brass handle
    // Windows with equalizer glow
    drawRect(mCtx, 22, 46, 16, 12, '#1f2937');
    drawRect(mCtx, 24, 52, 2, 4, '#22c55e');
    drawRect(mCtx, 28, 49, 2, 7, '#eab308');
    drawRect(mCtx, 32, 48, 2, 8, '#ef4444');
    drawRect(mCtx, 58, 46, 16, 12, '#1f2937');
    drawRect(mCtx, 60, 50, 2, 6, '#22c55e');
    drawRect(mCtx, 64, 48, 2, 8, '#eab308');
    drawRect(mCtx, 68, 53, 2, 3, '#ef4444');
    // Door mat
    drawRect(mCtx, 36, 88, 24, 4, '#9333ea');
    this.buildings.music = musicCanvas;

    // 2. RUN CLUB (96 x 96)
    const { canvas: runCanvas, ctx: rCtx } = createPixelCanvas(96, 96);
    // Green athletic pitched roof
    drawRect(rCtx, 16, 18, 64, 22, '#15803d');
    drawRect(rCtx, 12, 36, 72, 6, '#166534');
    // Running Flag on top pole
    drawRect(rCtx, 47, 2, 2, 16, '#64748b'); // pole
    drawRect(rCtx, 49, 3, 14, 8, '#ea580c'); // orange pennant
    drawRect(rCtx, 51, 5, 8, 4, '#ffffff');
    // Clubhouse Walls (White with orange racing stripe)
    drawRect(rCtx, 16, 42, 64, 46, '#f8fafc');
    drawRect(rCtx, 16, 56, 64, 4, '#ea580c'); // Racing stripe
    // Athletic double doors
    drawRect(rCtx, 38, 54, 20, 34, '#1e293b');
    drawRect(rCtx, 40, 56, 7, 32, '#334155');
    drawRect(rCtx, 49, 56, 7, 32, '#334155');
    drawRect(rCtx, 45, 70, 2, 2, '#ffffff');
    drawRect(rCtx, 51, 70, 2, 2, '#ffffff');
    // Water cooler on porch
    drawRect(rCtx, 22, 66, 8, 14, '#94a3b8');
    drawRect(rCtx, 23, 62, 6, 6, '#38bdf8'); // blue bottle
    // Sneaker icon above door
    drawRect(rCtx, 43, 46, 10, 6, '#ea580c');
    drawRect(rCtx, 45, 48, 6, 2, '#ffffff');
    // Cheerful big windows
    drawRect(rCtx, 66, 60, 14, 14, '#bae6fd');
    drawRect(rCtx, 72, 60, 2, 14, '#ffffff');
    drawRect(rCtx, 66, 66, 14, 2, '#ffffff');
    this.buildings.runClub = runCanvas;

    // 3. THE LAB (96 x 96)
    const { canvas: labCanvas, ctx: lCtx } = createPixelCanvas(96, 96);
    // Industrial flat roof with cyber antenna & satellite dish
    drawRect(lCtx, 14, 24, 68, 16, '#334155');
    drawRect(lCtx, 10, 36, 76, 6, '#1e293b');
    // Blinking Antenna
    drawRect(lCtx, 24, 6, 2, 18, '#94a3b8');
    drawRect(lCtx, 22, 4, 6, 3, '#00f5d4'); // Cyan pulse
    // Solar / Tech panel
    drawRect(lCtx, 56, 16, 20, 8, '#0284c7');
    drawRect(lCtx, 60, 16, 1, 8, '#ffffff');
    drawRect(lCtx, 66, 16, 1, 8, '#ffffff');
    drawRect(lCtx, 71, 16, 1, 8, '#ffffff');
    // Dark steel tech walls
    drawRect(lCtx, 16, 42, 64, 46, '#1e293b');
    // Neon conduits
    drawRect(lCtx, 18, 44, 60, 2, '#00f5d4');
    // Oscilloscope Screen Window (Glowing Green Sine Wave)
    drawRect(lCtx, 22, 50, 22, 16, '#052e16');
    lCtx.strokeStyle = '#22c55e';
    lCtx.lineWidth = 1;
    lCtx.beginPath();
    lCtx.moveTo(23, 58);
    lCtx.lineTo(27, 54);
    lCtx.lineTo(31, 62);
    lCtx.lineTo(35, 53);
    lCtx.lineTo(39, 61);
    lCtx.lineTo(43, 58);
    lCtx.stroke();
    // High-tech sliding door
    drawRect(lCtx, 50, 52, 22, 36, '#0f172a');
    drawRect(lCtx, 52, 54, 8, 34, '#475569');
    drawRect(lCtx, 62, 54, 8, 34, '#475569');
    drawRect(lCtx, 59, 66, 4, 4, '#00f5d4'); // keypad
    this.buildings.lab = labCanvas;

    // 4. MERCH SHOP (96 x 96)
    const { canvas: merchCanvas, ctx: shCtx } = createPixelCanvas(96, 96);
    // Red & Cream striped market awning
    const stripes = ['#dc2626', '#fef2f2'];
    for (let s = 0; s < 8; s++) {
      drawRect(shCtx, 12 + s * 9, 20, 9, 22, stripes[s % 2]);
    }
    drawRect(shCtx, 10, 38, 76, 6, '#b91c1c');
    // Wooden storefront walls
    drawRect(shCtx, 16, 44, 64, 44, '#d97706');
    drawRect(shCtx, 18, 46, 60, 42, '#b45309');
    // Hanging Sign with Hanger / Shirt
    drawRect(shCtx, 24, 48, 14, 10, '#fef3c7');
    drawRect(shCtx, 27, 51, 8, 4, '#b45309');
    // Merch display window with shirt mannequin
    drawRect(shCtx, 56, 52, 18, 22, '#451a03');
    drawRect(shCtx, 60, 56, 10, 12, '#38bdf8'); // Mini blue tee
    // Shop Door
    drawRect(shCtx, 26, 60, 18, 28, '#78350f');
    drawRect(shCtx, 28, 62, 14, 26, '#92400e');
    drawRect(shCtx, 38, 74, 2, 2, '#fef08a');
    this.buildings.merch = merchCanvas;

    // 5. SERVICES (96 x 96)
    const { canvas: servCanvas, ctx: svCtx } = createPixelCanvas(96, 96);
    // Modern architectural roof with ✦ Spark crest
    drawRect(svCtx, 14, 18, 68, 22, '#0f172a');
    drawRect(svCtx, 10, 36, 76, 6, '#334155');
    // Glowing golden ✦ spark crest
    drawRect(svCtx, 44, 6, 8, 8, '#f59e0b');
    drawRect(svCtx, 47, 3, 2, 14, '#fbbf24');
    drawRect(svCtx, 41, 9, 14, 2, '#fbbf24');
    // Sleek glass-brick walls & warm interior glow
    drawRect(svCtx, 16, 42, 64, 46, '#1e293b');
    // Large tinted floor-to-ceiling windows
    drawRect(svCtx, 20, 48, 20, 32, '#0284c7');
    drawRect(svCtx, 22, 50, 16, 28, '#38bdf8');
    drawRect(svCtx, 30, 48, 1, 32, '#ffffff');
    drawRect(svCtx, 20, 64, 20, 1, '#ffffff');
    // Double glass entry doors
    drawRect(svCtx, 46, 50, 26, 38, '#0f172a');
    drawRect(svCtx, 48, 52, 10, 36, '#67e8f9');
    drawRect(svCtx, 60, 52, 10, 36, '#67e8f9');
    drawRect(svCtx, 56, 68, 2, 6, '#f8fafc');
    drawRect(svCtx, 60, 68, 2, 6, '#f8fafc');
    this.buildings.services = servCanvas;

    // 6. ME (Abhishek's Loft / Cabin) (96 x 96)
    const { canvas: meCanvas, ctx: meCtx } = createPixelCanvas(96, 96);
    // Brick chimney on roof
    drawRect(meCtx, 22, 6, 8, 18, '#991b1b');
    drawRect(meCtx, 20, 4, 12, 4, '#7f1d1d');
    // Cozy shingle roof
    drawRect(meCtx, 14, 20, 68, 20, '#b45309');
    drawRect(meCtx, 10, 36, 76, 6, '#92400e');
    // Warm wood plank walls
    drawRect(meCtx, 16, 42, 64, 46, '#d97706');
    for (let p = 0; p < 6; p++) {
      drawRect(meCtx, 16, 46 + p * 7, 64, 1, '#b45309');
    }
    // Warm lit cottage window
    drawRect(meCtx, 22, 50, 16, 16, '#fef08a');
    drawRect(meCtx, 29, 50, 2, 16, '#92400e');
    drawRect(meCtx, 22, 57, 16, 2, '#92400e');
    // Wooden door
    drawRect(meCtx, 46, 52, 18, 36, '#78350f');
    drawRect(meCtx, 48, 54, 14, 34, '#92400e');
    drawRect(meCtx, 58, 68, 2, 2, '#fef08a');
    // Acoustic guitar leaned against porch
    drawRect(meCtx, 68, 54, 3, 22, '#451a03'); // guitar neck
    drawRect(meCtx, 66, 66, 8, 12, '#ca8a04'); // body
    drawRect(meCtx, 69, 70, 2, 4, '#451a03'); // soundhole
    this.buildings.me = meCanvas;

    // 7. SECRET GROVE / MYSTIC SHRINE (Easter Egg) (80 x 80)
    const { canvas: shrineCanvas, ctx: sCtx } = createPixelCanvas(80, 80);
    // Stone circle altar
    sCtx.fillStyle = 'rgba(0,0,0,0.2)';
    sCtx.beginPath();
    sCtx.ellipse(40, 55, 30, 14, 0, 0, Math.PI * 2);
    sCtx.fill();
    // Ancient stone pillars
    drawRect(sCtx, 16, 32, 10, 24, '#64748b');
    drawRect(sCtx, 18, 30, 6, 4, '#94a3b8');
    drawRect(sCtx, 54, 32, 10, 24, '#64748b');
    drawRect(sCtx, 56, 30, 6, 4, '#94a3b8');
    // Glowing amethyst crystal in center
    drawRect(sCtx, 36, 38, 8, 18, '#a855f7');
    drawRect(sCtx, 38, 32, 4, 8, '#c084fc');
    drawRect(sCtx, 39, 28, 2, 5, '#e9d5ff');
    // Runes & moss
    drawRect(sCtx, 18, 44, 6, 2, '#00f5d4');
    drawRect(sCtx, 56, 44, 6, 2, '#00f5d4');
    drawRect(sCtx, 20, 50, 4, 4, '#15803d');
    this.buildings.secretShrine = shrineCanvas;
  }

  // --- 5. ENVIRONMENT (Trees, Lanterns, Rocks, Signs) ---
  generateEnvironmentSprites() {
    // Dense Deciduous Tree (48 x 64)
    const { canvas: treeCanvas, ctx: tCtx } = createPixelCanvas(48, 64);
    // Shadow
    tCtx.fillStyle = 'rgba(0,0,0,0.25)';
    tCtx.beginPath();
    tCtx.ellipse(24, 60, 16, 5, 0, 0, Math.PI * 2);
    tCtx.fill();
    // Trunk
    drawRect(tCtx, 20, 40, 8, 20, '#78350f');
    drawRect(tCtx, 18, 56, 12, 4, '#582407');
    // Foliage canopy (layered round pixel clusters)
    drawRect(tCtx, 8, 14, 32, 30, '#15803d');
    drawRect(tCtx, 12, 8, 24, 36, '#16a34a');
    drawRect(tCtx, 16, 4, 16, 20, '#22c55e');
    // Highlights
    drawRect(tCtx, 14, 12, 6, 6, '#4ade80');
    drawRect(tCtx, 26, 16, 8, 6, '#4ade80');
    drawRect(tCtx, 18, 26, 8, 6, '#4ade80');
    this.decorations.tree = treeCanvas;

    // Pine Tree (40 x 56)
    const { canvas: pineCanvas, ctx: piCtx } = createPixelCanvas(40, 56);
    piCtx.fillStyle = 'rgba(0,0,0,0.25)';
    piCtx.beginPath();
    piCtx.ellipse(20, 52, 12, 4, 0, 0, Math.PI * 2);
    piCtx.fill();
    drawRect(piCtx, 18, 42, 4, 12, '#582407');
    // Triangles
    drawRect(piCtx, 6, 32, 28, 12, '#166534');
    drawRect(piCtx, 10, 20, 20, 14, '#15803d');
    drawRect(piCtx, 14, 8, 12, 14, '#16a34a');
    drawRect(piCtx, 18, 2, 4, 8, '#22c55e');
    this.decorations.pine = pineCanvas;

    // Street Lantern with warm halo (24 x 36)
    const { canvas: lampCanvas, ctx: lCtx } = createPixelCanvas(24, 36);
    drawRect(lCtx, 10, 12, 4, 22, '#334155');
    drawRect(lCtx, 8, 32, 8, 3, '#1e293b');
    drawRect(lCtx, 7, 6, 10, 7, '#0f172a');
    drawRect(lCtx, 8, 8, 8, 6, '#fef08a'); // Warm light
    drawRect(lCtx, 10, 9, 4, 4, '#ffffff');
    this.decorations.lamp = lampCanvas;

    // Signpost (24 x 24)
    const { canvas: signCanvas, ctx: sCtx } = createPixelCanvas(24, 24);
    drawRect(sCtx, 11, 10, 2, 14, '#78350f');
    drawRect(sCtx, 4, 4, 16, 9, '#d97706');
    drawRect(sCtx, 6, 6, 12, 1, '#451a03');
    drawRect(sCtx, 6, 9, 8, 1, '#451a03');
    this.decorations.sign = signCanvas;
  }
}

export const sprites = new SpriteManager();
