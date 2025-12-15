import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

// Mapbox token (must be set in .env as VITE_MAPBOX_TOKEN)
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const STYLES = {
  streets: "mapbox://styles/mapbox/streets-v12",
  satellite: "mapbox://styles/mapbox/satellite-streets-v12"
};

export default function Map3D() {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const [isSatellite, setIsSatellite] = useState(false);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: STYLES.streets,
      center: [127.6809, 26.2124], // Okinawa City
      zoom: 14,
      pitch: 60,
      bearing: -20,
      antialias: true
    });

    mapRef.current = map;

    map.on("style.load", () => {
      add3DBuildings(map, isSatellite);
    });

    return () => map.remove();
  }, []);

  const toggleStyle = () => {
    const next = !isSatellite;
    setIsSatellite(next);

    mapRef.current.setStyle(
      next ? STYLES.satellite : STYLES.streets
    );
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh"
      }}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleStyle}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 10,
          padding: "8px 12px",
          background: "#111",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px"
        }}
      >
        {isSatellite ? "Streets View" : "Satellite View"}
      </button>

      {/* Map Container */}
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%"
        }}
      />
    </div>
  );
}

/* ============================= */
/* 3D BUILDINGS LAYER FUNCTION   */
/* ============================= */

function add3DBuildings(map, isSatellite) {
  const layers = map.getStyle().layers;
  const labelLayerId = layers.find(
    l => l.type === "symbol" && l.layout["text-field"]
  )?.id;

  if (map.getLayer("3d-buildings")) {
    map.removeLayer("3d-buildings");
  }

  map.addLayer(
    {
      id: "3d-buildings",
      source: "composite",
      "source-layer": "building",
      type: "fill-extrusion",

      // KEY: buildings only appear later on satellite
      minzoom: isSatellite ? 16.5 : 15,

      paint: {
        // Almost invisible on satellite
        "fill-extrusion-opacity": isSatellite ? 0.18 : 0.6,

        // Dark, low-contrast color
        "fill-extrusion-color": isSatellite ? "#0b0f14" : "#aaaaaa",

        // CRITICAL: aggressive height dampening
        "fill-extrusion-height": isSatellite
          ? [
              "interpolate",
              ["linear"],
              ["zoom"],
              16.5,
              0,
              18,
              ["*", ["get", "height"], 0.35]
            ]
          : ["get", "height"],

        "fill-extrusion-base": ["get", "min_height"],

        // Kill gradients = less blur
        "fill-extrusion-vertical-gradient": false
      }
    },
    labelLayerId
  );
}