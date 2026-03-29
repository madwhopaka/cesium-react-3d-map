import { RadioTower, ShieldAlert, Wrench, Zap } from "lucide-react";

const ICON_BY_KEY = {
  maintenance: ShieldAlert,
  offline: Wrench,
  active: Zap,
  all: RadioTower,
};

export default function DashboardStatusCards({ cards, activeValue, activeValues, onCardClick }) {
  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: 10,
      }}
    >
      {cards.map((card) => {
        const Icon = ICON_BY_KEY[card.iconKey] || RadioTower;
        const hasMultiActiveValues = Array.isArray(activeValues) && activeValues.length > 0;
        const isActive = hasMultiActiveValues
          ? activeValues.includes("All")
            ? card.filterValue === "All"
            : activeValues.includes(card.filterValue)
          : typeof activeValue === "string" && card.filterValue === activeValue;

        return (
          <article
            key={card.id}
            onClick={() => onCardClick(card)}
            style={{
              background: card.bgColor,
              borderRadius: 4,
              border: isActive ? `1px solid ${card.textColor}` : "1px solid #F0F0F0",
              borderLeft: `3px solid ${card.textColor}`,
              padding: "10px 12px",
              display: "flex",
              flexDirection: "column",
              gap: 5,
              minHeight: 68,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: card.textColor,
                fontSize: 13,
                fontWeight: 600,
                lineHeight: 1,
              }}
            >
              <Icon size={15} color={card.textColor} aria-hidden="true" />
              <span>{card.label}</span>
            </div>
            <strong
              style={{
                color: "#141113",
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1,
                marginLeft: 18,
              }}
            >
              {card.count}
            </strong>
          </article>
        );
      })}
    </section>
  );
}
