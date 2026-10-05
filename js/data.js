/**
 * Abhishek Vira - Central Website Content Store
 * All editable portfolio content, shows, releases, runs, products, and services live here.
 */

export const SITE_CONFIG = {
  name: "Abhishek Vira",
  tagline: "Musician • Creative Technologist • Runner • Strategist",
  avatarText: "AV",
  socials: {
    spotify: "https://open.spotify.com",
    apple: "https://music.apple.com",
    youtube: "https://youtube.com",
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
    strava: "https://strava.com",
    github: "https://github.com",
    email: "abhishek@example.com"
  }
};

export const MUSIC_DATA = {
  title: "MUSIC HOUSE",
  subtitle: "Sonic experiments, soulful hooks & late-night synthesizers",
  bio: "Abhishek crafts melodic electronic and indie soundscapes built with vintage drum machines, analog poly-synths, and raw vocal textures. From bedroom beats to festival stages, his sound sits at the crossroads of sunset chill, dancefloor energy, and midnight introspection.",
  streamingLinks: [
    { name: "Spotify", url: "https://open.spotify.com", icon: "spotify", color: "#1DB954" },
    { name: "Apple Music", url: "https://music.apple.com", icon: "apple", color: "#FA243C" },
    { name: "YouTube Music", url: "https://youtube.com", icon: "youtube", color: "#FF0000" },
    { name: "Bandcamp", url: "https://bandcamp.com", icon: "bandcamp", color: "#629AA9" },
    { name: "SoundCloud", url: "https://soundcloud.com", icon: "soundcloud", color: "#FF5500" }
  ],
  releases: [
    {
      id: "rel-1",
      title: "Midnight Run",
      type: "Single",
      year: "2025",
      coverColor: "#7928ca",
      bpm: 122,
      duration: "3:42",
      description: "Driving arpeggiators, heavy tape saturation, and an unstoppable tempo designed for empty highways and late night sprints.",
      tracks: ["Midnight Run (Original Mix)", "Midnight Run (Club Dub)"],
      samplePattern: [440, 554, 659, 880, 659, 554],
      listenUrl: "https://open.spotify.com"
    },
    {
      id: "rel-2",
      title: "Signals from The Lab",
      type: "EP",
      year: "2024",
      coverColor: "#0070f3",
      bpm: 115,
      duration: "14:18",
      description: "A 4-track exploration of modular synthesis, warm Fender Rhodes chords, and organic percussions recorded across four cities.",
      tracks: ["1. Frequency Drift", "2. Neon Rain", "3. Circuit Breaker", "4. Morning After"],
      samplePattern: [523, 659, 783, 1046, 783, 659],
      listenUrl: "https://open.spotify.com"
    },
    {
      id: "rel-3",
      title: "Coastline Drift",
      type: "Single",
      year: "2024",
      coverColor: "#00dfd8",
      bpm: 98,
      duration: "4:05",
      description: "Breezy guitar licks meeting laid-back lo-fi hip hop grooves. Inspired by Pacific highway sunset sessions.",
      tracks: ["Coastline Drift (Feat. Luna)"],
      samplePattern: [392, 493, 587, 740, 587, 493],
      listenUrl: "https://open.spotify.com"
    },
    {
      id: "rel-4",
      title: "Subway Reverie",
      type: "Single",
      year: "2023",
      coverColor: "#f5a623",
      bpm: 128,
      duration: "3:15",
      description: "Fast-paced breakbeats fused with warm vocal chops reflecting the chaotic poetry of city transit.",
      tracks: ["Subway Reverie (Extended)"],
      samplePattern: [349, 440, 523, 698, 523, 440],
      listenUrl: "https://open.spotify.com"
    }
  ],
  musicVideos: [
    {
      title: "Midnight Run (Official Visualizer)",
      tag: "4K Sci-Fi Pixel Anime",
      duration: "3:44",
      thumbnailBg: "#1a0826",
      youtubeId: "dQw4w9WgXcQ"
    },
    {
      title: "Signals from The Lab (Live Modular Session)",
      tag: "Live Hardware Jam",
      duration: "8:20",
      thumbnailBg: "#06182c",
      youtubeId: "dQw4w9WgXcQ"
    }
  ],
  upcomingShows: [
    {
      date: "NOV 14, 2026",
      venue: "Elsewhere (The Hall)",
      city: "Brooklyn, NY",
      status: "Tickets Available",
      link: "https://dice.fm"
    },
    {
      date: "DEC 05, 2026",
      venue: "The Independent",
      city: "San Francisco, CA",
      status: "Selling Fast",
      link: "https://dice.fm"
    },
    {
      date: "JAN 22, 2027",
      venue: "Village Underground",
      city: "London, UK",
      status: "Tickets Available",
      link: "https://dice.fm"
    },
    {
      date: "FEB 18, 2027",
      venue: "antiSOCIAL",
      city: "Mumbai, IN",
      status: "RSVP Open",
      link: "https://insider.in"
    }
  ],
  pastShows: [
    { date: "AUG 2026", venue: "Summer Stage Festival", city: "New York, NY" },
    { date: "JUN 2026", venue: "Electric Forest (Honeycomb)", city: "Rothbury, MI" },
    { date: "APR 2026", venue: "KOKO", city: "London, UK" },
    { date: "NOV 2025", venue: "The Echo", city: "Los Angeles, CA" }
  ]
};

export const RUN_CLUB_DATA = {
  title: "RUN CLUB",
  subtitle: "Miles, coffee, community & good dopamine. Zero pace gatekeeping.",
  statement: "We are not a corporate fitness club. We are a creative crew of runners, designers, musicians, and night owls who meet up at dawn or dusk to move together. All paces welcome, from first-time 5kers to marathon grinders. Nobody runs alone.",
  metrics: [
    { value: "4,200+", label: "Miles Logged Together" },
    { value: "180+", label: "Saturday Coffee Stops" },
    { value: "100%", label: "Good Energy Guaranteed" },
    { value: "0 min/mi", label: "Pace Judgment" }
  ],
  upcomingRuns: [
    {
      id: "run-1",
      day: "THIS SATURDAY",
      date: "Oct 10 • 7:30 AM",
      name: "Sunrise Bridge Loop & Bakery Drop",
      distance: "5.2 km (3.2 mi)",
      pace: "Conversational (6:00 - 7:30 /km)",
      meetPoint: "Williamsburg Waterfront Pier",
      vibe: "Easy pace, scenic skyline morning light, ends at sourdough bakery.",
      rsvpLink: "#rsvp-run"
    },
    {
      id: "run-2",
      day: "NEXT TUESDAY",
      date: "Oct 13 • 6:45 PM",
      name: "Sunset Track & Beat Session",
      distance: "6.0 km Track Intervals",
      pace: "Choose your own heat",
      meetPoint: "McCarren Park Track (Center Field)",
      vibe: "Upbeat electronic DJ playlist on speaker, light intervals, cool down beers.",
      rsvpLink: "#rsvp-run"
    },
    {
      id: "run-3",
      day: "SPECIAL TRIP",
      date: "Nov 06-08 • Weekend",
      name: "Montauk Surf & Trail Retreat",
      distance: "12 km Coastline Trails + Surf",
      pace: "Trail chill",
      meetPoint: "Montauk Point Lighthouse",
      vibe: "Cabin rental, coastal trail runs, cold plunges, surf sessions & bonfire cookout.",
      rsvpLink: "#rsvp-trip"
    }
  ],
  recentRunsArchive: [
    { title: "Central Park Golden Hour 8K", date: "Sep 27", runners: "42 runners", coffee: "Variety Coffee" },
    { title: "Chinatown Midnight Neon 5K", date: "Sep 19", runners: "68 runners", coffee: "Dim Sum Feast" },
    { title: "Rockaway Boardwalk 10K & Swim", date: "Sep 05", runners: "55 runners", coffee: "Rippers Burgers" },
    { title: "Prospect Park Summer Finale", date: "Aug 29", runners: "74 runners", coffee: "Post-run matcha" }
  ],
  communityLinks: [
    { name: "Join our Strava Club", url: "https://strava.com", icon: "strava" },
    { name: "WhatsApp Group Invite", url: "https://chat.whatsapp.com", icon: "whatsapp" },
    { name: "Add Calendar to Phone (.ics)", url: "#", icon: "calendar" }
  ]
};

export const BUILDS_DATA = {
  title: "THE LAB",
  subtitle: "Weird, useful & playful software experiments crafted with care.",
  philosophy: "I love building software at the intersection of music, motion, generative algorithms, and everyday utility. No boring corporate tools here—just delightful things that make you smile or make something creative.",
  projects: [
    {
      id: "beatgen",
      title: "BeatGen 8-Bit Drum Sequencer",
      category: "Audio / Web App",
      badge: "PLAYABLE DEMO",
      status: "Live Project",
      description: "An interactive, web-based retro 8-step chiptune drum sequencer and arpeggiator with real-time waveform synthesis. Click notes and jam right in your browser!",
      interactiveType: "sequencer",
      tech: ["Web Audio API", "Canvas", "Vanilla JS"],
      link: "#sequencer-tool",
      github: "https://github.com"
    },
    {
      id: "pacecraft",
      title: "PaceCraft Runner Calculator",
      category: "Fitness / Tools",
      badge: "POPULAR",
      status: "Live Web App",
      description: "A playful, retro-styled pacing visualizer for distance runners. Calculates negative splits, marathon projections, and elevation effort with 8-bit runner graphics.",
      interactiveType: "calculator",
      tech: ["TypeScript", "SVG Data Viz", "Tailwind"],
      link: "#calculator-tool",
      github: "https://github.com"
    },
    {
      id: "retromap",
      title: "RetroMap Game World Engine",
      category: "Game Dev / Open Source",
      badge: "OPEN SOURCE",
      status: "v1.2 Released",
      description: "The lightweight, dependency-free 2D canvas tile engine powering this very website. Features collision matrices, dynamic camera follow, responsive D-Pad, and procedural pixel generation.",
      interactiveType: "showcase",
      tech: ["HTML5 Canvas", "ES6 Modules", "Zero Dependencies"],
      link: "https://github.com",
      github: "https://github.com"
    },
    {
      id: "ghostwriter",
      title: "Ghostwriter AI Lyric Pad",
      category: "AI / Creative Tool",
      badge: "AI EXPERIMENT",
      status: "Beta Access",
      description: "A distraction-free writing environment that assists songwriters with rhyme scheme mapping, phonetic assonance detection, and rhythmic meter analysis.",
      interactiveType: "showcase",
      tech: ["Next.js", "Web Speech API", "LLM Fine-tuning"],
      link: "https://github.com",
      github: "https://github.com"
    },
    {
      id: "droptracker",
      title: "DropTracker Streetwear & Vinyl Bot",
      category: "Automation",
      badge: "UTILITY",
      status: "Active Bot",
      description: "Lightweight monitoring daemon notifying collectors in private Discord channels when limited-edition vinyl pressings and streetwear collections drop.",
      interactiveType: "showcase",
      tech: ["Node.js", "Puppeteer", "Discord Webhooks"],
      link: "https://github.com",
      github: "https://github.com"
    }
  ]
};

export const MERCH_DATA = {
  title: "MERCH SHOP",
  subtitle: "High-grade threads, vintage vinyl & 8-bit artifacts.",
  notice: "All apparel printed on ultra-heavyweight 100% organic cotton. Ethically sourced and built to last hundreds of miles and festival nights.",
  products: [
    {
      id: "merch-1",
      name: "8-Bit World Tour Tee",
      category: "Apparel",
      price: "$44.00",
      priceNum: 44,
      tag: "NEW ARRIVAL",
      description: "Heavyweight 280 GSM washed vintage black tee featuring pixel art characters and tour dates silkscreened on back.",
      sizes: ["S", "M", "L", "XL", "XXL"],
      color: "Washed Vintage Black",
      pixelIcon: "shirt"
    },
    {
      id: "merch-2",
      name: "Run Club 5-Panel Cap",
      category: "Headwear",
      price: "$36.00",
      priceNum: 36,
      tag: "LIMITED RUN",
      description: "Breathable water-repellent nylon 5-panel runner cap with 3M reflective embroidered club logo and toggle strap.",
      sizes: ["One Size Fits All"],
      color: "Forest Green / Cream",
      pixelIcon: "cap"
    },
    {
      id: "merch-3",
      name: "The Lab Heavyweight Hoodie",
      category: "Apparel",
      price: "$78.00",
      priceNum: 78,
      tag: "BESTSELLER",
      description: "Super cozy 450 GSM French Terry cotton hoodie with custom embroidered pixel oscilloscope patch on chest.",
      sizes: ["S", "M", "L", "XL"],
      color: "Heather Graphite",
      pixelIcon: "hoodie"
    },
    {
      id: "merch-4",
      name: "Signals from The Lab 12\" Vinyl",
      category: "Music Physicals",
      price: "$32.00",
      priceNum: 32,
      tag: "COLLECTOR EDITION",
      description: "Translucent neon teal 180g audiophile vinyl pressing. Includes full-color printed inner sleeve and download card.",
      sizes: ["12\" LP Vinyl"],
      color: "Neon Teal",
      pixelIcon: "vinyl"
    },
    {
      id: "merch-5",
      name: "Retro Enamel Pin Set (Pack of 4)",
      category: "Accessories",
      price: "$20.00",
      priceNum: 20,
      tag: "FAN FAVORITE",
      description: "Hard enamel pins featuring the 8-Bit Abhishek sprite, Music Boombox, Running Sneaker, and The Lab Robot.",
      sizes: ["Set of 4"],
      color: "Polished Gold & Enamel",
      pixelIcon: "pins"
    }
  ]
};

export const SERVICES_DATA = {
  title: "SERVICES",
  subtitle: "Strategic growth, digital presence & artist rollouts.",
  intro: "I help ambitious founders, creative artists, and modern brands build magnetic internet presence, articulate their story, and engineer scalable growth loops.",
  pillars: [
    {
      id: "marketing",
      title: "Marketing & Growth Strategy",
      icon: "rocket",
      badge: "STRATEGY & EXECUTION",
      description: "End-to-end growth architecture designed for consumer products, creative platforms, and early-stage ventures.",
      bullets: [
        "Go-To-Market strategy & product launch roadmaps",
        "Positioning, narrative design & sticky brand voice",
        "Viral distribution loops & organic social momentum",
        "Conversion rate optimization & onboarding flows"
      ]
    },
    {
      id: "artist-support",
      title: "Artist & Creator Support",
      icon: "sparkles",
      badge: "CREATIVE & ROLLOUTS",
      description: "Bespoke digital campaigns, rollouts, and identity strategy tailored specifically for independent music artists and creators.",
      bullets: [
        "Music release rollouts, EP/Album rollout calendars",
        "Creative direction, visual assets & microsites",
        "Streaming editorial pitching & DSP optimization",
        "Merchandise curation & DTC drops strategy"
      ]
    },
    {
      id: "consulting",
      title: "Advisory & Consulting",
      icon: "compass",
      badge: "HIGH-IMPACT ADVISORY",
      description: "Fractional leadership and sparring partner sessions for founders seeking clarity on positioning, culture, and scale.",
      bullets: [
        "Fractional Head of Growth / Creative Director guidance",
        "0-to-1 product strategy and MVP roadmapping",
        "Community architecture & event activations",
        "Bi-weekly strategic founder advisory calls"
      ]
    }
  ],
  ctaText: "Need help with something? Let's talk.",
  contactEmail: "abhishek@example.com"
};

export const ABOUT_DATA = {
  title: "ME",
  subtitle: "Maker, musician, runner & curious human.",
  bioParagraphs: [
    "Hey! I'm Abhishek. Welcome to my little corner of the internet.",
    "By day and night, I build software, craft electronic music, run long miles through city streets, and help visionary creators and founders turn weird ideas into magnetic realities.",
    "I believe the internet used to be more magical, quirky, and personal before everything turned into identical minimalist SaaS landing pages. This website is my homage to that spirit: a playful, open world where every door opens into a different passion of mine.",
    "When I'm not in front of a keyboard or drum machine, you can find me hunting down the best espresso in town, surfing choppy waves in Montauk, or pacing friends at a weekend 10K."
  ],
  timeline: [
    {
      year: "2016",
      title: "The First Synthesizer",
      desc: "Bought a dusty analog drum machine and wrote my first electronic tunes in a dorm room."
    },
    {
      year: "2019",
      title: "First Startup & Hackathons",
      desc: "Wrote code through the night, built consumer tools, and discovered the thrill of shipping to thousands."
    },
    {
      year: "2022",
      title: "Founding the Run Club",
      desc: "Invited 5 friends for a sunrise jog; grew into a 200+ person community running every Saturday."
    },
    {
      year: "2024",
      title: "First World Tour & Signals EP",
      desc: "Released 'Signals from The Lab' EP and played shows across NYC, SF, and London."
    },
    {
      year: "Today",
      title: "Living in Curiosity",
      desc: "Building weird & useful software, releasing new music, and exploring where creative tech goes next."
    }
  ],
  currentObsessions: [
    "Analog tape loop delay effects",
    "Carbon-plated running shoes",
    "PICO-8 fantasy consoles & pixel art",
    "Specialty Ethiopian light roast coffee",
    "Modular architecture & generative audio"
  ],
  stats: [
    { label: "COFFEE / DAY", value: "3 cups" },
    { label: "FAVORITE BPM", value: "124" },
    { label: "MARATHON PR", value: "3h 18m" },
    { label: "KEYBOARDS OWNED", value: "6" }
  ]
};

export const EASTER_EGGS_DATA = {
  dog: {
    name: "Buster the Pixel Dog",
    dialogues: [
      "Woof! (Translation: 'Did you know Abhishek once played a 3-hour synth set fueled entirely by cold brew?')",
      "Arf! Wagging tail happily. 'Try wandering into the dense trees to the north-east... rumor has it there is a secret shrine!'",
      "*Barks excitedly* 'Running pace doesn't matter, treats at the finish line do.'",
      "Woof! 'Abhishek coded this whole world using zero frameworks and raw canvas power. Pretty neat, huh?'",
      "*Pant pant* 'You found me! Here's a virtual high-five 🐾'"
    ]
  },
  duck: {
    name: "Philosophical Duck",
    dialogues: [
      "Quack! 'The pond is calm today. Are you rushing through life or taking time to listen to the synths?'",
      "Quack quack! 'If you press Enter when near a building, the door opens instantly. Technology is fascinating.'"
    ]
  },
  secretShrine: {
    title: "THE HIDDEN 8-BIT SOUND SHRINE",
    subtitle: "You discovered the secret glade!",
    description: "Legend says whoever finds this secluded grove gains the power to summon retro chiptune melodies. Tap the sound pads below to jam your own 8-bit riff!"
  }
};
