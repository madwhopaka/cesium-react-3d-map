import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, MoveLeft, Search } from "lucide-react";
import { MODELS } from "../constants/models";
import ModelsPanel from "./Cesium/LeftPanel";

function statusTone(status) {
  const value = (status || "").toLowerCase();
  if (value.includes("active")) return { bg: "#e4fde9", fg: "#126b36", border: "#b7edc4" };
  if (value.includes("offline")) return { bg: "#fff3d4", fg: "#b26a00", border: "#f2d8a0" };
  if (value.includes("maintenance")) return { bg: "#ffe0e6", fg: "#c3344d", border: "#f0b6c1" };
  return { bg: "#ececec", fg: "#4b4b4b", border: "#d1d1d1" };
}

export default function TowersPage({
  renderProfile = "balanced",
  onRenderProfileChange,
}) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filterValue, setFilterValue] = useState("All");
  const [towerSearch, setTowerSearch] = useState("");
  const navigate = useNavigate();

  const filterValueFromQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const value = (params.get("filter") || "all").toLowerCase();
    if (value === "maintenance") return "Maintenance due";
    if (value === "offline") return "Offline";
    if (value === "active") return "Active";
    return "All";
  }, [location.search]);

  useEffect(() => {
    setFilterValue(filterValueFromQuery);
  }, [filterValueFromQuery]);

  const rows = useMemo(() => {
    return MODELS.map((model) => ({
      model,
      type: model.towerSpecs?.type || "-",
      location: model.towerSpecs?.location || "Unknown",
      status: model.status || "Unknown",
      statusUpdated: model.statusUpdated || "-",
      assignedTo: model.assignedTo || "-",
    }));
  }, []);

  const filteredRows = useMemo(() => {
    const statusFilteredRows =
      filterValue === "All"
        ? rows
        : rows.filter((row) => row.status.toLowerCase() === filterValue.toLowerCase());

    const query = towerSearch.trim().toLowerCase();
    if (!query) return statusFilteredRows;

    return statusFilteredRows.filter((row) =>
      [
        row.model.id,
        row.location,
        row.type,
        row.status,
        row.statusUpdated,
        row.assignedTo,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [filterValue, rows, towerSearch]);

  const dashboardStats = useMemo(() => {
    const maintenanceCount = rows.filter((row) => String(row.status).toLowerCase().includes("maintenance")).length;
    const offlineCount = rows.filter((row) => String(row.status).toLowerCase().includes("offline")).length;
    const activeCount = rows.filter((row) => String(row.status).toLowerCase().includes("active")).length;

    return [
      {
        id: "maintenance",
        label: "Maintenance due",
        count: maintenanceCount,
        textColor: "#C50B2F",
        bgColor: "#C50B2F14",
        filterValue: "Maintenance due",
        icon: "🛡",
      },
      {
        id: "offline",
        label: "Offline towers",
        count: offlineCount,
        textColor: "#B25A20",
        bgColor: "#B25A2014",
        filterValue: "Offline",
        icon: "🔧",
      },
      {
        id: "active",
        label: "Active towers",
        count: activeCount,
        textColor: "#136B36",
        bgColor: "#136B3614",
        filterValue: "Active",
        icon: "⚡",
      },
      {
        id: "all",
        label: "All towers",
        count: rows.length,
        textColor: "#141113",
        bgColor: "#14111310",
        filterValue: "All",
        icon: "⟲",
      },
    ];
  }, [rows]);

  const applyTowerFilter = (nextFilter) => {
    setFilterValue(nextFilter);
    const queryValue =
      nextFilter === "Maintenance due"
        ? "maintenance"
        : nextFilter === "Offline"
        ? "offline"
        : nextFilter === "Active"
        ? "active"
        : "all";
    navigate(`/towers?filter=${queryValue}`, { replace: true });
  };

  const RENDER_PROFILE_LABELS = {
    fast: "Fast",
    balanced: "Balanced",
    quality: "Quality",
  };

  const cycleRenderProfile = () => {
    if (typeof onRenderProfileChange !== "function") return;
    const order = ["fast", "balanced", "quality"];
    const currentIndex = order.indexOf(renderProfile);
    const nextProfile = order[(currentIndex + 1 + order.length) % order.length];
    onRenderProfileChange(nextProfile);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FFFFFF",
        color: "#141113",
      }}
    >
      <ModelsPanel
        models={MODELS}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((value) => !value)}
        onHome={() => navigate("/", { replace: true })}
        onOverview={() => navigate("/", { replace: true })}
        renderProfile={renderProfile}
        renderProfileLabel={RENDER_PROFILE_LABELS[renderProfile] || "Balanced"}
        onCycleRenderProfile={cycleRenderProfile}
        onSetRenderProfile={onRenderProfileChange}
      />

      <main
        style={{
          paddingLeft: sidebarOpen ? 264 : 84,
          paddingRight: 24,
          paddingTop: 24,
          paddingBottom: 24,
          transition: "padding-left 320ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <section
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <header
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 14,
              background: "#FFFFFF",
              padding: "14px 8px",
            }}
          >
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              {sidebarOpen && (
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close sidebar"
                  title="Close sidebar"
                  style={{
                    border: "none",
                    background: "transparent",
                    padding: 0,
                    display: "inline-flex",
                    marginRight: 15,
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#121212",
                  }}
                >
                  <MoveLeft color="currentColor" />
                </button>
              )}
              <h1 style={{ margin: 0, fontSize: 21, fontWeight: 700, color: "#141113", lineHeight: 1.1 }}>
                Tower Details
              </h1>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, flex: "0 1 520px" }}>
              <label
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#F7F7F7",
                  border: "1px solid #F0F0F0",
                  borderRadius: 999,
                  padding: "9px 12px",
                }}
              >
                <Search color="#000000" />
                <input
                  type="text"
                  value={towerSearch}
                  onChange={(event) => setTowerSearch(event.target.value)}
                  placeholder="Search something"
                  aria-label="Search towers in details"
                  style={{
                    width: "100%",
                    border: "none",
                    background: "transparent",
                    color: "#141113",
                    outline: "none",
                    fontSize: 13,
                  }}
                />
              </label>

              <span
                style={{
                  position: "relative",
                  width: 36,
                  height: 36,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#141113",
                }}
                aria-label="Notifications"
                title="Notifications"
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
              </span>
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 999,
                  background: "#136B36",
                  color: "#FFFFFF",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                T
              </span>
            </div>
          </header>

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
              gap: 10,
            }}
          >
            {dashboardStats.map((card) => (
              <article
                key={card.id}
                onClick={() => applyTowerFilter(card.filterValue)}
                style={{
                  background: card.bgColor,
                  borderRadius: 4,
                  border: filterValue === card.filterValue ? `1px solid ${card.textColor}` : "1px solid #F0F0F0",
                  borderLeft: `3px solid ${card.textColor}`,
                  padding: "7px 10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  minHeight: 52,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: card.textColor,
                    fontSize: 12,
                    fontWeight: 600,
                    lineHeight: 1,
                  }}
                >
                  <span aria-hidden="true" style={{ fontSize: 10 }}>{card.icon}</span>
                  <span>{card.label}</span>
                </div>
                <strong
                  style={{
                    color: "#141113",
                    fontSize: 17,
                    fontWeight: 700,
                    lineHeight: 1,
                    marginLeft: 16,
                  }}
                >
                  {card.count}
                </strong>
              </article>
            ))}
          </section>

          <section
            style={{
              padding: 18,
              borderRadius: 24,
              background: "#FFFFFF",
              border: "1px solid #F0F0F0",
              boxShadow: "0 10px 24px rgba(20,17,19,0.08)",
            }}
          >
            <div
              style={{
                padding: "4px 2px 14px",
                borderBottom: "1px solid #F0F0F0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 17, lineHeight: 1.2, color: "#141113" }}>Network tower List</h2>

              <div
                style={{
                  display: "flex",
                  position: "relative",
                  alignItems: "center",
                  gap: 10,
                  color: "#141113",
                  fontSize: 13,
                }}
              >
                <span style={{ color: "#141113", fontSize: 12 }}>Filters</span>
                <select
                  value={filterValue}
                  onChange={(event) => applyTowerFilter(event.target.value)}
                  aria-label="Filter towers by status"
                  style={{
                    minWidth: 152,
                    padding: "8px 34px 8px 10px",
                    borderRadius: 10,
                    border: "1px solid #F0F0F0",
                    background: "#FFFFFF",
                    color: "#141113",
                    outline: "none",
                    fontSize: 13,
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    cursor: "pointer",
                    lineHeight: 1.2,
                  }}
                >
                  <option value="All" style={{ background: "#FFFFFF", color: "#141113" }}>All</option>
                  <option value="Active" style={{ background: "#FFFFFF", color: "#141113" }}>Active</option>
                  <option value="Offline" style={{ background: "#FFFFFF", color: "#141113" }}>Offline</option>
                  <option value="Maintenance due" style={{ background: "#FFFFFF", color: "#141113" }}>Maintenance due</option>
                </select>
                <span
                  style={{
                    color: "#141113",
                    position: "absolute",
                    right: 12,
                    pointerEvents: "none",
                  }}
                >
                  ▾
                </span>
              </div>
            </div>

            <div id="tower-details" style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "separate",
                  borderSpacing: 0,
                  minWidth: 980,
                }}
              >
                <thead>
                  <tr>
                    {[
                      "Tower ID",
                      "Location",
                      "Tower Type",
                      "Status",
                      "Status Updated",
                      "Assigned To",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        style={{
                          textAlign: "left",
                          padding: "14px 12px",
                          width: heading === "Tower Type" ? 190 : "auto",
                          fontSize: 11,
                          textTransform: "uppercase",
                          letterSpacing: "0.12em",
                          color: "#141113",
                          borderBottom: "1px solid #F0F0F0",
                        }}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => {
                    const tone = statusTone(row.status);

                    return (
                    <tr key={row.model.id} style={{ borderBottom: "1px solid #F0F0F0" }}>
                      <td style={{ padding: "16px 12px", fontSize: 13, fontWeight: 700, color: "#141113" }}>{row.model.id}</td>
                        <td style={{ padding: "16px 12px", fontSize: 13, color: "#141113" }}>{row.location}</td>
                      <td style={{ padding: "16px 12px", fontSize: 13, color: "#141113", maxWidth: 190 }}>
                        <span
                          title={row.type}
                          style={{
                            display: "block",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {row.type}
                        </span>
                      </td>
                      <td style={{ padding: "16px 12px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "6px 10px",
                            borderRadius: 999,
                            background: tone.bg,
                            border: `1px solid ${tone.border}`,
                            color: tone.fg,
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td style={{ padding: "16px 12px", fontSize: 13, color: "#141113" }}>{row.statusUpdated}</td>
                      <td style={{ padding: "16px 12px", fontSize: 13, color: "#141113" }}>{row.assignedTo}</td>
                      <td style={{ padding: "16px 12px" }}>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                          <Link
                            to={`/map/${row.model.id}`}
                            style={{
                              padding: "0",
                              textDecoration: "none",
                              color: "#FF0091",
                              fontSize: 12,
                              fontWeight: 700,
                              textDecorationLine: "underline",
                              textUnderlineOffset: 3,
                            }}
                          >
                            view map
                          </Link>
                          <Link
                            to={`/model-viewer/${row.model.id}`}
                            target="_blank"
                            style={{
                              padding: "0",
                              textDecoration: "none",
                              color: "#FF0091",
                              fontSize: 12,
                              fontWeight: 700,
                              textDecorationLine: "underline",
                              textUnderlineOffset: 3,
                            }}
                          >
                            3D view
                          </Link>
                        </div>
                      </td>
                    </tr>
                    );
                  })}

                  {filteredRows.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: 24, textAlign: "center", color: "#141113" }}>
                        No towers match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
