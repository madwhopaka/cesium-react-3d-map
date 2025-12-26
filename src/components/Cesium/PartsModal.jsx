import { useEffect, useRef } from "react";

export default function PartModal({ modal, onClose }) {
  const modalRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    if (!modal) return;

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Add listener after a small delay to avoid immediate closure
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modal, onClose]);

  if (!modal) return null;

  return (
    <div
      ref={modalRef}
      style={{
        position: "fixed",
        right: "20px",
        bottom: "20px",
        width: "400px",
        maxHeight: "500px",
        backgroundColor: "rgba(30, 30, 30, 0.95)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "12px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
        zIndex: 1000,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        animation: "slideInUp 0.3s ease-out",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "24px" }}>{modal.icon}</span>
          <h3
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: "600",
              color: "#ffffff",
            }}
          >
            {modal.label}
          </h3>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "none",
            borderRadius: "6px",
            padding: "6px 10px",
            cursor: "pointer",
            color: "#ffffff",
            fontSize: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
          }}
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div
        style={{
          padding: "20px",
          overflowY: "auto",
          flex: 1,
        }}
      >
        {/* Position */}
        {modal.partPosition && (
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontSize: "16px" }}>📍</span>
              <h4
                style={{
                  margin: 0,
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#60a5fa",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Position
              </h4>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#d1d5db",
              }}
            >
              {modal.partPosition}
            </p>
          </div>
        )}

        {/* Why Here */}
        {modal.positionReason && (
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontSize: "16px" }}>💡</span>
              <h4
                style={{
                  margin: 0,
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#34d399",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Why Here?
              </h4>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#d1d5db",
              }}
            >
              {modal.positionReason}
            </p>
          </div>
        )}

        {/* Purpose */}
        {modal.purpose && (
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontSize: "16px" }}>🎯</span>
              <h4
                style={{
                  margin: 0,
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#fb923c",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Purpose
              </h4>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#d1d5db",
              }}
            >
              {modal.purpose}
            </p>
          </div>
        )}

        {/* Materials */}
        {modal.material && (
          <div style={{ marginBottom: "0" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontSize: "16px" }}>🔩</span>
              <h4
                style={{
                  margin: 0,
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#a78bfa",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Materials
              </h4>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#d1d5db",
              }}
            >
              {modal.material}
            </p>
          </div>
        )}
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes slideInUp {
            from {
              transform: translateY(20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          /* Custom scrollbar */
          div::-webkit-scrollbar {
            width: 6px;
          }

          div::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 3px;
          }

          div::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
          }

          div::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        `}
      </style>
    </div>
  );
}