import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MODELS } from "../constants/models";
import ModelsPanel from "./Cesium/LeftPanel";
import CommonHeader from "./CommonHeader";
import DashboardStatusCards from "./DashboardStatusCards";

function statusTone(status) {
  const value = (status || "").toLowerCase();
  if (value.includes("active")) return { bg: "#e4fde9", fg: "#126b36", border: "#b7edc4" };
  if (value.includes("offline")) return { bg: "#fff3d4", fg: "#b26a00", border: "#f2d8a0" };
  if (value.includes("maintenance")) return { bg: "#ffe0e6", fg: "#c3344d", border: "#f0b6c1" };
  return { bg: "#ececec", fg: "#4b4b4b", border: "#d1d1d1" };
}

const FILTER_OPTIONS = ["All", "Active", "Offline", "Maintenance due"];
const DETAIL_FILTER_OPTIONS = FILTER_OPTIONS.filter((option) => option !== "All");

function matchesFilter(status, filter) {
  const normalizedStatus = String(status || "").toLowerCase();
  if (filter === "Active") return normalizedStatus.includes("active");
  if (filter === "Offline") return normalizedStatus.includes("offline");
  if (filter === "Maintenance due") return normalizedStatus.includes("maintenance");
  return true;
}

function queryTokenToFilter(token) {
  if (token === "maintenance") return "Maintenance due";
  if (token === "offline") return "Offline";
  if (token === "active") return "Active";
  return "All";
}

function filterToQueryToken(filter) {
  if (filter === "Maintenance due") return "maintenance";
  if (filter === "Offline") return "offline";
  if (filter === "Active") return "active";
  return "all";
}

export default function TowersPage({
  renderProfile = "balanced",
  onRenderProfileChange,
}) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState(["All"]);
  const [detailFilters, setDetailFilters] = useState([]);
  const [towerSearch, setTowerSearch] = useState("");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const filterMenuRef = useRef(null);
  const navigate = useNavigate();
  const isAllTowersSelected = selectedFilters.includes("All");

  const selectedFiltersFromQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const queryValue = String(params.get("filter") || "all").toLowerCase();
    const mapped = queryValue
      .split(",")
      .map((token) => queryTokenToFilter(token.trim()))
      .filter((value, index, array) => FILTER_OPTIONS.includes(value) && array.indexOf(value) === index);

    if (mapped.length === 0 || mapped.includes("All")) return ["All"];
    return [mapped[0]];
  }, [location.search]);

  useEffect(() => {
    setSelectedFilters(selectedFiltersFromQuery);
  }, [selectedFiltersFromQuery]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setIsFilterMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    if (!isAllTowersSelected) {
      setIsFilterMenuOpen(false);
    }
  }, [isAllTowersSelected]);

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
    const statusFilteredRows = isAllTowersSelected
      ? detailFilters.length > 0
        ? rows.filter((row) => detailFilters.some((filter) => matchesFilter(row.status, filter)))
        : rows
      : rows.filter((row) => selectedFilters.some((filter) => matchesFilter(row.status, filter)));

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
  }, [detailFilters, isAllTowersSelected, selectedFilters, rows, towerSearch]);

  const toggleDetailFilter = (nextFilter) => {
    setDetailFilters((previous) =>
      previous.includes(nextFilter)
        ? previous.filter((value) => value !== nextFilter)
        : [...previous, nextFilter]
    );
  };

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
        iconKey: "maintenance",
      },
      {
        id: "offline",
        label: "Offline towers",
        count: offlineCount,
        textColor: "#B25A20",
        bgColor: "#B25A2014",
        filterValue: "Offline",
        iconKey: "offline",
      },
      {
        id: "active",
        label: "Active towers",
        count: activeCount,
        textColor: "#136B36",
        bgColor: "#136B3614",
        filterValue: "Active",
        iconKey: "active",
      },
      {
        id: "all",
        label: "All towers",
        count: rows.length,
        textColor: "#141113",
        bgColor: "#14111310",
        filterValue: "All",
        iconKey: "all",
      },
    ];
  }, [rows]);

  const towerMetaById = useMemo(() => {
    return rows.reduce((accumulator, row) => {
      accumulator[row.model.id] = {
        name: row.model.name || `Tower ${row.model.id}`,
        location: row.location || "Unknown",
      };
      return accumulator;
    }, {});
  }, [rows]);

  const applyTowerFilter = (nextFilter) => {
    const nextFilters = [nextFilter === "All" ? "All" : nextFilter];
    const queryValue = nextFilters[0] === "All" ? "all" : filterToQueryToken(nextFilters[0]);

    navigate(`/towers?filter=${queryValue}`, { replace: true });
    setSelectedFilters(nextFilters);
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
          paddingTop: 0,
          paddingBottom: 24,
          height: "100vh",
          overflow: "hidden",
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
            height: "100%",
            minHeight: 0,
          }}
        >
          <CommonHeader
            title="Tower Details"
            showBackButton={sidebarOpen}
            onBackButtonClick={() => setSidebarOpen(false)}
            searchValue={towerSearch}
            onSearchChange={setTowerSearch}
            searchAriaLabel="Search towers in details"
            notificationTowerMetaById={towerMetaById}
            notificationDialogLabel="Tower notifications"
            containerStyle={{ padding: "14px 8px" }}
          />

          <DashboardStatusCards
            cards={dashboardStats}
            activeValues={selectedFilters}
            onCardClick={(card) => applyTowerFilter(card.filterValue)}
          />

          <section
            style={{
              padding: 18,
              borderRadius: 24,
              background: "#FFFFFF",
              border: "1px solid #F0F0F0",
              // boxShadow: "0 10px 24px rgba(20,17,19,0.08)",
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minHeight: 0,
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

              {isAllTowersSelected && (
                <div
                  ref={filterMenuRef}
                  style={{
                    display: "flex",
                    position: "relative",
                    alignItems: "center",
                    gap: 8,
                    color: "#141113",
                    fontSize: 13,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setIsFilterMenuOpen((value) => !value)}
                    aria-label="Filter towers by status"
                    style={{
                      minWidth: 186,
                      padding: "8px 10px",
                      borderRadius: 10,
                      border: "1px solid #F0F0F0",
                      background: "#FFFFFF",
                      color: "#141113",
                      outline: "none",
                      fontSize: 13,
                      cursor: "pointer",
                      lineHeight: 1.2,
                      textAlign: "left",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                    }}
                  >
                    <span>{detailFilters.length > 0 ? detailFilters.join(", ") : "All"}</span>
                    <span aria-hidden="true">▾</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDetailFilters([])}
                    aria-label="Clear status filters"
                    title="Clear filters"
                    disabled={detailFilters.length === 0}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      border: "1px solid #F0F0F0",
                      background: "#FFFFFF",
                      color: detailFilters.length > 0 ? "#141113" : "#B0B0B0",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: detailFilters.length > 0 ? "pointer" : "not-allowed",
                    }}
                  >
                    <X size={15} aria-hidden="true" />
                  </button>

                  {isFilterMenuOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        right: 0,
                        minWidth: 220,
                        padding: 10,
                        borderRadius: 10,
                        border: "1px solid #F0F0F0",
                        background: "#FFFFFF",
                        boxShadow: "0 10px 24px rgba(20,17,19,0.08)",
                        zIndex: 20,
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      {DETAIL_FILTER_OPTIONS.map((option) => (
                        <label
                          key={option}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            fontSize: 13,
                            color: "#141113",
                            cursor: "pointer",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={detailFilters.includes(option)}
                            onChange={() => toggleDetailFilter(option)}
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div id="tower-details" style={{ overflow: "auto", flex: 1, minHeight: 0 }}>
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
