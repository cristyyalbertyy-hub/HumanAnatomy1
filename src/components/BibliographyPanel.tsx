import { furtherStudy, furtherStudyIntro, furtherStudyTitle } from "../data/bibliography";

export function BibliographyPanel() {
  return (
    <details className="bibliography-panel">
      <summary className="bibliography-panel__summary">{furtherStudyTitle}</summary>
      <div className="bibliography-panel__body">
        <p className="bibliography-panel__intro">{furtherStudyIntro}</p>
        <ol className="bibliography-panel__list">
          {furtherStudy.map((entry) => (
            <li key={`${entry.authors}-${entry.title}`}>
              <strong>{entry.authors}.</strong> <em>{entry.title}</em>
              {entry.edition ? ` (${entry.edition})` : null}
              {entry.publisher ? `. ${entry.publisher}` : null}
              {entry.note ? <span className="bibliography-panel__note"> — {entry.note}</span> : null}
            </li>
          ))}
        </ol>
      </div>
    </details>
  );
}
