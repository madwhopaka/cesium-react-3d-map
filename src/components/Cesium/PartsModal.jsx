import { useEffect, useRef } from "react";

export default function PartModal({ modal, onClose, clickPosition }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!modal) return;

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modal, onClose]);

  if (!modal) return null;

  // Calculate position near click (or default to bottom-right)
  const getPosition = () => {
    if (clickPosition) {
      const { x, y } = clickPosition;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Place bubble near click but ensure it fits on screen
      const bubbleWidth = 320;
      const bubbleHeight = 400;
      
      let left = x + 20;
      let top = y - 100;
      
      // Adjust if too far right
      if (left + bubbleWidth > windowWidth - 20) {
        left = x - bubbleWidth - 20;
      }
      
      // Adjust if too far down
      if (top + bubbleHeight > windowHeight - 20) {
        top = windowHeight - bubbleHeight - 20;
      }
      
      // Adjust if too far up
      if (top < 20) {
        top = 20;
      }
      
      return { left: `${left}px`, top: `${top}px` };
    }
    
    // Default position (bottom-right)
    return { right: "20px", bottom: "20px" };
  };

  const position = getPosition();

  return (
    <>
      <div
        ref={modalRef}
        style={{
          position: "fixed",
          ...position,
          width: "320px",
          maxHeight: "380px",
          backgroundColor: "rgba(30, 30, 30, 0.96)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "18px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
          zIndex: 1000,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          animation: "bubblePop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {/* Chat bubble pointer/tail */}
        <div
          style={{
            position: "absolute",
            left: clickPosition && clickPosition.x < window.innerWidth / 2 ? "-8px" : "auto",
            right: !clickPosition || clickPosition.x >= window.innerWidth / 2 ? "-8px" : "auto",
            top: "40px",
            width: "0",
            height: "0",
            borderTop: "8px solid transparent",
            borderBottom: "8px solid transparent",
            borderRight: clickPosition && clickPosition.x < window.innerWidth / 2 ? "8px solid rgba(30, 30, 30, 0.96)" : "none",
            borderLeft: !clickPosition || clickPosition.x >= window.innerWidth / 2 ? "8px solid rgba(30, 30, 30, 0.96)" : "none",
          }}
        />

        {/* Header */}
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: "18px", flexShrink: 0 }}>{modal.icon}</span>
            <h3
              style={{
                margin: 0,
                fontSize: "14px",
                fontWeight: "600",
                color: "#ffffff",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {modal.label}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "none",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              cursor: "pointer",
              color: "#9ca3af",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              flexShrink: 0,
              marginLeft: "8px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
              e.currentTarget.style.color = "#9ca3af";
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            padding: "14px 16px",
            overflowY: "auto",
            flex: 1,
          }}
        >
          {modal.partPosition && (
            <div style={{ marginBottom: "14px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "6px",
                }}
              >
                <span style={{ fontSize: "13px" }}>📍</span>
                <h4
                  style={{
                    margin: 0,
                    fontSize: "11px",
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
                  fontSize: "12px",
                  lineHeight: "1.5",
                  color: "#d1d5db",
                }}
              >
                {modal.partPosition}
              </p>
            </div>
          )}

          {modal.positionReason && (
            <div style={{ marginBottom: "14px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "6px",
                }}
              >
                <span style={{ fontSize: "13px" }}>💡</span>
                <h4
                  style={{
                    margin: 0,
                    fontSize: "11px",
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
                  fontSize: "12px",
                  lineHeight: "1.5",
                  color: "#d1d5db",
                }}
              >
                {modal.positionReason}
              </p>
            </div>
          )}

          {modal.purpose && (
            <div style={{ marginBottom: "14px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "6px",
                }}
              >
                <span style={{ fontSize: "13px" }}>🎯</span>
                <h4
                  style={{
                    margin: 0,
                    fontSize: "11px",
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
                  fontSize: "12px",
                  lineHeight: "1.5",
                  color: "#d1d5db",
                }}
              >
                {modal.purpose}
              </p>
            </div>
          )}

          {modal.material && (
            <div style={{ marginBottom: "0" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "6px",
                }}
              >
                <span style={{ fontSize: "13px" }}>🔩</span>
                <h4
                  style={{
                    margin: 0,
                    fontSize: "11px",
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
                  fontSize: "12px",
                  lineHeight: "1.5",
                  color: "#d1d5db",
                }}
              >
                {modal.material}
              </p>
            </div>
          )}
        </div>
      </div>

      <style>
        {`
          @keyframes bubblePop {
            from {
              transform: scale(0.9);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }

          div::-webkit-scrollbar {
            width: 5px;
          }

          div::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.04);
            border-radius: 3px;
          }

          div::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.15);
            border-radius: 3px;
          }

          div::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.25);
          }
        `}
      </style>
    </>
  );
}