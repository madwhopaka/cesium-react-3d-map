import { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN;

export default function CesiumMap() {
  const containerRef = useRef(null);

  useEffect(() => {
    let viewer;

    const init = async () => {
      viewer = new Cesium.Viewer(containerRef.current, {
        terrain: Cesium.Terrain.fromWorldTerrain(),
        sceneMode: Cesium.SceneMode.SCENE3D,
        timeline: false,
        animation: false,
        baseLayerPicker: false,
        geocoder: false,
        navigationHelpButton: false,
      });

      // 🔥 REAL photorealistic buildings
      const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(
        2275207 // Photorealistic 3D Tiles (example asset)
      );
      viewer.scene.primitives.add(tileset);

      // 🔥 Lighting = depth + realism
      viewer.scene.globe.enableLighting = true;
      viewer.scene.highDynamicRange = true;

      // 🔥 Force angled street-level camera
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          139.6917, // Tokyo longitude
          35.6895,  // Tokyo latitude
          800       // Low altitude = strong 3D depth
        ),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-45), // Critical for 3D feel
          roll: 0,
        },
        duration: 2.5,
      });
    };

    init();

    return () => {
      if (viewer && !viewer.isDestroyed()) {
        viewer.destroy();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
