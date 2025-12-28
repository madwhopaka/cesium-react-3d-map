import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { MODELS, MODEL_LOOKUP } from "../constants/models";
import { normalizeNodeName } from "../helpers/helper";
import PartModal from "./Cesium/PartsModal";

Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN;

export default function ModelViewer() {
  const { modelId } = useParams();
  const containerRef = useRef(null);
  const viewerRef = useRef(null);

  const model = MODEL_LOOKUP[modelId];

  // ========== ADDED: State for modal ==========
  const [activeModal, setActiveModal] = useState(null);
  // ========== END ADDED ==========

  useEffect(() => {
    if (!model) return;

    let viewer;

    const init = async () => {
      viewer = new Cesium.Viewer(containerRef.current, {
        terrain: undefined,
        timeline: false,
        animation: false,
        baseLayerPicker: false,
        geocoder: false,
        navigationHelpButton: false,
        homeButton: false,
        sceneModePicker: false,
        infoBox: false,
        selectionIndicator: false,
      });

      viewer.scene.backgroundColor = Cesium.Color.WHITE;
      viewer.scene.globe.show = false;
      viewer.scene.skyAtmosphere = undefined;
      viewer.scene.highDynamicRange = true;

      viewerRef.current = viewer;

      viewer.scene.light = new Cesium.DirectionalLight({
        direction: new Cesium.Cartesian3(0.5, 0.5, -0.8),
        intensity: 2.0,
      });

      const entity = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(0, 0, 0),
        model: {
          uri: model.uri,
          scale: model.scale,
          minimumPixelSize: 64,
          maximumScale: 50000,
          shadows: Cesium.ShadowMode.DISABLED,
        },
      });

      entity.modelId = model.id;

      await viewer.zoomTo(entity, new Cesium.HeadingPitchRange(
        Cesium.Math.toRadians(45),
        Cesium.Math.toRadians(-25),
        model.towerHeight * 2
      ));

      // ========== ADDED: Click handler for parts ==========
      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction((movement) => {
        const picked = viewer.scene.pick(movement.position);

        if (picked?.detail?.node && picked?.id) {
          const pickedModelId = picked.id.modelId;
          const pickedModel = MODEL_LOOKUP[pickedModelId];
          
          if (pickedModel) {
            const raw = picked.detail.node._name;
            const key = normalizeNodeName(raw);
            const part = pickedModel.parts?.[key] || pickedModel.parts?.[raw];
            
            if (part) {
              setActiveModal({
                label: part.label,
                icon: part.icon,
                partPosition: part.position,
                positionReason: part.positionReason,
                purpose: part.purpose,
                material: part.material,
              });
              
              console.log(`🖱️ Clicked: ${part.label} (${key})`);
            }
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      // ========== END ADDED ==========
    };

    init();

    return () => {
      if (viewer && !viewer.isDestroyed()) {
        viewer.destroy();
      }
    };
  }, [model]);

  if (!model) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f9fafb',
        color: '#111827',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h1>Model not found</h1>
        <Link 
          to="/" 
          style={{
            padding: '12px 24px',
            backgroundColor: '#3b82f6',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px'
          }}
        >
          Back to Map
        </Link>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <Link
        to="/"
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 1000,
          padding: '12px 24px',
          backgroundColor: 'white',
          color: '#111827',
          textDecoration: 'none',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          fontSize: '14px',
          fontWeight: '500',
        }}
      >
        ← Back to Map
      </Link>

      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          padding: '16px 24px',
          backgroundColor: 'white',
          color: '#111827',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}
      >
        <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '600' }}>{model.name}</h2>
        <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
          Height: {model.towerHeight}m
        </p>
      </div>

      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* ========== ADDED: Parts modal ========== */}
      <PartModal modal={activeModal} onClose={() => setActiveModal(null)} />
      {/* ========== END ADDED ========== */}
    </div>
  );
}