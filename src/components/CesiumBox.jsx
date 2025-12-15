import { useEffect, useRef, useState } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN;

export default function CesiumMap() {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const tilesetRef = useRef(null);

  const [loading, setLoading] = useState(true);

  // Okinawa
  const OKINAWA = {
    lon: 127.6809,
    lat: 26.2124,
  };

  useEffect(() => {
    let viewer;

    const init = async () => {
      viewer = new Cesium.Viewer(containerRef.current, {
        sceneMode: Cesium.SceneMode.SCENE2D, // start in 2D
        timeline: false,
        animation: false,
        baseLayerPicker: false,
        geocoder: false,
        navigationHelpButton: false,
        terrain: Cesium.Terrain.fromWorldTerrain(),
      });

      viewerRef.current = viewer;

      // === Camera controller: Google Maps–style ===
      const controller = viewer.scene.screenSpaceCameraController;

      controller.enableRotate = false;     // ❌ no free rotation
      controller.enableLook = false;
      controller.enableTilt = true;        // ✅ minimal tilt only
      controller.enableZoom = true;
      controller.enableTranslate = true;

      // Very limited tilt (almost flat)
      controller.minimumPitch = Cesium.Math.toRadians(-25);
      controller.maximumPitch = Cesium.Math.toRadians(-80);

      controller.minimumZoomDistance = 200;
      controller.maximumZoomDistance = 5_000_000;

      // === Default view: Okinawa (flat) ===
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
          OKINAWA.lon,
          OKINAWA.lat,
          1_500_000 // far = flat map feel
        ),
      });

      // === Place labels ===
      viewer.imageryLayers.addImageryProvider(
        new Cesium.IonImageryProvider({ assetId: 3 })
      );

      // === Performance defaults (low quality initially) ===
      viewer.scene.globe.maximumScreenSpaceError = 8;
      viewer.scene.fog.enabled = false;
      viewer.scene.skyAtmosphere.show = false;
      viewer.shadows = false;

      // === Load photorealistic tiles (but don't show yet) ===
      const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(2275207);
      tileset.show = false;
      viewer.scene.primitives.add(tileset);
      tilesetRef.current = tileset;

      // === Zoom-based mode switching ===
      viewer.camera.changed.addEventListener(() => {
        const height = viewer.camera.positionCartographic.height;

        // Zoomed OUT → 2D, cheap
        if (height > 50_000) {
          if (viewer.scene.mode !== Cesium.SceneMode.SCENE2D) {
            viewer.scene.morphTo2D(0.5);
          }

          if (tilesetRef.current) {
            tilesetRef.current.show = false;
          }

          viewer.scene.globe.maximumScreenSpaceError = 8;
        }

        // Zoomed IN → 3D, high quality
        else {
          if (viewer.scene.mode !== Cesium.SceneMode.SCENE3D) {
            viewer.scene.morphTo3D(0.5);
          }

          if (tilesetRef.current) {
            tilesetRef.current.show = true;
          }

          viewer.scene.globe.maximumScreenSpaceError = 4;
        }
      });

      // === Ready ===
      setLoading(false);
    };

    init();

    return () => {
      if (viewer && !viewer.isDestroyed()) {
        viewer.destroy();
      }
    };
  }, []);

  return (
    <>
      {/* Cesium container */}
      <div
        ref={containerRef}
        style={{
          width: "100vw",
          height: "100vh",
          // visibility: loading ? "hidden" : "visible",
        }}
      />
    </>
  );
}
