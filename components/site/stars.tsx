interface StarsProps {
  value: number;
}

export function Stars({ value }: StarsProps) {
  const full = Math.round(value);
  return (
    <span className="hub-stars" aria-label={`${value} stars`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className={i < full ? "" : "dim"} aria-hidden>
          ★
        </span>
      ))}
    </span>
  );
}
