import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { MODEL_LOOKUP } from "../constants/models";
import { normalizeNodeName } from "../helpers/helper";
import PartBubble from "./Cesium/PartsModal";
import TowerBubble from "./Cesium/TowerModal";

export default function ModelViewer() {
  const { modelId } = useParams();
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const modelRef = useRef(null);
  const modelLoadedRef = useRef(false);
  const raycasterRef = useRef(new THREE.Raycaster());
  const pointerRef = useRef(new THREE.Vector2());

  const model = MODEL_LOOKUP[modelId];
  const [isTowerBubbleVisible, setIsTowerBubbleVisible] = useState(false);
  const [partBubble, setPartBubble] = useState(null);
  const [bubbleAnchor, setBubbleAnchor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInIframe, setIsInIframe] = useState(false);

  // Detect if component is in iframe
  useEffect(() => {
    try {
      setIsInIframe(window.self !== window.top);
    } catch (e) {
      setIsInIframe(true);
    }
  }, []);

  // Safety timeout: ensure loading screen disappears after 5 seconds max
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
      console.log('⏱️ Loading timeout reached (5s)');
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!model) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#bdbdbd');
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      10000
    );
    camera.position.set(100, 100, 100);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-50, 50, -50);
    scene.add(fillLight);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    new RGBELoader()
      .setPath('/hdr/')
      .load('simple-light.hdr', (hdrTexture) => {
        const envMap = pmremGenerator.fromEquirectangular(hdrTexture).texture;
        scene.environment = envMap;
        hdrTexture.dispose();
        pmremGenerator.dispose();
      });

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 0.5;
    controls.maxDistance = 1000;
    controls.zoomSpeed = 1.0;
    controls.enablePan = true;
    controls.panSpeed = 0.8;
    controlsRef.current = controls;

    const handlePartClick = (event) => {
      if (!modelRef.current || !cameraRef.current || !rendererRef.current) return;

      const rect = renderer.domElement.getBoundingClientRect();
      const pointer = pointerRef.current;
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);

      const raycaster = raycasterRef.current;
      raycaster.setFromCamera(pointer, cameraRef.current);

      const intersects = raycaster.intersectObject(modelRef.current, true);
      if (!intersects.length) {
        setPartBubble(null);
        setBubbleAnchor(null);
        return;
      }

      let node = intersects[0].object;
      const fallbackLabel = node?.name || node?.type || "Model Part";
      while (node) {
        const rawName = node.name;
        const key = normalizeNodeName(rawName);
        const part = model.parts?.[key] || model.parts?.[rawName];

        if (part) {
          setPartBubble(part);
          setBubbleAnchor({
            x: event.clientX,
            y: event.clientY,
          });
          return;
        }

        node = node.parent;
      }

      setPartBubble({
        label: fallbackLabel,
        manufacturer: "",
        position: "Inside 3D model",
        purpose: "Selected model component",
        detailedPurpose: "This mesh is part of the current tower model.",
        material: "",
        lifeDuration: "",
        icon: "◼",
      });
      setBubbleAnchor({
        x: event.clientX,
        y: event.clientY,
      });
    };

    renderer.domElement.addEventListener("click", handlePartClick);

    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      model.uri,
      (gltf) => {
        const loadedModel = gltf.scene;
        loadedModel.scale.set(model.scale, model.scale, model.scale);

        loadedModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        scene.add(loadedModel);
        modelRef.current = loadedModel;

        const box = new THREE.Box3().setFromObject(loadedModel);
        const center = box.getCenter(new THREE.Vector3());
        loadedModel.position.sub(center);

        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const distance = maxDim * 2;

        camera.position.set(
          distance * 0.7,
          distance * 0.5,
          distance * 0.7
        );
        camera.lookAt(0, 0, 0);
        controls.target.set(0, 0, 0);
        controls.update();

        setTimeout(() => {
          modelLoadedRef.current = true;
          setIsTowerBubbleVisible(true);
          setIsLoading(false);
        }, 500);
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
        setIsLoading(false);
      }
    );

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener("click", handlePartClick);
      controls.dispose();
      dracoLoader.dispose();
      renderer.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
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
        backgroundColor: '#bdc2c6ff',
        color: '#111827',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h1>Model not found</h1>
        <Link 
          to="/" 
          style={{
            padding: '12px 24px',
            backgroundColor: '#f5f5f5',
            color: '#050505',
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
    <div style={{ position: 'relative', width: '100%', height: '100vh', backgroundColor: '#f5f5f5', color: '#2f2f2f', fontFamily: 'Inter, "Segoe UI", system-ui, sans-serif' }}>
      {/* Loading Screen */}
      {isLoading && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(230, 232, 234, 0.95)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          gap: '24px',
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #d1d5db',
            borderTop: '4px solid #374151',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
          <div style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#2f2f2f',
          }}>
            Loading 3D Model...
          </div>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      )}

      {!isInIframe && (
        <Link
          to="/"
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: 1000,
            padding: '12px 24px',
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            color: '#2f2f2f',
            textDecoration: 'none',
            borderRadius: '8px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
            fontSize: '14px',
            fontWeight: '500',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(17,24,39,0.08)',
          }}
        >
          ← Back to Map
        </Link>
      )}

      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          padding: '8px 12px',
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          color: '#2f2f2f',
          borderRadius: '6px',
          boxShadow: '0 10px 22px rgba(0,0,0,0.12)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(17,24,39,0.08)',
        }}
      >
        <h2 style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: '600' }}>{model.name}</h2>
      </div>

      <div ref={containerRef} style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%', 
        height: '100%',
        overflow: 'hidden'
      }} />

      <TowerBubble
        tower={model}
        visible={isTowerBubbleVisible && !isLoading}
      />

      <PartBubble
        bubble={partBubble}
        anchor={bubbleAnchor}
        onClose={() => setPartBubble(null)}
      />
    </div>
  );
}