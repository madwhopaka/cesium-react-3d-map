import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

import LoadingScreen from "./Cesium/LoadingScreen";
import ModelsPanel from "./Cesium/LeftPanel";

import { MODELS, MODEL_LOOKUP } from "../constants/models";
import {
  CESIUM_CONFIG,
  MODEL_CONFIG,
  BLIP_CONFIG,
  getVisibilityThreshold,
} from "../constants/config";
import { normalizeNodeName } from "../helpers/helper";
import PartBubble from "./Cesium/PartsModal";
import TowerBubble from "./Cesium/TowerModal";

Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN;

export default function CesiumMap() {
  const BLIP_TIP_OFFSET_METERS = 0;
  const BLIP_HEIGHT_RATIO = 0.82;
  const BLIP_PIXEL_OFFSET_Y = -10;
  const FLY_TO_ABOVE_TIP_METERS = 1;
  const FLY_TO_TARGET_HEIGHT_RATIO = 0.6;
  const FLY_TO_HEADING_DEG = 35;
  const FLY_TO_PITCH_DEG = -25;

  const navigate = useNavigate();
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const tilesetRef = useRef(null);

  const entityMapRef = useRef({});
  const blipMapRef = useRef({});
  const labelMapRef = useRef({}); // NEW: Separate labels
  const activeModelRef = useRef(null);

  const isFlyingRef = useRef(false);
  const frameCounterRef = useRef(0);
  const initStartTimeRef = useRef(null); // Track initialization start time
  const skyboxLoadedRef = useRef(false); // Track skybox loading

  const [panelOpen, setPanelOpen] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [partBubble, setPartBubble] = useState(null);
  const [bubbleAnchor, setBubbleAnchor] = useState(null);
  const [towerBubble, setTowerBubble] = useState(null);
  const [isLoading3D, setIsLoading3D] = useState(false);
  const [entitiesReady, setEntitiesReady] = useState(false);
  const [showViewModelButton, setShowViewModelButton] = useState(false);
  const [isModelVisible, setIsModelVisible] = useState(false);
  const [showMiniViewer, setShowMiniViewer] = useState(false); // Mini viewer modal state
  const cloudLayerRef = useRef(null); // Track cloud layer entity

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    let viewer;

    setIsLoading3D(true);
    initStartTimeRef.current = Date.now(); // Record start time
    
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

      // viewer.scene.skyAtmosphere.show = true;
      // viewer.scene.skyAtmosphere.atmosphereLightIntensity = 15.0;
      
      // viewer.scene.fog.enabled = true;
      // viewer.scene.fog.density = 0.0008;
      // viewer.scene.fog.minimumBrightness = 0.2;
      // viewer.scene.fog.screenSpaceErrorFactor = 2.0;

      // --- Photorealistic Tiles ---
      const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(
        CESIUM_CONFIG.TILESET_ASSET_ID
      );
      viewer.scene.primitives.add(tileset);
      tilesetRef.current = tileset;

      // --- Custom Skybox ---
      const skyboxSources = {
        positiveX: '/images/Black space.webp',
        negativeX: '/images/Black space.webp',
        positiveY: '/images/Black space.webp',
        negativeY: '/images/Black space.webp',
        positiveZ: '/images/Black space.webp',
        negativeZ: '/images/Black space.webp'
      };
      
      // Track skybox image loading
      let skyboxImagesLoaded = 0;
      const totalSkyboxImages = 6;
      
      Object.values(skyboxSources).forEach(src => {
        const img = new Image();
        img.onload = () => {
          skyboxImagesLoaded++;
          if (skyboxImagesLoaded === totalSkyboxImages) {
            console.log('✅ Skybox loaded');
            skyboxLoadedRef.current = true;
          }
        };
        img.src = src;
      });
      
      viewer.scene.skyBox = new Cesium.SkyBox({ sources: skyboxSources });
      viewer.scene.skyBox.show = true;
      viewer.scene.skyAtmosphere.show = false;

      const cloudLayer = viewer.entities.add({
        rectangle: {
          coordinates: Cesium.Rectangle.fromDegrees(-180, -90, 180, 90),
          height: 12000, // Cloud layer at 12km altitude
          material: new Cesium.ImageMaterialProperty({
            image: '/images/cloud-map.webp',
            repeat: new Cesium.Cartesian2(1, 1),
            transparent: true,
            color: Cesium.Color.WHITE.withAlpha(0.35), // 35% opacity
          }),
        },
      });
      
      cloudLayerRef.current = cloudLayer;
      
      // Track cloud layer image loading
      const cloudImg = new Image();
      cloudImg.onload = () => {
        console.log('✅ Cloud layer loaded');
        // Give a moment for rendering
        setTimeout(() => {
          viewer.scene.requestRender();
        }, 100);
      };
      cloudImg.src = '/images/cloud-map.webp';

      // --- Models, Blips & Labels (separated) ---
      console.log('🏗️ Creating models, blips, and labels for', MODELS.length, 'towers');
      MODELS.forEach((model) => {
        const pos = Cesium.Cartesian3.fromDegrees(
          model.lon,
          model.lat,
          model.altitude
        );

        // Position at the tip of the tower (+3m for visual separation)
        const tipPos = Cesium.Cartesian3.fromDegrees(
          model.lon,
          model.lat,
          model.altitude + model.towerHeight
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

        // Blip (marker icon) - at tower tip
        blipMapRef.current[model.id] = viewer.entities.add({
          position: tipPos,
          billboard: {
            image: BLIP_CONFIG.imageUrl,
            scale: BLIP_CONFIG.scale,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, BLIP_PIXEL_OFFSET_Y),
            // Keep marker visible even when model/buildings are between camera and blip.
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
        });

        // Label - at tower tip with pixel offset for visibility
        labelMapRef.current[model.id] = viewer.entities.add({
          position: tipPos,
          label: {
            text: model.name,
            font: BLIP_CONFIG.labelFont,
            pixelOffset: new Cesium.Cartesian2(0, BLIP_CONFIG.labelOffset),
            showBackground: true,
            backgroundColor: Cesium.Color.BLACK.withAlpha(0.7),
            // Keep label visible even when geometry is in front.
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
        });
      });
      
      console.log('✅ Models created:', Object.keys(entityMapRef.current).length);
      console.log('✅ Blips created:', Object.keys(blipMapRef.current).length);
      console.log('✅ Labels created:', Object.keys(labelMapRef.current).length);

      const first = MODELS[0];
       viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
          first.lon,
          first.lat,
          CESIUM_CONFIG.INITIAL_ALTITUDE

        ),
        orientation: { 
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-90), // Globe view from above
          roll: 0.0
        },
      });


      setEntitiesReady(true);

      // ====== Camera Distance Visibility Control + Smart Button ======
      const onCameraChange = () => {
        const cameraPos = viewer.camera.positionWC;
        setPartBubble(null);
        
        let closestModel = null;
        let closestDistance = Infinity;
        
        MODELS.forEach((model) => {
          const entity = entityMapRef.current[model.id];
          const blip = blipMapRef.current[model.id];
          const label = labelMapRef.current[model.id];
          if (!entity) return;

          if (blip) {
            blip.show = true;
          }

          if (label) {
            label.show = true;
          }

          const modelPos = Cesium.Cartesian3.fromDegrees(
            model.lon,
            model.lat,
            model.altitude
          );
          const distance = Cesium.Cartesian3.distance(cameraPos, modelPos);
          const threshold = Math.max(
            getVisibilityThreshold(model),
            model.towerHeight + FLY_TO_ABOVE_TIP_METERS + 50
          );

          // Track closest model
          if (distance < closestDistance) {
            closestDistance = distance;
            closestModel = model;
          }

          // Only toggle the 3D model visibility
          if (distance < threshold * 1.2) { 
            entity.show = true;
          } else {
            entity.show = false;
          }
        });
        
        // Smart button visibility logic
        // const BUTTON_SHOW_THRESHOLD = 1000; // Show button if within 50km of any model
        // const BUTTON_HIDE_THRESHOLD = 2000; // Hide button if farther than 100km
          const BUTTON_SHOW_THRESHOLD = 50000; // Show button if within 50km of any model
        const BUTTON_HIDE_THRESHOLD = 100000;

        if (closestDistance < BUTTON_SHOW_THRESHOLD) {
          // Close to a model - show button and update reference
          activeModelRef.current = closestModel;
          setTowerBubble(closestModel);
          setShowViewModelButton(true);
        } else if (closestDistance > BUTTON_HIDE_THRESHOLD) {
          // Far from all models (globe view) - hide button
          setShowViewModelButton(false);
          activeModelRef.current = null;
          setTowerBubble(null);
        } else {
          setTowerBubble(null);
        }
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

        console.log('picked',picked); 
        setPartBubble(null);
        setBubbleAnchor(null); 

        if (picked?.detail?.node && picked?.id) {
          const modelId = picked.id.modelId;
          const model = MODEL_LOOKUP[modelId];
          if (model) {
            const raw = picked.detail.node._name;
            const key = normalizeNodeName(raw);
            const part = model.parts?.[key] || model.parts?.[raw];
            if (part) {
              setPartBubble(part);
            
              setBubbleAnchor({
                x: movement.position.x,
                y: movement.position.y,
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
    const MINIMUM_LOADING_TIME = 2000; // 2 seconds minimum

    const onPostRender = () => {
      const tileset = tilesetRef.current;
      if (!tileset) return;

      const tilesReady =
        tileset.tilesLoaded || tileset._loadQueueLength === 0;

      // Check if skybox is loaded
      const skyboxReady = skyboxLoadedRef.current;

      if (!isFlyingRef.current && tilesReady && skyboxReady) {
        stableFrames++;
        if (stableFrames >= 5) {
          // Check if minimum loading time has passed
          const elapsedTime = Date.now() - initStartTimeRef.current;
          if (elapsedTime >= MINIMUM_LOADING_TIME) {
            console.log('✅ All resources loaded, hiding loading screen');
            setIsLoading3D(false);
          } else {
            // Wait for remaining time
            const remainingTime = MINIMUM_LOADING_TIME - elapsedTime;
            setTimeout(() => {
              console.log('✅ Minimum time reached, hiding loading screen');
              setIsLoading3D(false);
            }, remainingTime);
          }
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
  const MINIMUM_LOADING_TIME = 2000; // 2 seconds minimum

  const onPostRender = () => {
    // Still flying → keep loader
    if (isFlyingRef.current) return;

    // Check if skybox is loaded
    if (!skyboxLoadedRef.current) return;

    // Camera done → count frames
    frameCounterRef.current += 1;

    // After ~20 frames (~300ms @ 60fps)
    if (frameCounterRef.current > 20) {
      // Check if minimum loading time has passed
      const elapsedTime = Date.now() - initStartTimeRef.current;
      if (elapsedTime >= MINIMUM_LOADING_TIME) {
        console.log('✅ Frame counter ready, hiding loading screen');
        setIsLoading3D(false);
        frameCounterRef.current = 0;
      }
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
    
    // Show loader
    setIsLoading3D(true);
    
    // REMOVE camera listener during flyTo to prevent interference
    if (viewer.cameraChangeListener) {
      viewer.camera.changed.removeEventListener(viewer.cameraChangeListener);
    }
    
    entity.show = true;
    activeModelRef.current = model;
    setTowerBubble(model);
    isFlyingRef.current = true;
    
    // Target upper-mid tower so the whole structure remains visible in frame.
    const targetHeight =
      model.altitude + model.towerHeight * FLY_TO_TARGET_HEIGHT_RATIO;
    const distance = Math.max(model.towerHeight+model.altitude, 90);
    
    // Target point
    const target = Cesium.Cartesian3.fromDegrees(
      model.lon,
      model.lat,
      targetHeight
    );
    
    const offset = new Cesium.HeadingPitchRange(
      Cesium.Math.toRadians(FLY_TO_HEADING_DEG),
      Cesium.Math.toRadians(FLY_TO_PITCH_DEG),
      distance
    );

    viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(target, 1), {
      offset,
      duration: 2.5,
      complete: () => {
        if (viewer.cameraChangeListener) {
          viewer.camera.changed.addEventListener(viewer.cameraChangeListener);
          viewer.cameraChangeListener();
        }

        setIsLoading3D(false);
        isFlyingRef.current = false;
        console.log(`✅ Arrived at ${model.name}`);
      },
    });
    
    setPanelOpen(false); 
    console.log(`📏 ${model.name} - Distance: ${Math.round(distance)}m, Target: ${Math.round(targetHeight)}m`);
  };

  /* ---------------- ESC KEY TO CLOSE MINI VIEWER ---------------- */
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape' && showMiniViewer) {
        setShowMiniViewer(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showMiniViewer]);

  /* ---------------- LISTEN FOR IFRAME CLOSE MESSAGE ---------------- */
  useEffect(() => {
    const handleMessage = (event) => {
      // Close modal when iframe sends 'closeModal' message
      if (event.data === 'closeModal') {
        setShowMiniViewer(false);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);


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

      <PartBubble
        bubble={partBubble}
        anchor={bubbleAnchor}
        onClose={() => setPartBubble(null)}
      />

      <TowerBubble
        tower={towerBubble}
        visible={Boolean(towerBubble)}
      />

      {/* Floating View 3D Model Button */}
      {showViewModelButton && activeModelRef.current && (
        <button
          onClick={() => setShowMiniViewer(true)}
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            padding: '14px 24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            zIndex: 1000,
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
          }}
        >
          🔍 View 3D Model
        </button>
      )}

      {/* Mini Viewer Modal */}
      {showMiniViewer && activeModelRef.current && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            // backgroundColor: 'rgba(0, 0, 0, 0.85)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setShowMiniViewer(false)}
        >
          <div
            style={{
              position: 'relative',
              width: '60vw',
              height: '90vh',
              maxWidth: '1400px',
              maxHeight: '900px',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowMiniViewer(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                cursor: 'pointer',
                zIndex: 10001,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#333',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 60, 60, 0.95)';
                e.target.style.color = 'white';
                e.target.style.transform = 'rotate(90deg) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.95)';
                e.target.style.color = '#333';
                e.target.style.transform = 'rotate(0deg) scale(1)';
              }}
            >
              ✕
            </button>

            {/* GLB Viewer iframe */}
            <iframe
              src={`/model-viewer/${activeModelRef.current.id}`}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                borderRadius: '20px',
              }}
              title="3D Model Viewer"
            />
          </div>
        </div>
      )}
    </>
  );
}