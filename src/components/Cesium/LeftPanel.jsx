import { Link, useLocation } from "react-router-dom";

export default function ModelsPanel({ models, isOpen, onToggle, onHome, onOverview }) {
  const location = useLocation();

  const navItems = [
    { label: "Home", to: "/", icon: "⌂" },
    { label: "Tower Overview", to: "/?overview=1", icon: "▤" },
    { label: "Tower Details", to: "/tower", icon: "◫" },
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
        width: isOpen ? 324 : 76,
        background: "linear-gradient(180deg, rgba(10,10,10,0.98) 0%, rgba(6,6,6,0.96) 100%)",
        color: "#f5f5f5",
        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "18px 0 60px rgba(0, 0, 0, 0.38)",
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
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: isOpen ? "space-between" : "center",
          gap: 12,
        }}
      >
        {isOpen ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(180deg, #ffffff 0%, #cfcfcf 100%)",
                color: "#0a0a0a",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
                flexShrink: 0,
                fontSize: 18,
              }}
            >
              🗼
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 0.2, lineHeight: 1.2 }}>
                Quick Menu
              </div>
              <div style={{ fontSize: 12, color: "#a1a1a1", marginTop: 4 }}>
                Search and jump between towers
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(180deg, #ffffff 0%, #cfcfcf 100%)",
              color: "#0a0a0a",
              fontSize: 18,
            }}
          >
            🗼
          </div>
        )}

        <button
          onClick={onToggle}
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            border: "1px solid rgba(255, 255, 255, 0.12)",
            background: "rgba(255, 255, 255, 0.04)",
            color: "#e5e5e5",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            transition: "background 180ms ease, transform 180ms ease",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {isOpen ? "⟨" : "⟩"}
        </button>
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
                      color: isActive ? "#050505" : "#f5f5f5",
                      background: isActive
                        ? "linear-gradient(180deg, #f5f5f5 0%, #d9d9d9 100%)"
                        : "rgba(255,255,255,0.04)",
                      border: isActive
                        ? "1px solid rgba(255,255,255,0.7)"
                        : "1px solid rgba(255,255,255,0.08)",
                      boxShadow: isActive ? "0 14px 26px rgba(0,0,0,0.32)" : "none",
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
                      color: isActive ? "#050505" : "#f5f5f5",
                      background: isActive
                        ? "linear-gradient(180deg, #f5f5f5 0%, #d9d9d9 100%)"
                        : "rgba(255,255,255,0.04)",
                      border: isActive
                        ? "1px solid rgba(255,255,255,0.7)"
                        : "1px solid rgba(255,255,255,0.08)",
                      boxShadow: isActive ? "0 14px 26px rgba(0,0,0,0.32)" : "none",
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
                    color: isActive ? "#050505" : "#f5f5f5",
                    background: isActive
                      ? "linear-gradient(180deg, #f5f5f5 0%, #d9d9d9 100%)"
                      : "rgba(255,255,255,0.04)",
                    border: isActive
                      ? "1px solid rgba(255,255,255,0.7)"
                      : "1px solid rgba(255,255,255,0.08)",
                    boxShadow: isActive ? "0 14px 26px rgba(0,0,0,0.32)" : "none",
                    transition: "transform 180ms ease, background 180ms ease",
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
                </Link>
              );
            })}
          </nav>

          <div
            style={{
              marginTop: 4,
              padding: 14,
              borderRadius: 18,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div style={{ color: "#a1a1a1", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em" }}>
              Tower Details
            </div>
            <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.6, color: "#f5f5f5" }}>
              Browse tower metrics, search the list, and open the map or 3D viewer.
            </div>
            <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={{ padding: "6px 10px", borderRadius: 999, background: "rgba(255,255,255,0.08)", fontSize: 11 }}>
                {models?.length ?? 0} towers
              </span>
              <span style={{ padding: "6px 10px", borderRadius: 999, background: "rgba(255,255,255,0.08)", fontSize: 11 }}>
                Black &amp; white
              </span>
            </div>
          </div>
        </div>
      )}

      {!isOpen && (
        <div style={{ padding: "18px 12px", display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          <div style={{ color: "#a1a1a1", fontSize: 11, writingMode: "vertical-rl", transform: "rotate(180deg)", letterSpacing: "0.14em" }}>
            TOWERS
          </div>
          <div style={{ width: 32, height: 1, background: "rgba(255,255,255,0.12)" }} />
          <div style={{ color: "#f5f5f5", fontSize: 12, fontWeight: 700 }}>{models.length}</div>
        </div>
      )}
    </aside>
  );
}
