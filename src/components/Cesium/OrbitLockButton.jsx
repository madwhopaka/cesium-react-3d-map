/* ----------------------------------
   Orbit Lock Button Component
   
   Toggle between free camera and orbit mode
----------------------------------- */

export default function OrbitLockButton({ isVisible, isLocked, onToggle }) {
  if (!isVisible) return null;

  return (
    <button
      onClick={onToggle}
      style={{
        position: "fixed",
        bottom: 40,
        right: 40,
        zIndex: 10,
        padding: "14px 20px",
        background: isLocked 
          ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" 
          : "rgba(30, 41, 59, 0.95)",
        backdropFilter: "blur(10px)",
        border: isLocked ? "2px solid #60a5fa" : "2px solid #334155",
        borderRadius: "12px",
        color: "#fff",
        fontSize: "14px",
        fontWeight: 600,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        transition: "all 0.3s",
        boxShadow: isLocked 
          ? "0 0 20px rgba(59, 130, 246, 0.6)" 
          : "0 4px 12px rgba(0, 0, 0, 0.4)",
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = "translateY(-2px)";
        e.target.style.boxShadow = isLocked
          ? "0 4px 24px rgba(59, 130, 246, 0.8)"
          : "0 6px 16px rgba(0, 0, 0, 0.5)";
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "translateY(0)";
        e.target.style.boxShadow = isLocked
          ? "0 0 20px rgba(59, 130, 246, 0.6)"
          : "0 4px 12px rgba(0, 0, 0, 0.4)";
      }}
      title={isLocked ? "Exit Orbit Mode" : "Enter Orbit Mode"}
    >
      <span style={{ fontSize: "20px" }}>
        {isLocked ? "🔓" : "🔒"}
      </span>
      <span>
        {isLocked ? "Free Camera" : "Orbit Mode"}
      </span>
    </button>
  );
}