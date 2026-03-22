/**
 * Performance optimization utilities
 * Debounce, throttle, and visibility tracking functions
 */

/**
 * Debounce function - delays execution until quiet period
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle function - limits execution frequency
 * @param {Function} fn - Function to throttle
 * @param {number} delay - Minimum delay between executions in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(fn, delay) {
  let lastTime = 0;
  let timeoutId;

  return function (...args) {
    const now = Date.now();
    const remaining = delay - (now - lastTime);

    clearTimeout(timeoutId);

    if (remaining <= 0) {
      lastTime = now;
      fn(...args);
    } else {
      timeoutId = setTimeout(() => {
        lastTime = Date.now();
        fn(...args);
      }, remaining);
    }
  };
}

/**
 * Safely dispose Three.js material
 * @param {THREE.Material|THREE.Material[]} material - Material or array of materials
 */
export function disposeMaterial(material) {
  if (Array.isArray(material)) {
    material.forEach(m => m?.dispose?.());
  } else {
    material?.dispose?.();
  }
}

/**
 * Safely dispose Three.js texture
 * @param {THREE.Texture} texture - Texture to dispose
 */
export function disposeTexture(texture) {
  texture?.dispose?.();
}

/**
 * Create visibility tracker for models with debouncing
 * Caches visibility state and only updates when distance crosses thresholds
 * @returns {Object} Visibility tracker object
 */
export function createVisibilityTracker() {
  const visibilityCache = new Map(); // modelId -> { isVisible, distance, threshold }

  return {
    /**
     * Update visibility for a model
     * @param {string} modelId - Model ID
     * @param {number} distance - Distance from camera
     * @param {number} threshold - Visibility threshold distance
     * @returns {boolean} Whether visibility changed
     */
    updateVisibility(modelId, distance, threshold) {
      const cached = visibilityCache.get(modelId);
      const shouldBeVisible = distance < threshold;

      if (!cached) {
        visibilityCache.set(modelId, { isVisible: shouldBeVisible, distance, threshold });
        return true; // Initial state is always a change
      }

      // Check if we've crossed threshold
      const visibilityChanged = cached.isVisible !== shouldBeVisible;

      if (visibilityChanged || Math.abs(cached.distance - distance) > threshold * 0.1) {
        visibilityCache.set(modelId, { isVisible: shouldBeVisible, distance, threshold });
        return visibilityChanged;
      }

      return false;
    },

    /**
     * Get cached visibility state
     * @param {string} modelId - Model ID
     * @returns {boolean} Current visibility state
     */
    getVisibility(modelId) {
      return visibilityCache.get(modelId)?.isVisible ?? false;
    },

    /**
     * Clear cache (e.g., on component unmount)
     */
    clear() {
      visibilityCache.clear();
    },
  };
}
