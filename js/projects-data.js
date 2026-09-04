
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
    tagline: "Planetary climate analytics engine with multi-spectral vegetation tracking, carbon flux anomaly alerts & deep learning wildfire segmentation",
    category: "ai",
    categoryLabel: "Climate & Geospatial AI",
    image: "assets/images/project_ecopulse.jpg",
    featured: false,
    stats: {
      resolution: "10m Resolution",
      sensors: "Sentinel-2 & Landsat",
      model: "Spatio-Temporal U-Net"
    },
    tags: [
      "Python",
      "FastAPI",
      "TensorFlow",
      "Google Earth Engine",
      "Leaflet",
      "Mapbox GL",
      "Remote Sensing"
    ],
    overview: "An interactive planetary climate analytics engine and environmental monitoring platform featuring multi-spectral NDVI/NDWI tracking, real-time carbon flux anomaly detection, agricultural drought risk modeling (VCI), and spatio-temporal deep learning burn scar segmentation over Sentinel-2 and Landsat imagery.",
    highlights: [
      "Developed Spatio-Temporal U-Net with ConvLSTM2D bottlenecks to segment wildfire burn scars and canopy loss across multi-spectral temporal granules.",
      "Integrated Google Earth Engine API with high-fidelity deterministic synthetic fallback for real-time NDVI, NDWI, and carbon flux time series analysis.",
      "Built dynamic XYZ raster tile streaming pipeline generating real-time multi-spectral planetary overlays (NDVI, carbon flux, drought VCI, burn scars).",
      "Engineered dual-engine geospatial UI combining zero-key Open Satellite Leaflet rendering with Mapbox 3D atmospheric globe visualizations."
    ],
    metrics: [
      { label: "Spatial Resolution", value: "10m / 30m", detail: "Sentinel-2 MSI & Landsat-8/9 OLI reflectance" },
      { label: "Tile Stream Latency", value: "< 32ms", detail: "Dynamic XYZ multi-spectral raster streaming" },
      { label: "Planetary Coverage", value: "4,280 Mha", detail: "8 global biomes across major forest basins" },
      { label: "Model Inference", value: "~120ms", detail: "Spatio-temporal U-Net burn scar segmentation" },
      { label: "Anomaly Sensitivity", value: "±2.0σ Z-Score", detail: "Statistical anomaly flagging against seasonal baselines" }
    ],
    links: {
      demo: "https://xylium117.github.io/ecopulse/",
      github: "https://github.com/xylium117/ecopulse"
    }
  }
];
