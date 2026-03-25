/* ----------------------------------
   Utility Functions
   
   Updated to use altitude + towerHeight structure
----------------------------------- */

/**
 * Normalize node name from 3D model mesh
 */
export const normalizeNodeName = (nodeName) => {
  if (!nodeName) return null;

  return nodeName.toLowerCase().trim().replace(/_\d+$/, "");
};

/**
 * Find closest model to camera position
 */
export const findClosestModel = (models, cameraPos, Cesium) => {
  let closestModel = null;
  let closestDistance = Infinity;

  models.forEach((model) => {
    // Model is placed at its altitude (base of tower)
    const modelPos = Cesium.Cartesian3.fromDegrees(
      model.lon,
      model.lat,
      model.altitude
    );
    const distance = Cesium.Cartesian3.distance(cameraPos, modelPos);
    
    if (distance < closestDistance) {
      closestDistance = distance;
      closestModel = model;
    }
  });

  return closestModel;
};

/**
 * Get distance from camera to specific model
 */
export const getDistanceToModel = (model, cameraPos, Cesium) => {
  // Model is placed at its altitude (base of tower)
  const modelPos = Cesium.Cartesian3.fromDegrees(
    model.lon,
    model.lat,
    model.altitude
  );
  return Cesium.Cartesian3.distance(cameraPos, modelPos);
};

/**
 * Computes safe on-screen position for a speech bubble
 * anchored to a click position.
 */
export function computeBubblePosition({
  anchorX,
  anchorY,
  bubbleWidth = 320,  // Updated from 300 to match PartBubble
  bubbleHeight = 400, // Updated from 320 to match PartBubble
  margin = 12,
  tailOffset = 18,
}) {
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;

  let left = anchorX + tailOffset;
  let top = anchorY - 24;

  let tailHorizontal = "left";   // tail points left → bubble on right
  let tailVertical = "top";

  /* ---------- Horizontal logic ---------- */

  // Overflow right → flip to left
  if (left + bubbleWidth > viewportW - margin) {
    left = anchorX - bubbleWidth - tailOffset;
    tailHorizontal = "right";
  }

  // Clamp horizontally
  left = Math.max(
    margin,
    Math.min(left, viewportW - bubbleWidth - margin)
  );

  /* ---------- Vertical logic ---------- */

  // Overflow bottom → move above
  if (top + bubbleHeight > viewportH - margin) {
    top = anchorY - bubbleHeight - tailOffset;
    tailVertical = "bottom";
  }

  // Clamp vertically
  top = Math.max(
    margin,
    Math.min(top, viewportH - bubbleHeight - margin)
  );

  return {
    left,
    top,
    tailHorizontal, // "left" | "right"
    tailVertical,   // "top" | "bottom"
  };
}