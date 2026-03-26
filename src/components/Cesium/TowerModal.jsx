import { useEffect, useMemo, useState } from "react";

export default function TowerBubble({ tower, visible }) {
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
        width: 320,
        maxHeight: "calc(100vh - 32px)",
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
        pointerEvents: "auto",
      }}
    >
      <button
        type="button"
        onClick={() => setIsExpanded((value) => !value)}
        style={{
          width: "100%",
          border: "none",
          background: "transparent",
          color: "inherit",
          cursor: "pointer",
          textAlign: "left",
          padding: "10px 10px 12px",
          borderRadius: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {tower.name}
            </div>
            <div style={{ marginTop: 4, color: "#9ca3af", fontSize: 12 }}>
              Maintenance: <span style={{ color: "#e5e7eb", fontWeight: 600 }}>{maintenanceStatus}</span>
            </div>
          </div>

          <div
            style={{
              color: "#93c5fd",
              fontSize: 18,
              flexShrink: 0,
              transition: "transform 220ms ease, opacity 220ms ease",
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              opacity: 0.9,
            }}
          >
            {isExpanded ? "−" : "+"}
          </div>
        </div>
      </button>

      <div
        style={{
          overflow: "hidden",
          maxHeight: isExpanded ? "60vh" : "0px",
          opacity: isExpanded ? 1 : 0,
          transform: isExpanded ? "translateY(0)" : "translateY(-6px)",
          transition:
            "max-height 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease, transform 220ms ease",
          willChange: "max-height, opacity, transform",
        }}
      >
        <div
          style={{
            overflowY: "auto",
            overflowX: "hidden",
            padding: "0 16px 18px",
            textAlign: "left",
            fontSize: 13,
            lineHeight: 1.6,
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(156, 163, 175, 0.5) transparent",
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
      `}</style>
    </div>
  );
}

function Paragraph({ children }) {
  return <div style={{ marginBottom: 10 }}>{children}</div>;
}

function Muted({ children }) {
  return (
    <span style={{ color: "#9ca3af", fontWeight: 500 }}>
      {children}
    </span>
  );
}