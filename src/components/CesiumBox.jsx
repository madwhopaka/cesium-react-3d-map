import { useEffect, useRef, useState } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN;

/* ----------------------------------
   Utils
----------------------------------- */
const normalizeNodeName = (nodeName) => {
  if (!nodeName) return null;

  return nodeName
    .toLowerCase()
    .replace(/[0-9]+_0$/, "")
    .replace(/[0-9]+$/, "")
    .replace(/__+/g, "_")
    .replace(/_+$/, "");
};

/* ----------------------------------
   Model Registry
----------------------------------- */
const MODELS = [
  {
    id: "tower_1",
    name: "Tower 1 - Building Top",
    lon: 139.695,
    lat: 35.688,
    height: 220,
    scale: 10,
    uri: "/models/Tower_02-compressed.glb",
    parts: {
      antenna1_metal: {
        label: "Antenna – Metal Structure",
        icon: "📡",
      },
      antenna1_alum: {
        label: "Antenna – Aluminium Component",
        icon: "🧩",
      },
      antenna1_cloth: {
        label: "Antenna – Protective Cover",
        icon: "🧥",
      },
    },
  },
];

const MODEL_LOOKUP = Object.fromEntries(
  MODELS.map((m) => [m.id, m])
);

/* ----------------------------------
   Component
----------------------------------- */
export default function CesiumMap() {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const entityMapRef = useRef({});
  const blipMapRef = useRef({});
  const labelMapRef = useRef({});
  const tilesetRef = useRef(null);

  const [panelOpen, setPanelOpen] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [isLoading3D, setIsLoading3D] = useState(false);
  const isFlyingRef = useRef(false);
  const [isModelVisible, setIsModelVisible] = useState(false);
  const [orbitLocked, setOrbitLocked] = useState(false);
  const orbitLockedRef = useRef(false);
  const activeModelRef = useRef(null); // Track which model is currently active for orbit

  /* ----------------------------------
     Update modal position when camera moves
  ----------------------------------- */
  useEffect(() => {
    if (!activeModal?.worldPos || !viewerRef.current) return;

    const viewer = viewerRef.current;
    let animationFrameId;

    const updateModalPosition = () => {
      if (!activeModal?.worldPos) return;

      const screenPos = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
        viewer.scene,
        activeModal.worldPos
      );

      if (screenPos) {
        setActiveModal((prev) => ({
          ...prev,
          position: screenPos,
        }));
      }

      animationFrameId = requestAnimationFrame(updateModalPosition);
    };

    updateModalPosition();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [activeModal?.worldPos, activeModal?.partKey]);

  useEffect(() => {
    let viewer;

    const init = async () => {
      try {
        viewer = new Cesium.Viewer(containerRef.current, {
          terrain: Cesium.Terrain.fromWorldTerrain(),
          sceneMode: Cesium.SceneMode.SCENE3D,
          scene3DOnly: true,

          timeline: false,
          animation: false,
          baseLayerPicker: false,
          geocoder: false,
          navigationHelpButton: false,
          infoBox: false,
          selectionIndicator: false,
        });

        viewerRef.current = viewer;

        /* ----------------------------------
           Camera constraints
        ----------------------------------- */
        const controller = viewer.scene.screenSpaceCameraController;
        controller.enableRotate = true;
        controller.enableLook = false;
        controller.enableTilt = true;
        controller.enableZoom = true;
        controller.enableTranslate = true;

        controller.tiltEventTypes = [
          Cesium.CameraEventType.RIGHT_DRAG,
          Cesium.CameraEventType.PINCH,
          Cesium.CameraEventType.MIDDLE_DRAG,
        ];

        controller.minimumPitch = Cesium.Math.toRadians(-5);
        controller.maximumPitch = Cesium.Math.toRadians(-75);

        /* ----------------------------------
           Lighting (HDR-like)
        ----------------------------------- */
        viewer.scene.globe.enableLighting = true;
        viewer.scene.highDynamicRange = true;
        viewer.scene.light = new Cesium.SunLight();
        viewer.shadows = true;

        /* ----------------------------------
           Photorealistic tiles
        ----------------------------------- */
        const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(2275207);
        viewer.scene.primitives.add(tileset);
        tilesetRef.current = tileset;

        /* ----------------------------------
           Load models + blips
        ----------------------------------- */
        MODELS.forEach((model) => {
          const position = Cesium.Cartesian3.fromDegrees(
            model.lon,
            model.lat,
            model.height
          );

          /* ---- Tower model ---- */
          const entity = viewer.entities.add({
            name: model.name,
            position,
            show: false,
            model: {
              uri: model.uri,
              scale: model.scale,
              minimumPixelSize: 96,
              maximumScale: 300,
              shadows: Cesium.ShadowMode.ENABLED,
            },
          });

          entity.modelId = model.id;
          entityMapRef.current[model.id] = entity;

          /* ---- Blip marker with label ---- */
          const blip = viewer.entities.add({
            position,
            billboard: {
              image: "/images/blip.png",
              scale: 0.03,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            },
            label: {
              text: model.name,
              font: "bold 16px sans-serif",
              fillColor: Cesium.Color.WHITE,
              outlineColor: Cesium.Color.BLACK,
              outlineWidth: 4,
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              pixelOffset: new Cesium.Cartesian2(0, -25),
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
              scale: 0.9,
              backgroundColor: Cesium.Color.fromCssColorString("rgba(0, 0, 0, 0.7)"),
              backgroundPadding: new Cesium.Cartesian2(8, 4),
              showBackground: true,
            },
          });

          blipMapRef.current[model.id] = blip;
        });

        /* ----------------------------------
           Initial camera position - Dynamic based on first model
        ----------------------------------- */
        const firstModel = MODELS[0];
        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(
            firstModel.lon,
            firstModel.lat,
            20000000    // 20,000 km - full Earth view
          ),
          orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-90),
            roll: 0.0
          }
        });

        /* ----------------------------------
           Zoom-based visibility + manual orbit control - DYNAMIC for multiple models
        ----------------------------------- */
        const VISIBILITY_THRESHOLD = 1200;
        const ORBIT_RANGE_THRESHOLD = 600;
        let hasShownLoading = false;
        let loadingTimeoutId = null;
        
        viewer.camera.changed.addEventListener(() => {
          const height = viewer.camera.positionCartographic.height;
          const cameraPos = viewer.camera.positionWC;

          // Find closest visible model to camera
          let closestModel = null;
          let closestDistance = Infinity;

          MODELS.forEach((model) => {
            const modelPos = Cesium.Cartesian3.fromDegrees(
              model.lon,
              model.lat,
              model.height
            );
            const distance = Cesium.Cartesian3.distance(cameraPos, modelPos);
            
            if (distance < closestDistance) {
              closestDistance = distance;
              closestModel = model;
            }
          });

          // Show loading screen when approaching visibility threshold (only for manual zoom)
          if (height < VISIBILITY_THRESHOLD + 200 && height > VISIBILITY_THRESHOLD - 100 && !hasShownLoading && !isFlyingRef.current) {
            hasShownLoading = true;
            setIsLoading3D(true);
          }
          
          // Reset loading flag and hide screen when far away
          if (height > VISIBILITY_THRESHOLD + 500) {
            hasShownLoading = false;
            if (loadingTimeoutId) {
              clearTimeout(loadingTimeoutId);
              loadingTimeoutId = null;
            }
            setIsLoading3D(false);
          }
    
          // Check if any model should be visible
          let anyModelVisible = false;

          // Toggle model/blip visibility for ALL models
          MODELS.forEach((model) => {
            const entity = entityMapRef.current[model.id];
            const blip = blipMapRef.current[model.id];
            const modelPos = Cesium.Cartesian3.fromDegrees(model.lon, model.lat, model.height);
            const distanceToModel = Cesium.Cartesian3.distance(cameraPos, modelPos);
            
            if (entity && blip) {
              // Show model if close enough to THIS specific model
              if (distanceToModel < VISIBILITY_THRESHOLD) {
                entity.show = true;
                blip.show = false;
                anyModelVisible = true;
                
                // Set as active model if closest
                if (model === closestModel) {
                  activeModelRef.current = model;
                }
                
                // Hide loading screen after model becomes visible (only for manual zoom, not flyTo)
                if (hasShownLoading && !isFlyingRef.current && !loadingTimeoutId) {
                  loadingTimeoutId = setTimeout(() => {
                    setIsLoading3D(false);
                    hasShownLoading = false;
                    loadingTimeoutId = null;
                  }, 1500); // 1.5 seconds for rendering
                }
              } else {
                entity.show = false;
                blip.show = true;
              }
            }
          });

          setIsModelVisible(anyModelVisible);

          // Exit orbit lock when no models visible
          if (!anyModelVisible && orbitLockedRef.current) {
            viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
            setOrbitLocked(false);
            orbitLockedRef.current = false;
            activeModelRef.current = null;
          }
    
          // Camera constraints based on altitude
          if (height > 10000) {
            controller.minimumPitch = Cesium.Math.toRadians(-90);
            controller.maximumPitch = Cesium.Math.toRadians(-89);
          } else if (height > 2000) {
            controller.minimumPitch = Cesium.Math.toRadians(-10);
            controller.maximumPitch = Cesium.Math.toRadians(-60);
          } else if (height > ORBIT_RANGE_THRESHOLD) {
            controller.minimumPitch = Cesium.Math.toRadians(-15);
            controller.maximumPitch = Cesium.Math.toRadians(-85);
          } else {
            controller.minimumPitch = Cesium.Math.toRadians(-89);
            controller.maximumPitch = Cesium.Math.toRadians(89);
            
            controller.enableRotate = true;
            controller.inertiaSpin = 0.9;
            controller.inertiaTranslate = 0.9;
            controller.inertiaZoom = 0.8;
            controller.minimumZoomDistance = 50;
            controller.maximumZoomDistance = 600;
          }

          controller.tiltEventTypes = [
            Cesium.CameraEventType.RIGHT_DRAG,
            Cesium.CameraEventType.PINCH,
            Cesium.CameraEventType.MIDDLE_DRAG,
          ];
          
          controller.rotateEventTypes = [
            Cesium.CameraEventType.LEFT_DRAG,
          ];
        });
        
        /* ----------------------------------
           Click picking → modal display
        ----------------------------------- */
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

        handler.setInputAction((movement) => {
          const picked = viewer.scene.pick(movement.position);
          if (!picked?.detail?.node || !picked?.id) return;

          const modelId = picked.id.modelId;
          const model = MODEL_LOOKUP[modelId];
          if (!model) return;

          const rawNodeName = picked.detail.node._name;
          const partKey = normalizeNodeName(rawNodeName);
          const part = model.parts?.[partKey];
          if (!part) return;

          if (labelMapRef.current[partKey]) {
            viewer.entities.remove(labelMapRef.current[partKey]);
            delete labelMapRef.current[partKey];
          }

          const worldPos =
            picked.detail?.position ??
            picked.id.position.getValue(Cesium.JulianDate.now());

          const screenPos = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            viewer.scene,
            worldPos
          );

          setActiveModal({
            partKey,
            label: part.label,
            icon: part.icon,
            position: screenPos,
            worldPos,
          });
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      } catch (error) {
        console.error("Error initializing Cesium viewer:", error);
      }
    };

    init();

    return () => {
      Object.values(labelMapRef.current).forEach((label) => {
        if (viewer && !viewer.isDestroyed()) {
          viewer.entities.remove(label);
        }
      });
      labelMapRef.current = {};

      if (viewer && !viewer.isDestroyed()) {
        viewer.destroy();
      }
    };
  }, []);

  /* ----------------------------------
     Camera helper - FLY TO MODEL (DYNAMIC)
  ----------------------------------- */
  const flyToModel = (modelId) => {
    const viewer = viewerRef.current;
    const entity = entityMapRef.current[modelId];
    const model = MODEL_LOOKUP[modelId];
    if (!viewer || !entity || !model) return;

    // Set this as the active model
    activeModelRef.current = model;

    // Show loading screen immediately
    setIsLoading3D(true);
    isFlyingRef.current = true;

    // Temporarily show entity if hidden (needed for flyTo to work)
    const wasHidden = !entity.show;
    if (wasHidden) {
      entity.show = true;
    }

    // Calculate position at mid-height of the model
    const midHeight = model.height / 2;
    const targetPosition = Cesium.Cartesian3.fromDegrees(
      model.lon,
      model.lat,
      midHeight
    );

    // Fly to position with camera looking at mid-height
    viewer.camera.flyTo({
      destination: targetPosition,
      orientation: {
        heading: Cesium.Math.toRadians(45),
        pitch: Cesium.Math.toRadians(-20),
        roll: 0.0
      },
      offset: new Cesium.HeadingPitchRange(
        Cesium.Math.toRadians(45),
        Cesium.Math.toRadians(-20),
        200
      ),
      duration: 2.5
    }).then(() => {
      // Wait for rendering, then enable orbit and hide loading
      setTimeout(() => {
        // Automatically enable orbit lock mode for THIS model
        if (!orbitLockedRef.current) {
          const orbitCenter = Cesium.Cartesian3.fromDegrees(
            model.lon,
            model.lat,
            model.height
          );

          const offset = Cesium.Cartesian3.subtract(
            viewer.camera.position,
            orbitCenter,
            new Cesium.Cartesian3()
          );

          const transform = Cesium.Transforms.eastNorthUpToFixedFrame(orbitCenter);
          const inverseTransform = Cesium.Matrix4.inverse(transform, new Cesium.Matrix4());
          const localOffset = Cesium.Matrix4.multiplyByPoint(
            inverseTransform,
            viewer.camera.position,
            new Cesium.Cartesian3()
          );
          
          viewer.camera.lookAtTransform(transform, localOffset);
          setOrbitLocked(true);
          orbitLockedRef.current = true;
        }
        
        // Hide loading screen
        setIsLoading3D(false);
        isFlyingRef.current = false;
      }, 1500); // 1.5 seconds after arrival
    }).catch((error) => {
      console.error("Error flying to model:", error);
      if (wasHidden) {
        entity.show = false;
      }
      setIsLoading3D(false);
      isFlyingRef.current = false;
    });
  };

  /* ----------------------------------
     Close modal helper
  ----------------------------------- */
  const closeModal = () => {
    setActiveModal(null);
  };

  /* ----------------------------------
     Toggle orbit lock mode - DYNAMIC for active model
  ----------------------------------- */
  const toggleOrbitLock = () => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    if (!orbitLocked) {
      // Use active model, or closest visible model, or first model as fallback
      const model = activeModelRef.current || MODELS[0];
      
      // Enter orbit mode - PRESERVE current camera position
      const orbitCenter = Cesium.Cartesian3.fromDegrees(
        model.lon,
        model.lat,
        model.height
      );

      // Calculate the offset from tower to camera in world coordinates
      const offset = Cesium.Cartesian3.subtract(
        viewer.camera.position,
        orbitCenter,
        new Cesium.Cartesian3()
      );

      // Create the transform at tower position
      const transform = Cesium.Transforms.eastNorthUpToFixedFrame(orbitCenter);
      
      // Transform the offset to the local ENU coordinate system
      const inverseTransform = Cesium.Matrix4.inverse(transform, new Cesium.Matrix4());
      const localOffset = Cesium.Matrix4.multiplyByPoint(
        inverseTransform,
        viewer.camera.position,
        new Cesium.Cartesian3()
      );
      
      // Apply lookAtTransform with the local offset to maintain current position
      viewer.camera.lookAtTransform(transform, localOffset);

      setOrbitLocked(true);
      orbitLockedRef.current = true;
    } else {
      // Exit orbit mode - return to free camera
      viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
      setOrbitLocked(false);
      orbitLockedRef.current = false;
    }
  };

  /* ----------------------------------
     Render
  ----------------------------------- */
  return (
    <>
      {/* LOADING SCREEN */}
      {isLoading3D && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "#000",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              border: "4px solid #1a1a1a",
              borderTop: "4px solid #3b82f6",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              marginBottom: "24px",
            }}
          />
          
          <div
            style={{
              color: "#fff",
              fontSize: "24px",
              fontWeight: 600,
              marginBottom: "8px",
            }}
          >
            Loading 3D Model
          </div>
          <div
            style={{
              color: "#888",
              fontSize: "14px",
            }}
          >
            Rendering tower and environment...
          </div>
        </div>
      )}

      {/* FLOATING MODELS PANEL */}
      <div
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          zIndex: 10,
          background: "rgba(15, 23, 42, 0.95)",
          backdropFilter: "blur(12px)",
          borderRadius: "16px",
          border: "2px solid #334155",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          overflow: "hidden",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          width: panelOpen ? "280px" : "56px",
          maxHeight: "calc(100vh - 40px)",
        }}
      >
        <div
          style={{
            padding: "16px",
            borderBottom: panelOpen ? "1px solid #334155" : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {panelOpen && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                }}
              >
                🗼
              </div>
              <h3
                style={{
                  margin: 0,
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                Models
              </h3>
            </div>
          )}
          <button
            onClick={() => setPanelOpen((v) => !v)}
            style={{
              background: panelOpen ? "#1e293b" : "transparent",
              border: "1px solid #334155",
              borderRadius: "8px",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#94a3b8",
              cursor: "pointer",
              fontSize: "16px",
              transition: "all 0.2s",
              marginLeft: panelOpen ? 0 : "auto",
              marginRight: panelOpen ? 0 : "auto",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#334155";
              e.target.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = panelOpen ? "#1e293b" : "transparent";
              e.target.style.color = "#94a3b8";
            }}
            aria-label={panelOpen ? "Collapse panel" : "Expand panel"}
          >
            {panelOpen ? "⟨" : "⟩"}
          </button>
        </div>

        {panelOpen && (
          <div
            style={{
              padding: "16px",
              maxHeight: "calc(100vh - 120px)",
              overflowY: "auto",
            }}
          >
            <div style={{ marginBottom: "8px" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  color: "#64748b",
                }}
              >
                Available Towers
              </span>
            </div>
            {MODELS.map((m, index) => (
              <button
                key={m.id}
                onClick={() => flyToModel(m.id)}
                style={{
                  width: "100%",
                  padding: "14px",
                  marginBottom: index < MODELS.length - 1 ? "8px" : 0,
                  background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                  border: "1px solid #334155",
                  borderRadius: "10px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "linear-gradient(135deg, #334155 0%, #1e293b 100%)";
                  e.target.style.transform = "translateX(4px)";
                  e.target.style.borderColor = "#475569";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)";
                  e.target.style.transform = "translateX(0)";
                  e.target.style.borderColor = "#334155";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "rgba(59, 130, 246, 0.1)",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                      flexShrink: 0,
                    }}
                  >
                    📡
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        color: "#fff",
                        fontSize: "14px",
                        fontWeight: 600,
                        marginBottom: "4px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {m.name}
                    </div>
                    <div
                      style={{
                        color: "#64748b",
                        fontSize: "11px",
                      }}
                    >
                      {m.lat.toFixed(4)}°, {m.lon.toFixed(4)}°
                    </div>
                  </div>
                  <div
                    style={{
                      color: "#3b82f6",
                      fontSize: "18px",
                      opacity: 0.6,
                    }}
                  >
                    →
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* CESIUM CANVAS */}
      <div
        ref={containerRef}
        style={{
          position: "fixed",
          inset: 0,
        }}
      />

      {/* 3D MODAL */}
      {activeModal && activeModal.position && (
        <div
          style={{
            position: "fixed",
            left: activeModal.position.x,
            top: activeModal.position.y,
            transform: "translate(-50%, -100%)",
            marginTop: "-20px",
            zIndex: 100,
            background: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(10px)",
            border: "2px solid #334155",
            borderRadius: "12px",
            padding: "20px",
            minWidth: "280px",
            maxWidth: "400px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
            pointerEvents: "auto",
          }}
        >
          <button
            onClick={closeModal}
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              fontSize: "20px",
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "6px",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#1e293b";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
            }}
            title="Close"
          >
            ✕
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                fontSize: "32px",
                width: "48px",
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#1e293b",
                borderRadius: "8px",
                border: "1px solid #334155",
              }}
            >
              {activeModal.icon}
            </div>
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  margin: 0,
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                {activeModal.label}
              </h3>
              <p
                style={{
                  margin: "4px 0 0 0",
                  color: "#94a3b8",
                  fontSize: "12px",
                }}
              >
                Component ID: {activeModal.partKey}
              </p>
            </div>
          </div>

          <div
            style={{
              background: "#1e293b",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "12px",
            }}
          >
            <div style={{ marginBottom: "8px" }}>
              <span style={{ color: "#94a3b8", fontSize: "13px" }}>
                Status:
              </span>
              <span
                style={{
                  color: "#10b981",
                  fontSize: "13px",
                  marginLeft: "8px",
                  fontWeight: 600,
                }}
              >
                ● Operational
              </span>
            </div>
            <div style={{ marginBottom: "8px" }}>
              <span style={{ color: "#94a3b8", fontSize: "13px" }}>
                Last Inspection:
              </span>
              <span
                style={{
                  color: "#e2e8f0",
                  fontSize: "13px",
                  marginLeft: "8px",
                }}
              >
                Nov 15, 2024
              </span>
            </div>
            <div>
              <span style={{ color: "#94a3b8", fontSize: "13px" }}>
                Maintenance Due:
              </span>
              <span
                style={{
                  color: "#e2e8f0",
                  fontSize: "13px",
                  marginLeft: "8px",
                }}
              >
                Jan 20, 2025
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              style={{
                flex: 1,
                padding: "10px",
                background: "#3b82f6",
                border: "none",
                borderRadius: "6px",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#2563eb";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#3b82f6";
              }}
            >
              View Details
            </button>
            <button
              style={{
                flex: 1,
                padding: "10px",
                background: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "6px",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#334155";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#1e293b";
              }}
            >
              Report Issue
            </button>
          </div>
        </div>
      )}

      {/* ORBIT LOCK TOGGLE */}
      {isModelVisible && (
        <button
          onClick={toggleOrbitLock}
          style={{
            position: "fixed",
            bottom: 40,
            right: 40,
            zIndex: 10,
            padding: "14px 20px",
            background: orbitLocked 
              ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" 
              : "rgba(30, 41, 59, 0.95)",
            backdropFilter: "blur(10px)",
            border: orbitLocked ? "2px solid #60a5fa" : "2px solid #334155",
            borderRadius: "12px",
            color: "#fff",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.3s",
            boxShadow: orbitLocked 
              ? "0 0 20px rgba(59, 130, 246, 0.6)" 
              : "0 4px 12px rgba(0, 0, 0, 0.4)",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = orbitLocked
              ? "0 4px 24px rgba(59, 130, 246, 0.8)"
              : "0 6px 16px rgba(0, 0, 0, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = orbitLocked
              ? "0 0 20px rgba(59, 130, 246, 0.6)"
              : "0 4px 12px rgba(0, 0, 0, 0.4)";
          }}
          title={orbitLocked ? "Exit Orbit Mode" : "Enter Orbit Mode"}
        >
          <span style={{ fontSize: "20px" }}>
            {orbitLocked ? "🔓" : "🔒"}
          </span>
          <span>
            {orbitLocked ? "Free Camera" : "Orbit Mode"}
          </span>
        </button>
      )}
    </>
  );
}

/* ----------------------------------
   CSS Animations
----------------------------------- */
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `;
  if (!document.head.querySelector('style[data-cesium-animations]')) {
    style.setAttribute('data-cesium-animations', 'true');
    document.head.appendChild(style);
  }
}
    