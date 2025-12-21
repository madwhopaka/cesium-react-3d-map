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
    height: 250,
    scale: 5,
    uri: "/models/Tower_01-compressed.glb",
    parts: {
      antenna1_metal: {
        label: "Antenna – Metal Structure",
        description:
          "Primary steel structure supporting the antenna assembly",
        icon: "📡",
      },
      antenna1_alum: {
        label: "Antenna – Aluminium Component",
        description:
          "Lightweight aluminium casing and structural elements",
        icon: "🧩",
      },
      antenna1_cloth: {
        label: "Antenna – Protective Cover",
        description:
          "Weather-resistant fabric covering protecting antenna internals",
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

  const [modalData, setModalData] = useState(null);
  const [panelOpen, setPanelOpen] = useState(true);

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
        infoBox: false,
        selectionIndicator: false,
      });

      viewerRef.current = viewer;

      /* --- Photorealistic tiles --- */
      const tileset =
        await Cesium.Cesium3DTileset.fromIonAssetId(2275207);
      viewer.scene.primitives.add(tileset);

      viewer.scene.globe.enableLighting = true;
      viewer.scene.highDynamicRange = false;
      viewer.scene.globe.depthTestAgainstTerrain = false;

      /* --- Load models --- */
      MODELS.forEach((model) => {
        const position = Cesium.Cartesian3.fromDegrees(
          model.lon,
          model.lat,
          model.height
        );

        const entity = viewer.entities.add({
          name: model.name,
          position,
          model: {
            uri: model.uri,
            scale: model.scale,
            minimumPixelSize: 64,
            maximumScale: 200,
            shadows: Cesium.ShadowMode.ENABLED,
          },
        });

        // ✅ Attach modelId to ENTITY (not primitive)
        entity.modelId = model.id; 
        
        entityMapRef.current[model.id] = entity;
      });

      flyToModel(MODELS[0].id);

      /* --- Click handling --- */
      const handler = new Cesium.ScreenSpaceEventHandler(
        viewer.canvas
      );

      handler.setInputAction((movement) => {
        const picked = viewer.scene.pick(movement.position);

        console.log(picked, 'Picked') ; 
      
        if (!picked?.detail?.node || !picked?.primitive) return;
      
        const modelId = picked.id?.modelId;
        if (!modelId) {
          console.log("❌ No modelId on primitive");
          return;
        }
      
        const model = MODEL_LOOKUP[modelId];
        if (!model) {
          console.log("❌ Model not found:", modelId);
          return;
        }
      
        const rawNodeName = picked.detail.node._name;
        const partKey = normalizeNodeName(rawNodeName);
        const part = model.parts?.[partKey];
      
        console.log("✅ Opening modal for:", partKey);
      
        setModalData({
          modelName: model.name,
          label: part?.label ?? model.name,
          description:
            part?.description ?? `Clicked node: ${rawNodeName}`,
          icon: part?.icon ?? "🧩",
          rawNodeName,
        });
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    };

    init();

    return () => {
      if (viewer && !viewer.isDestroyed()) {
        viewer.destroy();
      }
    };
  }, []);

  /* ----------------------------------
     Camera helper
  ----------------------------------- */
  const flyToModel = (modelId) => {
    const viewer = viewerRef.current;
    const entity = entityMapRef.current[modelId];
    if (!viewer || !entity) return;

    viewer.flyTo(entity, {
      duration: 2,
      offset: new Cesium.HeadingPitchRange(
        Cesium.Math.toRadians(20),
        Cesium.Math.toRadians(-35),
        400
      ),
    });
  };

  /* ----------------------------------
     Render
  ----------------------------------- */
  return (
    <>
      {/* LEFT PANEL */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: panelOpen ? 260 : 40,
          height: "100vh",
          background: "#0f172a",
          color: "#fff",
          zIndex: 10,
          padding: panelOpen ? "16px" : "8px",
          transition: "width 0.2s ease",
          overflow: "hidden",
        }}
      >
        <button
          onClick={() => setPanelOpen((v) => !v)}
          style={{
            position: "absolute",
            top: 10,
            right: 8,
            background: "transparent",
            border: "none",
            color: "#94a3b8",
            cursor: "pointer",
            fontSize: 18,
          }}
        >
          {panelOpen ? "⟨" : "⟩"}
        </button>

        {panelOpen && (
          <>
            <h3 style={{ marginTop: 0 }}>Demo Models</h3>

            {MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => flyToModel(model.id)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  fontSize: 16, 
                  marginBottom: 8,
                  background: "#1e293b",
                  border: "1px solid #334155",
                  color: "#fff",
                  borderRadius: 6,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {model.name}
              </button>
            ))}
          </>
        )}
      </div>

      {/* CESIUM CANVAS */}
      <div
        ref={containerRef}
        style={{
          position: "fixed",
          inset: 0,
          marginLeft: panelOpen ? 260 : 40,
          transition: "margin-left 0.2s ease",
        }}
      />

      {/* MODAL */}
      {modalData && (
        <div
          onClick={() => setModalData(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 420,
              background: "#020617",
              color: "#fff",
              padding: 20,
              borderRadius: 10,
              border: "1px solid #1e293b",
            }}
          >
            <h3>
              {modalData.icon} {modalData.label}
            </h3>
            <p>{modalData.description}</p>
            <div style={{ fontSize: 12, opacity: 0.6 }}>
              node: {modalData.rawNodeName}
            </div>

            <button
              onClick={() => setModalData(null)}
              style={{
                fontSize:14 ,
                marginTop: 12,
                padding: "2px 8px",
                background: "#1e293b",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
