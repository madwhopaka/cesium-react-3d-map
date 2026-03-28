import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
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

export default function CesiumMap({
  renderProfile: controlledRenderProfile,
  onRenderProfileChange,
}) {
  const HOVER_CARD_WIDTH = 236;
  const HOVER_CARD_HEIGHT = 112;
  const HOVER_CARD_GAP = 1;
  const HOVER_CARD_PADDING = 8;

  const BLIP_TIP_OFFSET_METERS = 0;
  const BLIP_HEIGHT_RATIO = 0.82;
  const BLIP_PIXEL_OFFSET_Y = -10;
  const FLY_TO_ABOVE_TIP_METERS = 1;
  const FLY_TO_TARGET_HEIGHT_RATIO = 0.6;
  const FLY_TO_HEADING_DEG = 35;
  const FLY_TO_PITCH_DEG = -25;

  const navigate = useNavigate();
  const location = useLocation();
  const { modelId: routeModelId } = useParams();
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const tilesetRef = useRef(null);

  const entityMapRef = useRef({});
  const blipMapRef = useRef({});
  const labelMapRef = useRef({}); // NEW: Separate labels
  const hoveredBlipIdRef = useRef(null);
  const activeModelRef = useRef(null);
  const homeViewRef = useRef(null);

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
  const [hoverBlipCard, setHoverBlipCard] = useState(null);
  const [isHoverBlipCardVisible, setIsHoverBlipCardVisible] = useState(false);
  const [overviewSearch, setOverviewSearch] = useState("");
  const [localRenderProfile, setLocalRenderProfile] = useState("balanced");
  const renderProfile =
    typeof controlledRenderProfile === "string" ? controlledRenderProfile : localRenderProfile;
  const setRenderProfile =
    typeof onRenderProfileChange === "function"
      ? onRenderProfileChange
      : setLocalRenderProfile;
  const cloudLayerRef = useRef(null); // Track cloud layer entity
  const hoverCardHideTimeoutRef = useRef(null);
  const previousPathRef = useRef(location.pathname);
  const sidebarWidth = panelOpen ? 248 : 68;
  const hasAutoFlewRef = useRef(false);
  const isOverviewOpen = useMemo(() => {
    return location.pathname === "/";
  }, [location.pathname]);
  const isMapRoute = useMemo(() => {
    return location.pathname === "/map" || location.pathname.startsWith("/map/");
  }, [location.pathname]);

  const RENDER_PRESETS = {
    fast: {
      label: "Fast",
      resolutionScale: 0.75,
      maximumScreenSpaceError: 32,
      dynamicScreenSpaceErrorDensity: 0.01,
      dynamicScreenSpaceErrorFactor: 8,
      highDynamicRange: false,
      enableGlobeLighting: false,
      enableModelShadows: false,
    },
    balanced: {
      label: "Balanced",
      resolutionScale: 0.9,
      maximumScreenSpaceError: 22,
      dynamicScreenSpaceErrorDensity: 0.004,
      dynamicScreenSpaceErrorFactor: 6,
      highDynamicRange: false,
      enableGlobeLighting: true,
      enableModelShadows: false,
    },
    quality: {
      label: "Quality",
      resolutionScale: 1,
      maximumScreenSpaceError: 14,
      dynamicScreenSpaceErrorDensity: 0.002,
      dynamicScreenSpaceErrorFactor: 4,
      highDynamicRange: true,
      enableGlobeLighting: true,
      enableModelShadows: true,
    },
  };

  const applyRenderPreset = (viewer, tileset, profile) => {
    const preset = RENDER_PRESETS[profile] || RENDER_PRESETS.balanced;

    viewer.resolutionScale = preset.resolutionScale;
    viewer.scene.highDynamicRange = preset.highDynamicRange;
    viewer.scene.globe.enableLighting = preset.enableGlobeLighting;

    if (viewer.scene.postProcessStages?.fxaa) {
      viewer.scene.postProcessStages.fxaa.enabled = true;
    }

    tileset.maximumScreenSpaceError = preset.maximumScreenSpaceError;
    tileset.dynamicScreenSpaceError = true;
    tileset.dynamicScreenSpaceErrorDensity = preset.dynamicScreenSpaceErrorDensity;
    tileset.dynamicScreenSpaceErrorFactor = preset.dynamicScreenSpaceErrorFactor;
    tileset.skipLevelOfDetail = true;
    tileset.baseScreenSpaceError = 1024;
    tileset.skipScreenSpaceErrorFactor = 16;
    tileset.skipLevels = 1;
    tileset.cullWithChildrenBounds = true;
    tileset.preloadWhenHidden = false;

    Object.values(entityMapRef.current).forEach((entity) => {
      if (entity?.model) {
        entity.model.shadows = preset.enableModelShadows
          ? Cesium.ShadowMode.ENABLED
          : Cesium.ShadowMode.DISABLED;
      }
    });

    viewer.scene.requestRender();
  };

  const cycleRenderProfile = () => {
    const order = ["fast", "balanced", "quality"];
    setRenderProfile((current) => {
      const currentIndex = order.indexOf(current);
      return order[(currentIndex + 1) % order.length];
    });
  };

  const overviewRows = useMemo(() => {
    return MODELS.map((model) => ({
      model,
      type: model.towerSpecs?.type || "-",
      location: model.towerSpecs?.location || model.towerSpecs?.region || "Site",
      status: model.status || model.towerSpecs?.maintenance || "Active",
    }));
  }, []);

  const filteredOverviewRows = useMemo(() => {
    const query = overviewSearch.trim().toLowerCase();
    if (!query) return overviewRows;

    return overviewRows.filter((row) => {
      return [row.model.id, row.model.name, row.location, row.type, row.status]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [overviewRows, overviewSearch]);

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    let viewer;

    setIsLoading3D(true);
    initStartTimeRef.current = Date.now(); // Record start time
    
    const init = async () => {
      viewer = new Cesium.Viewer(containerRef.current, {
        terrain: Cesium.Terrain.fromWorldTerrain(),
        creditContainer: document.createElement("div"),
        fullscreenButton: false,
        homeButton: false,
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
      applyRenderPreset(viewer, tileset, renderProfile);

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
            shadows: RENDER_PRESETS[renderProfile].enableModelShadows
              ? Cesium.ShadowMode.ENABLED
              : Cesium.ShadowMode.DISABLED,
          },
        });

        entity.modelId = model.id;
        entityMapRef.current[model.id] = entity;

        // Blip (marker icon) - at tower tip
        blipMapRef.current[model.id] = viewer.entities.add({
          position: tipPos,
          modelId: model.id,
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
          modelId: model.id,
          label: {
            text: model.name,
            font: BLIP_CONFIG.labelFont,
            pixelOffset: new Cesium.Cartesian2(0, BLIP_CONFIG.labelOffset),
            showBackground: true,
            backgroundColor: Cesium.Color.BLACK.withAlpha(0.7),
            // Keep label visible even when geometry is in front.
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
          show: false,
        });
      });
      
      console.log('✅ Models created:', Object.keys(entityMapRef.current).length);
      console.log('✅ Blips created:', Object.keys(blipMapRef.current).length);
      console.log('✅ Labels created:', Object.keys(labelMapRef.current).length);

      const first = MODELS[0];
      homeViewRef.current = {
        destination: Cesium.Cartesian3.fromDegrees(
          first.lon,
          first.lat,
          CESIUM_CONFIG.INITIAL_ALTITUDE
        ),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-90),
          roll: 0.0,
        },
      };

      viewer.camera.setView(homeViewRef.current);


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
            label.show = false;
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

      const clearHoveredBlipLabel = () => {
        if (hoveredBlipIdRef.current) {
          const previousLabel = labelMapRef.current[hoveredBlipIdRef.current];
          if (previousLabel) {
            previousLabel.show = false;
          }

          hoveredBlipIdRef.current = null;
        }

        setHoverBlipCard(null);
      };

      const onMouseMove = (movement) => {
        const picked = viewer.scene.pick(movement.endPosition);
        const modelId = picked?.id?.modelId;

        if (!modelId) {
          clearHoveredBlipLabel();
          return;
        }

        const isBlipHover = picked?.id === blipMapRef.current[modelId];
        if (!isBlipHover) {
          clearHoveredBlipLabel();
          return;
        }

        if (hoveredBlipIdRef.current && hoveredBlipIdRef.current !== modelId) {
          const previousLabel = labelMapRef.current[hoveredBlipIdRef.current];
          if (previousLabel) {
            previousLabel.show = false;
          }
        }

        hoveredBlipIdRef.current = modelId;

        const model = MODEL_LOOKUP[modelId];
        if (model) {
          const containerRect = containerRef.current?.getBoundingClientRect();
          const minX = containerRect
            ? containerRect.left + HOVER_CARD_PADDING + HOVER_CARD_WIDTH / 2
            : HOVER_CARD_PADDING + HOVER_CARD_WIDTH / 2;
          const maxX = containerRect
            ? containerRect.right - HOVER_CARD_PADDING - HOVER_CARD_WIDTH / 2
            : window.innerWidth - HOVER_CARD_PADDING - HOVER_CARD_WIDTH / 2;
          const clampedX = Math.max(minX, Math.min(maxX, movement.endPosition.x));

          const minY = containerRect
            ? containerRect.top + HOVER_CARD_PADDING
            : HOVER_CARD_PADDING;
          const maxY = containerRect
            ? containerRect.bottom - HOVER_CARD_PADDING
            : window.innerHeight - HOVER_CARD_PADDING;
          const clampedY = Math.max(minY, Math.min(maxY, movement.endPosition.y));

          const hasRoomAbove = containerRect
            ? movement.endPosition.y - (HOVER_CARD_HEIGHT + HOVER_CARD_GAP) >=
              containerRect.top + HOVER_CARD_PADDING
            : movement.endPosition.y - (HOVER_CARD_HEIGHT + HOVER_CARD_GAP) >=
              HOVER_CARD_PADDING;
          const placement = hasRoomAbove ? "above" : "below";

          setHoverBlipCard({
            model,
            x: clampedX,
            y: clampedY,
            placement,
          });
        }
      };

      viewer.screenSpaceEventHandler.setInputAction(
        onMouseMove,
        Cesium.ScreenSpaceEventType.MOUSE_MOVE
      );

      viewer.hoverClearLabel = clearHoveredBlipLabel;
      // ====== END ADDED ======

      if (routeModelId && MODEL_LOOKUP[routeModelId]) {
        setTimeout(() => {
          flyToModel(routeModelId, { keepSidebarOpen: true });
        }, 0);
      }

      // --- Click Handler (parts + coords) ---
      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction((movement) => {
        const picked = viewer.scene.pick(movement.position);

        console.log('picked',picked); 
        setPartBubble(null);
        setBubbleAnchor(null); 
        setHoverBlipCard(null);

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
  const flyToModel = (modelId, options = {}) => {
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
    
    if (!options.keepSidebarOpen) {
      setPanelOpen(false);
    }
    console.log(`📏 ${model.name} - Distance: ${Math.round(distance)}m, Target: ${Math.round(targetHeight)}m`);
  };

  const goHome = () => {
    const viewer = viewerRef.current;
    if (!viewer || !homeViewRef.current) return;

    setPartBubble(null);
    setBubbleAnchor(null);
    setTowerBubble(null);
    setShowMiniViewer(false);
    activeModelRef.current = null;

    viewer.camera.flyTo({
      ...homeViewRef.current,
      duration: 1.6,
      complete: () => {
        if (viewer.cameraChangeListener) {
          viewer.cameraChangeListener();
        }

        navigate("/", { replace: true });
      },
    });

    setPanelOpen(true);
  };

  const resetToInitialGlobeView = () => {
    const viewer = viewerRef.current;
    if (!viewer || !homeViewRef.current) return;

    setPartBubble(null);
    setBubbleAnchor(null);
    setTowerBubble(null);
    setShowMiniViewer(false);
    activeModelRef.current = null;

    viewer.camera.setView(homeViewRef.current);

    if (viewer.cameraChangeListener) {
      viewer.cameraChangeListener();
    }

    viewer.scene.requestRender();
  };

  const openOverviewPanel = () => {
    navigate("/", { replace: true });
    setPanelOpen(true);
  };

  useEffect(() => {
    const previousPath = previousPathRef.current;
    const currentPath = location.pathname;

    const isOverviewRoute = (path) => path === "/";
    const isMapRoute = (path) => path === "/map" || path.startsWith("/map/");

    const switchedBetweenOverviewAndMap =
      (isOverviewRoute(previousPath) && isMapRoute(currentPath)) ||
      (isMapRoute(previousPath) && isOverviewRoute(currentPath));

    if (switchedBetweenOverviewAndMap) {
      resetToInitialGlobeView();
    }

    previousPathRef.current = currentPath;
  }, [location.pathname]);

  useEffect(() => {
    if (!entitiesReady || !routeModelId || !MODEL_LOOKUP[routeModelId]) return;

    hasAutoFlewRef.current = false;

    const timeoutId = window.setTimeout(() => {
      if (hasAutoFlewRef.current) return;

      hasAutoFlewRef.current = true;
      flyToModel(routeModelId, { keepSidebarOpen: true });
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [routeModelId, entitiesReady]);

  useEffect(() => {
    const viewer = viewerRef.current;
    const tileset = tilesetRef.current;
    if (!viewer || !tileset) return;

    applyRenderPreset(viewer, tileset, renderProfile);
  }, [renderProfile]);

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
      {hoverBlipCard && (
        <div
          style={{
            position: "fixed",
            left: hoverBlipCard.x,
            top: hoverBlipCard.y,
            transform:
              hoverBlipCard.placement === "below"
                ? `translate(-50%, ${HOVER_CARD_GAP}px)`
                : `translate(-50%, calc(-100% - ${HOVER_CARD_GAP}px))`,
            zIndex: 60,
            width: HOVER_CARD_WIDTH,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              borderRadius: 14,
              overflow: "hidden",
              background: "#ececec",
              boxShadow: "0 16px 40px rgba(0,0,0,0.34)",
              border: "1px solid rgba(255,255,255,0.4)",
              color: "#1f1f1f",
            }}
          >
            <div
              style={{
                padding: "6px 10px",
                background: String(hoverBlipCard.model.status || "").toLowerCase().includes("maintenance")
                  ? "#e4c3cb"
                  : String(hoverBlipCard.model.status || "").toLowerCase().includes("offline")
                  ? "#f2dcb3"
                  : "#cce8d7",
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 999,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontSize: 11,
                  background: String(hoverBlipCard.model.status || "").toLowerCase().includes("maintenance")
                    ? "#e11d48"
                    : String(hoverBlipCard.model.status || "").toLowerCase().includes("offline")
                    ? "#d97706"
                    : "#16a34a",
                }}
              >
                i
              </span>
              <span>
                {String(hoverBlipCard.model.status || "").toLowerCase().includes("maintenance")
                  ? "Needs maintenance"
                  : hoverBlipCard.model.status || "Tower status"}
              </span>
            </div>

            <div style={{ padding: "8px 10px 6px" }}>
              <div style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.15 }}>
                {hoverBlipCard.model.towerSpecs?.location || "Japan"}
              </div>
              <div
                style={{
                  marginTop: 1,
                  fontSize: 11,
                  color: "#303030",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={hoverBlipCard.model.towerSpecs?.type || "Tower"}
              >
                {hoverBlipCard.model.towerSpecs?.type || "Tower"}
              </div>
            </div>

            <div
              style={{
                borderTop: "1px solid rgba(0,0,0,0.12)",
                padding: "5px 8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 6,
                fontSize: 10,
                color: "#252525",
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 12 }}>📶</span>
                <span
                  style={{
                    background: "rgba(0,0,0,0.08)",
                    borderRadius: 6,
                    padding: "2px 6px",
                    fontWeight: 700,
                  }}
                >
                  #{hoverBlipCard.model.id}
                </span>
              </span>

              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "#3a3a3a" }}>
                <span style={{ fontSize: 11 }}>↻</span>
                <span>5 min ago</span>
              </span>

              <span style={{ fontSize: 13, lineHeight: 1 }}>›</span>
            </div>
          </div>
        </div>
      )}

      <LoadingScreen isVisible={isLoading3D} leftOffset={sidebarWidth} />

      <ModelsPanel
        models={MODELS}
        isOpen={panelOpen}
        onToggle={() => setPanelOpen((v) => !v)}
        onHome={goHome}
        onOverview={goHome}
        onSelectModel={flyToModel}
        renderProfile={renderProfile}
        renderProfileLabel={RENDER_PRESETS[renderProfile].label}
        onCycleRenderProfile={cycleRenderProfile}
        onSetRenderProfile={setRenderProfile}
      />

      <div
        ref={containerRef}
        style={{
          position: "fixed",
          top: isOverviewOpen ? 12 : 0,
          left: isOverviewOpen ? sidebarWidth + 12 : sidebarWidth,
          right: isOverviewOpen ? 12 : 0,
          bottom: isOverviewOpen ? "calc(50vh + 8px)" : 0,
          border: isOverviewOpen ? "1px solid rgba(255,255,255,0.12)" : "none",
          borderRadius: isOverviewOpen ? 18 : 0,
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      />

      {isOverviewOpen || isMapRoute ? (
        <div
          style={{
            position: "fixed",
            left: sidebarWidth + 24,
            bottom: isOverviewOpen ? "calc(50vh + 24px)" : 24,
            zIndex: 30,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          {isOverviewOpen && (
            <button
              type="button"
              onClick={() => navigate("/map", { replace: true })}
              title="Expand map to full view"
              aria-label="Expand map to full view"
              style={{
                width: 42,
                height: 42,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.16)",
                background: "rgba(28,27,27,0.72)",
                backdropFilter: "blur(8px)",
                color: "#f5f5f5",
                cursor: "pointer",
                boxShadow: "0 10px 24px rgba(0,0,0,0.28)",
              }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                <path d="M8 3H3V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 3L10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 3H21V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 3L14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 21H3V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 21L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 21H21V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 21L14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          <button
            type="button"
            onClick={resetToInitialGlobeView}
            title="Reset globe view"
            aria-label="Reset globe view"
            style={{
              width: 42,
              height: 42,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.16)",
              background: "rgba(28,27,27,0.72)",
              backdropFilter: "blur(8px)",
              color: "#f5f5f5",
              cursor: "pointer",
              boxShadow: "0 10px 24px rgba(0,0,0,0.28)",
            }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
              <path d="M21 12a9 9 0 1 1-2.64-6.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 3v6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      ) : null}

      <PartBubble
        bubble={partBubble}
        anchor={bubbleAnchor}
        onClose={() => setPartBubble(null)}
      />

      <TowerBubble
        tower={towerBubble}
        visible={Boolean(towerBubble)}
        onOpenInWindow={() => setShowMiniViewer(true)}
      />

      {isOverviewOpen && (
        <section
          style={{
            position: "fixed",
            left: sidebarWidth,
            right: 0,
            top: "50vh",
            bottom: 0,
            zIndex: 18,
            borderRadius: 0,
            background: "#1F1C1C",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.28)",
            backdropFilter: "blur(16px)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: 17, lineHeight: 1.2 }}>Tower overview</h2>
            </div>

            <button
              type="button"
              onClick={() => navigate("/map", { replace: true })}
              style={{
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.03)",
                color: "#f5f5f5",
                borderRadius: 999,
                padding: "8px 12px",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Close overview
            </button>
          </div>

          <div
            style={{
              padding: "10px 16px 0",
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <label
              style={{
                flex: "1 1 280px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 12px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span style={{ color: "#b0a7a7", fontSize: 13 }}>Search</span>
              <input
                type="text"
                value={overviewSearch}
                onChange={(event) => setOverviewSearch(event.target.value)}
                placeholder="Tower ID, location, type, or status"
                aria-label="Search towers in overview"
                style={{
                  width: "100%",
                  border: "none",
                  background: "transparent",
                  color: "#f5f5f5",
                  outline: "none",
                  fontSize: 13,
                }}
              />
            </label>

            <button
              type="button"
              onClick={() => setOverviewSearch("")}
              style={{
                padding: "10px 14px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.03)",
                color: "#f5f5f5",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Clear
            </button>

            <div style={{ color: "#b0a7a7", fontSize: 13 }}>
              {filteredOverviewRows.length} towers
            </div>
          </div>

          <div style={{ overflow: "auto", flex: 1 }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: 0,
                minWidth: 920,
              }}
            >
              <thead>
                <tr>
                  {["Tower ID", "Location", "Tower Type", "Status", "Actions"].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        textAlign: "left",
                        padding: "14px 18px",
                        width: heading === "Tower Type" ? 180 : "auto",
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        color: "#b0a7a7",
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOverviewRows.map((row) => {
                  const isOffline = String(row.status).toLowerCase().includes("offline");
                  const isMaintenance = String(row.status).toLowerCase().includes("maintenance");
                  const isActive = String(row.status).toLowerCase().includes("active");
                  const tone = isOffline
                    ? { bg: "rgba(245, 158, 11, 0.18)", fg: "#f59e0b", border: "rgba(245, 158, 11, 0.28)" }
                    : isMaintenance
                    ? { bg: "rgba(239, 68, 68, 0.18)", fg: "#ef4444", border: "rgba(239, 68, 68, 0.28)" }
                    : isActive
                    ? { bg: "rgba(34, 197, 94, 0.18)", fg: "#22c55e", border: "rgba(34, 197, 94, 0.28)" }
                    : { bg: "rgba(148, 163, 184, 0.16)", fg: "#cbd5e1", border: "rgba(148, 163, 184, 0.26)" };

                  return (
                    <tr key={row.model.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <td style={{ padding: "16px 18px", fontSize: 13, fontWeight: 700 }}>{row.model.id}</td>
                      <td style={{ padding: "16px 18px", fontSize: 13, color: "#d9d9d9" }}>{row.location}</td>
                      <td style={{ padding: "16px 18px", fontSize: 13, color: "#d9d9d9", maxWidth: 180 }}>
                        <span
                          title={row.type}
                          style={{
                            display: "block",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {row.type}
                        </span>
                      </td>
                      <td style={{ padding: "16px 18px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "6px 11px",
                            borderRadius: 999,
                            background: tone.bg,
                            color: tone.fg,
                            border: `1px solid ${tone.border}`,
                            fontSize: 12,
                            fontWeight: 700,
                            letterSpacing: "0.02em",
                            textTransform: "capitalize",
                            boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                          }}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td style={{ padding: "16px 18px" }}>
                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                          <Link
                            to={`/map/${row.model.id}`}
                            style={{
                              color: "#f5f5f5",
                              fontSize: 12,
                              fontWeight: 700,
                              textDecoration: "underline",
                              textUnderlineOffset: 3,
                            }}
                          >
                            View map
                          </Link>
                          <Link
                            to={`/model-viewer/${row.model.id}`}
                            target="_blank"
                            style={{
                              color: "#f5f5f5",
                              fontSize: 12,
                              fontWeight: 700,
                              textDecoration: "underline",
                              textUnderlineOffset: 3,
                            }}
                          >
                            3D view
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredOverviewRows.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: 24, textAlign: "center", color: "#9a9a9a" }}>
                      No towers match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
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