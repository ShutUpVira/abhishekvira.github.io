/**
 * Abhishek Vira - Navigation & Content Rendering Engine
 * Manages view routing, 300-500ms retro pixel transitions,
 * dynamic content template injection from data.js, and interactive page widgets.
 */

import {
  SITE_CONFIG,
  MUSIC_DATA,
  RUN_CLUB_DATA,
  BUILDS_DATA,
  MERCH_DATA,
  SERVICES_DATA,
  ABOUT_DATA,
  EASTER_EGGS_DATA
} from './data.js';

import { sound } from './sound.js';

export class NavigationManager {
  constructor(game) {
    this.game = game;
    this.currentView = 'map'; // 'map' or building id
    this.isTransitioning = false;

    // Sequencer state for The Lab demo
    this.sequencerPlaying = false;
    this.sequencerStep = 0;
    this.sequencerTimer = null;
    this.sequencerGrid = [
      [1, 0, 0, 0, 1, 0, 0, 0], // Kick
      [0, 0, 1, 0, 0, 0, 1, 0], // Snare
      [1, 1, 1, 1, 1, 1, 1, 1], // Hi-hat
      [1, 0, 1, 0, 0, 1, 0, 1]  // Synth Lead
    ];

    this.initDOM();
    this.initRouting();
  }

  initDOM() {
    this.transitionOverlay = document.getElementById('pixel-transition');
    this.contentContainer = document.getElementById('content-viewport');
    this.mapContainer = document.getElementById('map-viewport');
    this.hudElement = document.getElementById('game-hud');
    this.navLinks = document.querySelectorAll('.nav-btn');
    this.soundToggleBtn = document.getElementById('sound-toggle-btn');
    this.dialogueModal = document.getElementById('dialogue-modal');

    // Setup Top Sound Toggle Button
    if (this.soundToggleBtn) {
      this.soundToggleBtn.addEventListener('click', () => {
        const isUnmuted = sound.toggleMute();
        this.updateSoundButtonUI(isUnmuted);
      });
    }

    // Setup Header Navigation Links
    this.navLinks.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = btn.dataset.view;
        if (target) {
          this.navigateTo(target);
        }
      });
    });

    // Handle hash change (browser Back / Forward buttons)
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '') || 'map';
      if (hash !== this.currentView) {
        this.navigateTo(hash, false);
      }
    });

    // Close dialogue modal on click or key
    if (this.dialogueModal) {
      this.dialogueModal.addEventListener('click', () => {
        this.closeDialogue();
      });
    }
  }

  updateSoundButtonUI(isUnmuted) {
    if (!this.soundToggleBtn) return;
    if (isUnmuted) {
      this.soundToggleBtn.classList.add('sound-on');
      this.soundToggleBtn.innerHTML = '<span>🔊</span> SOUND [ON]';
    } else {
      this.soundToggleBtn.classList.remove('sound-on');
      this.soundToggleBtn.innerHTML = '<span>🔇</span> SOUND [MUTED]';
    }
  }

  initRouting() {
    // Initial load route from URL hash
    const initialHash = window.location.hash.replace('#', '') || 'map';
    if (initialHash !== 'map') {
      this.navigateTo(initialHash, false);
    } else {
      this.updateActiveNav('map');
    }
  }

  updateActiveNav(viewId) {
    this.navLinks.forEach(link => {
      if (link.dataset.view === viewId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  navigateTo(viewId, updateHistory = true) {
    if (this.isTransitioning) return;
    if (viewId === this.currentView) return;

    this.isTransitioning = true;
    sound.playDoorOpen();

    // Trigger retro pixel transition animation
    this.transitionOverlay.classList.add('transition-active');

    setTimeout(() => {
      if (viewId === 'map') {
        this.showMapView();
      } else {
        this.showContentView(viewId);
      }

      this.currentView = viewId;
      this.updateActiveNav(viewId);
      if (updateHistory) {
        window.location.hash = viewId === 'map' ? '' : viewId;
      }

      // Reverse transition wipe
      setTimeout(() => {
        this.transitionOverlay.classList.remove('transition-active');
        this.isTransitioning = false;
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 180);
    }, 280);
  }

  showMapView() {
    if (this.contentContainer) this.contentContainer.classList.add('hidden');
    if (this.mapContainer) this.mapContainer.classList.remove('hidden');
    if (this.hudElement) this.hudElement.classList.remove('hidden');
    this.stopSequencer();
    sound.startBgm();
  }

  showContentView(viewId) {
    if (this.mapContainer) this.mapContainer.classList.add('hidden');
    if (this.hudElement) this.hudElement.classList.add('hidden');
    if (this.contentContainer) {
      this.contentContainer.classList.remove('hidden');
      this.renderViewContent(viewId);
    }
    sound.stopBgm();
  }

  renderViewContent(viewId) {
    let html = '';
    switch (viewId) {
      case 'music':
        html = this.renderMusicHouse();
        break;
      case 'run-club':
        html = this.renderRunClub();
        break;
      case 'builds':
      case 'lab':
        html = this.renderTheLab();
        break;
      case 'merch':
        html = this.renderMerchShop();
        break;
      case 'services':
        html = this.renderServices();
        break;
      case 'about':
        html = this.renderAbout();
        break;
      case 'secret-shrine':
        html = this.renderSecretShrine();
        break;
      default:
        html = `<div class="content-box"><h2>404 - Location Not Found</h2><button class="back-btn" onclick="window.navManager.navigateTo('map')">← BACK TO THE WORLD</button></div>`;
    }

    this.contentContainer.innerHTML = html;
    this.attachContentViewListeners(viewId);
  }

  // --- CONTENT TEMPLATES ---

  renderMusicHouse() {
    const d = MUSIC_DATA;
    return `
      <div class="content-page music-page">
        <header class="page-header">
          <div class="header-tag">🎵 LOCATION 01 // AUDIO FREQUENCIES</div>
          <h1 class="page-title">${d.title}</h1>
          <p class="page-subtitle">${d.subtitle}</p>
          <button class="back-to-world-btn" onclick="window.navManager.navigateTo('map')">← BACK TO THE WORLD</button>
        </header>

        <!-- Artist Intro -->
        <section class="section-card artist-intro-card">
          <div class="intro-grid">
            <div class="intro-text">
              <span class="badge-pill">ARTIST BIO</span>
              <p class="lead-text">${d.bio}</p>
              <div class="streaming-row">
                ${d.streamingLinks.map(link => `
                  <a href="${link.url}" target="_blank" rel="noopener" class="streaming-chip" style="--chip-color: ${link.color}">
                    <span class="chip-dot"></span> ${link.name} ↗
                  </a>
                `).join('')}
              </div>
            </div>
            <div class="intro-visual">
              <div class="synth-rig-graphic">
                <div class="speaker-cone"></div>
                <div class="cassette-tape">
                  <div class="tape-reel"></div>
                  <div class="tape-reel"></div>
                </div>
                <div class="speaker-cone"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- Releases -->
        <section class="page-section">
          <div class="section-heading">
            <h2>DISCOGRAPHY & RELEASES</h2>
            <span class="section-count">${d.releases.length} RELEASES</span>
          </div>

          <div class="releases-grid">
            ${d.releases.map(rel => `
              <div class="release-card" style="--cover-glow: ${rel.coverColor}">
                <div class="release-cover" style="background: linear-gradient(135deg, ${rel.coverColor}44, #0b0f19); border-color: ${rel.coverColor}">
                  <div class="pixel-vinyl-badge">33 RPM</div>
                  <div class="waveform-bars">
                    <span></span><span></span><span></span><span></span><span></span>
                  </div>
                  <button class="preview-btn" data-pattern='${JSON.stringify(rel.samplePattern)}'>
                    ▶ PREVIEW SYNTH
                  </button>
                </div>
                <div class="release-body">
                  <div class="release-meta">
                    <span class="release-type">${rel.type}</span>
                    <span class="release-year">${rel.year} • ${rel.bpm} BPM</span>
                  </div>
                  <h3 class="release-title">${rel.title}</h3>
                  <p class="release-desc">${rel.description}</p>
                  <ul class="tracklist">
                    ${rel.tracks.map(t => `<li><span class="track-arrow">►</span> ${t}</li>`).join('')}
                  </ul>
                  <a href="${rel.listenUrl}" target="_blank" rel="noopener" class="listen-link-btn">
                    LISTEN ON SPOTIFY ↗
                  </a>
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Live Shows & Tour Dates -->
        <section class="page-section">
          <div class="section-heading">
            <h2>UPCOMING LIVE DATES</h2>
            <span class="section-count">TOUR 2026-2027</span>
          </div>
          <div class="shows-table-wrapper">
            <table class="shows-table">
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>VENUE</th>
                  <th>CITY</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                ${d.upcomingShows.map(show => `
                  <tr>
                    <td class="show-date">${show.date}</td>
                    <td class="show-venue"><strong>${show.venue}</strong></td>
                    <td class="show-city">${show.city}</td>
                    <td><span class="ticket-status-pill">${show.status}</span></td>
                    <td><a href="${show.link}" target="_blank" rel="noopener" class="ticket-btn">TICKETS ↗</a></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </section>

        <!-- Music Videos (CRT Style) -->
        <section class="page-section">
          <div class="section-heading">
            <h2>VISUALIZERS & LIVE SESSIONS</h2>
          </div>
          <div class="crt-videos-grid">
            ${d.musicVideos.map(vid => `
              <div class="crt-monitor-card">
                <div class="crt-screen">
                  <div class="crt-scanlines"></div>
                  <div class="crt-inner-content">
                    <div class="crt-play-icon">▶</div>
                    <div class="crt-tag">${vid.tag}</div>
                    <div class="crt-duration">${vid.duration}</div>
                  </div>
                </div>
                <div class="crt-details">
                  <h4>${vid.title}</h4>
                  <a href="https://youtube.com" target="_blank" rel="noopener" class="crt-link">WATCH ON YOUTUBE ↗</a>
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Past Highlights -->
        <section class="past-shows-strip">
          <h4>SELECTED PAST FESTIVALS & NIGHTS</h4>
          <div class="past-shows-list">
            ${d.pastShows.map(p => `
              <span class="past-show-item">⚡ <strong>${p.venue}</strong> (${p.city}, ${p.date})</span>
            `).join('')}
          </div>
        </section>
      </div>
    `;
  }

  renderRunClub() {
    const d = RUN_CLUB_DATA;
    return `
      <div class="content-page runclub-page">
        <header class="page-header">
          <div class="header-tag">🏃 LOCATION 02 // PACE-FREE CREW</div>
          <h1 class="page-title">${d.title}</h1>
          <p class="page-subtitle">${d.subtitle}</p>
          <button class="back-to-world-btn" onclick="window.navManager.navigateTo('map')">← BACK TO THE WORLD</button>
        </header>

        <!-- Manifesto Card -->
        <section class="section-card run-manifesto-card">
          <div class="manifesto-content">
            <span class="badge-pill orange">OUR PHILOSOPHY</span>
            <p class="lead-text">${d.statement}</p>
            <div class="run-metrics-grid">
              ${d.metrics.map(m => `
                <div class="metric-box">
                  <div class="metric-val">${m.value}</div>
                  <div class="metric-lbl">${m.label}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- Upcoming Runs -->
        <section class="page-section">
          <div class="section-heading">
            <h2>UPCOMING RUNS & GATHERINGS</h2>
            <span class="section-count">EVERYONE WELCOME</span>
          </div>
          <div class="runs-grid">
            ${d.upcomingRuns.map(run => `
              <div class="run-card">
                <div class="run-card-header">
                  <span class="run-day-badge">${run.day}</span>
                  <span class="run-date">${run.date}</span>
                </div>
                <h3 class="run-name">${run.name}</h3>
                <div class="run-spec-row">
                  <span class="spec-item">📍 ${run.meetPoint}</span>
                  <span class="spec-item">📏 ${run.distance}</span>
                  <span class="spec-item">⏱️ ${run.pace}</span>
                </div>
                <p class="run-vibe">${run.vibe}</p>
                <button class="rsvp-action-btn" onclick="alert('You are on the list! See you at ${run.meetPoint.replace(/'/g, "\\'")} 🏃☕')">
                  COUNT ME IN (RSVP FREE)
                </button>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Community Links -->
        <section class="section-card run-community-card">
          <div class="community-callout">
            <h3>READY TO HIT THE PAVEMENT?</h3>
            <p>Join our Strava club to log miles together, hop into our WhatsApp group for weekend coffee callouts, or download the schedule to your calendar.</p>
            <div class="community-buttons-row">
              <a href="https://strava.com" target="_blank" rel="noopener" class="run-btn strava">
                <span>⚡</span> STRAVA RUN CLUB ↗
              </a>
              <a href="https://chat.whatsapp.com" target="_blank" rel="noopener" class="run-btn whatsapp">
                <span>💬</span> WHATSAPP CHAT ↗
              </a>
              <button class="run-btn calendar" onclick="alert('Calendar subscription link copied! Paste into Google / Apple Calendar.')">
                <span>📅</span> ADD CALENDAR (.ICS)
              </button>
            </div>
          </div>
        </section>

        <!-- Recent Runs Archive -->
        <section class="page-section">
          <div class="section-heading">
            <h2>RECENT RUN ARCHIVE</h2>
          </div>
          <div class="recent-runs-list">
            ${d.recentRunsArchive.map(item => `
              <div class="recent-run-strip">
                <div class="strip-title">🏃 ${item.title}</div>
                <div class="strip-meta">
                  <span>${item.date}</span>
                  <span>👥 ${item.runners}</span>
                  <span>☕ ${item.coffee}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    `;
  }

  renderTheLab() {
    const d = BUILDS_DATA;
    return `
      <div class="content-page lab-page">
        <header class="page-header">
          <div class="header-tag">💻 LOCATION 03 // DIGITAL EXPERIMENTS</div>
          <h1 class="page-title">${d.title}</h1>
          <p class="page-subtitle">${d.subtitle}</p>
          <button class="back-to-world-btn" onclick="window.navManager.navigateTo('map')">← BACK TO THE WORLD</button>
        </header>

        <!-- Interactive 8-Bit Drum Sequencer Demo -->
        <section class="section-card sequencer-lab-card" id="sequencer-tool">
          <div class="lab-card-header">
            <div>
              <span class="badge-pill cyan">PLAYABLE WEIRD TOOL</span>
              <h3>BEATGEN 8-BIT LIVE SEQUENCER</h3>
            </div>
            <div class="seq-controls">
              <button id="seq-play-btn" class="seq-play-btn">▶ PLAY BEAT</button>
              <button id="seq-clear-btn" class="seq-clear-btn">CLEAR</button>
            </div>
          </div>
          <p class="seq-hint">Click the glowing pixel pads below to build a custom chiptune loop in real-time!</p>
          
          <div class="sequencer-matrix">
            <div class="seq-track-labels">
              <div class="track-name">KICK</div>
              <div class="track-name">SNARE</div>
              <div class="track-name">HI-HAT</div>
              <div class="track-name">SYNTH</div>
            </div>
            <div class="seq-steps-grid" id="seq-grid">
              ${[0, 1, 2, 3].map(row => `
                <div class="seq-row" data-row="${row}">
                  ${[0, 1, 2, 3, 4, 5, 6, 7].map(col => `
                    <button class="seq-pad ${this.sequencerGrid[row][col] ? 'active' : ''}" data-row="${row}" data-col="${col}"></button>
                  `).join('')}
                </div>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- Project Builds List -->
        <section class="page-section">
          <div class="section-heading">
            <h2>SELECTED BUILDS & TOOLS</h2>
            <span class="section-count">${d.projects.length} PROJECTS</span>
          </div>

          <div class="projects-grid">
            ${d.projects.map(p => `
              <div class="project-card">
                <div class="project-header">
                  <span class="proj-badge">${p.badge}</span>
                  <span class="proj-status">${p.status}</span>
                </div>
                <h3 class="proj-title">${p.title}</h3>
                <p class="proj-category">${p.category}</p>
                <p class="proj-desc">${p.description}</p>
                <div class="tech-tags">
                  ${p.tech.map(t => `<span class="tag">${t}</span>`).join('')}
                </div>
                <div class="proj-actions">
                  <a href="${p.link}" class="proj-btn primary">VISIT PROJECT ↗</a>
                  <a href="${p.github}" target="_blank" rel="noopener" class="proj-btn secondary">SOURCE CODE</a>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    `;
  }

  renderMerchShop() {
    const d = MERCH_DATA;
    return `
      <div class="content-page merch-page">
        <header class="page-header">
          <div class="header-tag">👕 LOCATION 04 // APPAREL & GOODS</div>
          <h1 class="page-title">${d.title}</h1>
          <p class="page-subtitle">${d.subtitle}</p>
          <button class="back-to-world-btn" onclick="window.navManager.navigateTo('map')">← BACK TO THE WORLD</button>
        </header>

        <section class="section-card shop-notice-card">
          <p>📦 <strong>Notice:</strong> ${d.notice}</p>
        </section>

        <section class="page-section">
          <div class="section-heading">
            <h2>CURRENT CATALOGUE</h2>
            <span class="section-count">${d.products.length} ARTIFACTS</span>
          </div>

          <div class="merch-grid">
            ${d.products.map(p => `
              <div class="merch-card">
                <div class="merch-photo-box">
                  <div class="merch-tag-badge">${p.tag}</div>
                  <div class="merch-pixel-illustration ${p.pixelIcon}">
                    <div class="illustration-art">[ 8-BIT ${p.pixelIcon.toUpperCase()} ]</div>
                  </div>
                </div>
                <div class="merch-info">
                  <div class="merch-cat">${p.category}</div>
                  <h3 class="merch-title">${p.name}</h3>
                  <div class="merch-price">${p.price}</div>
                  <p class="merch-desc">${p.description}</p>
                  
                  <div class="size-selector-row">
                    <span class="size-label">SIZE:</span>
                    <div class="size-options">
                      ${p.sizes.map((s, idx) => `
                        <button class="size-pill ${idx === 0 ? 'selected' : ''}" data-product="${p.id}">${s}</button>
                      `).join('')}
                    </div>
                  </div>

                  <button class="add-to-bag-btn" onclick="window.navManager.handleMerchBuy('${p.name.replace(/'/g, "\\'")}', '${p.price}')">
                    PURCHASE ARTIFACT ↗
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    `;
  }

  renderServices() {
    const d = SERVICES_DATA;
    return `
      <div class="content-page services-page">
        <header class="page-header">
          <div class="header-tag">✦ LOCATION 05 // STRATEGY & ADVISORY</div>
          <h1 class="page-title">${d.title}</h1>
          <p class="page-subtitle">${d.subtitle}</p>
          <button class="back-to-world-btn" onclick="window.navManager.navigateTo('map')">← BACK TO THE WORLD</button>
        </header>

        <section class="section-card services-lead-card">
          <p class="lead-text">${d.intro}</p>
        </section>

        <div class="pillars-grid">
          ${d.pillars.map(pillar => `
            <div class="pillar-card">
              <div class="pillar-badge">${pillar.badge}</div>
              <h3 class="pillar-title">${pillar.title}</h3>
              <p class="pillar-desc">${pillar.description}</p>
              <ul class="pillar-bullets">
                ${pillar.bullets.map(b => `<li><span class="check-icon">✓</span> ${b}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>

        <section class="section-card talk-cta-card">
          <div class="cta-inner">
            <span class="badge-pill gold">COLLABORATION</span>
            <h2>${d.ctaText}</h2>
            <p>Whether you're gearing up for a high-stakes music rollout, refining product positioning, or scaling an online community, let's talk.</p>
            
            <form class="contact-form" onsubmit="event.preventDefault(); alert('Message dispatched! Abhishek will get back to you shortly.'); this.reset();">
              <div class="form-row">
                <input type="text" placeholder="YOUR NAME" required class="retro-input" />
                <input type="email" placeholder="YOUR EMAIL" required class="retro-input" />
              </div>
              <input type="text" placeholder="SUBJECT / VENTURE / ARTIST NAME" required class="retro-input" />
              <textarea placeholder="WHAT ARE WE BUILDING OR SCHEMING TOGETHER?" rows="4" required class="retro-input"></textarea>
              <button type="submit" class="submit-talk-btn">SEND MESSAGE ✦</button>
            </form>
          </div>
        </section>
      </div>
    `;
  }

  renderAbout() {
    const d = ABOUT_DATA;
    return `
      <div class="content-page about-page">
        <header class="page-header">
          <div class="header-tag">👤 LOCATION 06 // THE HUMAN BEHIND THE WORLD</div>
          <h1 class="page-title">${d.title}</h1>
          <p class="page-subtitle">${d.subtitle}</p>
          <button class="back-to-world-btn" onclick="window.navManager.navigateTo('map')">← BACK TO THE WORLD</button>
        </header>

        <!-- Conversational Bio -->
        <section class="section-card bio-card">
          <div class="bio-grid">
            <div class="bio-avatar-box">
              <div class="pixel-avatar-frame">
                <div class="pixel-avatar-img">
                  <div class="avatar-shades">🕶️</div>
                  <div class="avatar-tag">ABHISHEK VIRA</div>
                </div>
              </div>
              <div class="bio-stats-box">
                ${d.stats.map(s => `
                  <div class="stat-line">
                    <span class="s-label">${s.label}</span>
                    <span class="s-val">${s.value}</span>
                  </div>
                `).join('')}
              </div>
            </div>
            <div class="bio-paragraphs">
              ${d.bioParagraphs.map(p => `<p class="bio-p">${p}</p>`).join('')}
            </div>
          </div>
        </section>

        <!-- 8-Bit Life Chapters Timeline -->
        <section class="page-section">
          <div class="section-heading">
            <h2>8-BIT LIFE CHAPTERS TIMELINE</h2>
          </div>
          <div class="timeline-container">
            ${d.timeline.map((item, idx) => `
              <div class="timeline-node">
                <div class="timeline-year-badge">${item.year}</div>
                <div class="timeline-content">
                  <h4>${item.title}</h4>
                  <p>${item.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Current Obsessions -->
        <section class="section-card obsessions-card">
          <h3>CURRENT OBSESSIONS & TOOLSTACK</h3>
          <div class="obsessions-list">
            ${d.currentObsessions.map(item => `
              <span class="obsession-chip">✨ ${item}</span>
            `).join('')}
          </div>
        </section>
      </div>
    `;
  }

  renderSecretShrine() {
    const d = EASTER_EGGS_DATA.secretShrine;
    const notes = [
      { name: 'C4', freq: 261.63 },
      { name: 'D4', freq: 293.66 },
      { name: 'E4', freq: 329.63 },
      { name: 'G4', freq: 392.00 },
      { name: 'A4', freq: 440.00 },
      { name: 'C5', freq: 523.25 },
      { name: 'D5', freq: 587.33 },
      { name: 'E5', freq: 659.25 }
    ];

    return `
      <div class="content-page shrine-page">
        <header class="page-header">
          <div class="header-tag">✨ EASTER EGG // HIDDEN LOCATION</div>
          <h1 class="page-title">${d.title}</h1>
          <p class="page-subtitle">${d.subtitle}</p>
          <button class="back-to-world-btn" onclick="window.navManager.navigateTo('map')">← BACK TO THE WORLD</button>
        </header>

        <section class="section-card shrine-card">
          <p class="lead-text">${d.description}</p>
          
          <div class="soundboard-container">
            <h3>✦ CHIPTUNE SOUNDBOARD ✦</h3>
            <div class="soundboard-pads">
              ${notes.map(n => `
                <button class="shrine-pad-btn" data-freq="${n.freq}">
                  <span class="pad-note">${n.name}</span>
                  <span class="pad-hz">${Math.round(n.freq)} Hz</span>
                </button>
              `).join('')}
            </div>
            <div class="soundboard-footer">
              <p>TIP: Sound must be unmuted to hear notes.</p>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  // --- ATTACH EVENT LISTENERS INSIDE VIEWS ---

  attachContentViewListeners(viewId) {
    // 1. Music Synth Previews
    const previewBtns = this.contentContainer.querySelectorAll('.preview-btn');
    previewBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        try {
          const pattern = JSON.parse(btn.dataset.pattern);
          sound.playReleasePreview(pattern);
          btn.textContent = '♪ PLAYING...';
          setTimeout(() => {
            btn.textContent = '▶ PREVIEW SYNTH';
          }, 1200);
        } catch (e) {}
      });
    });

    // 2. The Lab Sequencer
    if (viewId === 'builds' || viewId === 'lab') {
      const playBtn = document.getElementById('seq-play-btn');
      const clearBtn = document.getElementById('seq-clear-btn');
      const pads = document.querySelectorAll('.seq-pad');

      if (playBtn) {
        playBtn.addEventListener('click', () => {
          this.toggleSequencer(playBtn);
        });
      }

      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          this.sequencerGrid = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
          ];
          pads.forEach(p => p.classList.remove('active'));
        });
      }

      pads.forEach(pad => {
        pad.addEventListener('click', () => {
          const r = parseInt(pad.dataset.row);
          const c = parseInt(pad.dataset.col);
          this.sequencerGrid[r][c] = this.sequencerGrid[r][c] ? 0 : 1;
          pad.classList.toggle('active');
          if (this.sequencerGrid[r][c]) {
            this.playDrumSound(r);
          }
        });
      });
    }

    // 3. Merch Size Selectors
    const sizePills = this.contentContainer.querySelectorAll('.size-pill');
    sizePills.forEach(pill => {
      pill.addEventListener('click', () => {
        const parent = pill.closest('.size-options');
        parent.querySelectorAll('.size-pill').forEach(p => p.classList.remove('selected'));
        pill.classList.add('selected');
        sound.playInteract();
      });
    });

    // 4. Secret Shrine Soundboard
    if (viewId === 'secret-shrine') {
      sound.playSecretChime();
      const shrinePads = this.contentContainer.querySelectorAll('.shrine-pad-btn');
      shrinePads.forEach(pad => {
        pad.addEventListener('click', () => {
          const freq = parseFloat(pad.dataset.freq);
          sound.playSynthNote(freq, 0.28, 'square');
          pad.classList.add('pad-flash');
          setTimeout(() => pad.classList.remove('pad-flash'), 250);
        });
      });
    }
  }

  handleMerchBuy(productName, price) {
    sound.playInteract();
    alert(`Order inquiry initiated for "${productName}" (${price})!\n\nThis will link to your Stripe / Shopify checkout in production.`);
  }

  // Sequencer Drum Sound trigger
  playDrumSound(row) {
    if (sound.isMuted) return;
    switch (row) {
      case 0: // Kick
        sound.playSynthNote(80, 0.12, 'triangle');
        break;
      case 1: // Snare
        sound.playSynthNote(220, 0.08, 'sawtooth');
        break;
      case 2: // Hi-hat
        sound.playSynthNote(800, 0.04, 'square');
        break;
      case 3: // Lead Synth
        const leads = [440, 523, 659, 783];
        sound.playSynthNote(leads[this.sequencerStep % leads.length], 0.14, 'square');
        break;
    }
  }

  toggleSequencer(btn) {
    if (this.sequencerPlaying) {
      this.stopSequencer();
      if (btn) btn.textContent = '▶ PLAY BEAT';
    } else {
      if (sound.isMuted) {
        sound.toggleMute();
        this.updateSoundButtonUI(true);
      }
      this.sequencerPlaying = true;
      if (btn) btn.textContent = '■ STOP BEAT';

      this.sequencerStep = 0;
      this.sequencerTimer = setInterval(() => {
        const step = this.sequencerStep % 8;

        // Visual step highlight
        document.querySelectorAll('.seq-pad').forEach(pad => {
          if (parseInt(pad.dataset.col) === step) {
            pad.classList.add('step-highlight');
          } else {
            pad.classList.remove('step-highlight');
          }
        });

        // Trigger active tracks
        for (let row = 0; row < 4; row++) {
          if (this.sequencerGrid[row][step]) {
            this.playDrumSound(row);
          }
        }

        this.sequencerStep++;
      }, 160);
    }
  }

  stopSequencer() {
    if (this.sequencerTimer) {
      clearInterval(this.sequencerTimer);
      this.sequencerTimer = null;
    }
    this.sequencerPlaying = false;
    document.querySelectorAll('.seq-pad').forEach(p => p.classList.remove('step-highlight'));
  }

  // --- NPC DIALOGUE SYSTEM ---

  showNPCDialogue(npc) {
    if (!this.dialogueModal) return;
    const isDog = npc.type === 'dog';
    const data = isDog ? EASTER_EGGS_DATA.dog : EASTER_EGGS_DATA.duck;

    if (isDog) {
      sound.playDogBark();
    } else {
      sound.playInteract();
    }

    const dialogueText = data.dialogues[npc.dialogueIndex % data.dialogues.length];
    npc.dialogueIndex++;

    const avatarHtml = isDog ? '🐕' : '🦆';

    this.dialogueModal.innerHTML = `
      <div class="dialogue-box">
        <div class="dialogue-header">
          <span class="dialogue-avatar">${avatarHtml}</span>
          <span class="dialogue-name">${data.name.toUpperCase()}</span>
          <button class="dialogue-close" onclick="window.navManager.closeDialogue()">✕</button>
        </div>
        <div class="dialogue-body">
          <p class="dialogue-text">${dialogueText}</p>
        </div>
        <div class="dialogue-footer">
          <span>(Click anywhere to continue)</span>
        </div>
      </div>
    `;
    this.dialogueModal.classList.remove('hidden');
  }

  closeDialogue() {
    if (this.dialogueModal) {
      this.dialogueModal.classList.add('hidden');
      sound.playInteract();
    }
  }
}
