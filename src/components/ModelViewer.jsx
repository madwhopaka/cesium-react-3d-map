import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { MODEL_LOOKUP } from "../constants/models";
import { normalizeNodeName } from "../helpers/helper";
import PartBubble from "./Cesium/PartsModal";

export default function ModelViewer() {
  const { modelId } = useParams();
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const modelRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  
  // Track if user is actively interacting to prevent premature bubble clearing
  const isUserInteractingRef = useRef(false);
  const bubbleSetTimeRef = useRef(0);
  const modelLoadedRef = useRef(false);

  const model = MODEL_LOOKUP[modelId];
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

    // Scene setup with off-white background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#bdbdbd');
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      10000
    );
    camera.position.set(100, 100, 100);
    cameraRef.current = camera;

    // Renderer
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

    // Lighting
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
      .setPath("/hdr/") // folder where your .hdr lives
      .load("simple-light.hdr", (hdrTexture) => {
        const envMap = pmremGenerator.fromEquirectangular(hdrTexture).texture;
    
        scene.environment = envMap; // ✅ PBR lighting
    
        hdrTexture.dispose();
        pmremGenerator.dispose();
      });

    // Controls with enhanced zoom range
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 0.5;      // Allow zooming VERY close (was 10)
    controls.maxDistance = 1000;     // Allow zooming VERY far (was 1000)
    controls.zoomSpeed = 1.0;        // Slightly faster zoom
    controls.enablePan = true;       // Enable panning
    controls.panSpeed = 0.8;
    controlsRef.current = controls;

    // Track when user starts interacting
    const onControlStart = () => {
      isUserInteractingRef.current = true;
    };

    const onControlEnd = () => {
      isUserInteractingRef.current = false;
    };

    // Only clear bubble if user is actively rotating/moving camera
    // AND enough time has passed since bubble was set (prevents immediate clearing)
    const onControlChange = () => {
      const timeSinceBubbleSet = Date.now() - bubbleSetTimeRef.current;
      
      // Only clear if:
      // 1. User is actively dragging/rotating
      // 2. At least 200ms has passed since bubble was set (prevents race condition)
      // 3. Model has finished loading (prevents clearing during initial setup)
      if (isUserInteractingRef.current && timeSinceBubbleSet > 200 && modelLoadedRef.current) {
        setPartBubble(null);
        setBubbleAnchor(null);
      }
    };

    controls.addEventListener('start', onControlStart);
    controls.addEventListener('end', onControlEnd);
    controls.addEventListener('change', onControlChange);

    // Load model
    const loader = new GLTFLoader();
    loader.load(
      model.uri,
      (gltf) => {
        const loadedModel = gltf.scene;
        loadedModel.scale.set(model.scale, model.scale, model.scale);
        
        // Enable shadows and log all mesh names for debugging
        loadedModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            console.log('Mesh found:', child.name);
          }
        });

        scene.add(loadedModel);
        modelRef.current = loadedModel;

        // Center the model
        const box = new THREE.Box3().setFromObject(loadedModel);
        const center = box.getCenter(new THREE.Vector3());
        loadedModel.position.sub(center);

        // Adjust camera to fit model
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
        
        // Mark model as loaded and hide loading screen
        setTimeout(() => {
          modelLoadedRef.current = true;
          setIsLoading(false);
          console.log('✅ Model fully loaded and ready for interaction');
        }, 500);
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
        setIsLoading(false); // Hide loading screen even on error
      }
    );

    // Click handler for parts
    const handleClick = (event) => {
      // Don't process clicks if model isn't loaded yet
      if (!modelLoadedRef.current || !modelRef.current) {
        console.log('⏳ Model not ready yet');
        return;
      }

      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      
      console.log('🖱️ Click detected');

      // Intersect with all meshes recursively
      const intersects = raycasterRef.current.intersectObjects(
        modelRef.current.children,
        true // recursive
      );

      if (intersects.length > 0) {
        const intersected = intersects[0].object;
        
        // Try multiple ways to get the node name
        let nodeName = intersected.name;
        
        // If no name, check parent hierarchy
        if (!nodeName && intersected.parent) {
          nodeName = intersected.parent.name;
        }
        
        // If still no name, traverse up the hierarchy
        if (!nodeName) {
          let current = intersected;
          while (current.parent && !nodeName) {
            current = current.parent;
            if (current.name && current !== modelRef.current) {
              nodeName = current.name;
              break;
            }
          }
        }
        
        console.log('Picked object:', nodeName, 'Type:', intersected.type);

        if (nodeName) {
          const key = normalizeNodeName(nodeName);
          
          // Try multiple lookup strategies
          const part = model.parts?.[key] || 
                       model.parts?.[nodeName] || 
                       model.parts?.[nodeName.replace(/_/g, " ")] ||
                       model.parts?.[nodeName.toLowerCase()];

          if (part) {
            console.log(`✅ Part found: ${part.label} (key: ${key})`);
            
            // Record when bubble was set to prevent immediate clearing
            bubbleSetTimeRef.current = Date.now();
            
            setPartBubble(part);

            setBubbleAnchor({
              x: event.clientX,
              y: event.clientY,
            });

            return;
          } else {
            console.log(`⚠️ No part definition found for: "${nodeName}" (normalized: "${key}")`);
            console.log('Available parts:', Object.keys(model.parts || {}));
          }
        } else {
          console.log('⚠️ No name found for intersected object');
        }
      } else {
        console.log("❌ No objects intersected");
      }
      
      // Only clear bubble if we didn't find a valid part
      setPartBubble(null);
      setBubbleAnchor(null);
    };

    // Use pointerdown to ensure clean click detection
    renderer.domElement.addEventListener('pointerdown', handleClick);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handleClick);
      controls.removeEventListener('start', onControlStart);
      controls.removeEventListener('end', onControlEnd);
      controls.removeEventListener('change', onControlChange);
      controls.dispose();
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
    <div style={{ position: 'relative', width: '100%', height: '100vh', backgroundColor: '#f8f9fa' }}>
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
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
          <div style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
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
            backgroundColor: 'rgba(219, 215, 215, 0.95)',
            color: '#111827',
            textDecoration: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            fontSize: '14px',
            fontWeight: '500',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0,0,0,0.1)',
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
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          color: '#111827',
          borderRadius: '6px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0,0,0,0.1)',
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

      <PartBubble
        bubble={partBubble}
        anchor={bubbleAnchor}
      />
    </div>
  );
}