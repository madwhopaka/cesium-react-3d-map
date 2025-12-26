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
        timeline: false,
        animation: false,
        baseLayerPicker: false,
        geocoder: false,
        navigationHelpButton: false,
        infoBox: false,
        selectionIndicator: false,
      });

      viewerRef.current = viewer;

      const controller = viewer.scene.screenSpaceCameraController;
      controller.enableLook = false;

      viewer.scene.globe.enableLighting = true;
      viewer.scene.highDynamicRange = true;
      viewer.scene.light = new Cesium.SunLight();

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

        // Check if clicked on a model part
        if (picked?.detail?.node && picked?.id) {
          const modelId = picked.id.modelId;
          const model = MODEL_LOOKUP[modelId];
          
          if (model) {
            const rawNodeName = picked.detail.node._name;
            const partKey = normalizeNodeName(rawNodeName);
            const part = model.parts?.[partKey];
            
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

  /* ---------------- ORBIT TOGGLE ---------------- */
  const toggleOrbit = () => {
    const viewer = viewerRef.current;
    const model = activeModelRef.current;
    if (!viewer || !model) return;

    const controller = viewer.scene.screenSpaceCameraController;

    if (!orbitLockedRef.current) {
      /* ----------------------------------
         1️⃣ Define orbit center
      ---------------------------------- */
      const centerHeight =
        model.altitude + Math.max(model.towerHeight * 0.5, 150);

      const center = Cesium.Cartesian3.fromDegrees(
        model.lon,
        model.lat,
        centerHeight
      );

      /* ----------------------------------
         2️⃣ KEEP CAMERA POSITION
      ---------------------------------- */
      const cameraPos = viewer.camera.positionWC.clone();

      /* ----------------------------------
         3️⃣ FORCE CAMERA TO LOOK AT MODEL
         (THIS IS THE CRITICAL STEP)
      ---------------------------------- */
      viewer.camera.lookAt(
        center,
        new Cesium.Cartesian3(
          cameraPos.x - center.x,
          cameraPos.y - center.y,
          cameraPos.z - center.z
        )
      );

      /* ----------------------------------
         4️⃣ ENABLE ORBIT MODE
      ---------------------------------- */
      const transform =
        Cesium.Transforms.eastNorthUpToFixedFrame(center);

      viewer.camera.lookAtTransform(transform);

      /* ----------------------------------
         5️⃣ Orbit-safe controls
      ---------------------------------- */
      controller.minimumZoomDistance = Math.max(
        model.towerHeight * 0.4,
        40
      );

      controller.maximumZoomDistance = Math.max(
        model.towerHeight * 10,
        600
      );

      controller.inertiaZoom = 0.85;
      controller.inertiaSpin = 0.9;
      controller.inertiaTranslate = 0.0;

      orbitLockedRef.current = true;
      setOrbitLocked(true);
    } else {
      /* ----------------------------------
         EXIT ORBIT CLEANLY
      ---------------------------------- */
      viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);

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
        onSelectModel={(id) => {
          const entity = entityMapRef.current[id];
          if (entity) {
            entity.show = true;
            activeModelRef.current = MODEL_LOOKUP[id];
            viewerRef.current.flyTo(entity);
          }
        }}
      />
      <div ref={containerRef} style={{ position: "fixed", inset: 0 }} />
      <PartModal modal={activeModal} onClose={() => setActiveModal(null)} />
      <OrbitLockButton
        isVisible={isModelVisible}
        isLocked={orbitLocked}
        onToggle={toggleOrbit}
      />
    </>
  );
}