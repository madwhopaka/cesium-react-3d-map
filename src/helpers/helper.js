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
  bounds,
  bubbleWidth = 320,  // Updated from 300 to match PartBubble
  bubbleHeight = 400, // Updated from 320 to match PartBubble
  margin = 12,
  tailOffset = 18,
}) {
  const minX = bounds?.left ?? 0;
  const maxX = bounds?.right ?? window.innerWidth;
  const minY = bounds?.top ?? 0;
  const maxY = bounds?.bottom ?? window.innerHeight;

  let left = anchorX + tailOffset;
  let top = anchorY - 24;

  let tailHorizontal = "left";   // tail points left → bubble on right

  /* ---------- Horizontal logic ---------- */

  // Overflow right → flip to left
  if (left + bubbleWidth > maxX - margin) {
    left = anchorX - bubbleWidth - tailOffset;
    tailHorizontal = "right";
  }

  // Clamp horizontally
  left = Math.max(
    minX + margin,
    Math.min(left, maxX - bubbleWidth - margin)
  );

  /* ---------- Vertical logic ---------- */

  // Overflow bottom → move above
  if (top + bubbleHeight > maxY - margin) {
    top = anchorY - bubbleHeight - tailOffset;
  }

  // Clamp vertically
  top = Math.max(
    minY + margin,
    Math.min(top, maxY - bubbleHeight - margin)
  );

  // Keep the tail aligned with the click point as much as possible.
  const rawTailTop = anchorY - top - 12; // 12 is half tail height
  const tailTop = Math.max(16, Math.min(rawTailTop, bubbleHeight - 40));

  return {
    left,
    top,
    tailHorizontal, // "left" | "right"
    tailTop,
  };
}