# Abhishek Vira — 8-Bit Personal World Portfolio

An interactive 8-bit personal website for Abhishek Vira built from the ground up to feel like entering a retro adventure game disguised as a modern portfolio.

## 🌟 Highlights

- **Interactive 8-Bit Game World**:
  - Procedurally generated crisp pixel art sprites with zero external asset bloat.
  - Multi-directional walking animation for Abhishek (down, up, left, right).
  - 6 landmark buildings: **Music House**, **Run Club**, **The Lab**, **Merch Shop**, **Services**, and **Me (Abhishek's Loft)**.
  - Environmental life: Water animations, chimney smoke puffs, floating music notes, wandering NPC **Buster the Dog** with quirky dialogues, and a hidden **??? Secret Sound Shrine** in the north-east grove!
- **Universal Controls**:
  - **Desktop**: Click-to-move, WASD, and Arrow keys.
  - **Mobile**: Large on-screen retro 4-directional D-Pad and tactile A (Interact) button.
  - **Proximity Prompts**: Visual bouncing prompts (`ENTER [BUILDING] - Press Enter or Click`) when standing near doorways.
  - **Fallback Navigation Bar**: Fixed top header navigation allowing immediate jumping into any section without touching the game controls.
- **Audio Synthesizer (Web Audio API)**:
  - 100% compliant with PRD: **Starts muted by default**, no autoplay.
  - Prominent global toggle (`🔊 SOUND [OFF/ON]`).
  - Synthesized retro SFX: footsteps, happy door jingles, barks, synth previews, and an optional catchy 8-bit ambient adventure track.
- **Modern Responsive Portfolio Content**:
  - **Music**: Discography with live playable synth previews, streaming badges, CRT visualizers, and upcoming tour dates table.
  - **Run Club**: Community manifesto, metrics, upcoming runs with instant RSVP, Strava/WhatsApp community links, and past runs archive.
  - **The Lab**: Showcase of weird and useful creative software builds, plus a **playable 8-step live retro drum machine & sequencer**!
  - **Merch Shop**: Curated apparel & vinyl artifacts with interactive size pickers and purchase flows.
  - **Services**: Strategic growth pillars (Marketing & Growth, Artist Support, Advisory) with an interactive "Let's Talk" contact form.
  - **About (Me)**: Conversational narrative, 8-bit Life Chapters timeline, and current obsessions.

---

## 🚀 Running Locally

Because this website uses zero build tools, zero external runtime libraries, and standard ES6 modules, you can serve it with any local static HTTP server:

### Option 1: Python 3
```bash
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

### Option 2: Node.js `npx serve`
```bash
npx serve .
```

---

## 🌐 Deploying to GitHub Pages

1. Push this directory to your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Abhishek Vira 8-Bit Personal Website"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. In your repository on GitHub, navigate to:
   **Settings** → **Pages**
3. Under **Branch**, select `main` and `/ (root)`, then click **Save**.
4. GitHub Pages will publish the site at `https://<your-username>.github.io/<your-repo-name>/`.

---

## 📂 Project Structure

```
.
├── index.html                  # Accessible root markup, canvas viewport & HUD
├── css/
│   ├── main.css                # Retro typography, header navigation & dialog modals
│   ├── map.css                 # Canvas rendering, proximity alerts & mobile touch D-Pad
│   └── pages.css               # Modern responsive styling for all portfolio sections
├── js/
│   ├── data.js                 # Central content store (shows, releases, runs, projects, merch, bio)
│   ├── sound.js                # Web Audio API 8-bit chiptune synthesizer
│   ├── sprites.js              # Procedural pixel art generation for sprites, tiles, & buildings
│   ├── player.js               # Character movement, physics, and input listeners
│   ├── map.js                  # 2D tile engine, collision matrix, and proximity triggers
│   ├── navigation.js           # View routing, 350ms retro shutter wipe, and content renderers
│   └── game.js                 # Main canvas game loop, camera follow, and interaction dispatch
└── README.md                   # Project documentation
```
