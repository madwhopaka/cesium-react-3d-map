/* ----------------------------------
   useModalPosition Hook
   
   Updates modal screen position as camera moves
----------------------------------- */

import { useEffect } from "react";
import * as Cesium from "cesium";

export function useModalPosition(viewer, activeModal, setActiveModal) {
  useEffect(() => {
    if (!activeModal?.worldPos || !viewer) return;

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
  }, [viewer, activeModal?.worldPos, activeModal?.partKey, setActiveModal]);
}