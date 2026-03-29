import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Home, Map, RadioTower, TriangleAlert, LayoutDashboard } from "lucide-react";

export default function ModelsPanel({
  models,
  isOpen,
  onToggle,
  onHome,
  onOverview,
  renderProfile = "balanced",
  renderProfileLabel = "Balanced",
  onCycleRenderProfile,
  onSetRenderProfile,
}) {
  const location = useLocation();
  const [pendingActiveItem, setPendingActiveItem] = useState(null);

  useEffect(() => {
    setPendingActiveItem(null);
  }, [location.pathname, location.search]);

  const navItems = [
    { label: "Overview", kind: "action", onClick: onOverview, icon: Home, active: () => location.pathname === "/" || location.pathname === "/towers" },
    { label: "Maps", kind: "link", to: "/map", icon: Map, active: () => location.pathname === "/map" || location.pathname.startsWith("/map/") },
    { label: "Tower Details", kind: "link", to: "/towers", icon: RadioTower, active: () => location.pathname === "/towers" || location.pathname === "/tower" },
    { label: "Maintenance Activity", kind: "disabled", icon: TriangleAlert },
    { label: "Dashboard", kind: "disabled", icon: LayoutDashboard },
  ];

  const getIcon = (IconComponent) => <IconComponent size={18} strokeWidth={2.1} />;

  const renderItem = (item, isCollapsed = false) => {
    const isActive = pendingActiveItem ? pendingActiveItem === item.label : item.active ? item.active() : false;
    const sharedStyle = {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: isCollapsed ? 0 : "12px 14px",
      borderRadius: isCollapsed ? 14 : 16,
      textDecoration: "none",
      color: isActive ? "#FF0091" : "#757575",
      background: "transparent",
      border: "1px solid transparent",
      boxShadow: "none",
      transition: "transform 180ms ease, background 180ms ease, opacity 180ms ease",
      cursor: item.kind === "disabled" ? "not-allowed" : "pointer",
      width: isCollapsed ? 40 : "100%",
      height: isCollapsed ? 40 : "auto",
      justifyContent: isCollapsed ? "center" : "flex-start",
      opacity: item.kind === "disabled" ? 0.55 : 1,
      pointerEvents: item.kind === "disabled" ? "none" : "auto",
      textAlign: "left",
    };

    const iconElement = getIcon(item.icon);

    if (item.kind === "action") {
      return (
        <button
          key={item.label}
          type="button"
          onClick={() => {
            setPendingActiveItem(item.label);
            item.onClick?.();
          }}
          title={item.label}
          aria-label={item.label}
          style={sharedStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateX(2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          {iconElement}
          {!isCollapsed && <span style={{ fontSize: 14, fontWeight: 700 }}>{item.label}</span>}
        </button>
      );
    }

    if (item.kind === "disabled") {
      return (
        <button key={item.label} type="button" disabled title={item.label} aria-label={item.label} style={sharedStyle}>
          {iconElement}
          {!isCollapsed && <span style={{ fontSize: 14, fontWeight: 700 }}>{item.label}</span>}
        </button>
      );
    }

    return (
      <Link
        key={item.label}
        to={item.to}
        title={item.label}
        aria-label={item.label}
        onClick={() => setPendingActiveItem(item.label)}
        style={sharedStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateX(2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateX(0)";
        }}
      >
        {iconElement}
        {!isCollapsed && <span style={{ fontSize: 14, fontWeight: 700 }}>{item.label}</span>}
      </Link>
    );
  };

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 20,
        width: isOpen ? 248 : 68,
        background: "#F7F7F7",
        color: "#f5f5f5",
        backdropFilter: "blur(16px)",
        overflow: "hidden",
        transition:
          "width 320ms cubic-bezier(0.22, 1, 0.36, 1), transform 240ms ease, opacity 240ms ease",
        opacity: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: isOpen ? "18px 18px 16px" : "18px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: isOpen ? "space-between" : "center",
          gap: 12,
        }}
      >
        {isOpen ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            <img
              src="/images/PointAi.png"
              alt="PointAI"
              style={{
                width: 40,
                height: 40,
                borderRadius: 14,
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 0.2, lineHeight: 1.2, color: "#000000" }}>
                 Point AI 
              </div>
              <div style={{ fontSize: 12, color: "#757575", marginTop: 4 }}>
                Search and jump between towers
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={onToggle}
            style={{
              width: 40,
              height: 40,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <img
              src="/images/PointAI.png"
              alt="PointAI"
              style={{
                width: 40,
                height: 40,
                borderRadius: 14,
                objectFit: "cover",
              }}
            />
          </button>
        )}

          {isOpen && (
            <button
              onClick={onToggle}
              aria-label="Collapse sidebar"
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                border: "1px solid rgba(255, 255, 255, 0.08)",
                background: "rgba(255, 255, 255, 0.03)",
                color: "#f5f5f5",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                transition: "background 180ms ease, transform 180ms ease",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              ⟨
            </button>
          )}
      </div>

      {isOpen && (
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14, minHeight: 0, flex: 1 }}>
          <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {navItems.map((item) => renderItem(item, false))}
          </nav>

          <div
            style={{
              marginTop: 4,
              padding: 14,
              borderRadius: 18,
              background: "#FFFFFF",
              border: "1px solid #E6E6E6",
            }}
          >
            <div style={{ color: "#757575", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em" }}>
              Render Profile
            </div>
            <div style={{ marginTop: 8, color: "#757575", fontSize: 12, lineHeight: 1.45 }}>
              Choose quality based on device performance.
            </div>

            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap:2,
                padding: 3,
                borderRadius: 12,
                background: "#FFFFFF",
                border: "1px solid #E6E6E6",
              }}
            >
              {[
                { key: "fast", label: "Fast" },
                { key: "balanced", label: "Balanced" },
                { key: "quality", label: "Quality" },
              ].map((option) => {
                const isActive = renderProfile === option.key;
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => onSetRenderProfile?.(option.key)}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      border: isActive ? "1px solid #FF0091" : "1px solid transparent",
                      background: "transparent",
                      color: isActive ? "#FF0091" : "#757575",
                      borderRadius: 9,
                      padding: "10px 4px",
                      cursor: "pointer",
                      fontSize: 11,
                      fontWeight: isActive ? 800 : 700,
                      letterSpacing: "0.01em",
                      transition: "background 140ms ease, border-color 140ms ease, color 140ms ease",
                    }}
                    title={`Switch to ${option.label} mode`}
                  >
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={onCycleRenderProfile}
              style={{
                marginTop: 8,
                width: "100%",
                border: "1px solid #FF0091",
                background: "#FFFFFF",
                color: "#FF0091",
                borderRadius: 10,
                padding: "8px 10px",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 700,
                textAlign: "center",
              }}
              title="Cycle profile"
            >
              Current: {renderProfileLabel}
            </button>
          </div>
        </div>
      )}

      {!isOpen && (
        <div style={{ padding: "14px 10px", display: "flex", flexDirection: "column", gap: 10, alignItems: "center", flex: 1 }}>
          {navItems.map((item) => renderItem(item, true))}
        </div>
      )}

    </aside>
  );
}
