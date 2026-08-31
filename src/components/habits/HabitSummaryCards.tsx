interface HabitSummaryCardsProps {
  totalPossible: number;
  totalDone: number;
  remaining: number;
}

const CARDS = [
  { key: "possible", label: "목표" },
  { key: "done", label: "완료" },
  { key: "remaining", label: "남음" },
] as const;

export function HabitSummaryCards({
  totalPossible,
  totalDone,
  remaining,
}: HabitSummaryCardsProps) {
  const values: Record<(typeof CARDS)[number]["key"], number> = {
    possible: totalPossible,
    done: totalDone,
    remaining,
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {CARDS.map((card) => (
        <div
          key={card.key}
          className="flex flex-col gap-1 rounded-2xl bg-brand-600 px-5 py-4 text-white shadow-card"
        >
          <span className="text-xs font-medium text-brand-100">{card.label}</span>
          <span className="tnum text-3xl font-bold">{values[card.key]}</span>
        </div>
      ))}
    </div>
  );
}
