import { useEffect, useMemo, useRef, useState } from "react";
import { CourseNav, useLessonFromSelection, type LessonSelection } from "./components/CourseNav";
import { LessonContent } from "./components/LessonContent";
import { courseTitle, systems } from "./data/curriculum";
import { assetUrl } from "./utils/assetUrl";

function collapsedRecord(ids: string[]): Record<string, boolean> {
  const init: Record<string, boolean> = {};
  for (const id of ids) init[id] = false;
  return init;
}

export default function App() {
  const [openSystems, setOpenSystems] = useState(() =>
    collapsedRecord(systems.map((s) => s.id)),
  );
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [selection, setSelection] = useState<LessonSelection | null>(null);
  const [atHome, setAtHome] = useState(true);
  const mainRef = useRef<HTMLElement>(null);

  const lesson = useMemo(() => useLessonFromSelection(selection), [selection]);
  const isBrowsing = !lesson && !atHome;

  const overviewImage = assetUrl("/HumanAnatomy.png");

  const overviewPanel = (
    <div className="overview-panel">
      <img
        src={overviewImage}
        alt="Human Anatomy I — course overview"
        className="overview-infographic"
      />
      <div className="overview-chapters" role="navigation" aria-label="Course chapters">
        {systems.map((system) => (
          <button
            key={system.id}
            type="button"
            className="overview-chapter-btn"
            onClick={() => {
              setAtHome(false);
              setOpenSystems((o) => ({ ...o, [system.id]: true }));
            }}
          >
            {system.title}
          </button>
        ))}
      </div>
    </div>
  );

  const toggleSystem = (id: string) => {
    setOpenSystems((o) => ({ ...o, [id]: !o[id] }));
  };

  const toggleSection = (key: string) => {
    setOpenSections((o) => ({ ...o, [key]: !o[key] }));
  };

  const selectLesson = (sel: LessonSelection) => {
    setAtHome(false);
    setSelection(sel);

    const nextSystems = collapsedRecord(systems.map((s) => s.id));
    nextSystems[sel.systemId] = true;
    setOpenSystems(nextSystems);

    const sectionKey = `${sel.systemId}:${sel.sectionId}`;
    if (sel.topicId !== null) {
      setOpenSections({ [sectionKey]: true });
    } else {
      setOpenSections({});
    }
  };

  const lessonScrollKey = lesson
    ? `${lesson.system.id}:${lesson.section.id}:${lesson.topic?.id ?? ""}:${lesson.assetCode}`
    : null;

  useEffect(() => {
    if (!lessonScrollKey) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    mainRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [lessonScrollKey]);

  const goToEntry = () => {
    setAtHome(true);
    setSelection(null);
    setOpenSystems(collapsedRecord(systems.map((s) => s.id)));
    setOpenSections({});
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <button
          type="button"
          className="home-thumb"
          onClick={goToEntry}
          aria-label="Back to course overview"
          title="Course overview"
        >
          <img src={overviewImage} alt="" onError={(e) => (e.currentTarget.style.display = "none")} />
          <span className="home-thumb-fallback" aria-hidden>
            ⊕
          </span>
        </button>
        <h1>{courseTitle}</h1>
      </header>

      <div className={`layout${atHome ? " layout--overview" : ""}`}>
        {!atHome ? (
          <CourseNav
            openSystems={openSystems}
            openSections={openSections}
            selection={selection}
            onToggleSystem={toggleSystem}
            onToggleSection={toggleSection}
            onSelectLesson={selectLesson}
          />
        ) : null}

        <main
          ref={mainRef}
          className={`main${atHome ? " main--overview" : ""}${isBrowsing ? " main--browsing" : ""}`}
        >
          {atHome ? (
            overviewPanel
          ) : lesson ? (
            <LessonContent lesson={lesson} />
          ) : (
            <div className="browse-view">
              <div className="media-stage media-stage--placeholder">
                <p>Choose a sub-topic in the menu (for example <code>LS_AT_S</code>).</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
