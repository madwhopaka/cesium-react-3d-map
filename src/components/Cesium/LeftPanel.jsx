import { Link } from 'react-router-dom';

export default function ModelsPanel({ models, isOpen, onToggle, onSelectModel }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        left: 16,
        zIndex: 10,

        background: "rgba(15, 23, 42, 0.95)",
        backdropFilter: "blur(12px)",

        borderRadius: "12px",
        border: "1px solid #334155",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.3)",

        overflow: "hidden",

        /* Compact width */
        width: isOpen ? "240px" : "48px",
        transform: isOpen
          ? "translateX(0) scale(1)"
          : "translateX(0) scale(0.98)",

        opacity: isOpen ? 1 : 0.95,

        transition: `
          width 420ms cubic-bezier(0.34, 1.56, 0.64, 1),
          transform 320ms ease-out,
          opacity 220ms ease-out
        `,

        willChange: "width, transform, opacity",

        maxHeight: "calc(100vh - 32px)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px",
          borderBottom: isOpen ? "1px solid #334155" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {isOpen && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
              }}
            >
              🗼
            </div>
            <h3
              style={{
                margin: 0,
                color: "#fff",
                fontSize: "14px",
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
            borderRadius: "6px",
            width: "28px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#94a3b8",
            cursor: "pointer",
            fontSize: "14px",
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
            padding: "12px",
            maxHeight: "calc(100vh - 100px)",
            overflowY: "auto",
          }}
        >
          <div style={{ marginBottom: "6px" }}>
            <span
              style={{
                fontSize: "10px",
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
            <div
              key={model.id}
              style={{
                marginBottom: index < models.length - 1 ? "6px" : 0,
                background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                border: "1px solid #334155",
                borderRadius: "8px",
                overflow: "hidden",
                transition: "all 0.2s",
              }}
            >
              {/* Fly to Tower Button */}
              <button
                onClick={() => onSelectModel(model.id)}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(59, 130, 246, 0.05)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      background: "rgba(59, 130, 246, 0.1)",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      flexShrink: 0,
                    }}
                  >
                    📡
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        color: "#fff",
                        fontSize: "13px",
                        fontWeight: 600,
                        marginBottom: "2px",
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
                        fontSize: "10px",
                      }}
                    >
                      {model.lat.toFixed(4)}°, {model.lon.toFixed(4)}°
                    </div>
                  </div>
                  <div
                    style={{
                      color: "#3b82f6",
                      fontSize: "16px",
                      opacity: 0.6,
                    }}
                  >
                    →
                  </div>
                </div>
              </button>

              {/* View 3D Model Link */}
              <Link
                to={`/model-viewer/${model.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "5px",
                  width: "100%",
                  padding: "8px 10px",
                  background: "rgba(59, 130, 246, 0.08)",
                  borderTop: "1px solid rgba(59, 130, 246, 0.15)",
                  color: "#60a5fa",
                  textDecoration: "none",
                  fontSize: "11px",
                  fontWeight: 500,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(59, 130, 246, 0.15)";
                  e.target.style.color = "#93c5fd";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(59, 130, 246, 0.08)";
                  e.target.style.color = "#60a5fa";
                }}
              >
                <span style={{ fontSize: "12px" }}>🔍</span>
                View 3D Model
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}