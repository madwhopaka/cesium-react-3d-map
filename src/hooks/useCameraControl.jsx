import { useEffect } from "react";
import * as Cesium from "cesium";
import { getVisibilityThreshold } from "../constants/config";
import { getDistanceToModel } from "../helpers/helper";

export function useCameraControls({
  viewer,
  models,
  entityMapRef,
  blipMapRef,
  isFlyingRef,
  activeModelRef,
  orbitLockedRef,
  setIsModelVisible,
  entitiesReady,
}) {
  useEffect(() => {
    if (!viewer || !entitiesReady) return;

    const controller = viewer.scene.screenSpaceCameraController;

    controller.inertiaZoom = 0.8;
    controller.inertiaSpin = 0.9;
    controller.inertiaTranslate = 0.9;

    const onChange = () => {
      if (orbitLockedRef.current || isFlyingRef.current) return;

      const camPos = viewer.camera.positionWC;
      let anyVisible = false;
      let closest = null;
      let closestDist = Infinity;

      models.forEach((m) => {
        const e = entityMapRef.current[m.id];
        const b = blipMapRef.current[m.id];
        
        if (!e || !b) return;

        const d = getDistanceToModel(m, camPos, Cesium);
        if (d < getVisibilityThreshold(m) * 1.2) {
          e.show = true;
          b.show = false;
          
          // Show part markers
          if (e.partMarkers) {
            e.partMarkers.forEach(marker => marker.show = true);
          }
          
          anyVisible = true;

          if (d < closestDist) {
            closestDist = d;
            closest = m;
          }
        } else {
          e.show = false;
          b.show = true;
          
          // Hide part markers
          if (e.partMarkers) {
            e.partMarkers.forEach(marker => marker.show = false);
          }
        }
      });

      if (closest) activeModelRef.current = closest;
      setIsModelVisible(anyVisible);
    };

    viewer.camera.changed.addEventListener(onChange);
    onChange();

    return () => viewer.camera.changed.removeEventListener(onChange);
  }, [viewer, entitiesReady]);
}