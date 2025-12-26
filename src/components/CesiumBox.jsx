import { useEffect, useRef, useState } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

import LoadingScreen from "./Cesium/LoadingScreen";
import ModelsPanel from "./Cesium/LeftPanel";
import PartModal from "./Cesium/PartsModal";
import OrbitLockButton from "./Cesium/OrbitLockButton";

import { useCameraControls } from "../hooks/useCameraControl";
import { MODELS, MODEL_LOOKUP } from "../constants/models";
import {
  CESIUM_CONFIG,
  CAMERA_CONFIG,
  MODEL_CONFIG,
  BLIP_CONFIG,
} from "../constants/config";
import { normalizeNodeName } from "../helpers/helper";

Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN;

export default function CesiumMap() {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const entityMapRef = useRef({});
  const blipMapRef = useRef({});

  const isFlyingRef = useRef(false);
  const orbitLockedRef = useRef(false);
  const activeModelRef = useRef(null);

  const [panelOpen, setPanelOpen] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [isLoading3D, setIsLoading3D] = useState(false);
  const [isModelVisible, setIsModelVisible] = useState(false);
  const [orbitLocked, setOrbitLocked] = useState(false);
  const [entitiesReady, setEntitiesReady] = useState(false);

  useCameraControls({
    viewer: viewerRef.current,
    models: MODELS,
    entityMapRef,
    blipMapRef,
    isFlyingRef,
    activeModelRef,
    orbitLockedRef,
    setIsModelVisible,
    entitiesReady,
  });

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    let viewer;

    const init = async () => {
      viewer = new Cesium.Viewer(containerRef.current, {
        terrain: Cesium.Terrain.fromWorldTerrain(),
        sceneModePicker: false,
        timeline: false,
        animation: false,
        baseLayerPicker: false,
        geocoder: false,
        navigationHelpButton: true,
        infoBox: false,
        selectionIndicator: false,
      });

      viewerRef.current = viewer;

      const controller = viewer.scene.screenSpaceCameraController;
      controller.enableLook = false;

      // ENHANCED LIGHTING FOR MODELS
      viewer.scene.globe.enableLighting = true;
      viewer.scene.highDynamicRange = true;
      
      viewer.scene.light = new Cesium.SunLight();
      // Add ambient lighting by brightening the globe base color

      const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(
        CESIUM_CONFIG.TILESET_ASSET_ID
      );
      viewer.scene.primitives.add(tileset);

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

      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

      handler.setInputAction((movement) => {
        const picked = viewer.scene.pick(movement.position);

        console.log(picked?.detail, picked?.id, 'Picked', 'Hello'); 
        // Check if clicked on a model part
        if (picked?.detail?.node && picked?.id) {
          const modelId = picked.id.modelId;
          const model = MODEL_LOOKUP[modelId];

          console.log(model, modelId, picked?.detail?.node?._name, 'HELLO'); 
          
          if (model) {
            const rawNodeName = picked.detail.node._name;
            const partKey = normalizeNodeName(rawNodeName);
            let part = model.parts?.[partKey];

            if (!part) {
              part = model.parts?.[rawNodeName]; 
            }
            
            if (part) {
              setActiveModal({
                partKey,
                label: part.label,
                icon: part.icon,
                partPosition: part.position,
                positionReason: part.positionReason,
                purpose: part.purpose,
                material: part.material,
              });
              
              console.log(`🖱️ Clicked: ${part.label} (${partKey})`);
              return;
            }
          }
        }

        // Otherwise, get coordinates (your existing logic)
        const scene = viewer.scene;
        const camera = viewer.camera;
      
        let cartesian;
      
        // 1️⃣ Try picking position from 3D tiles / terrain
        if (scene.pickPositionSupported) {
          cartesian = scene.pickPosition(movement.position);
        }        

        // 2️⃣ Fallback to globe intersection
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
        console.log("Longitude:", lon.toFixed(6));
        console.log("Latitude :", lat.toFixed(6));
        console.log("Height   :", height.toFixed(2), "m");
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      
    };

    init();
    return () => viewer && !viewer.isDestroyed() && viewer.destroy();
  }, []);

  /* ---------------- FLY TO MODEL - FIXED ---------------- */
  const flyToModel = (modelId) => {
    const viewer = viewerRef.current;
    const entity = entityMapRef.current[modelId];
    const model = MODEL_LOOKUP[modelId];
    if (!viewer || !entity || !model) return;

    console.log(`✈️ Flying to: ${model.name}`);
    
    entity.show = true;
    activeModelRef.current = model;
    isFlyingRef.current = true;
    
    // Calculate viewing position
    const distance = model.towerHeight * 2; // 2x tower height away
    const targetHeight = model.altitude + (model.towerHeight * 0.6); // Look at 60% up the tower
    
    const target = Cesium.Cartesian3.fromDegrees(
      model.lon,
      model.lat,
      targetHeight
    );
    
    viewer.camera.flyToBoundingSphere(
      new Cesium.BoundingSphere(target, distance),
      {
        duration: 2.5,
        offset: new Cesium.HeadingPitchRange(
          Cesium.Math.toRadians(45),  // Northeast view
          Cesium.Math.toRadians(-30), // Looking slightly down
          distance
        ),
        complete: () => {
          isFlyingRef.current = false;
          console.log(`✅ Arrived at ${model.name}`);
        },
      }
    );

    setPanelOpen(false); 
    console.log(`📏 Distance: ${Math.round(distance)}m, Target height: ${Math.round(targetHeight)}m`);
  };

  /* ---------------- ORBIT TOGGLE - FIXED ---------------- */
  const toggleOrbit = () => {
    const viewer = viewerRef.current;
    const model = activeModelRef.current;
    if (!viewer || !model) return;

    const controller = viewer.scene.screenSpaceCameraController;

    if (!orbitLockedRef.current) {
      console.log(`🔒 Enabling orbit for: ${model.name}`);
      
      // Orbit center at middle of tower (no forced minimum)
      const centerHeight = model.altitude + (model.towerHeight * 0.5);
      
      const center = Cesium.Cartesian3.fromDegrees(
        model.lon,
        model.lat,
        centerHeight
      );

      // Create transform at orbit center
      const transform = Cesium.Transforms.eastNorthUpToFixedFrame(center);
      
      // Get current camera position in world coordinates
      const cameraPosition = viewer.camera.positionWC.clone();
      
      // Convert camera position to local coordinates relative to orbit center
      const inverseTransform = Cesium.Matrix4.inverse(
        transform,
        new Cesium.Matrix4()
      );
      
      const localPosition = Cesium.Matrix4.multiplyByPoint(
        inverseTransform,
        cameraPosition,
        new Cesium.Cartesian3()
      );

      // Apply the transform with the local offset
      viewer.camera.lookAtTransform(transform, localPosition);

      // Set zoom constraints relative to tower
      controller.minimumZoomDistance = model.towerHeight * 0.1;
      controller.maximumZoomDistance = model.towerHeight * 3;

      controller.inertiaZoom = 0.85;
      controller.inertiaSpin = 0.9;
      controller.inertiaTranslate = 0.0;

      orbitLockedRef.current = true;
      setOrbitLocked(true);
      
      console.log(`✅ Orbit enabled - center: ${Math.round(centerHeight)}m, min: ${Math.round(model.towerHeight * 0.1)}m, max: ${Math.round(model.towerHeight * 3)}m`);
    } else {
      console.log("🔓 Disabling orbit");
      
      // Exit orbit mode
      viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);

      // Reset constraints
      controller.minimumZoomDistance = 1;
      controller.maximumZoomDistance = Number.POSITIVE_INFINITY;

      controller.inertiaZoom = 0.8;
      controller.inertiaTranslate = 0.9;

      orbitLockedRef.current = false;
      setOrbitLocked(false);
    }
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
    {/* <OrbitLockButton
        isVisible={isModelVisible}
        isLocked={orbitLocked}
        onToggle={toggleOrbit}
      />//
    </>*/}
    </>
  );
}