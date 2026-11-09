
window.PROJECTS_DATA = [
  {
    id: "kmap",
    title: "KMap",
    tagline: "Interactive Karnaugh Map solver, Boolean minimizer & logic circuit synthesizer",
    category: "systems",
    categoryLabel: "Logic Design & Systems",
    image: "assets/images/project_kmap.png",
    featured: false,
    stats: {
      variables: "2–4 Variables",
      minimization: "Quine-McCluskey",
      synthesis: "Basic Gates / Universal Gates"
    },
    tags: ["Java", "Swing / AWT", "Boolean Algebra", "Quine-McCluskey", "Digital Logic"],
    overview: "An interactive desktop Karnaugh Map solver and Boolean algebra minimization engine featuring real-time matrix state manipulation, Petrick's minimal cover algorithm, truth table inspection, and 2-level logic circuit diagram synthesis.",
    highlights: [
      "Engineered exact Boolean minimization using the Quine-McCluskey tabular reduction and Petrick's algorithm for minimal SOP and POS expressions.",
      "Designed visual matrix renderer with color-coded rectangular group decomposition and seamless toroidal/cylindrical wrap-around boundary handling.",
      "Built interactive 2-level logic circuit diagram synthesizer supporting Basic (AND/OR/NOT) and Universal (All-NAND / All-NOR) gates.",
      "Developed zero-dependency, cross-platform Java Swing UI targeting Java 8 bytecode compatibility with automated CI/CD JAR builds."
    ],
    metrics: [
      { label: "Solve Latency", value: "< 1 ms", detail: "Sub-millisecond Quine-McCluskey evaluation" },
      { label: "Time Complexity", value: "O(3ⁿ / √n)", detail: "Tabular prime implicant generation with Petrick cover" },
      { label: "Space Complexity", value: "O(3ⁿ) bounded", detail: "Minimal memory footprint (< 50 KB heap usage)" },
      { label: "State Search Space", value: "65,536 functions", detail: "Instant evaluation across all 2¹⁶ Boolean states" },
      { label: "Render Performance", value: "60 FPS", detail: "Hardware-accelerated Java2D vector circuit canvas" },
      { label: "Gate Synthesis", value: "3 Paradigms", detail: "SOP/POS Basic (AND/OR/NOT), All-NAND, and All-NOR" }
    ],
    links: {
      demo: "https://github.com/xylium117/kmap/releases/download/v1.0/KMap.jar",
      github: "https://github.com/xylium117/kmap"
    }
  },
  {
    id: "quantumcode",
    title: "QuantumCode",
    tagline: "Educational quantum computing IDE with live Bloch sphere visualizer & circuit optimizer",
    category: "systems",
    categoryLabel: "Quantum & Systems",
    image: "assets/images/project_quantumcode.png",
    featured: false,
    stats: {
      qubits: "12 Qubit State",
      gates: "20+ Gates",
      academy: "16 Curated Tutorials"
    },
    tags: ["Rust", "WebAssembly", "TypeScript", "Canvas2D", "Linear Algebra"],
    overview: "An interactive quantum algorithm prototyping platform featuring drag-and-drop circuit composition, real-time matrix transformation calculations, and 3D Bloch sphere quantum state vector projections.",
    highlights: [
      "Built high-performance statevector simulator engine in Rust utilizing SIMD matrix operations.",
      "Designed interactive Bloch sphere with Euler angle controls and decoherence noise modeling.",
      "Included step-by-step interactive tutorials for Shor's, Grover's, and Quantum Teleportation algorithms.",
      "Integrated OpenQASM 3.0 export and compiler optimization passes to minimize gate depth."
    ],
    metrics: [
      { label: "Codebase Size", value: "6,637 LOC", detail: "63 source, style, and QASM files" },
      { label: "Unit Tests", value: "25 / 25", detail: "Rust workspace tests passing" },
      { label: "Production Build", value: "639 modules", detail: "Vite production bundle" },
      { label: "QASM Examples", value: "10", detail: "Ready-to-import quantum circuits" },
      { label: "Simulation Scale", value: "12 qubits", detail: "Interactive statevector register" },
      { label: "API Endpoints", value: "7", detail: "Simulation, optimization, QASM, and tutorials" },
    ],
    links: {
      demo: "https://xylium117.github.io/quantumcode/",
      github: "https://github.com/xylium117/quantumcode"
    }
  },
  {
    id: "ecopulse",
    title: "EcoPulse",
    tagline: "Planetary climate & multi-hazard intelligence platform with dual-engine wildfire burn scar & flash flood inundation AI",
    category: "ai",
    categoryLabel: "Climate & Geospatial AI",
    image: "assets/images/project_ecopulse.jpg",
    featured: true,
    stats: {
      resolution: "10m Resolution",
      sensors: "Sentinel-1 SAR, Sentinel-2 & Landsat",
      model: "Dual ST-UNet · STURM-FLOOD · Inundation2Depth"
    },
    tags: [
      "Python",
      "FastAPI",
      "TensorFlow",
      "Sentinel-1 SAR",
      "Sentinel-2 MSI",
      "Google Earth Engine",
      "Hydrological AI",
      "GIS",
      "Remote Sensing",
    ],
    overview: "An interactive planetary climate analytics and multi-hazard observation platform featuring dual operational engines: wildfire burn-scar segmentation with carbon flux tracking and VCI drought modeling, paired with cloud-penetrating Sentinel-1 SAR radar inundation mapping, closed-form Flash Flood Guidance (FFG/SCS-CN) physics, a 20-factor STURM-FLOOD regressor trained on 1.14M+ planetary basin records, and an Inundation2Depth 2D water depth predictor (R² = 0.984).",
    highlights: [
      "Engineered Dual Planetary Hazard Engines toggling between Wildfire & Biomass Loss (optical delta-NBR / canopy loss / carbon flux) and Flash Flood & Inundation (all-weather Sentinel-1 C-Band SAR backscatter drop + optical MNDWI).",
      "Developed Spatio-Temporal U-Net with TimeDistributed encoders and ConvLSTM2D temporal state bottlenecks to segment floodwater surges and burn scars across multi-temporal satellite observation stacks (T=2, 256×256×3).",
      "Trained STURM-FLOOD & FloodDET 20-parameter ridge regressor on a 1.14M+ planetary flood observation corpus (R² = 0.845) calibrated against 20 GDACS FloodDET climatological GeoTIFF grids with dynamic focal edge weighting.",
      "Built Inundation2Depth hydro-kinematic 2D depth engine (R² = 0.984, RMSE = 0.095m) mapping SAR backscatter attenuation, TWI, HAND, and storm intensity to continuous floodwater depths h(x, y) in meters.",
      "Coupled physics-based Flash Flood Guidance (FFG), dynamic moisture-adjusted SCS-CN runoff retention, CREST/EF5 infiltration, and Time of Concentration (Tc) for catchment-specific lead-time forecasting.",
      "Integrated Google Earth Engine API with high-fidelity deterministic synthetic fallback for real-time NDVI, NDWI, and carbon flux time-series telemetry with ±2.0σ Z-score anomaly detection.",
      "Calibrated real-world disaster scene presets (Valencia DANA, Nepal & Tibet Bagmati/Koshi Basin, India Indo-Gangetic Corridor, Bangladesh Delta, California Camp Fire, Amazon, Borneo) alongside dynamic live viewport scanning.",
      "Designed dynamic 5-tier hazard severity grading (Critical, High, Medium, Low, None) with automated terrestrial ocean-masking to eliminate false positives over open water bodies.",
      "Built high-throughput XYZ multi-spectral & radar raster tile streaming service in FastAPI (< 28ms latency) generating real-time slippy-map overlays for flood risk, inundation extent, MNDWI, soil saturation, and burn scars.",
      "Engineered dual-engine geospatial frontend combining zero-key Open Satellite Leaflet 2D GIS with Three.js / Globe.GL 3D atmospheric globe visualizations, interactive threshold sliders, and tactical rescue vehicle passability overlays."
    ],
    metrics: [
      { label: "Spatial Resolution", value: "10m / 30m", detail: "Sentinel-1 C-Band SAR, Sentinel-2 MSI & Landsat-8/9 OLI" },
      { label: "Tile Stream Latency", value: "< 28ms", detail: "Dynamic XYZ multi-spectral & radar raster tile streaming" },
      { label: "Hydrology Model Accuracy", value: "R² = 0.845", detail: "20-parameter STURM-FLOOD regressor on empirical basin telemetry" },
      { label: "Inundation Depth Model", value: "R² = 0.984", detail: "Inundation2Depth 2D water depth predictor (RMSE = 0.095m)" },
      { label: "Model Inference", value: "< 50ms", detail: "Spatio-Temporal ConvLSTM2D U-Net & closed-form physics" },
      { label: "Anomaly Sensitivity", value: "±2.0σ Z-Score", detail: "Statistical anomaly flagging against seasonal baselines" },
      { label: "Planetary Coverage", value: "4,820 Mha", detail: "Global coverage across 9 biomes with automated ocean masking" },
      { label: "Spectral & Radar Indices", value: "7 Live Pipelines", detail: "NDVI, NDWI, MNDWI, SAR delta-dB, VCI drought, delta-NBR & TWI" },
      { label: "Training Corpus Pool", value: "1.14M+ Samples", detail: "1.12M tabular flood records + 20 GDACS GeoTIFFs + 25K depth scenarios" }
    ],
    links: {
      demo: "https://xylium117.github.io/ecopulse/",
      github: "https://github.com/xylium117/ecopulse"
    }
  },
  {
    id: "kharcha",
    title: "Kharcha",
    tagline: "Pocket money tracker for students — log expenses, set budgets, split bills, and let Stash the owl talk you out of bad buys.",
    category: "web",
    categoryLabel: "Web & Full-Stack",
    image: "assets/images/project_kharcha.png",
    featured: true,
    stats: {
      platform: "PWA (Installable)",
      sync: "IndexedDB + Firestore",
      ai: "Stash AI"
    },
    tags: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "Firebase 13",
      "Dexie / IndexedDB",
      "Serwist PWA",
      "Framer Motion",
      "Recharts",
      "Vitest",
      "Zod"
    ],
    overview: "A privacy-first Progressive Web App for student pocket-money management — log expenses in one tap or natural text, visualise spending habits, set savings goals, split bills with friends, and consult Stash the owl AI before impulse purchases. All financial data lives locally in IndexedDB; cloud sync with Google / Firestore is fully opt-in.",
    highlights: [
      "Architected offline-first data layer with Dexie (IndexedDB) and debounced, atomic Firestore cloud sync triggered on change, every 2.5 min, on tab focus, and on network reconnect.",
      "Built multi-backend Stash AI mentor supporting Google Gemini, Groq, OpenRouter, and a 100% offline zero-key local reasoning engine trained on student finance with natural-language expense parsing.",
      "Engineered season-aware budget engine with SCS-CN-style runoff forecasting, month-end spend projection, and dynamic Normal / Academic / Vacation period switching.",
      "Designed a 14-badge gamification system rewarding streaks, no-spend days, goal completions, and behavioural milestones with confetti unlock animations.",
      "Implemented installable PWA via Serwist / Workbox service worker with pre-cached assets, offline fallback, and an in-app install prompt flow.",
      "Delivered interactive Stats Lab with category breakdowns, daily spend sparklines, Tukey outlier detection, Welch t-test weekday vs. weekend spend analytics, and streak tracking using Recharts."
    ],
    metrics: [
      { label: "Stats Lab", value: "10 Core Metrics", detail: "Mean, median, std dev, IQR, 95% CI, Gini index, skewness, Tukey outliers & Welch t-test" },
      { label: "Expense Categories", value: "10 Categories", detail: "Custom emoji, colours, and Need / Want / Waste tagging" },
      { label: "Badges", value: "14 Badges", detail: "Unlockable awards for logging streaks, zero-spend days & goal completions" },
      { label: "Seasonal Budgets", value: "3 Modes", detail: "Adaptive spend forecasting tailored to Normal, Exam, and Vacation semesters" },
      { label: "Weekly Reports", value: "6 Grades", detail: "Automated A+ to F financial report cards with personalized wins and tips" }
    ],
    links: {
      demo: "https://kharcha-pi.vercel.app",
      github: "https://github.com/xylium117/kharcha"
    }
  },
  {
    id: "logiscope",
    title: "Logiscope.ai",
    tagline: "Predictive logistics intelligence & decision-support digital twin with spatio-temporal GNN route disruption AI",
    category: "ai",
    categoryLabel: "Logistics & Geospatial AI",
    image: "assets/images/project_logiscope.png",
    featured: true,
    stats: {
      resolution: "Multi-Echelon Network",
      sensors: "IoT Telemetry, SRTM DEM & Live Weather Feeds",
      model: "ST-GNN (Edge-GAT + T-GRU) · Linear Programming Solver"
    },
    tags: [
      "Python",
      "FastAPI",
      "PyTorch",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Leaflet GIS",
      "Graph Neural Networks",
      "Operations Research",
      "Digital Twin"
    ],
    overview: "A predictive logistics intelligence and tactical command-and-control platform engineered for high-altitude, austere, and geographically vulnerable supply corridors. Features a real-time synchronized logistics digital twin coupled with an inductive Spatio-Temporal Graph Neural Network (Edge-Conditioned Spatial Graph Attention + Temporal GRU) for multi-horizon route impassability forecasting, multivariate time-series demand projections, environmental high-altitude burn modifiers, and mixed-integer linear programming (MILP) dispatch optimization.",
    highlights: [
      "Engineered an inductive Spatio-Temporal Graph Neural Network (ST-GNN) combining edge-conditioned Spatial-GAT and Temporal GRUs to forecast route disruption probabilities across multi-horizon tactical windows (T+1h to T+48h).",
      "Architected a continuously synchronized supply network Digital Twin spanning forward bases, regional transit hubs, and main depots with live IoT telemetry and multi-echelon stock health monitoring.",
      "Formulated physics-informed high-altitude consumption multipliers adjusting fuel, caloric, and battery drawdowns against elevation gradients, sub-zero freeze drag, and atmospheric hypoxia.",
      "Built multi-objective Operations Research / Mixed-Integer Linear Programming (MILP) dispatch solvers balancing payload capacity, corridor risk cost surfaces, and transit time SLAs across all-terrain convoys and air bridges.",
      "Developed an interactive tactical GIS operations map with interactive Leaflet topology overlays, dynamic chokepoint vulnerability heatmaps, elevation profiles, and fallback corridor routing.",
      "Coupled multivariate time-series demand forecasting engines with seasonal trend decomposition and statistical ±2.5σ Z-score anomaly radar for early stockout and consumption surge detection.",
      "Designed an interactive Scenario Simulation Lab allowing logistics commanders to model severe shock disruptions (pass closures, blizzards, fuel depot loss) and simulate automated proactive replenishment re-routing.",
      "Built low-latency REST and WebSocket telemetry ingestion pipelines in FastAPI (< 30ms response) serving route cost matrices and predictive risk indices to a modern React 19 / TypeScript command dashboard."
    ],
    metrics: [
      { label: "ST-GNN Disruption ROC-AUC", value: "0.948", detail: "Multi-horizon route impassability & pass closure classifier (F1 = 0.912)" },
      { label: "ETA Prediction MAE", value: "0.42 hrs", detail: "Mean absolute ETA error vs 2.85 hrs for static geodesic routing" },
      { label: "Routing Latency", value: "< 24ms", detail: "FastAPI vectorized dynamic risk cost surface C_uv(t) & Dijkstra solver" },
      { label: "Projection Horizon", value: "48 Hours", detail: "5 discrete tactical forecast heads (T+1h, T+6h, T+12h, T+24h, T+48h)" },
      { label: "Graph Feature Tensor", value: "14 Dimensions", detail: "8D spatial node vectors (X_t) + 6D dynamic edge tensors (E_t)" },
      { label: "Anomaly Sensitivity", value: "±3.0σ Z-Score", detail: "Statistical Gaussian divergence radar flagging stock & telemetry spikes" },
      { label: "Lead-Time Buffer Gain", value: "68 Hours", detail: "Pre-positioning advance notice prior to severe seasonal pass closures" },
      { label: "Mission Readiness Gain", value: "+35%", detail: "Combat readiness retention benchmark via MILP forward pre-positioning" },
      { label: "Fleet Capacity Managed", value: "280+ Tons", detail: "Multi-modal dispatch across heavy convoys (160T), trucks (75T) & air (45T)" }
    ],
    links: {
      demo: "https://xylium117.github.io/logiscope.ai/",
      github: "https://github.com/xylium117/logiscope.ai"
    }
  },
  {
    id: "hattrk",
    title: "Hattrk",
    tagline: "Data-driven spatial football match engine with 18-zone pitch geometry, matchday physics, domestic league simulation, and multi-continental cup season simulator",
    category: "ai",
    categoryLabel: "Sports Analytics & Predictive AI",
    image: "assets/images/project_hattrk.png",
    featured: true,
    stats: {
      resolution: "18-Zone Tactical Pitch Grid",
      sensors: "Opta / StatsBomb Benchmark Telemetry",
      model: "Continuous Possession State Machine · Bradley-Terry Elo · Opta xG · Matchday Physics · 65-League & Cup Simulator"
    },
    tags: [
      "Python",
      "Sports Analytics",
      "Monte Carlo Simulation",
      "Expected Goals (xG)",
      "Spatial Pitch Geometry",
      "Tactical AI",
      "Elo Rating Systems",
      "Domestic League Simulation",
      "Continental Tournament Simulation",
      "Biomechanical Modeling"
    ],
    overview: "A high-fidelity data-driven football match simulation and probabilistic prediction engine spanning individual matches to full multi-continental seasons. Powered by an 18-zone tactical pitch grid, continuous micro-possession state machines across 4 match phases, dynamic game-state urgency AI, and an Opta-calibrated xG/xA model with defender shot-blocking. The matchday physics engine layers referee personality profiles, VAR review mechanics, environmental weather conditions, and set-piece choreography onto every simulated fixture. A 745-club database across 65 domestic leagues drives a double round-robin league simulator with rolling form standings, feeding into a multi-continental season simulator supporting UCL, UEL, UECL, UWCL, Copa Libertadores, Copa Sudamericana, CONCACAF Champions Cup, AFC Champions Elite, and CAF Champions League. The Monte Carlo predictor (1,000 iterations, RPS = 0.174) now also outputs probabilistic league finish distributions.",
    highlights: [
      "Engineered an 18-zone spatial pitch grid dividing the pitch into vertical thirds and horizontal channels (wings, half-spaces, central channels) to model passing lanes, defensive block compression, and spatial overload dynamics.",
      "Developed a continuous phase-based micro-possession state machine (Build-up, Progression, Final Third, Transition) processing 2–4 micro-ticks per minute to achieve authentic match pass volumes (893 completed passes/match at 88.3% accuracy).",
      "Calibrated an Opta-standard expected goals (xG) and assists (xA) engine integrating defender shot-blocking (25%–35% block rate), goalkeeper save resistance, and parried deflections, dropping shots on target from an unrealistic 54% to an authentic 36.3%.",
      "Built dynamic Game-State AI manager adjusting pressing triggers, passing risk, and five tactical mentalities (Park the Bus, Controlled Counter, Balanced, Attacking Overload, Hail Mary) based on real-time clock urgency and score differential.",
      "Formulated anti-blowout lead retention and underdog low-block compression that dropped 3+ goal blowouts from 47.0% to 17.0% and completely eliminated unrealistic runaway 5+ goal demolitions.",
      "Engineered headless high-speed Monte Carlo predictor executing 1,000+ match simulations head-to-head to extract probability distributions: 1X2 win probabilities, exact scoreline matrices, Over/Under (1.5, 2.5, 3.5), BTTS, anytime goalscorer props, and probabilistic league finish distributions.",
      "Coupled 745-club Bradley-Terry Elo power ratings across 65 domestic leagues, goal difference anchor formulas, rolling 5-match form parsing (WWDDL), and tactical philosophy friction matrices (High Press vs Tiki-Taka, Direct Counter vs Possession).",
      "Designed a matchday physics engine with four set-piece choreography routines (near-post flick, far-post overload, goalkeeper screen, short cutback), each driving distinct spatial movement patterns, delivery trajectories, and outcome probability distributions.",
      "Implemented referee personality profiles (disciplinarian, lenient, crowd-pressure-biased) modulating card thresholds, foul call frequency, and VAR review trigger likelihood, with VAR overturning on-field decisions at calibrated real-world rates.",
      "Integrated environmental weather physics: Wet/Rain increases pass velocity variance by 12%, Heat applies a 20% stamina decay multiplier to sprinting actions, and Snow reduces ground pass accuracy by 15%, affecting zone transition probabilities throughout the match.",
      "Calibrated player and match rating system to real-world distributions: 10.0 reserved for historic individual performances (4+ goals or 11+ saves in a clean sheet), normal starters range 5.8–6.8, and MOTM performances cluster 8.0–8.8.",
      "Built a domestic league engine supporting 65 leagues and 745 clubs across 6 continents with double round-robin scheduling, real-time rolling standings (GD, GF tiebreakers), dynamic team and player form tracking, and promotion/relegation slot resolution.",
      "Architected a multi-continental season simulator orchestrating parallel domestic campaigns alongside 9 continental cup competitions (UCL, UEL, UECL, UWCL, Copa Libertadores, Copa Sudamericana, CONCACAF Champions Cup, AFC Champions Elite, CAF Champions League) configurable by continent selection and number of seasons."
    ],
    metrics: [
      { label: "Passes Completed", value: "893 / Match", detail: "88.3% pass accuracy across 100-match benchmark (750–950 real target)" },
      { label: "Total Goals / Match", value: "2.74 Goals", detail: "Calibrated to Opta standard (2.65–3.10 real average, xG divergence = 0.04)" },
      { label: "Blowout Rate", value: "17.0%", detail: "3+ goal blowouts compressed from 47.0% down to 17.0% (0% demolitions)" },
      { label: "Predictor Accuracy", value: "RPS = 0.174", detail: "Ensemble Ranked Probability Score beating the <= 0.188 benchmark target" },
      { label: "Simulation Speed", value: "< 8ms / Match", detail: "Headless batch simulation throughput for 1,000-run Monte Carlo ensembles" },
      { label: "Club & Squad Database", value: "444 Clubs", detail: "Global clubs with authentic venues, manager mappings, and player rosters" },
      { label: "Shot Conversion", value: "29.9% G/SoT", detail: "36.3% shots on target with 25.2 total shots/match mirroring UCL data" },
      { label: "Discipline & Corners", value: "21.2 Fouls", detail: "3.84 yellow cards and 11.4 corners per match from deflections and saves" },
      { label: "Test Suite Pass Rate", value: "59 / 59 (100%)", detail: "Full coverage across engine, matchday physics, ratings, league simulation, and continental season tests" }
    ],
    links: {
      demo: "https://github.com/xylium117/hattrk/wiki",
      github: "https://github.com/xylium117/hattrk"
    }
  }
];
