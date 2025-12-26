# Modular CesiumMap Component

## 📁 File Structure

```
src/components/CesiumMap/
├── CesiumMap.jsx              # Main orchestrator (320 lines)
├── components/
│   ├── LoadingScreen.jsx      # Loading overlay (60 lines)
│   ├── ModelsPanel.jsx        # Tower list sidebar (180 lines)
│   ├── PartModal.jsx          # Part details modal (200 lines)
│   └── OrbitLockButton.jsx    # Orbit toggle button (80 lines)
├── hooks/
│   ├── useModalPosition.js    # Track modal screen position (30 lines)
│   └── useCameraControls.js   # Camera logic & visibility (150 lines)
├── constants/
│   ├── models.js              # Model registry (35 lines)
│   └── config.js              # Configuration values (80 lines)
└── utils/
    └── helpers.js             # Utility functions (40 lines)
```

**Total: ~1,175 lines spread across 10 files** (was 800+ lines in 1 file)

---

## 🎯 How to Make Changes

### Example 1: Add a New Tower
**File to edit:** `constants/models.js`

```javascript
export const MODELS = [
  // ... existing towers
  {
    id: "tower_2",
    name: "Tower 2 - NYC",
    lon: -74.005974,
    lat: 40.712776,
    height: 300,
    scale: 8,
    uri: "/models/Tower_03.glb",
    parts: { /* ... */ }
  },
];
```

✅ Everything else updates automatically!

---

### Example 2: Change Loading Screen Design
**File to edit:** `components/LoadingScreen.jsx`

Change colors, text, animation - just this one 60-line file.

---

### Example 3: Adjust Camera Behavior
**File to edit:** `constants/config.js`

```javascript
export const CAMERA_CONFIG = {
  VISIBILITY_THRESHOLD: 1500,  // Changed from 1200
  FLYTO_DISTANCE: 250,          // Changed from 200
  // ... other settings
};
```

---

### Example 4: Modify Loading Timing
**Files to edit:**
- `constants/config.js` - Change `LOADING_RENDER_DELAY` constant
- `hooks/useCameraControls.js` - Adjust logic if needed

---

### Example 5: Change Orbit Button Style
**File to edit:** `components/OrbitLockButton.jsx`

Just update the button styles in this one file.

---

## 🚀 Benefits of This Structure

| Before (Monolithic) | After (Modular) |
|---------------------|-----------------|
| 800+ lines in 1 file | 10 smaller files |
| Hard to find code | Clear organization |
| Large git diffs | Small, focused diffs |
| Test everything | Test components individually |
| Tight coupling | Loose coupling |
| Modify carefully | Modify confidently |

---

## 📝 Quick Reference

**Need to change...** → **Edit this file:**

- Model list → `constants/models.js`
- Camera settings → `constants/config.js`
- Loading screen UI → `components/LoadingScreen.jsx`
- Panel sidebar UI → `components/ModelsPanel.jsx`
- Part modal UI → `components/PartModal.jsx`
- Orbit button UI → `components/OrbitLockButton.jsx`
- Camera behavior → `hooks/useCameraControls.js`
- Modal tracking → `hooks/useModalPosition.js`
- Helper functions → `utils/helpers.js`
- Main logic → `CesiumMap.jsx`

---

## ✨ When Asking for Changes

**Instead of sending the entire file, just send:**

"Change the loading screen spinner color to red"
→ Send `components/LoadingScreen.jsx` only

"Add tower in London"
→ Send `constants/models.js` only

"Fix camera jumping when clicking tower"
→ Send `hooks/useCameraControls.js` and/or `CesiumMap.jsx`

---

## 🔧 Import Structure

All components import from:
- `./components/*` - UI components
- `./hooks/*` - Custom React hooks
- `./constants/*` - Configuration
- `./utils/*` - Helper functions

Main app imports from:
- `./components/CesiumMap/CesiumMap.jsx`

---

## 💡 Pro Tips

1. **Add new towers**: Just edit `models.js` - zero code changes needed
2. **Tweak behavior**: Check `config.js` first before touching code
3. **UI changes**: Each UI piece is its own file - super easy to modify
4. **Logic changes**: Hooks are isolated - test independently
5. **Git conflicts**: Much less likely with smaller, focused files

---

## 🎉 Result

Clean, maintainable, professional code structure that's easy to:
- ✅ Understand
- ✅ Modify
- ✅ Test
- ✅ Extend
- ✅ Collaborate on