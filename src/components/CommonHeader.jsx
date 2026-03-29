import { MoveLeft, Search } from "lucide-react";
import NotificationBellPopup from "./NotificationBellPopup";

export default function CommonHeader({
  title,
  showBackButton,
  onBackButtonClick,
  searchValue,
  onSearchChange,
  searchAriaLabel,
  notificationTowerMetaById,
  notificationDialogLabel,
  profileLabel = "T",
  containerStyle,
}) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 14,
        background: "#FFFFFF",
        padding: "14px 18px",
        ...(containerStyle || {}),
      }}
    >
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        {showBackButton && (
          <button
            type="button"
            onClick={onBackButtonClick}
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
          {title}
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
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search something"
            aria-label={searchAriaLabel}
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

        <NotificationBellPopup
          towerMetaById={notificationTowerMetaById}
          dialogLabel={notificationDialogLabel}
        />
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
          {profileLabel}
        </span>
      </div>
    </header>
  );
}
