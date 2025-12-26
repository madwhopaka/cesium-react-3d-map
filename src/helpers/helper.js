/* ----------------------------------
   Utility Functions
   
   Updated to use altitude + towerHeight structure
----------------------------------- */

/**
 * Normalize node name from 3D model mesh
 */
export const normalizeNodeName = (nodeName) => {
  if (!nodeName) return null;

  return nodeName
    .toLowerCase()
    .replace(/[0-9]+_0$/, "")
    .replace(/[0-9]+$/, "")
    .replace(/__+/g, "_")
    .replace(/_+$/, "");
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