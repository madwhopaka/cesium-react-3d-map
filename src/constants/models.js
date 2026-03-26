/* ----------------------------------
   Model Registry - 3 Towers with Realistic Dimensions
   
   altitude: Where the tower base is (0 = ground, >0 = on building)
   towerHeight: Actual height of the tower structure
   scale: Model scale factor
----------------------------------- */

export const MODELS = [
  {
    id: "SICA001946",
    name: "Tower SICA001946, Monopole",
    lon: 135.502121,
    lat: 34.693735,
    altitude: 90,
    towerHeight: 30,
    scale: 2.1,
    blipColor: "#f5f5f5",
    status: "Maintenance due",
    uri: "/models/SICA001946.glb",
    towerSpecs: {
      type: "Monopole",
      location: "Osaka, Japan",
      height: "30 m",
      baseWidth: "1.6 m",
      topWidth: "0.5 m",
      foundation: "Pad Foundation",
      windLoad: "180 km/h",
      material: "Galvanized Steel",
      totalCapacity: "3000–3500 kg",
      currentLoad: "68%",
      availableCapacity: "Moderate",
      maintenance: "Good",
      summary:
        "The tower is moderately loaded and structurally capable of supporting additional telecom equipment. Equipment mix suggests a standard multi-operator or 4G-ready site with potential for 5G upgrade. Maintenance condition is stable with no critical risks, indicating normal operational reliability.",
    },
    parts: {
      cellular_antenna: {
        label: "Cellular Antenna",
        manufacturer: "Ericsson / Huawei",
        quantity: 9,
        dimensions: {
          height: "1.2–2.5 m",
          width: "0.3–0.5 m",
          depth: "0.15–0.25 m",
        },
        icon: "📡",
        position: "Top",
        positionReason:
          "Mounted at the top for maximum signal coverage and minimal obstruction",
        purpose: "Primary cellular communication",
        detailedPurpose:
          "Provides 2G/3G/4G/5G cellular coverage. Transmits and receives radio signals between the network and user devices",
        material: "Fiberglass radome with internal aluminum/copper elements",
        lifeDuration: "8–12 years",
      },
      omni_antenna: {
        label: "Omni Antenna",
        manufacturer: "CommScope / Kathrein",
        quantity: 4,
        dimensions: {
          height: "1.0–1.8 m",
          diameter: "40–80 mm",
        },
        icon: "📡",
        position: "Top",
        positionReason:
          "Positioned at the top to provide full 360° signal coverage",
        purpose: "Omnidirectional 360° RF coverage",
        detailedPurpose:
          "Provides uniform signal coverage in all directions. Used for broadcast, monitoring, or supplemental cellular coverage",
        material: "Fiberglass radome with internal antenna elements",
        lifeDuration: "10–15 years",
      },
      mini_transformer: {
        label: "Mini Transformer",
        manufacturer: "Siemens / ABB",
        quantity: 9,
        dimensions: {
          height: "0.8–1.2 m",
          width: "0.6–1.0 m",
          depth: "0.5–0.8 m",
        },
        icon: "⚡",
        position: "Mid / Base",
        positionReason:
          "Placed mid-tower or at base for easy access and to step down voltage for equipment",
        purpose: "Voltage step-down and power distribution",
        detailedPurpose:
          "Steps down high voltage supply to levels suitable for telecom equipment. Protects sensitive electronics from voltage fluctuations",
        material: "Steel enclosure with copper windings",
        lifeDuration: "15–20 years",
      },
      big_transformer: {
        label: "Big Transformer",
        manufacturer: "ABB / Schneider",
        quantity: 3,
        dimensions: {
          height: "1.5–2.2 m",
          width: "1.2–2.0 m",
          depth: "1.0–1.8 m",
        },
        icon: "⚡",
        position: "Ground",
        positionReason:
          "Ground-level installation for safety, weight management, and ease of maintenance",
        purpose: "Main power supply and voltage transformation",
        detailedPurpose:
          "Primary power transformation for the entire tower site. Converts grid supply to required voltage levels for all site equipment",
        material: "Heavy-duty steel enclosure with oil-cooled copper windings",
        lifeDuration: "20–30 years",
      },
      power_box: {
        label: "Power Box",
        manufacturer: "Delta / Emerson",
        quantity: 3,
        dimensions: {
          height: "1.5–2.0 m",
          width: "0.6–1.0 m",
          depth: "0.5–0.8 m",
        },
        icon: "⚙️",
        position: "Base",
        positionReason:
          "Base-mounted for accessibility, housing power management systems close to the main supply",
        purpose: "Power management and distribution",
        detailedPurpose:
          "Manages AC/DC power conversion, battery backup systems, and power distribution to all active equipment on site",
        material: "Steel cabinet with internal power electronics",
        lifeDuration: "7–10 years",
      },
    },
  },
  {
    id: "SITX024649",
    name: "Tower SITX024649, Monopole",
    lon: 141.354228,
    lat: 43.061949,
    altitude: 129.18,
    towerHeight: 36,
    scale: 2.2,
    blipColor: "#f5f5f5",
    status: "Offline",
    uri: "/models/SITX024649.glb",
    towerSpecs: {
      type: "Monopole",
      location: "Sapporo, Japan",
      height: "36 m",
      baseWidth: "1.8 m",
      topWidth: "0.45 m",
      foundation: "Deep Pile",
      windLoad: "200 km/h",
      material: "Galvanized Steel",
      totalCapacity: "4000–4500 kg",
      currentLoad: "82%",
      availableCapacity: "Low",
      maintenance: "Fair",
      summary:
        "This tower is heavily loaded, indicating a high-capacity multi-operator or urban deployment. Limited expansion capability suggests nearing structural or RF congestion limits. Maintenance condition indicates need for cable management optimization and preventive corrosion treatment.",
    },
    parts: {
      cellular_antenna: {
        label: "Cellular Antenna",
        manufacturer: "Huawei / Nokia",
        quantity: 11,
        dimensions: {
          height: "1.5–2.7 m",
          width: "0.35–0.55 m",
          depth: "0.18–0.30 m",
        },
        icon: "📡",
        position: "Top",
        positionReason:
          "Mounted at top for maximum LOS and cellular coverage in dense urban area",
        purpose: "Primary cellular communication",
        detailedPurpose:
          "Provides 2G/3G/4G/5G cellular coverage for high-density urban users. Multiple antennas support multi-operator sharing",
        material: "Fiberglass radome with internal aluminum/copper elements",
        lifeDuration: "8–12 years",
      },
      omni_antenna: {
        label: "Omni Antenna",
        manufacturer: "CommScope / RFS",
        quantity: 4,
        dimensions: {
          height: "1.2–2.0 m",
          diameter: "50–90 mm",
        },
        icon: "📡",
        position: "Top",
        positionReason:
          "Positioned at the top to provide full 360° signal coverage across surrounding area",
        purpose: "Omnidirectional 360° RF coverage",
        detailedPurpose:
          "Provides uniform signal coverage in all directions. Supplements sector antennas and supports monitoring or control links",
        material: "Fiberglass with internal antenna elements",
        lifeDuration: "10–15 years",
      },
      mini_transformer: {
        label: "Mini Transformer",
        manufacturer: "Siemens / Schneider",
        quantity: 3,
        dimensions: {
          height: "1.0–1.4 m",
          width: "0.7–1.1 m",
          depth: "0.6–0.9 m",
        },
        icon: "⚡",
        position: "Mid / Base",
        positionReason:
          "Located mid-tower or base for efficient voltage distribution to active equipment",
        purpose: "Voltage step-down and distribution",
        detailedPurpose:
          "Steps down incoming voltage for distribution to radio and processing equipment. Provides isolation and surge protection",
        material: "Steel housing with copper windings",
        lifeDuration: "15–20 years",
      },
      big_transformer: {
        label: "Big Transformer",
        manufacturer: "ABB / CG",
        quantity: 3,
        dimensions: {
          height: "1.8–2.5 m",
          width: "1.5–2.2 m",
          depth: "1.2–2.0 m",
        },
        icon: "⚡",
        position: "Ground",
        positionReason:
          "Installed at ground level for safety and structural load management",
        purpose: "Main power supply and voltage transformation",
        detailedPurpose:
          "Primary power transformation for the tower site. Converts and conditions grid power for all site equipment",
        material: "Heavy-duty steel enclosure with oil-cooled copper windings",
        lifeDuration: "20–30 years",
      },
      power_box: {
        label: "Power Box",
        manufacturer: "Delta / Vertiv",
        quantity: 4,
        dimensions: {
          height: "1.6–2.2 m",
          width: "0.7–1.2 m",
          depth: "0.6–0.9 m",
        },
        icon: "⚙️",
        position: "Base",
        positionReason:
          "Base-level placement for ease of monitoring and maintenance of power systems",
        purpose: "Power management and distribution",
        detailedPurpose:
          "Manages power distribution, AC/DC conversion, and battery backup. Ensures uninterrupted power to all active equipment",
        material: "Steel cabinet with internal power electronics",
        lifeDuration: "7–10 years",
      },
      panel_antenna: {
        label: "Panel Antenna",
        manufacturer: "Kathrein / Ericsson",
        quantity: 4,
        dimensions: {
          height: "1.3–2.6 m",
          width: "0.3–0.6 m",
          depth: "0.15–0.28 m",
        },
        icon: "📡",
        position: "Top",
        positionReason:
          "Mounted at top for directional sector coverage in targeted zones",
        purpose: "Directional cellular coverage",
        detailedPurpose:
          "Provides focused directional RF coverage for specific sectors. Reduces inter-sector interference and increases network capacity",
        material: "Fiberglass radome with copper/aluminum radiating elements",
        lifeDuration: "8–12 years",
      },
    },
  },
  {
    id: "204312",
    name: "Tower 204312, Lattice Tower",
    lon: 138.174895,
    lat: 36.646417,
    altitude: 468,
    towerHeight: 45,
    scale: 0.7,
    blipColor: "#f5f5f5",
    status: "Maintenance due",
    uri: "/models/204312.glb",
    towerSpecs: {
      type: "Lattice",
      location: "Nagano, Japan",
      height: "45 m",
      baseWidth: "6.0 m",
      topWidth: "1.5 m",
      foundation: "4-point Footing",
      windLoad: "210 km/h",
      material: "Angular Steel",
      totalCapacity: "6000–7500 kg",
      currentLoad: "61%",
      availableCapacity: "High",
      maintenance: "Good",
      summary:
        "This lattice tower has significant available capacity, making it suitable for future expansion or multi-operator deployment. Presence of microwave (parabolic) and multiple RRU units indicates a backhaul-enabled high-performance telecom site. Overall maintenance condition is stable with no immediate structural or operational concerns.",
    },
    parts: {
      cellular_antenna: {
        label: "Cellular Antenna",
        manufacturer: "Ericsson / Nokia",
        quantity: 6,
        dimensions: {
          height: "1.5–2.8 m",
          width: "0.35–0.6 m",
          depth: "0.2–0.35 m",
        },
        icon: "📡",
        position: "Top",
        positionReason:
          "Mounted at the top of the lattice tower for maximum coverage area",
        purpose: "Primary cellular communication",
        detailedPurpose:
          "Provides 2G/3G/4G/5G cellular coverage across a wide area. High mounting height on lattice tower enables extended coverage radius",
        material: "Fiberglass radome with internal aluminum/copper elements",
        lifeDuration: "8–12 years",
      },
      mini_transformer: {
        label: "Mini Transformer",
        manufacturer: "Siemens / ABB",
        quantity: 3,
        dimensions: {
          height: "1.0–1.5 m",
          width: "0.8–1.2 m",
          depth: "0.6–1.0 m",
        },
        icon: "⚡",
        position: "Lower",
        positionReason:
          "Installed at lower tower section for efficient power step-down close to base equipment",
        purpose: "Voltage step-down and power conditioning",
        detailedPurpose:
          "Steps down voltage for distribution to radio units. Provides electrical isolation and protection for sensitive equipment",
        material: "Steel housing with copper windings",
        lifeDuration: "15–20 years",
      },
      remote_radio: {
        label: "Remote Radio Unit (RRU)",
        manufacturer: "Huawei / Ericsson",
        quantity: 3,
        dimensions: {
          height: "0.4–0.7 m",
          width: "0.3–0.5 m",
          depth: "0.1–0.25 m",
        },
        icon: "📶",
        position: "Top",
        positionReason:
          "Co-located with antennas at the top to minimize cable loss and improve signal efficiency",
        purpose: "RF signal processing and transmission",
        detailedPurpose:
          "Converts digital baseband signals to RF for transmission and vice versa. Mounted close to antennas to reduce feeder cable losses and improve efficiency",
        material: "Aluminum housing for heat dissipation",
        lifeDuration: "7–10 years",
      },
      dule_remote_radio_unit: {
        label: "Dual RRU (Multi-band Radio Unit)",
        manufacturer: "Nokia / ZTE",
        quantity: 6,
        dimensions: {
          height: "0.5–0.8 m",
          width: "0.35–0.55 m",
          depth: "0.15–0.3 m",
        },
        icon: "📶",
        position: "Top",
        positionReason:
          "Installed at the top near antennas to serve multiple frequency bands simultaneously with minimal cable loss",
        purpose: "Multi-band RF transmission and reception",
        detailedPurpose:
          "Supports simultaneous operation across multiple frequency bands. Enables network operators to provide 4G/5G multi-band coverage from a single unit",
        material: "Aluminum enclosure for efficient thermal management",
        lifeDuration: "7–10 years",
      },
      omni_antenna: {
        label: "Omni Antenna",
        manufacturer: "CommScope / Kathrein",
        quantity: 3,
        dimensions: {
          height: "1.2–2.2 m",
          diameter: "50–100 mm",
        },
        icon: "📡",
        position: "Top",
        positionReason: "Top-mounted for full 360° coverage without obstruction",
        purpose: "Omnidirectional 360° RF coverage",
        detailedPurpose:
          "Provides uniform omnidirectional signal coverage. Typically used for network control links, monitoring, or supplemental coverage",
        material: "Fiberglass radome with internal antenna elements",
        lifeDuration: "10–15 years",
      },
      parabolic_antenna: {
        label: "Parabolic (Microwave) Antenna",
        manufacturer: "Huawei / Aviat Networks",
        quantity: 1,
        dimensions: {
          dishDiameter: "0.6–1.8 m",
          depth: "0.3–0.8 m",
        },
        icon: "📡",
        position: "Side",
        positionReason:
          "Mounted on the side of the tower for clear line-of-sight microwave backhaul link to remote site",
        purpose: "Microwave point-to-point backhaul",
        detailedPurpose:
          "Carries aggregated data traffic from the tower site to the core network via microwave link. Used where fiber connectivity is unavailable or as a redundant backhaul path",
        material:
          "Aluminum reflector dish with galvanized steel mounting hardware and weather-resistant coating",
        lifeDuration: "10–15 years",
      },
    },
  },
  {
    id: "SICO001139",
    name: "Tower SICO001139, Monopole",
    lon: 139.622089,
    lat: 35.487399,
    altitude: 46,
    towerHeight: 30,
    scale: 0.15,
    blipColor: "#f5f5f5",
    status: "Maintenance due",
    uri: "/models/SICO001139.glb",
    towerSpecs: {
      type: "Monopole",
      location: "Yokohama, Japan",
      height: "30 m",
      baseWidth: "1.2 m",
      topWidth: "0.5 m",
      foundation: "Monopole Base",
      windLoad: "180 km/h",
      material: "Tubular Steel",
      totalCapacity: "3000–4500 kg",
      currentLoad: "58%",
      availableCapacity: "Moderate",
      maintenance: "Good",
      summary:
        "This monopole tower provides efficient space utilization and moderate load capacity, suitable for urban or semi-urban deployments. Presence of multiple RF and power distribution units indicates a compact, integrated telecom site supporting broadband and cellular services. Overall maintenance condition is stable with no immediate structural or operational concerns.",
    },
    parts: {
      part_01: {
        label: "Cellular Antenna",
        manufacturer: "Ericsson / Nokia",
        quantity: 12,
        dimensions: {
          height: "1.2–2.5 m",
          width: "0.3–0.5 m",
          depth: "0.15–0.3 m",
        },
        icon: "📡",
        position: "Top",
        positionReason:
          "Mounted at top to maximize cellular signal range and minimize ground-level obstructions",
        purpose: "Primary cellular communication",
        detailedPurpose:
          "Provides broad 2G/3G/4G/5G cellular coverage for urban and semi-urban users. High quantity supports multi-operator or multi-band deployment",
        material: "Fiberglass radome with internal aluminum/copper elements",
        lifeDuration: "8–12 years",
      },
      nl_signal_antenna: {
        label: "NL Signal Antenna",
        manufacturer: "CommScope / Kathrein",
        quantity: 3,
        dimensions: {
          height: "0.8–1.8 m",
          width: "0.25–0.45 m",
          depth: "0.1–0.25 m",
        },
        icon: "📡",
        position: "Mid",
        positionReason:
          "Positioned mid-tower for optimized near-line signal distribution",
        purpose: "Near-line signal distribution and coverage",
        detailedPurpose:
          "Handles near-line signal management for localized RF coverage. Complements primary antennas for intermediate coverage zones",
        material: "Fiberglass radome with composite internal elements",
        lifeDuration: "8–10 years",
      },
      rf_signal_antenna: {
        label: "RF Signal Antenna",
        manufacturer: "Huawei / ZTE",
        quantity: 3,
        dimensions: {
          height: "1.0–2.2 m",
          width: "0.3–0.5 m",
          depth: "0.15–0.3 m",
        },
        icon: "📡",
        position: "Top",
        positionReason:
          "Top-mounted alongside cellular antennas for co-located RF signal management",
        purpose: "RF signal transmission and management",
        detailedPurpose:
          "Provides dedicated RF signal handling for broadband and cellular services. Works in conjunction with RRU units to optimize signal quality",
        material: "Composite radome with internal RF elements",
        lifeDuration: "7–10 years",
      },
      omni_antenna: {
        label: "Omni Antenna",
        manufacturer: "CommScope / Kathrein",
        quantity: 5,
        dimensions: {
          height: "1.0–2.0 m",
          diameter: "40–90 mm",
        },
        icon: "📡",
        position: "Top",
        positionReason:
          "Top-mounted for unobstructed omnidirectional signal coverage",
        purpose: "Omnidirectional 360° RF coverage",
        detailedPurpose:
          "Provides uniform signal in all directions for monitoring, control links, or supplemental coverage. Supports full-site RF coverage without gaps",
        material: "Fiberglass with internal antenna elements",
        lifeDuration: "10–15 years",
      },
      rru_power: {
        label: "RRU Power Unit",
        manufacturer: "Ericsson / Huawei",
        quantity: 3,
        dimensions: {
          height: "0.4–0.7 m",
          width: "0.3–0.5 m",
          depth: "0.15–0.25 m",
        },
        icon: "⚡",
        position: "Top",
        positionReason:
          "Co-located with RRUs at top to minimize power cable length and losses",
        purpose: "Power supply for Remote Radio Units",
        detailedPurpose:
          "Delivers dedicated power to Remote Radio Units at the top of the tower. Reduces power losses associated with long cable runs from the base",
        material: "Aluminum housing for efficient thermal management",
        lifeDuration: "7–10 years",
      },
      dsl_remote: {
        label: "DSL Remote Unit",
        manufacturer: "Nokia / ZTE",
        quantity: 4,
        dimensions: {
          height: "0.5–1.0 m",
          width: "0.4–0.6 m",
          depth: "0.2–0.4 m",
        },
        icon: "⚙️",
        position: "Base",
        positionReason:
          "Installed at base for easy access to DSL backhaul connections and maintenance",
        purpose: "DSL backhaul termination and management",
        detailedPurpose:
          "Terminates and manages DSL backhaul connections between the tower site and the core network. Handles signal processing for xDSL broadband links",
        material: "Steel enclosure with internal electronic components",
        lifeDuration: "6–10 years",
      },
      transmitter_panel: {
        label: "Transmitter Panel",
        manufacturer: "Ericsson / Huawei",
        quantity: 3,
        dimensions: {
          height: "0.6–1.2 m",
          width: "0.4–0.7 m",
          depth: "0.2–0.4 m",
        },
        icon: "📡",
        position: "Top",
        positionReason:
          "Mounted near the top to minimize transmission line losses to antennas",
        purpose: "RF signal transmission",
        detailedPurpose:
          "Handles RF signal amplification and transmission to panel antennas. Provides controlled directional RF output for sector coverage",
        material: "Aluminum housing for heat dissipation",
        lifeDuration: "8–12 years",
      },
      llp_power: {
        label: "LLP Power Unit",
        manufacturer: "ABB / Siemens",
        quantity: 2,
        dimensions: {
          height: "0.5–1.0 m",
          width: "0.4–0.8 m",
          depth: "0.3–0.5 m",
        },
        icon: "⚡",
        position: "Base",
        positionReason:
          "Base-level installation for protection against lightning-induced power surges",
        purpose: "Lightning and surge power protection",
        detailedPurpose:
          "Protects all base equipment from lightning-induced transients and power surges. Acts as primary power protection layer for the tower site electrical system",
        material: "Steel enclosure with surge protection components",
        lifeDuration: "10–15 years",
      },
      dd_power: {
        label: "DD Power Unit",
        manufacturer: "Schneider / Eaton",
        quantity: 6,
        dimensions: {
          height: "0.6–1.2 m",
          width: "0.5–0.9 m",
          depth: "0.3–0.6 m",
        },
        icon: "⚙️",
        position: "Base",
        positionReason:
          "Base-mounted for centralized DC power distribution to tower equipment",
        purpose: "DC power distribution",
        detailedPurpose:
          "Manages and distributes DC power throughout the tower site. Provides regulated DC supply to all active telecom equipment requiring DC input",
        material: "Steel cabinet with internal DC power electronics",
        lifeDuration: "10–15 years",
      },
    },
  },
  {
    id: "A001",
    name: "Tower A001, Slim Monopole",
    lon: 136.760837,
    lat: 35.424416,
    altitude: 52.56,
    towerHeight: 24,
    scale: 0.4,
    blipColor: "#f5f5f5",
    uri: "/models/Site A001.glb",
      status: "Active",
    towerSpecs: {
      type: "Monopole",
      location: "Near Gifu, Japan",
      height: "24 m",
      baseWidth: "0.9 m",
      topWidth: "0.35 m",
      foundation: "Single-base Foundation",
      windLoad: "160 km/h",
      material: "Galvanized Tubular Steel",
      totalCapacity: "1800–2500 kg",
      currentLoad: "72%",
      availableCapacity: "Moderate-Low",
      maintenance: "Fair",
      summary:
        "This slim monopole tower is designed for compact deployments, typically in urban or roadside environments. Equipment configuration indicates a space-optimized setup with integrated RF and signal management units. Moderate-to-high loading suggests limited expansion capacity, requiring careful planning for additional equipment.",
    },
    parts: {
      cellular_antenna: {
        label: "Cellular Antenna",
        manufacturer: "Huawei / Ericsson",
        quantity: 2,
        dimensions: {
          height: "1.2–2.2 m",
          width: "0.3–0.5 m",
          depth: "0.15–0.25 m",
        },
        icon: "📡",
        position: "Top",
        positionReason:
          "Mounted at the top of the slim monopole for maximum signal reach in compact urban setting",
        purpose: "Primary cellular communication",
        detailedPurpose:
          "Provides cellular coverage for 2G/3G/4G services in dense urban or roadside environments. Compact configuration suits space-constrained deployments",
        material: "Fiberglass radome with internal aluminum/copper elements",
        lifeDuration: "8–12 years",
      },
      main_pole: {
        label: "Main Pole (Tower Structure)",
        manufacturer: "Local / Tata Steel",
        quantity: 2,
        dimensions: {
          height: "24 m",
          diameter: "0.9–0.35 m (tapered)",
        },
        icon: "🏗️",
        position: "Central (Full Height)",
        positionReason:
          "Forms the primary structural member of the monopole tower, supporting all attached equipment",
        purpose: "Primary structural support for tower and all equipment",
        detailedPurpose:
          "Tapered tubular steel pole that carries all vertical and lateral loads from antennas, radio units, and cables. Designed for wind resistance and structural stability",
        material: "Galvanized tubular steel",
        lifeDuration: "25–40 years",
      },
      mmt_box: {
        label: "MMT Box (Multi-Mode Terminal)",
        manufacturer: "Nokia / Ericsson",
        quantity: 1,
        dimensions: {
          height: "0.6–1.0 m",
          width: "0.5–0.8 m",
          depth: "0.3–0.6 m",
        },
        icon: "⚙️",
        position: "Mid",
        positionReason:
          "Mid-tower placement balances cable length from antennas and accessibility for maintenance",
        purpose: "Multi-mode signal processing and management",
        detailedPurpose:
          "Handles multi-mode signal processing tasks including protocol conversion and signal aggregation. Interfaces between radio units and backhaul network",
        material: "Steel / Aluminum enclosure",
        lifeDuration: "8–12 years",
      },
      radio_heads: {
        label: "Radio Heads",
        manufacturer: "Huawei / ZTE",
        quantity: 1,
        dimensions: {
          height: "0.4–0.7 m",
          width: "0.3–0.5 m",
          depth: "0.15–0.3 m",
        },
        icon: "📶",
        position: "Top",
        positionReason:
          "Positioned at top near antennas to minimize RF cable losses",
        purpose: "RF signal transmission and reception",
        detailedPurpose:
          "Active RF components that transmit and receive radio signals. Co-located with antennas at the top to minimize feeder cable losses and improve overall signal efficiency",
        material: "Aluminum housing for heat dissipation",
        lifeDuration: "7–10 years",
      },
      rf_cable_box: {
        label: "RF Cable Box",
        manufacturer: "CommScope / Rosenberger",
        quantity: 1,
        dimensions: {
          height: "0.5–0.9 m",
          width: "0.4–0.7 m",
          depth: "0.2–0.4 m",
        },
        icon: "🔧",
        position: "Mid",
        positionReason:
          "Mid-tower placement for organized cable routing between top RF equipment and base units",
        purpose: "RF cable management and routing",
        detailedPurpose:
          "Organizes and protects RF coaxial cables running between antennas/radio heads and base equipment. Prevents cable damage and maintains signal integrity",
        material: "Polymer / Metal enclosure",
        lifeDuration: "10–15 years",
      },
      rru: {
        label: "Remote Radio Unit (RRU)",
        manufacturer: "Ericsson / Nokia",
        quantity: 2,
        dimensions: {
          height: "0.4–0.8 m",
          width: "0.3–0.5 m",
          depth: "0.15–0.3 m",
        },
        icon: "📶",
        position: "Top",
        positionReason:
          "Mounted near antennas at the top to reduce feeder cable losses and improve signal efficiency",
        purpose: "Remote RF signal processing",
        detailedPurpose:
          "Converts digital baseband signals to RF and vice versa at the antenna location. Reduces signal loss compared to traditional base-station configurations",
        material: "Aluminum housing for efficient heat dissipation",
        lifeDuration: "7–10 years",
      },
      upper_pole: {
        label: "Upper Pole Extension",
        manufacturer: "Local / OEM",
        quantity: 1,
        dimensions: {
          height: "2–4 m",
          diameter: "0.2–0.35 m",
        },
        icon: "🏗️",
        position: "Top",
        positionReason:
          "Extends the effective height of the tower to mount antennas and lightning protection at optimal elevation",
        purpose: "Height extension for antenna mounting",
        detailedPurpose:
          "Adds additional height above the main pole section to provide clearance for antenna arrays and lightning protection systems",
        material: "Steel",
        lifeDuration: "20–30 years",
      },
      junction_box: {
        label: "Junction Box",
        manufacturer: "Schneider / ABB",
        quantity: 1,
        dimensions: {
          height: "0.4–0.8 m",
          width: "0.3–0.6 m",
          depth: "0.2–0.4 m",
        },
        icon: "⚙️",
        position: "Lower",
        positionReason:
          "Lower tower position for convenient cable termination and power/signal distribution point",
        purpose: "Electrical distribution and cable termination",
        detailedPurpose:
          "Central termination point for power and signal cables. Distributes electrical connections to various equipment on the tower and provides overcurrent protection",
        material: "Polycarbonate / Metal enclosure",
        lifeDuration: "10–15 years",
      },
    },
  },
  {
    id: "78266",
    name: "Tower 78266, Ground-Based Lattice Tower (3-Legged Hybrid)",
    lon: 139.584000,
    lat: 35.915467,
    altitude: 52.99,
    towerHeight: 50,
    scale: 2,
    uri: "/models/78266.glb",
      status: "Offline",
    towerSpecs: {
      type: "Ground-Based Lattice Tower (3-Legged Hybrid Structure)",
      location: "Saitama, Japan",
      height: "50 m",
      baseWidth: "5.5 m",
      topWidth: "1.8 m",
      foundation: "Reinforced concrete isolated footings (3-point foundation)",
      windLoad: "Up to 220 km/h",
      material: "Hot-dip galvanized angular steel",
      totalCapacity: "~7000–9000 kg",
      currentLoad: "76%",
      availableCapacity: "Moderate",
      maintenance: "Fair",
      summary:
        "This lattice tower supports a dense multi-level antenna configuration, indicating a high-capacity urban or network hub deployment. Moderate available capacity suggests the tower is actively utilized but still allows controlled expansion. Maintenance condition highlights the need for cable management optimization due to high equipment density.",
    },
    parts: {
      cellular_antenna: {
        label: "Cellular Antenna",
        manufacturer: "Ericsson / Huawei",
        quantity: 6,
        dimensions: {
          height: "1.5–2.8 m",
          width: "0.35–0.6 m",
          depth: "0.2–0.35 m",
        },
        icon: "📡",
        position: "Multi-level sectorized arrays across tower faces",
        positionReason:
          "Distributed across multiple levels on the lattice faces to provide high-capacity sectorized LTE and 5G coverage across all azimuths",
        purpose: "LTE & 5G cellular communication",
        detailedPurpose:
          "Provides multi-level sectorized LTE and 5G coverage. Distributed antenna placement maximizes coverage while reducing interference between sectors",
        material: "Fiberglass radome with internal aluminum/copper elements",
        lifeDuration: "8–12 years",
      },
      mmt_box: {
        label: "MMT Box (Multi-Mode Terminal)",
        manufacturer: "Nokia / Ericsson",
        quantity: 24,
        dimensions: {
          height: "0.6–1.2 m",
          width: "0.5–0.9 m",
          depth: "0.3–0.6 m",
        },
        icon: "⚙️",
        position: "Intermediate platforms",
        positionReason:
          "Installed at multiple intermediate platform levels to handle signal processing close to antenna arrays, minimizing cable losses",
        purpose: "Signal processing and integration",
        detailedPurpose:
          "Handles multi-mode signal processing, protocol conversion, and signal aggregation at each antenna level. High quantity reflects the dense multi-level antenna configuration of this tower",
        material: "Powder-coated steel / Aluminum enclosure",
        lifeDuration: "8–12 years",
      },
      radio_heads: {
        label: "Radio Heads",
        manufacturer: "Huawei / ZTE",
        quantity: 4,
        dimensions: {
          height: "0.4–0.8 m",
          width: "0.3–0.5 m",
          depth: "0.15–0.3 m",
        },
        icon: "📶",
        position: "Adjacent to antennas",
        positionReason:
          "Co-located with antenna arrays to minimize feeder cable losses and maximize RF amplification efficiency",
        purpose: "RF amplification and signal conditioning",
        detailedPurpose:
          "Amplifies and conditions RF signals adjacent to antenna elements. Improves signal quality and reduces end-to-end transmission losses across the multi-level antenna system",
        material: "Die-cast aluminum for robust heat dissipation",
        lifeDuration: "7–10 years",
      },
      rru: {
        label: "Remote Radio Unit (RRU)",
        manufacturer: "Ericsson / Nokia",
        quantity: 3,
        dimensions: {
          height: "0.4–0.9 m",
          width: "0.3–0.5 m",
          depth: "0.15–0.3 m",
        },
        icon: "📶",
        position: "Near antennas",
        positionReason:
          "Mounted near antenna arrays to convert digital baseband signals to RF with minimal transmission loss",
        purpose: "Signal transmission and reception",
        detailedPurpose:
          "Converts digital baseband signals to RF for transmission and vice versa. Positioned near antennas to reduce feeder cable losses and improve system efficiency",
        material: "Aluminum alloy enclosure",
        lifeDuration: "7–10 years",
      },
      rf_cable_box: {
        label: "RF Cable Box",
        manufacturer: "CommScope / Rosenberger",
        quantity: 1,
        dimensions: {
          height: "0.5–1.0 m",
          width: "0.4–0.8 m",
          depth: "0.25–0.5 m",
        },
        icon: "🔧",
        position: "Along cable routes",
        positionReason:
          "Positioned along main cable routing paths to protect and organize RF connections between antenna levels and base equipment",
        purpose: "RF connection protection and cable management",
        detailedPurpose:
          "Organizes and protects RF coaxial cable connections running between antenna arrays and base equipment. Ensures signal integrity and prevents cable damage in the dense multi-level installation",
        material: "Coated metal / Polymer enclosure",
        lifeDuration: "10–15 years",
      },
      junction_box: {
        label: "Junction Box",
        manufacturer: "Schneider Electric / ABB",
        quantity: 2,
        dimensions: {
          height: "0.5–1.0 m",
          width: "0.4–0.8 m",
          depth: "0.3–0.6 m",
        },
        icon: "⚙️",
        position: "Multiple levels",
        positionReason:
          "Installed at multiple tower levels to provide distributed electrical distribution points, reducing long cable runs and improving fault isolation",
        purpose: "Electrical distribution across tower levels",
        detailedPurpose:
          "Provides distributed cable termination and power distribution at multiple levels of the tower. Enables efficient electrical management for the high-density, multi-level equipment configuration",
        material: "Steel / Polycarbonate enclosure",
        lifeDuration: "10–15 years",
      },
    },
  },
];

export const MODEL_LOOKUP = Object.fromEntries(
  MODELS.map((m) => [m.id, m])
);