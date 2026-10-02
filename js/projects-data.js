
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
      model: "Dual Spatio-Temporal U-Net, STURM-FLOOD & Inundation2Depth"
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
      { label: "Hazard Classification", value: "5-Tier Dynamic", detail: "Multi-factor Critical to Zero-Risk severity grading" },
      { label: "Spectral & Radar Indices", value: "7 Live Pipelines", detail: "NDVI, NDWI, MNDWI, SAR delta-dB, VCI drought, delta-NBR & TWI" },
      { label: "Training Corpus Pool", value: "1.14M+ Samples", detail: "1.12M tabular flood records + 20 GDACS GeoTIFFs + 25K depth scenarios" }
    ],
    links: {
      demo: "https://xylium117.github.io/ecopulse/",
      github: "https://github.com/xylium117/ecopulse"
    }
  }
];
