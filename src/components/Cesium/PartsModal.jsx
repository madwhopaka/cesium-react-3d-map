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

  console.log(bubble, 'bubble');

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

  return (
    <>
      <div
        ref={ref}
        style={{ 
          position: "fixed",
          left,
          top,
          width: 300,
          maxHeight: 320,
          padding: "10px",
          background: "rgba(17, 24, 39, 0.96)",
          backdropFilter: "blur(10px)",
          borderRadius: "22px",
          color: "#e5e7eb",
          boxShadow: "0 12px 36px rgba(0,0,0,0.45)",
          zIndex: 1000,
          animation: "bubbleIn 180ms cubic-bezier(0.22, 1, 0.36, 1)",
          display: "flex",
          flexDirection: "column",
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
                : "12px solid rgba(17,24,39,0.96)",
            borderRight:
              tailHorizontal === "right"
                ? "none"
                : "12px solid rgba(17,24,39,0.96)",
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
          {/* Title line (speech-style) */}
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 16 }}>{bubble.icon}</span>{" "}
            <strong>{bubble.label}</strong>
          </div>

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

          {/* Purpose */}
          {bubble.purpose && (
            <Paragraph>
              <Muted>Purpose:</Muted> {bubble.purpose}
            </Paragraph>
          )}

          {/* Material */}
          {bubble.material && (
            <Paragraph>
              <Muted>Materials:</Muted> {bubble.material}
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
          background: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }

        div::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.7);
        }
      `}</style>
    </>
  );
}

/* ---------- helpers ---------- */

function Paragraph({ children }) {
  return <div style={{ marginBottom: 8 }}>{children}</div>;
}

function Muted({ children }) {
  return (
    <span style={{ color: "#9ca3af", fontWeight: 500 }}>
      {children}
    </span>
  );
}