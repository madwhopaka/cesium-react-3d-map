import { useEffect, useRef, useState } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

import LoadingScreen from "./Cesium/LoadingScreen";
import ModelsPanel from "./Cesium/LeftPanel";
import PartModal from "./Cesium/PartsModal";

import { MODELS, MODEL_LOOKUP } from "../constants/models";
import {
  CESIUM_CONFIG,
  MODEL_CONFIG,
  BLIP_CONFIG,
} from "../constants/config";
import { normalizeNodeName } from "../helpers/helper";

Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN;

export default function CesiumMap() {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const tilesetRef = useRef(null);

  const entityMapRef = useRef({});
  const blipMapRef = useRef({});
  const activeModelRef = useRef(null);

  const isFlyingRef = useRef(false);
  const frameCounterRef = useRef(0);

  const [panelOpen, setPanelOpen] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [isLoading3D, setIsLoading3D] = useState(false);
  const [entitiesReady, setEntitiesReady] = useState(false);

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    let viewer;

    setIsLoading3D(true); 
    const init = async () => {
      viewer = new Cesium.Viewer(containerRef.current, {
        terrain: Cesium.Terrain.fromWorldTerrain(),
        sceneModePicker: false,
        timeline: false,
        animation: false,
        baseLayerPicker: false,
        geocoder: false,
        navigationHelpButton: false,
        infoBox: false,
        selectionIndicator: false,
      });

      viewer.scene.mode = Cesium.SceneMode.SCENE3D;
      viewer.scene.morphTo3D(0);
      viewer.scene.completeMorph();

      viewer.scene.requestRenderMode = true;
      viewer.scene.maximumRenderTimeChange = Infinity;

      viewerRef.current = viewer;

      viewer.scene.globe.enableLighting = true;
      viewer.scene.highDynamicRange = true;
      viewer.scene.light = new Cesium.SunLight();

      // --- Photorealistic Tiles ---
      const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(
        CESIUM_CONFIG.TILESET_ASSET_ID
      );
      viewer.scene.primitives.add(tileset);
      tilesetRef.current = tileset;

      // --- Models & Blips ---
      MODELS.forEach((model) => {
        const pos = Cesium.Cartesian3.fromDegrees(
          model.lon,
          model.lat,
          model.altitude
        );

        const entity = viewer.entities.add({
          position: pos,
          show: false,
          model: {
            uri: model.uri,
            scale: model.scale,
            minimumPixelSize: MODEL_CONFIG.minimumPixelSize,
            maximumScale: MODEL_CONFIG.maximumScale,
            shadows: Cesium.ShadowMode.ENABLED,
          },
        });

        entity.modelId = model.id;
        entityMapRef.current[model.id] = entity;

        blipMapRef.current[model.id] = viewer.entities.add({
          position: pos,
          billboard: {
            image: BLIP_CONFIG.imageUrl,
            scale: BLIP_CONFIG.scale,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          },
          label: {
            text: model.name,
            font: BLIP_CONFIG.labelFont,
            pixelOffset: new Cesium.Cartesian2(0, BLIP_CONFIG.labelOffset),
            showBackground: true,
            backgroundColor: Cesium.Color.BLACK.withAlpha(0.7),
          },
        });
      });

      const first = MODELS[0];
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
          first.lon,
          first.lat,
          CESIUM_CONFIG.INITIAL_ALTITUDE
        ),
        orientation: { pitch: Cesium.Math.toRadians(-70) },
      });

      setEntitiesReady(true);

      // ====== Camera Distance Visibility Control ======
      const onCameraChange = () => {
        const cameraPos = viewer.camera.positionWC;

        MODELS.forEach((model) => {
          const entity = entityMapRef.current[model.id];
          const blip = blipMapRef.current[model.id];
          if (!entity || !blip) return;

          const modelPos = Cesium.Cartesian3.fromDegrees(
            model.lon,
            model.lat,
            model.altitude
          );
          const distance = Cesium.Cartesian3.distance(cameraPos, modelPos);
          const threshold = model.towerHeight * 8;

          if (distance < threshold * 1.2) {
            entity.show = true;
            blip.show = false;
          } else {
            entity.show = false;
            blip.show = true;
          }
        });
      };

      // Store listener reference for removal during flyTo
      viewer.cameraChangeListener = onCameraChange;
      viewer.camera.changed.addEventListener(onCameraChange);
      onCameraChange();
      // ====== END ADDED ======

      // --- Click Handler (parts + coords) ---
      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction((movement) => {
        const picked = viewer.scene.pick(movement.position);

        if (picked?.detail?.node && picked?.id) {
          const modelId = picked.id.modelId;
          const model = MODEL_LOOKUP[modelId];
          if (model) {
            const raw = picked.detail.node._name;
            const key = normalizeNodeName(raw);
            const part = model.parts?.[key] || model.parts?.[raw];
            if (part) {
              setActiveModal({
                label: part.label,
                icon: part.icon,
                purpose: part.purpose,
                material: part.material,
              });
              return;
            }
          }
        }

        // Get coordinates for any click (terrain/tiles)
        const scene = viewer.scene;
        const camera = viewer.camera;
        let cartesian;

        // Try picking position from 3D tiles / terrain
        if (scene.pickPositionSupported) {
          cartesian = scene.pickPosition(movement.position);
        }

        // Fallback to globe intersection
        if (!Cesium.defined(cartesian)) {
          const ray = camera.getPickRay(movement.position);
          cartesian = scene.globe.pick(ray, scene);
        }

        if (!Cesium.defined(cartesian)) {
          console.log("❌ No position detected");
          return;
        }

        // Convert to lat / lon / height
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        const lon = Cesium.Math.toDegrees(cartographic.longitude);
        const lat = Cesium.Math.toDegrees(cartographic.latitude);
        const height = cartographic.height;

        console.log("📍 Clicked Coordinates:");
        console.log("  Longitude:", lon.toFixed(6));
        console.log("  Latitude :", lat.toFixed(6));
        console.log("  Height   :", height.toFixed(2), "m");
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    };
    init();
    return () => viewer && !viewer.isDestroyed() && viewer.destroy();
  }, []);

  /* ---------------- LOADER ORCHESTRATION ---------------- */
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const scene = viewer.scene;
    let stableFrames = 0;

    const onPostRender = () => {
      const tileset = tilesetRef.current;
      if (!tileset) return;

      const tilesReady =
        tileset.tilesLoaded || tileset._loadQueueLength === 0;

      if (!isFlyingRef.current && tilesReady) {
        stableFrames++;
        if (stableFrames >= 5) {
          setIsLoading3D(false);
        }
      } else {
        stableFrames = 0;
      }
    };

    scene.postRender.addEventListener(onPostRender);
    return () => scene.postRender.removeEventListener(onPostRender);
  }, []);


useEffect(() => {
  const viewer = viewerRef.current;
  if (!viewer) return;

  const scene = viewer.scene;

  const onPostRender = () => {
    // Still flying → keep loader
    if (isFlyingRef.current) return;

    // Camera done → count frames
    frameCounterRef.current += 1;

    // After ~20 frames (~300ms @ 60fps)
    if (frameCounterRef.current > 20) {
      setIsLoading3D(false);
      frameCounterRef.current = 0;
    }
  };

  scene.postRender.addEventListener(onPostRender);
  return () => scene.postRender.removeEventListener(onPostRender);
}, []);


  /* ---------------- FLY TO MODEL ---------------- */
const flyToModel = (modelId) => {
    const viewer = viewerRef.current;
    const entity = entityMapRef.current[modelId];
    const model = MODEL_LOOKUP[modelId];
    if (!viewer || !entity || !model) return;

    console.log(`✈️ Flying to: ${model.name}`);
    
    // Show loader
    setIsLoading3D(true);
    
    // REMOVE camera listener during flyTo to prevent interference
    if (viewer.cameraChangeListener) {
      viewer.camera.changed.removeEventListener(viewer.cameraChangeListener);
    }
    
    entity.show = true;
    activeModelRef.current = model;
    isFlyingRef.current = true;
    
    // Calculate viewing parameters
    const distance = model.towerHeight * 2.5; // 2.5x tower height
    const targetHeight = model.altitude + (model.towerHeight * 0.5); // Middle of tower
    
    // Target point
    const target = Cesium.Cartesian3.fromDegrees(
      model.lon,
      model.lat,
      targetHeight
    );
    
    // Create transform at target
    const transform = Cesium.Transforms.eastNorthUpToFixedFrame(target);
    
    // Camera offset in local coordinates (northeast, slightly elevated)
    const cameraOffset = new Cesium.Cartesian3(
      distance * 0.707,  // East (45° = cos/sin ≈ 0.707)
      distance * 0.707,  // North
      distance * 0.5     // Up (for -30° pitch)
    );
    
    // Transform to world coordinates
    const cameraPosition = Cesium.Matrix4.multiplyByPoint(
      transform,
      cameraOffset,
      new Cesium.Cartesian3()
    );
    
    // Fly to position
    viewer.camera.flyTo({
      destination: cameraPosition,
      orientation: {
        heading: Cesium.Math.toRadians(45),
        pitch: Cesium.Math.toRadians(-30),
        roll: 0.0
      },
      duration: 2.5,
      complete: () => {
        // Lock camera to prevent auto-adjustment
        const finalHeading = Cesium.Math.toRadians(45);
        const finalPitch = Cesium.Math.toRadians(-30);
        
        viewer.camera.lookAt(
          target,
          new Cesium.HeadingPitchRange(finalHeading, finalPitch, distance)
        );
        
        // Then unlock it and re-enable camera listener
        setTimeout(() => {
          viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
          
          // RE-ADD camera listener after flyTo completes
          if (viewer.cameraChangeListener) {
            viewer.camera.changed.addEventListener(viewer.cameraChangeListener);
            viewer.cameraChangeListener(); // Run once to update visibility
          }
          
          setIsLoading3D(false);
          isFlyingRef.current = false;
          console.log(`✅ Arrived at ${model.name}`);
        }, 3000);
      },
    });
    
    console.log(`📏 ${model.name} - Distance: ${Math.round(distance)}m, Target: ${Math.round(targetHeight)}m`);
  };


  return (
    <>
      <LoadingScreen isVisible={isLoading3D} />

      <ModelsPanel
        models={MODELS}
        isOpen={panelOpen}
        onToggle={() => setPanelOpen((v) => !v)}
        onSelectModel={flyToModel}
      />

      <div ref={containerRef} style={{ position: "fixed", inset: 0 }} />

      <PartModal modal={activeModal} onClose={() => setActiveModal(null)} />
    </>
  );
}