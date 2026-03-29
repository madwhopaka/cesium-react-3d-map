import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, ChevronDown, TriangleAlert, Wrench } from "lucide-react";

const NOTIFICATION_ITEMS = [
  {
    id: "structural-damage",
    type: "alert",
    unread: true,
    title: "Structural Damage",
    time: "3 min ago",
    tower_id: "SICA001946",
    description: [
      "Critical structural issues have been detected at this site, indicating potential safety risks.",
      "Immediate inspection is required to assess integrity and prevent further damage.",
    ],
  },
  {
    id: "antenna-misalignment",
    type: "alert",
    unread: true,
    title: "Antenna Misalignment",
    time: "3 min ago",
    tower_id: "SICA001139",
    description: [
      "The antenna positioning appears to be off-angle, which may affect signal performance.",
      "A prompt realignment check is recommended to restore optimal connectivity.",
    ],
  },
  {
    id: "new-installation",
    type: "notification",
    unread: false,
    title: "New Installation",
    time: "3 min ago",
    tower_id: "A001",
    description: [
      "A new antenna unit has been successfully installed at the site.",
      "Verification of setup and calibration is needed to ensure proper functionality.",
    ],
  },
];

export default function NotificationBellPopup({ towerMetaById = {}, dialogLabel = "Tower notifications" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState([]);
  const wrapperRef = useRef(null);

  const notifications = useMemo(() => {
    return NOTIFICATION_ITEMS.map((item) => ({
      ...item,
      name: towerMetaById[item.tower_id]?.name || `Tower ${item.tower_id}`,
      location: towerMetaById[item.tower_id]?.location || "Unknown",
    }));
  }, [towerMetaById]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const toggleNotificationExpansion = (notificationId) => {
    setExpandedIds((previous) =>
      previous.includes(notificationId)
        ? previous.filter((id) => id !== notificationId)
        : [...previous, notificationId]
    );
  };

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "relative",
        width: 36,
        height: 36,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 20000,
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        aria-label="Notifications"
        aria-expanded={isOpen}
        title="Notifications"
        style={{
          border: "none",
          background: "transparent",
          width: 36,
          height: 36,
          borderRadius: 999,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#141113",
          cursor: "pointer",
        }}
      >
        <Bell size={20} strokeWidth={1.9} aria-hidden="true" />
        <span
          style={{
            position: "absolute",
            top: 2,
            right: 1,
            width: 9,
            height: 9,
            borderRadius: 999,
            background: "#FF003D",
            border: "1px solid #FFFFFF",
          }}
        />
      </button>

      {isOpen && (
        <section
          role="dialog"
          aria-label={dialogLabel}
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: -6,
            width: 390,
            maxWidth: "calc(100vw - 24px)",
            maxHeight: "70vh",
            overflowY: "auto",
            background: "#FFFFFF",
            border: "1px solid #F0F0F0",
            borderRadius: 14,
            boxShadow: "0 14px 34px rgba(20,17,19,0.14)",
            zIndex: 20001,
            padding: 12,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "2px 2px 8px",
              borderBottom: "1px solid #F2F2F2",
            }}
          >
            <strong style={{ fontSize: 14, color: "#141113" }}>Notifications</strong>
            <span style={{ fontSize: 12, color: "#676767" }}>{notifications.length} items</span>
          </div>

          {notifications.map((item) => {
            const isExpanded = expandedIds.includes(item.id);
            const isAlert = item.type === "alert";
            const toneColor = isAlert ? "#e73636" : "#4d88d5";
            const toneBackground = isAlert ? "#fff2f2" : "#f1f6ff";
            const itemBackground = item.unread
              ? isAlert
                ? "#fff7f7"
                : "#f4f8ff"
              : "#FFFFFF";

            return (
              <article
                key={item.id}
                style={{
                  border: `1px solid ${isAlert ? "#ffd8d8" : "#dbe9ff"}`,
                  borderRadius: 10,
                  overflow: "hidden",
                  background: itemBackground,
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleNotificationExpansion(item.id)}
                  aria-expanded={isExpanded}
                  style={{
                    width: "100%",
                    border: "none",
                    background: "transparent",
                    padding: "10px 10px 9px",
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    gap: 7,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <span
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 999,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: toneColor,
                          background: toneBackground,
                        }}
                      >
                        {isAlert ? (
                          <TriangleAlert size={14} color="#e73636" aria-hidden="true" />
                        ) : (
                          <Wrench size={14} color="#4d88d5" aria-hidden="true" />
                        )}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#141113" }}>{item.title}</span>
                    </div>

                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "3px 8px",
                          borderRadius: 999,
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          color: toneColor,
                          background: toneBackground,
                        }}
                      >
                        {isAlert ? "Alert" : "Notification"}
                      </span>
                      <ChevronDown
                        size={14}
                        color="#636363"
                        style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 180ms ease" }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "4px 10px",
                      fontSize: 11,
                      color: "#4D4D4D",
                    }}
                  >
                    <span><strong style={{ color: "#141113" }}>Tower:</strong> {item.tower_id}</span>
                    <span><strong style={{ color: "#141113" }}>Time:</strong> {item.time}</span>
                    <span><strong style={{ color: "#141113" }}>Name:</strong> {item.name}</span>
                    <span><strong style={{ color: "#141113" }}>Location:</strong> {item.location}</span>
                  </div>
                </button>

                {isExpanded && (
                  <div
                    style={{
                      padding: "0 10px 10px",
                      borderTop: "1px solid #F3F3F3",
                      background: "#FCFCFC",
                    }}
                  >
                    {item.description.map((line, index) => (
                      <p
                        key={`${item.id}-description-${index}`}
                        style={{
                          margin: "8px 0 0",
                          fontSize: 12,
                          lineHeight: 1.45,
                          color: "#2E2E2E",
                        }}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
