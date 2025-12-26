export const CESIUM_CONFIG = {
  TILESET_ASSET_ID: 2275207,
  INITIAL_ALTITUDE: 20000000,
};

export const CAMERA_CONFIG = {
  VISIBILITY_MULTIPLIER: 8,
};

export const MODEL_CONFIG = {
  minimumPixelSize: 96,
  maximumScale: 300,
};

export const BLIP_CONFIG = {
  scale: 0.03,
  imageUrl: "/images/blip.png",
  labelFont: "bold 16px sans-serif",
  labelOffset: -25,
};

export function getVisibilityThreshold(model) {
  return model.towerHeight * 8;
}
