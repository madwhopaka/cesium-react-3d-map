/* ----------------------------------
   Model Registry - 3 Towers with Realistic Dimensions
   
   altitude: Where the tower base is (0 = ground, >0 = on building)
   towerHeight: Actual height of the tower structure
   scale: Model scale factor
----------------------------------- */

export const MODELS = [
  {
    id: "tower_1",
    name: "Central Honshu, Guyed Lattice Tower",
    lon: 139.446046,
    lat: 36.343633,
    altitude: 177,
    towerHeight: 101,
    scale: 2,
    uri: "/models/Tower 1 new.glb",
    parts: {
      "Lightning Arrestor and other meshes": {
        label: "Lightning Arrestor with RF Omni Antenna",
        manufacturer: "CommScope / Huber+Suhner",
        dimensions: {
          height: "~1.2–2.5 m",
          diameter: "~50–120 mm (omni antenna)"
        },
        icon: "⚡",
        position: "Installed at the absolute top of the tower",
        positionReason:
          "Highest point to intercept lightning strikes and provide maximum unobstructed signal coverage",
        purpose:
          "Intercepts lightning strikes and safely grounds electrical energy. Provides omnidirectional low-power RF communication for monitoring and control",
        detailedPurpose: "Lightning protection: Safely directs lightning energy into tower grounding system. Radio communication: Used for low-power links such as monitoring, control, or backup communication",
        material:
          "Lightning rod: Copper or copper-clad steel. Antenna elements: Aluminum or copper. Outer cover (radome): UV-resistant fiberglass or plastic. Internal grounding parts: Copper",
        lifeDuration: "20–25 years",
      },

      "Red side supports": {
        label: "Sector Panel Antennas",
        manufacturer: "Ericsson / Nokia / Huawei",
        dimensions: {
          height: "~1.2–2.6 m",
          width: "~250–400 mm",
          depth: "~150–250 mm"
        },
        icon: "📡",
        position:
          "Installed near the top of the mobile tower, below the lightning protection system",
        positionReason:
          "Mounted on multiple sides to create sectors (typically 3 × 120° coverage). Positioned at high elevation to maximize coverage area and minimize signal obstruction",
        purpose:
          "Primary cellular antennas for 2G, 3G, 4G LTE, and 5G. Provide directional sector coverage to increase capacity and reduce interference",
        detailedPurpose:
          "Primary interface between mobile network and user devices. Transmits/receives radio signals for 2G, 3G, 4G LTE, and 5G NR. Multiple panels allow directional coverage, higher user capacity, and reduced interference",
        material:
          "Radome: Fiberglass-reinforced plastic (FRP) or RF-transparent polymer, UV-resistant. Internal elements: Copper or aluminum radiating elements. Mounting hardware: Hot-dip galvanized steel or stainless steel brackets",
        lifeDuration: "15–20 years",
      },

      "Metal side supports": {
        label: "Sector Panel Antennas",
        manufacturer: "Ericsson / Nokia / Huawei",
        dimensions: {
          height: "~1.2–2.6 m",
          width: "~250–400 mm",
          depth: "~150–250 mm"
        },
        icon: "📡",
        position:
          "Installed near the top of the mobile tower, below the lightning protection system",
        positionReason:
          "Mounted on multiple sides to create sectors (typically 3 × 120° coverage). Positioned at high elevation to maximize coverage area and minimize signal obstruction",
        purpose:
          "Primary cellular antennas for 2G, 3G, 4G LTE, and 5G. Provide directional sector coverage to increase capacity and reduce interference",
        detailedPurpose:
          "Primary interface between mobile network and user devices. Transmits/receives radio signals for 2G, 3G, 4G LTE, and 5G NR. Multiple panels allow directional coverage, higher user capacity, and reduced interference",
        material:
          "Radome: Fiberglass-reinforced plastic (FRP) or RF-transparent polymer, UV-resistant. Internal elements: Copper or aluminum radiating elements. Mounting hardware: Hot-dip galvanized steel or stainless steel brackets",
        lifeDuration: "15–20 years",
      },

      "Main antenna": {
        label: "Microwave Point-to-Point Dish Antenna",
        manufacturer: "NEC / Aviat Networks / Ericsson",
        dimensions: {
          dishDiameter: "~0.6–3.7 m"
        },
        icon: "📶",
        position:
          "Mounted high on the tower, below the lightning protection zone",
        positionReason:
          "Needs clear line-of-sight to another tower for long-distance communication. Positioned away from other antennas to reduce interference",
        purpose:
          "Provides high-capacity point-to-point wireless backhaul. Connects remote towers where fiber is unavailable",
        detailedPurpose:
          "Provides backhaul connectivity. Carries large volumes of data between towers or from tower to core network. Used where fiber optic cable is unavailable",
        material:
          "Dish: Aluminum or steel. Mounting brackets: Galvanized steel. Feed horn and waveguide: Aluminum or brass. Protective coating: Weather-resistant paint or powder coating",
        lifeDuration: "15–25 years",
      },

      "Cloth covers": {
        label: "Microwave Point-to-Point Dish Antenna",
        manufacturer: "NEC / Aviat Networks / Ericsson",
        dimensions: {
          dishDiameter: "~0.6–3.7 m"
        },
        icon: "📶",
        position:
          "Mounted high on the tower, below the lightning protection zone",
        positionReason:
          "Needs clear line-of-sight to another tower for long-distance communication. Positioned away from other antennas to reduce interference",
        purpose:
          "Provides high-capacity point-to-point wireless backhaul. Connects remote towers where fiber is unavailable",
        detailedPurpose:
          "Provides backhaul connectivity. Carries large volumes of data between towers or from tower to core network. Used where fiber optic cable is unavailable",
        material:
          "Dish: Aluminum or steel. Mounting brackets: Galvanized steel. Feed horn and waveguide: Aluminum or brass. Protective coating: Weather-resistant paint or powder coating",
        lifeDuration: "15–25 years",
      },
    },
  },
  {
    id: "tower_2",
    name: "Shinjuku area, Cellular monopole Tower",
    lon: 139.696634,
    lat: 35.689771,
    altitude: 115.8,
    towerHeight: 18,
    scale: 18,
    uri: "/models/Tower 2 new.glb",
    parts: {
  
      antenna2_metal1_0: {
        label: "Massive MIMO Antenna Array (5G)",
        manufacturer: "Ericsson / Nokia / Samsung Networks",
        dimensions: {
          height: "~1.0–1.8 m",
          width: "~400–600 mm",
          depth: "~250–350 mm"
        },
        icon: "📡",
        position:
          "Mounted near the very top of the monopole, just below the crown",
        positionReason:
          "Installed in circular arrangement for uniform 360° coverage. Positioned high to support dense urban 5G coverage and reduce obstruction",
        purpose:
          "Enables high-capacity 5G NR using beamforming. Supports dense user environments with simultaneous connections",
        detailedPurpose:
          "Supports 5G New Radio (NR), especially mid-band frequencies. Uses Massive MIMO to serve many users simultaneously and perform beamforming for higher data rates. Designed for high-capacity, short-to-medium range coverage",
        material:
          "Radome: RF-transparent composite plastic or fiberglass. Internal antenna elements: Copper or aluminum. Mounting brackets: Galvanized steel or aluminum. Cabling: Shielded copper RF cables and fiber optic cables. Integrated radio and cooling components",
        lifeDuration: "10–15 years",
      },

      antenna2_alum_0: {
        label: "Antenna Mounting Platform / RF Safety Fence",
        manufacturer: "Valmont Industries / Sabre Industries",
        dimensions: {
          platformWidth: "~1.5–4 m"
        },
        icon: "🔧",
        position:
          "Installed around the monopole at antenna height, below or between active antenna arrays",
        positionReason:
          "Encircles the tower to provide 360° access. Support multiple antennas and radio units while maintaining correct spacing. Allows technicians safe access during installation and maintenance",
        purpose:
          "Supports antennas, radio units, and cabling. Provides safe access for installation and maintenance crews",
        detailedPurpose:
          "Acts as structural support frame for mounting antennas, RRUs, and cabling. Provides stable working platform for tower maintenance crews. The surrounding mesh/fencing limits accidental access into high RF exposure areas and acts as visual and physical safety barrier",
        material:
          "Main platform structure: Hot-dip galvanized structural steel. Cross-bracing: Galvanized steel for rigidity. RF safety fence: Galvanized steel wire mesh or expanded metal. Mounting clamps: Stainless steel or galvanized steel bolts. Protective finish: Anti-corrosion galvanization",
        lifeDuration: "25–30 years",
      },

      antenna2_alum2_0: {
        label: "Antenna Mounting Platform / RF Safety Fence",
        manufacturer: "Valmont Industries / Sabre Industries",
        dimensions: {
          platformWidth: "~1.5–4 m"
        },
        icon: "🔧",
        position:
          "Installed around the monopole at antenna height, below or between active antenna arrays",
        positionReason:
          "Encircles the tower to provide 360° access. Support multiple antennas and radio units while maintaining correct spacing. Allows technicians safe access during installation and maintenance",
        purpose:
          "Supports antennas, radio units, and cabling. Provides safe access for installation and maintenance crews",
        detailedPurpose:
          "Acts as structural support frame for mounting antennas, RRUs, and cabling. Provides stable working platform for tower maintenance crews. The surrounding mesh/fencing limits accidental access into high RF exposure areas and acts as visual and physical safety barrier",
        material:
          "Main platform structure: Hot-dip galvanized structural steel. Cross-bracing: Galvanized steel for rigidity. RF safety fence: Galvanized steel wire mesh or expanded metal. Mounting clamps: Stainless steel or galvanized steel bolts. Protective finish: Anti-corrosion galvanization",
        lifeDuration: "25–30 years",
      },

      antenna2_Concrete_0: {
        label: "Base Transceiver Station (BTS) Cabinet",
        manufacturer: "Ericsson / Nokia / Huawei",
        dimensions: {
          height: "~1.6–2.2 m",
          width: "~600–900 mm",
          depth: "~600–800 mm"
        },
        icon: "⚙️",
        position:
          "Installed at the base of the tower, mounted on a concrete foundation",
        positionReason:
          "Positioned at ground level to allow easy maintenance and monitoring, reduce weight load on tower, and improve safety and accessibility",
        purpose:
          "Houses baseband units, power systems, and batteries. Interfaces antennas with fiber backhaul and core network",
        detailedPurpose:
          "Houses baseband units (BBU). Contains power systems including AC/DC converters, battery backup, and surge/lightning protection. Connects tower equipment to fiber optic backhaul and network core infrastructure",
        material:
          "Cabinet enclosure: Powder-coated steel or aluminum. Internal racks: Galvanized steel. Cooling system: Aluminum heat sinks and fans. Base foundation: Reinforced concrete",
        lifeDuration: "15–20 years",
      },

      antenna2_metal7_0: {
        label: "Base Transceiver Station (BTS) Cabinet",
        manufacturer: "Ericsson / Nokia / Huawei",
        dimensions: {
          height: "~1.6–2.2 m",
          width: "~600–900 mm",
          depth: "~600–800 mm"
        },
        icon: "⚙️",
        position:
          "Installed at the base of the tower, mounted on a concrete foundation",
        positionReason:
          "Positioned at ground level to allow easy maintenance and monitoring, reduce weight load on tower, and improve safety and accessibility",
        purpose:
          "Houses baseband units, power systems, and batteries. Interfaces antennas with fiber backhaul and core network",
        detailedPurpose:
          "Houses baseband units (BBU). Contains power systems including AC/DC converters, battery backup, and surge/lightning protection. Connects tower equipment to fiber optic backhaul and network core infrastructure",
        material:
          "Cabinet enclosure: Powder-coated steel or aluminum. Internal racks: Galvanized steel. Cooling system: Aluminum heat sinks and fans. Base foundation: Reinforced concrete",
        lifeDuration: "15–20 years",
      },
    },
  },
  {
    id: "tower_3",
    name: "Yokohama Bay, Lattice communication Tower",
    lon: 139.339381,
    lat: 35.369106,
    altitude: 45.9,
    towerHeight: 12,
    scale: 10,
    uri: "/models/Tower 3 new.glb",
    parts: {
      Mesh023: {
        label: "Sector Panel Antennas (Secondary / Additional Sectors)",
        manufacturer: "Ericsson / Nokia / Huawei",
        dimensions: {
          height: "~1.2–2.6 m",
          width: "~250–400 mm"
        },
        icon: "📡",
        position: "Installed at the uppermost section of the tower",
        positionReason: "Maximizes coverage radius in open terrain. Adds additional sectors or capacity layers",
        purpose: "Primary cellular communication (2G–5G). Supports network densification and redundancy",
        material: "Composite or fiberglass radome. Aluminum/copper radiators. Galvanized steel mounts",
        lifeDuration: "15–20 years",
      },

      Mesh023_3: {
        label: "Sector Panel Antennas (Secondary / Additional Sectors)",
        manufacturer: "Ericsson / Nokia / Huawei",
        dimensions: {
          height: "~1.2–2.6 m",
          width: "~250–400 mm"
        },
        icon: "📡",
        position: "Installed at the uppermost section of the tower",
        positionReason: "Maximizes coverage radius in open terrain. Adds additional sectors or capacity layers",
        purpose: "Primary cellular communication (2G–5G). Supports network densification and redundancy",
        material: "Composite or fiberglass radome. Aluminum/copper radiators. Galvanized steel mounts",
        lifeDuration: "15–20 years",
      },

      Mesh023_5: {
        label: "Microwave Backhaul Dish Antenna",
        manufacturer: "NEC / Aviat Networks / Ceragon Networks",
        dimensions: {
          dishDiameter: "~0.6–2.4 m"
        },
        icon: "📶",
        position: "Mounted at mid-height of the tower",
        positionReason: "Clear line-of-sight with reduced wind loading. Needs clear line-of-sight to another tower",
        purpose: "Point-to-point backhaul data transmission. Carries aggregated traffic from multiple sectors. Ensures reliable high-speed backhaul connectivity",
        material: "Aluminum reflector. Galvanized steel mounting system. Weather-resistant coatings",
        lifeDuration: "15–25 years",
      },

      Mesh023_6: {
        label: "Microwave Backhaul Dish Antenna",
        manufacturer: "NEC / Aviat Networks / Ceragon Networks",
        dimensions: {
          dishDiameter: "~0.6–2.4 m"
        },
        icon: "📶",
        position: "Mounted at mid-height of the tower",
        positionReason: "Clear line-of-sight with reduced wind loading. Needs clear line-of-sight to another tower",
        purpose: "Point-to-point backhaul data transmission. Carries aggregated traffic from multiple sectors. Ensures reliable high-speed backhaul connectivity",
        material: "Aluminum reflector. Galvanized steel mounting system. Weather-resistant coatings",
        lifeDuration: "15–25 years",
      },
      Mesh023_7: {
        label: "Tower Base Platform with Access Ladder and Safety Railings",
        manufacturer: "Valmont Industries / American Tower (fabrication partners)",
        dimensions: {
          platformSize: "~1.5–3 m",
          ladderHeight: "As per tower height"
        },
        icon: "🪜",
        position: "Located at the base of the tower",
        positionReason: "Provides safe access for maintenance personnel. Ensures compliance with fall protection and safety regulations",
        purpose: "Structural access and safety platform. Provides safe access for tower maintenance",
        material: "Hot-dip galvanized steel platform, ladder, and railings. Reinforced concrete base",
        lifeDuration: "30+ years",
      },

      Mesh023_4: {
        label: "Tower Base Platform with Access Ladder and Safety Railings",
        manufacturer: "Valmont Industries / American Tower (fabrication partners)",
        dimensions: {
          platformSize: "~1.5–3 m",
          ladderHeight: "As per tower height"
        },
        icon: "🪜",
        position: "Located at the base of the tower",
        positionReason: "Provides safe access for maintenance personnel. Ensures compliance with fall protection and safety regulations",
        purpose: "Structural access and safety platform. Provides safe access for tower maintenance",
        material: "Hot-dip galvanized steel platform, ladder, and railings. Reinforced concrete base",
        lifeDuration: "30+ years",
      },

      Mesh023_19: {
        label: "Tower Base Platform with Access Ladder and Safety Railings",
        manufacturer: "Valmont Industries / American Tower (fabrication partners)",
        dimensions: {
          platformSize: "~1.5–3 m",
          ladderHeight: "As per tower height"
        },
        icon: "🪜",
        position: "Located at the base of the tower",
        positionReason: "Provides safe access for maintenance personnel. Ensures compliance with fall protection and safety regulations",
        purpose: "Structural access and safety platform. Provides safe access for tower maintenance",
        material: "Hot-dip galvanized steel platform, ladder, and railings. Reinforced concrete base",
        lifeDuration: "30+ years",
      },

      Mesh023_10: {
        label: "Tower Base Platform with Access Ladder and Safety Railings",
        manufacturer: "Valmont Industries / American Tower (fabrication partners)",
        dimensions: {
          platformSize: "~1.5–3 m",
          ladderHeight: "As per tower height"
        },
        icon: "🪜",
        position: "Located at the base of the tower",
        positionReason: "Provides safe access for maintenance personnel. Ensures compliance with fall protection and safety regulations",
        purpose: "Structural access and safety platform. Provides safe access for tower maintenance",
        material: "Hot-dip galvanized steel platform, ladder, and railings. Reinforced concrete base",
        lifeDuration: "30+ years",
      },
    },
  },
];

export const MODEL_LOOKUP = Object.fromEntries(
  MODELS.map((m) => [m.id, m])
);