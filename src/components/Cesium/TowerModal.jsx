import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

export default function TowerBubble({ tower, visible, onOpenInWindow, showModelViewerLink = true }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const towerDetails = useMemo(() => {
    if (!tower) return [];

    const specs = tower.towerSpecs || {};

    return [
      ["Type", specs.type],
      ["Height", specs.height || `${tower.towerHeight} m`],
      ["Base Width", specs.baseWidth],
      ["Top Width", specs.topWidth],
      ["Foundation", specs.foundation],
      ["Wind Load", specs.windLoad],
      ["Material", specs.material],
      ["Current Load", specs.currentLoad],
      ["Available Capacity", specs.availableCapacity],
      ["Maintenance", specs.maintenance],
    ].filter(([, value]) => Boolean(value));
  }, [tower]);

  useEffect(() => {
    setIsExpanded(false);
  }, [tower?.id]);

  if (!visible || !tower) return null;

  const maintenanceStatus = tower.towerSpecs?.maintenance || "Unknown";

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        width: 292,
        maxHeight: "calc(100vh - 32px)",
        padding: 8,
        background: "#ffffff",
        backdropFilter: "blur(12px)",
        borderRadius: 20,
        color: "#4a4a4a",
        boxShadow: "0 16px 44px rgba(0,0,0,0.16)",
        zIndex: 1000,
        animation: "bubbleIn 180ms cubic-bezier(0.22, 1, 0.36, 1)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        pointerEvents: "auto",
        fontFamily: '"DM Sans", "Segoe UI", system-ui, sans-serif',
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 10,
          padding: isExpanded ? "10px 10px 12px" : "8px 8px 9px",
          borderRadius: 14,
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: isExpanded ? 14 : 13,
              fontWeight: 700,
              lineHeight: 1.2,
              color: "#4a4a4a",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {tower.name}
          </div>

          <div style={{ marginTop: 2, color: "#6d6d6d", fontSize: isExpanded ? 12 : 11 }}>
            Maintenance: <span style={{ color: "#4a4a4a", fontWeight: 600 }}>{maintenanceStatus}</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "nowrap",
              marginTop: isExpanded ? 8 : 6,
            }}
          >
            {showModelViewerLink && (
              <Link
                to={`/model-viewer/${tower.id}`}
                target="_blank"
                style={{
                  color: "#4a4a4a",
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                  fontSize: 12,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                3D model viewer
              </Link>
            )}

            {onOpenInWindow && (
              <button
                type="button"
                onClick={onOpenInWindow}
                style={{
                  padding: 0,
                  border: "none",
                  background: "transparent",
                  color: "#4a4a4a",
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                  whiteSpace: "nowrap",
                }}
              >
                3D in-window
              </button>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded((value) => !value)}
          aria-label={isExpanded ? "Collapse tower details" : "Expand tower details"}
          style={{
            flexShrink: 0,
            border: "none",
            background: "transparent",
            color: "#4a4a4a",
            cursor: "pointer",
            padding: 0,
            fontSize: isExpanded ? 18 : 16,
            transition: "transform 220ms ease, opacity 220ms ease",
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            opacity: 0.9,
            lineHeight: 1,
            marginTop: 2,
          }}
        >
          {isExpanded ? "−" : "+"}
        </button>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          maxHeight: isExpanded ? "60vh" : "0px",
          overflowY: isExpanded ? "auto" : "hidden",
          overflowX: "hidden",
          opacity: isExpanded ? 1 : 0,
          transform: isExpanded ? "translateY(0)" : "translateY(-6px)",
          transition: "max-height 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease, transform 220ms ease",
          willChange: "max-height, opacity, transform",
        }}
      >
        <div
          style={{
            padding: "0 16px 18px",
            textAlign: "left",
            fontSize: 13,
            lineHeight: 1.6,
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(107, 114, 128, 0.5) transparent",
          }}
        >
          <Paragraph>
            <Muted>ID:</Muted> {tower.id}
          </Paragraph>

          <Paragraph>
            <Muted>Location:</Muted> {tower.lat}, {tower.lon}
          </Paragraph>

          <Paragraph>
            <Muted>Altitude:</Muted> {tower.altitude} m
          </Paragraph>

          <Paragraph>
            <Muted>Scale:</Muted> {tower.scale}
          </Paragraph>

          {towerDetails.map(([label, value]) => (
            <Paragraph key={label}>
              <Muted>{label}:</Muted> {value}
            </Paragraph>
          ))}

          {tower.towerSpecs?.summary && (
            <Paragraph>
              <Muted>Summary:</Muted> {tower.towerSpecs.summary}
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

        div > div::-webkit-scrollbar {
          width: 6px;
        }

        div > div::-webkit-scrollbar-track {
          background: transparent;
        }

        div > div::-webkit-scrollbar-thumb {
          background: rgba(107, 114, 128, 0.5);
          border-radius: 3px;
        }

        div > div::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.7);
        }
      `}</style>
    </div>
  );
}

function Paragraph({ children }) {
  return <div style={{ marginBottom: 8 }}>{children}</div>;
}

function Muted({ children }) {
  return <span style={{ color: "#6d6d6d", fontWeight: 500 }}>{children}</span>;
}