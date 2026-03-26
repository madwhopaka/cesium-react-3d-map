import { Link, useLocation } from "react-router-dom";

export default function ModelsPanel({ models, isOpen, onToggle, onHome, onOverview }) {
  const location = useLocation();

  const navItems = [
    { label: "Home", to: "/", icon: "⌂" },
    { label: "Tower Overview", to: "/?overview=1", icon: "▤" },
    { label: "Tower Details", to: "/tower", icon: "/images/icon-tower.png" },
  ];

  const isHomeActive = location.pathname === "/";
  const isTowersActive = location.pathname === "/" && new URLSearchParams(location.search).get("overview") === "1";
  const isTowerDetailsActive = location.pathname === "/tower";

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 20,
        width: isOpen ? 248 : 68,
        background: "#1c1b1b",
        color: "#f5f5f5",
        borderRight: "1px solid rgba(255, 255, 255, 0.06)",
        boxShadow: "18px 0 60px rgba(0, 0, 0, 0.28)",
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
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: isOpen ? "space-between" : "center",
          gap: 12,
        }}
      >
        {isOpen ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            <img
              src="/images/PointAI.png"
              alt="PointAI"
              style={{
                width: 40,
                height: 40,
                borderRadius: 14,
                objectFit: "cover",
                flexShrink: 0,
                boxShadow: "0 8px 18px rgba(0,0,0,0.18)",
              }}
            />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 0.2, lineHeight: 1.2, color: "#f5f5f5" }}>
                Quick Menu
              </div>
              <div style={{ fontSize: 12, color: "#b0a7a7", marginTop: 4 }}>
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
                boxShadow: "0 8px 18px rgba(0,0,0,0.18)",
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
            {navItems.map((item) => {
              const isActive =
                (item.to === "/" && isHomeActive && new URLSearchParams(location.search).get("overview") !== "1") ||
                (item.to === "/?overview=1" && isTowersActive) ||
                (item.to === "/tower" && isTowerDetailsActive);

              if (item.to === "/" && onHome) {
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={onHome}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 14px",
                      borderRadius: 16,
                      textDecoration: "none",
                      color: isActive ? "#ffffff" : "#b0a7a7",
                      background: isActive ? "#2a2424" : "transparent",
                      border: isActive ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
                      boxShadow: isActive ? "0 10px 22px rgba(0,0,0,0.2)" : "none",
                      transition: "transform 180ms ease, background 180ms ease",
                      cursor: "pointer",
                      width: "100%",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateX(2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{item.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{item.label}</span>
                  </button>
                );
              }

              if (item.to === "/?overview=1" && onOverview) {
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={onOverview}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 14px",
                      borderRadius: 16,
                      textDecoration: "none",
                      color: isActive ? "#ffffff" : "#b0a7a7",
                      background: isActive ? "#2a2424" : "transparent",
                      border: isActive ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
                      boxShadow: isActive ? "0 10px 22px rgba(0,0,0,0.2)" : "none",
                      transition: "transform 180ms ease, background 180ms ease",
                      cursor: "pointer",
                      width: "100%",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateX(2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{item.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{item.label}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.label}
                  to={item.to}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 14px",
                    borderRadius: 16,
                    textDecoration: "none",
                    color: isActive ? "#ffffff" : "#b0a7a7",
                    background: isActive ? "#2a2424" : "transparent",
                    border: isActive ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
                    boxShadow: isActive ? "0 10px 22px rgba(0,0,0,0.2)" : "none",
                    transition: "transform 180ms ease, background 180ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateX(2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  {item.icon.startsWith("/images/") ? (
                    <img
                      src={item.icon}
                      alt={item.label}
                      style={{ width: 18, height: 18, objectFit: "contain", flexShrink: 0 }}
                    />
                  ) : (
                    <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{item.icon}</span>
                  )}
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div
            style={{
              marginTop: 4,
              padding: 14,
              borderRadius: 18,
              background: "#241f1f",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div style={{ color: "#b0a7a7", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em" }}>
              Tower Details
            </div>
            <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.6, color: "#f5f5f5" }}>
              Browse tower metrics, search the list, and open the map or 3D viewer.
            </div>
            <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={{ padding: "6px 10px", borderRadius: 999, background: "rgba(255,255,255,0.05)", fontSize: 11 }}>
                {models?.length ?? 0} towers
              </span>
              <span style={{ padding: "6px 10px", borderRadius: 999, background: "rgba(255,255,255,0.05)", fontSize: 11 }}>
                Black &amp; white
              </span>
            </div>
          </div>
        </div>
      )}

      {!isOpen && (
        <div style={{ padding: "14px 10px", display: "flex", flexDirection: "column", gap: 10, alignItems: "center", flex: 1 }}>
          {navItems.map((item) => {
            const isActive =
              (item.to === "/" && isHomeActive && new URLSearchParams(location.search).get("overview") !== "1") ||
              (item.to === "/?overview=1" && isTowersActive) ||
              (item.to === "/tower" && isTowerDetailsActive);

            const IconContent = item.icon.startsWith("/images/") ? (
              <img
                src={item.icon}
                alt={item.label}
                style={{ width: 18, height: 18, objectFit: "contain" }}
              />
            ) : (
              <span style={{ fontSize: 18, lineHeight: 1 }}>{item.icon}</span>
            );

            const commonStyle = {
              width: 40,
              height: 40,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: isActive ? "#2a2424" : "transparent",
              border: isActive ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
              color: "#f5f5f5",
              cursor: "pointer",
              padding: 0,
              boxShadow: isActive ? "0 10px 22px rgba(0,0,0,0.2)" : "none",
            };

            if (item.to === "/" && onHome) {
              return (
                <button key={item.label} type="button" onClick={onHome} title={item.label} aria-label={item.label} style={commonStyle}>
                  {IconContent}
                </button>
              );
            }

            if (item.to === "/?overview=1" && onOverview) {
              return (
                <button key={item.label} type="button" onClick={onOverview} title={item.label} aria-label={item.label} style={commonStyle}>
                  {IconContent}
                </button>
              );
            }

            return (
              <Link key={item.label} to={item.to} title={item.label} aria-label={item.label} style={commonStyle}>
                {IconContent}
              </Link>
            );
          })}
        </div>
      )}

    </aside>
  );
}
