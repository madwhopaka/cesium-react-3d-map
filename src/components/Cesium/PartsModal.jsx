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

  console.log(bubble, 'bubble') ; 

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

          background: "rgba(17, 24, 39, 0.96)",
          backdropFilter: "blur(10px)",

          borderRadius: "22px",
          padding: "20  px 16px",

          color: "#e5e7eb",
          fontSize: 13,
          lineHeight: 1.6,

          boxShadow: "0 12px 36px rgba(0,0,0,0.45)",
          zIndex: 1000,

          animation: "bubbleIn 180ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* Tail */}
        <div
          style={{
            position: "absolute",
            top: tailVertical === "top" ? 22 : "auto",
            bottom: tailVertical === "bottom" ? 22 : "auto",
            [tailHorizontal === "left" ? "left" : "right"]: -6,
            width: 0,
            height: 0,
            transform:'rotate(-90%)', 
            borderTop: "6px solid transparent",
            borderBottom: "6px solid transparent",
            // borderLeft:
            //   tail === "left"
            //     ? "6px solid rgba(17,24,39,0.96)"
            //     : "none",
            // borderRight:
            //   tail === "right"
            //     ? "6px solid rgba(17,24,39,0.96)"
            //     : "none",
          }}
        />

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
