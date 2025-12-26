/* ----------------------------------
   Models Panel Component
   
   Floating sidebar with list of towers
----------------------------------- */

export default function ModelsPanel({ models, isOpen, onToggle, onSelectModel }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        left: 20,
        zIndex: 10,
        background: "rgba(15, 23, 42, 0.95)",
        backdropFilter: "blur(12px)",
        borderRadius: "16px",
        border: "2px solid #334155",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        width: isOpen ? "280px" : "56px",
        maxHeight: "calc(100vh - 40px)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px",
          borderBottom: isOpen ? "1px solid #334155" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {isOpen && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
              }}
            >
              🗼
            </div>
            <h3
              style={{
                margin: 0,
                color: "#fff",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              Models
            </h3>
          </div>
        )}
        
        <button
          onClick={onToggle}
          style={{
            background: isOpen ? "#1e293b" : "transparent",
            border: "1px solid #334155",
            borderRadius: "8px",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#94a3b8",
            cursor: "pointer",
            fontSize: "16px",
            transition: "all 0.2s",
            marginLeft: isOpen ? 0 : "auto",
            marginRight: isOpen ? 0 : "auto",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#334155";
            e.target.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = isOpen ? "#1e293b" : "transparent";
            e.target.style.color = "#94a3b8";
          }}
          aria-label={isOpen ? "Collapse panel" : "Expand panel"}
        >
          {isOpen ? "⟨" : "⟩"}
        </button>
      </div>

      {/* Model List */}
      {isOpen && (
        <div
          style={{
            padding: "16px",
            maxHeight: "calc(100vh - 120px)",
            overflowY: "auto",
          }}
        >
          <div style={{ marginBottom: "8px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                color: "#64748b",
              }}
            >
              Available Towers
            </span>
          </div>
          
          {models.map((model, index) => (
            <button
              key={model.id}
              onClick={() => onSelectModel(model.id)}
              style={{
                width: "100%",
                padding: "14px",
                marginBottom: index < models.length - 1 ? "8px" : 0,
                background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                border: "1px solid #334155",
                borderRadius: "10px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "linear-gradient(135deg, #334155 0%, #1e293b 100%)";
                e.target.style.transform = "translateX(4px)";
                e.target.style.borderColor = "#475569";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)";
                e.target.style.transform = "translateX(0)";
                e.target.style.borderColor = "#334155";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "rgba(59, 130, 246, 0.1)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    flexShrink: 0,
                  }}
                >
                  📡
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      color: "#fff",
                      fontSize: "14px",
                      fontWeight: 600,
                      marginBottom: "4px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {model.name}
                  </div>
                  <div
                    style={{
                      color: "#64748b",
                      fontSize: "11px",
                    }}
                  >
                    {model.lat.toFixed(4)}°, {model.lon.toFixed(4)}°
                  </div>
                </div>
                <div
                  style={{
                    color: "#3b82f6",
                    fontSize: "18px",
                    opacity: 0.6,
                  }}
                >
                  →
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}