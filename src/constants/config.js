export const CESIUM_CONFIG = {
  TILESET_ASSET_ID: 2275207,
  INITIAL_ALTITUDE: 20000000,
};

export const CAMERA_CONFIG = {
  VISIBILITY_MULTIPLIER: 8,
  MIN_VISIBILITY_DISTANCE: 3000,
};

export const MODEL_CONFIG = {
  minimumPixelSize: 8,
  maximumScale: 30,
};

export const BLIP_CONFIG = {
  scale: 0.033,
  imageUrl: "/images/red-marker.png",
  labelFont: "bold 16px sans-serif",
  labelOffset: -25,
};

export function getStatusVariant(status) {
  const normalizedStatus = String(status || "").toLowerCase();

  if (
    normalizedStatus.includes("offline") ||
    normalizedStatus.includes("down") ||
    normalizedStatus.includes("critical")
  ) {
    return "red";
  }

  if (
    normalizedStatus.includes("maintenance") ||
    normalizedStatus.includes("due") ||
    normalizedStatus.includes("warning")
  ) {
    return "yellow";
  }

  if (
    normalizedStatus.includes("online") ||
    normalizedStatus.includes("active") ||
    normalizedStatus.includes("operational") ||
    normalizedStatus.includes("healthy")
  ) {
    return "green";
  }

  return "red";
}

export function getStatusColorForStatus(status) {
  const variant = getStatusVariant(status);

  if (variant === "yellow") {
    return "#f59e0b";
  }

  if (variant === "green") {
    return "#22c55e";
  }

  return "#ef4444";
}

export function getBlipImageForStatus(status) {
  const variant = getStatusVariant(status);

  if (variant === "red") {
    return "/images/red-marker.png";
  }

  if (variant === "yellow") {
    return "/images/yellow-marker.png";
  }

  if (variant === "green") {
    return "/images/green-marker.png";
  }

  return BLIP_CONFIG.imageUrl;
}

export function getVisibilityThreshold(model) {
  return Math.max(
    model.towerHeight * CAMERA_CONFIG.VISIBILITY_MULTIPLIER,
    CAMERA_CONFIG.MIN_VISIBILITY_DISTANCE
  );
}
