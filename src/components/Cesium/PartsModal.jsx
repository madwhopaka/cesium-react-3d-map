import { useEffect, useRef } from "react";
import { computeBubblePosition } from "../../helpers/helper";

export default function PartBubble({ bubble, anchor, onClose }) {
  const ref = useRef(null);

  const {
    left,
    top,
    tailHorizontal,
    tailVertical,
  } = computeBubblePosition({
    anchorX: anchor?.x,
    anchorY: anchor?.y,
  });

  useEffect(() => {
    if (!bubble) return;

    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [bubble, onClose]);

  if (!bubble || !anchor) return null;

  // Helper to format dimensions object
  const formatDimensions = (dimensions) => {
    if (!dimensions) return null;
    const entries = Object.entries(dimensions);
    if (entries.length === 0) return null;
    
    return entries.map(([key, value]) => {
      const label = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
      return `${label}: ${value}`;
    }).join(' • ');
  };

  return (
    <>
      <div
        ref={ref}
        style={{ 
          position: "fixed",
          left,
          top,
          width: 320,
          maxHeight: 400,
          padding: "10px",
          background: "#ffffff",
          backdropFilter: "blur(12px)",
          borderRadius: "22px",
          color: "#4a4a4a",
          boxShadow: "0 16px 44px rgba(0,0,0,0.16)",
          zIndex: 1000,
          animation: "bubbleIn 180ms cubic-bezier(0.22, 1, 0.36, 1)",
          display: "flex",
          flexDirection: "column",
          fontFamily: 'Inter, "Segoe UI", system-ui, sans-serif',
        }}
      >
        {/* Tail */}
        <div
          style={{
            position: "absolute",
            top: tailVertical === "top" ? 22 : "auto",
            bottom: tailVertical === "bottom" ? 22 : "auto",
            [tailHorizontal === "left" ? "left" : "right"]: -12,
            width: 0,
            height: 0,
            borderTop: "12px solid transparent",
            borderBottom: "12px solid transparent",
            borderLeft:
              tailHorizontal === "left"
                ? "none"
                : "12px solid #ffffff",
            borderRight:
              tailHorizontal === "right"
                ? "none"
                : "12px solid #ffffff",
          }}
        />

        {/* Scrollable content area */}
        <div
          style={{
            overflowY: "auto",
            overflowX: "hidden",
            padding: "20px 16px",
            textAlign: "left",
            fontSize: 13,
            lineHeight: 1.6,
            // Custom scrollbar styling
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(156, 163, 175, 0.5) transparent",
          }}
        >
          {/* Title line */}
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 18 }}>{bubble.icon}</span>{" "}
            <strong style={{ fontSize: 15, color: "#4a4a4a" }}>{bubble.label}</strong>
          </div>

          {/* Manufacturer */}
          {bubble.manufacturer && (
            <Paragraph>
              <Muted>Manufacturer:</Muted> {bubble.manufacturer}
            </Paragraph>
          )}

          {/* Dimensions */}
          {bubble.dimensions && (
            <Paragraph>
              <Muted>Dimensions:</Muted> {formatDimensions(bubble.dimensions)}
            </Paragraph>
          )}

          {/* Position */}
          {bubble.position && (
            <Paragraph>
              <Muted>Position:</Muted> {bubble.position}
            </Paragraph>
          )}

          {/* Reason */}
          {bubble.positionReason && (
            <Paragraph>
              <Muted>Why here:</Muted> {bubble.positionReason}
            </Paragraph>
          )}

          {/* Purpose - use detailedPurpose if available, otherwise use purpose */}
          {(bubble.detailedPurpose || bubble.purpose) && (
            <Paragraph>
              <Muted>Purpose:</Muted> {bubble.detailedPurpose || bubble.purpose}
            </Paragraph>
          )}

          {/* Material */}
          {bubble.material && (
            <Paragraph>
              <Muted>Materials:</Muted> {bubble.material}
            </Paragraph>
          )}

          {/* Life Duration */}
          {bubble.lifeDuration && (
            <Paragraph>
              <Muted>Life Duration:</Muted> {bubble.lifeDuration}
            </Paragraph>
          )}
        </div>
      </div>

      <style>{`
        @keyframes bubbleIn {
          from {
            opacity: 0;
            transform: translateY(6px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Custom scrollbar for webkit browsers */
        div::-webkit-scrollbar {
          width: 6px;
        }

        div::-webkit-scrollbar-track {
          background: transparent;
        }

        div::-webkit-scrollbar-thumb {
          background: rgba(107, 114, 128, 0.5);
          border-radius: 3px;
        }

        div::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.7);
        }
      `}</style>
    </>
  );
}

/* ---------- helpers ---------- */

function Paragraph({ children }) {
  return <div style={{ marginBottom: 10 }}>{children}</div>;
}

function Muted({ children }) {
  return (
    <span style={{ color: "#6d6d6d", fontWeight: 500 }}>
      {children}
    </span>
  );
}