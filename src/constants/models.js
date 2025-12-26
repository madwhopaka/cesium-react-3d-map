/* ----------------------------------
   Model Registry - 3 Towers with Realistic Dimensions
   
   altitude: Where the tower base is (0 = ground, >0 = on building)
   towerHeight: Actual height of the tower structure
   scale: Model scale factor
----------------------------------- */

export const MODELS = [
  {
    id: "tower_1",
    name: "Tower 1 - Mountain Area",
    lon: 139.445180,
    lat: 36.341518,
    altitude: 129 ,         
    towerHeight: 100,   
    scale: 2,
    uri: "/models/Tower 1.glb",
    parts: {
      'blip 1 (lightning arrestor)': {
        label: "Lightning Arrestor with RF Omni Antenna",
        icon: "⚡",
        position: "Installed at the absolute top of the tower",
        positionReason: "Highest point to intercept lightning strikes and provide maximum unobstructed signal coverage",
        purpose: "Lightning protection: Safely directs lightning energy into tower grounding system. Radio communication: Used for low-power links such as monitoring, control, or backup communication",
        material: "Lightning rod: Copper or copper-clad steel. Antenna elements: Aluminum or copper. Outer cover (radome): UV-resistant fiberglass or plastic. Internal grounding parts: Copper"
      },

      "Red side supports": {
        label: "Lightning Arrestor with RF Omni Antenna",
        icon: "⚡",
        position: "Installed at the absolute top of the tower",
        positionReason: "Highest point to intercept lightning strikes and provide maximum unobstructed signal coverage",
        purpose: "Lightning protection: Safely directs lightning energy into tower grounding system. Radio communication: Used for low-power links such as monitoring, control, or backup communication",
        material: "Lightning rod: Copper or copper-clad steel. Antenna elements: Aluminum or copper. Outer cover (radome): UV-resistant fiberglass or plastic. Internal grounding parts: Copper"
      },

      "Metal side supports": {
        label: "Lightning Arrestor with RF Omni Antenna",
        icon: "⚡",
        position: "Installed at the absolute top of the tower",
        positionReason: "Highest point to intercept lightning strikes and provide maximum unobstructed signal coverage",
        purpose: "Lightning protection: Safely directs lightning energy into tower grounding system. Radio communication: Used for low-power links such as monitoring, control, or backup communication",
        material: "Lightning rod: Copper or copper-clad steel. Antenna elements: Aluminum or copper. Outer cover (radome): UV-resistant fiberglass or plastic. Internal grounding parts: Copper"
      },
     
      'blip 2 (sector panel antennas)': {
        label: "Sector Panel Antennas",
        icon: "📡",
        position: "Installed near the top of the mobile tower, below the lightning protection system",
        positionReason: "Mounted on multiple sides to create sectors (typically 3 × 120° coverage). Positioned at high elevation to maximize coverage area and minimize signal obstruction",
        purpose: "Primary interface between mobile network and user devices. Transmits/receives radio signals for 2G, 3G, 4G LTE, and 5G NR. Multiple panels allow directional coverage, higher user capacity, and reduced interference",
        material: "Radome: Fiberglass-reinforced plastic (FRP) or RF-transparent polymer, UV-resistant. Internal elements: Copper or aluminum radiating elements. Mounting hardware: Hot-dip galvanized steel or stainless steel brackets"
      },
      'blip 3 (microwave dish antennas)': {
        label: "Microwave Point-to-Point Dish Antenna",
        icon: "📶",
        position: "Mounted high on the tower, below the lightning protection zone",
        positionReason: "Needs clear line-of-sight to another tower for long-distance communication. Positioned away from other antennas to reduce interference",
        purpose: "Provides backhaul connectivity. Carries large volumes of data between towers or from tower to core network. Used where fiber optic cable is unavailable",
        material: "Dish: Aluminum or steel. Mounting brackets: Galvanized steel. Feed horn and waveguide: Aluminum or brass. Protective coating: Weather-resistant paint or powder coating"
      },
      "Main antenna": {
        label: "Microwave Point-to-Point Dish Antenna",
        icon: "📶",
        position: "Mounted high on the tower, below the lightning protection zone",
        positionReason: "Needs clear line-of-sight to another tower for long-distance communication. Positioned away from other antennas to reduce interference",
        purpose: "Provides backhaul connectivity. Carries large volumes of data between towers or from tower to core network. Used where fiber optic cable is unavailable",
        material: "Dish: Aluminum or steel. Mounting brackets: Galvanized steel. Feed horn and waveguide: Aluminum or brass. Protective coating: Weather-resistant paint or powder coating"
      },
      "Cloth covers": {
        label: "Microwave Point-to-Point Dish Antenna",
        icon: "📶",
        position: "Mounted high on the tower, below the lightning protection zone",
        positionReason: "Needs clear line-of-sight to another tower for long-distance communication. Positioned away from other antennas to reduce interference",
        purpose: "Provides backhaul connectivity. Carries large volumes of data between towers or from tower to core network. Used where fiber optic cable is unavailable",
        material: "Dish: Aluminum or steel. Mounting brackets: Galvanized steel. Feed horn and waveguide: Aluminum or brass. Protective coating: Weather-resistant paint or powder coating"
      },

    },
  },
  {
    id: "tower_2",
    name: "Tower 2 - Building Top",
    lon: 139.696634,
    lat: 35.689771,
    altitude: 115.85,         // On top of 150m building
    towerHeight: 20,       // Tower is 60m tall
    scale: 20,
    uri: "/models/Tower 2.glb",
    parts: {
      'blip 1 (massive mimo antennas)': {
        label: "Massive MIMO Antenna Array (5G)",
        icon: "📡",
        position: "Mounted near the very top of the monopole, just below the crown",
        positionReason: "Installed in circular arrangement for uniform 360° coverage. Positioned high to support dense urban 5G coverage and reduce obstruction",
        purpose: "Supports 5G New Radio (NR), especially mid-band frequencies. Uses Massive MIMO to serve many users simultaneously and perform beamforming for higher data rates. Designed for high-capacity, short-to-medium range coverage",
        material: "Radome: RF-transparent composite plastic or fiberglass. Internal antenna elements: Copper or aluminum. Mounting brackets: Galvanized steel or aluminum. Cabling: Shielded copper RF cables and fiber optic cables"
      },

      "antenna2_metal1_0": {
        label: "Massive MIMO Antenna Array (5G)",
        icon: "📡",
        position: "Mounted near the very top of the monopole, just below the crown",
        positionReason: "Installed in circular arrangement for uniform 360° coverage. Positioned high to support dense urban 5G coverage and reduce obstruction",
        purpose: "Supports 5G New Radio (NR), especially mid-band frequencies. Uses Massive MIMO to serve many users simultaneously and perform beamforming for higher data rates. Designed for high-capacity, short-to-medium range coverage",
        material: "Radome: RF-transparent composite plastic or fiberglass. Internal antenna elements: Copper or aluminum. Mounting brackets: Galvanized steel or aluminum. Cabling: Shielded copper RF cables and fiber optic cables"
      },

      "antenna2_metal7_0":  {
        label: "Massive MIMO Antenna Array (5G)",
        icon: "📡",
        position: "Mounted near the very top of the monopole, just below the crown",
        positionReason: "Installed in circular arrangement for uniform 360° coverage. Positioned high to support dense urban 5G coverage and reduce obstruction",
        purpose: "Supports 5G New Radio (NR), especially mid-band frequencies. Uses Massive MIMO to serve many users simultaneously and perform beamforming for higher data rates. Designed for high-capacity, short-to-medium range coverage",
        material: "Radome: RF-transparent composite plastic or fiberglass. Internal antenna elements: Copper or aluminum. Mounting brackets: Galvanized steel or aluminum. Cabling: Shielded copper RF cables and fiber optic cables"
      },


      "antenna2_rust_0":  {
        label: "Massive MIMO Antenna Array (5G)",
        icon: "📡",
        position: "Mounted near the very top of the monopole, just below the crown",
        positionReason: "Installed in circular arrangement for uniform 360° coverage. Positioned high to support dense urban 5G coverage and reduce obstruction",
        purpose: "Supports 5G New Radio (NR), especially mid-band frequencies. Uses Massive MIMO to serve many users simultaneously and perform beamforming for higher data rates. Designed for high-capacity, short-to-medium range coverage",
        material: "Radome: RF-transparent composite plastic or fiberglass. Internal antenna elements: Copper or aluminum. Mounting brackets: Galvanized steel or aluminum. Cabling: Shielded copper RF cables and fiber optic cables"
      },

      "antenna2_metal6_0":  {
        label: "Massive MIMO Antenna Array (5G)",
        icon: "📡",
        position: "Mounted near the very top of the monopole, just below the crown",
        positionReason: "Installed in circular arrangement for uniform 360° coverage. Positioned high to support dense urban 5G coverage and reduce obstruction",
        purpose: "Supports 5G New Radio (NR), especially mid-band frequencies. Uses Massive MIMO to serve many users simultaneously and perform beamforming for higher data rates. Designed for high-capacity, short-to-medium range coverage",
        material: "Radome: RF-transparent composite plastic or fiberglass. Internal antenna elements: Copper or aluminum. Mounting brackets: Galvanized steel or aluminum. Cabling: Shielded copper RF cables and fiber optic cables"
      },

      "antenna2_alum_0" :  {
        label: "Antenna Mounting Platform / RF Safety Fence",
        icon: "🔧",
        position: "Installed around the monopole at antenna height, below or between active antenna arrays",
        positionReason: "Encircles the tower to provide 360° access. Support multiple antennas and radio units while maintaining correct spacing. Allows technicians safe access during installation and maintenance",
        purpose: "Acts as structural support frame for mounting antennas, RRUs, and cabling. Provides stable working platform for tower maintenance crews. The surrounding mesh/fencing limits accidental access into high RF exposure areas and acts as visual and physical safety barrier",
        material: "Main platform structure: Hot-dip galvanized structural steel. Cross-bracing: Galvanized steel for rigidity. RF safety fence: Galvanized steel wire mesh or expanded metal. Mounting clamps: Stainless steel or galvanized steel bolts. Protective finish: Anti-corrosion galvanization"
      },

      "antenna2_Concrete_0":  {
        label: "Base Transceiver Station (BTS) Cabinet",
        icon: "⚙️",
        position: "Installed at the base of the tower, mounted on a concrete foundation",
        positionReason: "Positioned at ground level to allow easy maintenance and monitoring, reduce weight load on tower, and improve safety and accessibility",
        purpose: "Houses baseband units (BBU). Contains power systems including AC/DC converters, battery backup, and surge/lightning protection. Connects tower equipment to fiber optic backhaul and network core infrastructure",
        material: "Cabinet enclosure: Powder-coated steel or aluminum. Internal racks: Galvanized steel. Cooling system: Aluminum heat sinks and fans. Base foundation: Reinforced concrete"
      } , 

     
      'blip 2 (antenna mounting platform)': {
        label: "Antenna Mounting Platform / RF Safety Fence",
        icon: "🔧",
        position: "Installed around the monopole at antenna height, below or between active antenna arrays",
        positionReason: "Encircles the tower to provide 360° access. Support multiple antennas and radio units while maintaining correct spacing. Allows technicians safe access during installation and maintenance",
        purpose: "Acts as structural support frame for mounting antennas, RRUs, and cabling. Provides stable working platform for tower maintenance crews. The surrounding mesh/fencing limits accidental access into high RF exposure areas and acts as visual and physical safety barrier",
        material: "Main platform structure: Hot-dip galvanized structural steel. Cross-bracing: Galvanized steel for rigidity. RF safety fence: Galvanized steel wire mesh or expanded metal. Mounting clamps: Stainless steel or galvanized steel bolts. Protective finish: Anti-corrosion galvanization"
      },
      
      'blip 3 (power and control unit)': {
        label: "Base Transceiver Station (BTS) Cabinet",
        icon: "⚙️",
        position: "Installed at the base of the tower, mounted on a concrete foundation",
        positionReason: "Positioned at ground level to allow easy maintenance and monitoring, reduce weight load on tower, and improve safety and accessibility",
        purpose: "Houses baseband units (BBU). Contains power systems including AC/DC converters, battery backup, and surge/lightning protection. Connects tower equipment to fiber optic backhaul and network core infrastructure",
        material: "Cabinet enclosure: Powder-coated steel or aluminum. Internal racks: Galvanized steel. Cooling system: Aluminum heat sinks and fans. Base foundation: Reinforced concrete"
      },
    },
  },
   {
    id: "tower_3",
    name: "Tower 3 - Open Flat Land",
    lon: 139.339381,
    lat: 35.369106,
    altitude: 46,           // Flat ground
    towerHeight: 50,      // Standard lattice tower
    scale: 10,
    uri: "/models/Tower 3.glb",
    parts: {
      "blip 1 (sector panel antennas)": {
        label: "Sector Panel Antennas (Multi-Band)",
        icon: "📡",
        position: "Installed at the uppermost section of the tower",
        positionReason:
          "Maximizes coverage radius in open terrain",
        purpose:
          "Primary cellular communication (2G–5G)",
        material:
          "RF-transparent radome, aluminum/copper radiating elements",
      },

      'Mesh023' :  {
        label: "Sector Panel Antennas (Multi-Band)",
        icon: "📡",
        position: "Installed at the uppermost section of the tower",
        positionReason:
          "Maximizes coverage radius in open terrain",
        purpose:
          "Primary cellular communication (2G–5G)",
        material:
          "RF-transparent radome, aluminum/copper radiating elements",
      },

      'Mesh023_3' :  {
        label: "Sector Panel Antennas (Multi-Band)",
        icon: "📡",
        position: "Installed at the uppermost section of the tower",
        positionReason:
          "Maximizes coverage radius in open terrain",
        purpose:
          "Primary cellular communication (2G–5G)",
        material:
          "RF-transparent radome, aluminum/copper radiating elements",
      },

      'Blip 2 (Microwave Dish Antenna)': {
        label: "Microwave Backhaul Dish Antenna",
        icon: "📶",
        position: "Mounted at mid-height of the tower",
        positionReason:
          "Clear line-of-sight with reduced wind loading",
        purpose:
          "Point-to-point backhaul data transmission",
        material:
          "Aluminum dish, galvanized steel mounting",
      },
      'Mesh023_5': {
        label: "Microwave Backhaul Dish Antenna",
        icon: "📶",
        position: "Mounted at mid-height of the tower",
        positionReason:
          "Clear line-of-sight with reduced wind loading",
        purpose:
          "Point-to-point backhaul data transmission",
        material:
          "Aluminum dish, galvanized steel mounting",
      },

      'Mesh023_6': {
        label: "Microwave Backhaul Dish Antenna",
        icon: "📶",
        position: "Mounted at mid-height of the tower",
        positionReason:
          "Clear line-of-sight with reduced wind loading",
        purpose:
          "Point-to-point backhaul data transmission",
        material:
          "Aluminum dish, galvanized steel mounting",
      },

      "blip 3 (tower base platform)": {
        label: "Tower Base Platform with Access Ladder",
        icon: "🪜",
        position: "Located at the base of the tower",
        positionReason:
          "Provides safe access for maintenance personnel",
        purpose:
          "Structural access and safety platform",
        material:
          "Galvanized steel platform, reinforced concrete base",
      },

      "Mesh023_7": {
        label: "Tower Base Platform with Access Ladder",
        icon: "🪜",
        position: "Located at the base of the tower",
        positionReason:
          "Provides safe access for maintenance personnel",
        purpose:
          "Structural access and safety platform",
        material:
          "Galvanized steel platform, reinforced concrete base",
      },

      "Mesh023_4": {
        label: "Tower Base Platform with Access Ladder",
        icon: "🪜",
        position: "Located at the base of the tower",
        positionReason:
          "Provides safe access for maintenance personnel",
        purpose:
          "Structural access and safety platform",
        material:
          "Galvanized steel platform, reinforced concrete base",
      },

       "Mesh023_19": {
        label: "Tower Base Platform with Access Ladder",
        icon: "🪜",
        position: "Located at the base of the tower",
        positionReason:
          "Provides safe access for maintenance personnel",
        purpose:
          "Structural access and safety platform",
        material:
          "Galvanized steel platform, reinforced concrete base",
      },

       "Mesh023_10": {
        label: "Tower Base Platform with Access Ladder",
        icon: "🪜",
        position: "Located at the base of the tower",
        positionReason:
          "Provides safe access for maintenance personnel",
        purpose:
          "Structural access and safety platform",
        material:
          "Galvanized steel platform, reinforced concrete base",
      },


    },
  },
];

export const MODEL_LOOKUP = Object.fromEntries(
  MODELS.map((m) => [m.id, m])
);