import { useEffect, useState } from "react";
import { parseCsvRows } from "../utils/parseCsv";

type Props = { src: string };

export function Questionnaire({ src }: Props) {
  const [items, setItems] = useState<{ question: string; answer: string }[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<Record<number, boolean>>({});

  useEffect(() => {
    let cancelled = false;
    setItems(null);
    setError(null);
    fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error(`Could not load questionnaire (${r.status}).`);
        return r.text();
      })
      .then((t) => {
        if (cancelled) return;
        setItems(parseCsvRows(t));
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load.");
      });
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (error) return <p className="muted">{error}</p>;
  if (!items) return <p className="muted">Loading questions…</p>;
  if (items.length === 0) return <p className="muted">No questions in this file.</p>;

  return (
    <ul className="q-list">
      {items.map((it, idx) => (
        <li key={idx} className="q-item">
          <button
            type="button"
            className="q-toggle"
            onClick={() => setOpen((o) => ({ ...o, [idx]: !o[idx] }))}
            aria-expanded={!!open[idx]}
          >
            <span className="q-num">{idx + 1}.</span>
            <span className="q-text">{it.question}</span>
            <span className="q-chevron" aria-hidden>
              {open[idx] ? "▼" : "▶"}
            </span>
          </button>
          {open[idx] ? (
            <div className="q-answer">
              <span className="q-answer-label">Answer</span>
              <p>{it.answer}</p>
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
