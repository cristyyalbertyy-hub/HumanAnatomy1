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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(true);
  const mainRef = useRef<HTMLElement>(null);

  const lesson = useMemo(() => useLessonFromSelection(selection), [selection]);
  const isBrowsing = !lesson && !atHome;

  const activeSystemId = useMemo(() => {
    if (lesson) return lesson.system.id;
    if (selection && !atHome) return selection.systemId;
    return systems.find((s) => openSystems[s.id])?.id ?? null;
  }, [lesson, selection, atHome, openSystems]);

  const browsingContext = useMemo(() => {
    if (!selection || lesson) return null;
    const system = systems.find((s) => s.id === selection.systemId);
    const section = system?.sections.find((sec) => sec.id === selection.sectionId);
    if (!system || !section) return null;
    return { system, section };
  }, [selection, lesson]);

  const mobileLessonContext = useMemo(() => {
    if (lesson) {
      return {
        chapter: lesson.system.title,
        subchapter: lesson.topic?.title ?? lesson.section.title,
        color: lesson.system.color,
      };
    }
    if (browsingContext) {
      return {
        chapter: browsingContext.system.title,
        subchapter: browsingContext.section.title,
        color: browsingContext.system.color,
      };
    }
    return null;
  }, [lesson, browsingContext]);

  const showMobileLessonBar = !mobileMenuOpen && !atHome && mobileLessonContext !== null;
  const shellMode = mobileMenuOpen ? "is-mobile-menu" : "is-mobile-content";

  const overviewImage = assetUrl("/HumanAnatomy.png");

  const overviewPanel = (
    <div className="overview-panel">
      <div className="overview-intro">
        <p className="overview-lead">
          Locomotor, cardiovascular and respiratory anatomy — three systems with video, podcast,
          infographic and quiz for each sub-topic.
        </p>
        <ul className="overview-systems" aria-label="Course systems">
          {systems.map((system) => (
            <li
              key={system.id}
              className="overview-systems__item"
              style={{ borderLeftColor: system.color }}
            >
              <strong>{system.title}</strong>
              <span>
                {system.sections.length} {system.sections.length === 1 ? "section" : "sections"}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <img
        src={overviewImage}
        alt="Human Anatomy I — course overview"
        className="overview-infographic"
      />
      <p className="overview-hint muted">
        Open a coloured chapter below, then choose a sub-topic to start.
      </p>
      <button type="button" className="mobile-browse-btn" onClick={() => setMobileMenuOpen(true)}>
        Browse chapters →
      </button>
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
    setMobileMenuOpen(false);

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
    setMobileMenuOpen(false);
    setOpenSystems(collapsedRecord(systems.map((s) => s.id)));
    setOpenSections({});
  };

  const openMobileMenu = () => {
    setMobileMenuOpen(true);
  };

  return (
    <div className={`app-shell ${shellMode}`}>
      <header className={`app-header${showMobileLessonBar ? " app-header--compact-mobile" : ""}`}>
        <button
          type="button"
          className="home-overview-btn"
          onClick={goToEntry}
          aria-label="Back to course overview"
        >
          <span className="home-overview-btn__media">
            <img src={overviewImage} alt="" onError={(e) => (e.currentTarget.style.display = "none")} />
            <span className="home-overview-btn__fallback" aria-hidden>
              ⊕
            </span>
          </span>
          <span className="home-overview-btn__label">Course overview</span>
        </button>
        <h1>{courseTitle}</h1>
      </header>

      {showMobileLessonBar && mobileLessonContext ? (
        <div
          className="mobile-lesson-bar"
          style={{ borderLeftColor: mobileLessonContext.color }}
        >
          <button type="button" className="mobile-menu-back" onClick={openMobileMenu}>
            ← Menu
          </button>
          <div className="mobile-lesson-bar__text">
            <span className="mobile-lesson-bar__chapter">{mobileLessonContext.chapter}</span>
            <span className="mobile-lesson-bar__sub">{mobileLessonContext.subchapter}</span>
          </div>
        </div>
      ) : null}

      <div className="layout">
        <div className="sidebar-column">
          <CourseNav
            openSystems={openSystems}
            openSections={openSections}
            selection={selection}
            onToggleSystem={toggleSystem}
            onToggleSection={toggleSection}
            onSelectLesson={selectLesson}
          />
        </div>

        <main
          ref={mainRef}
          className={`main${atHome ? " main--overview" : ""}${isBrowsing ? " main--browsing" : ""}`}
          data-system-tint={activeSystemId ?? undefined}
        >
          {atHome ? (
            overviewPanel
          ) : lesson ? (
            <LessonContent lesson={lesson} />
          ) : (
            <div className="browse-view">
              <div className="media-stage media-stage--placeholder">
                {browsingContext ? (
                  <>
                    <p className="eyebrow">{browsingContext.system.title}</p>
                    <h2 className="browse-title">{browsingContext.section.title}</h2>
                    <p className="browse-hint">
                      Pick a sub-topic in the menu to open video, podcast, infographic and questions.
                    </p>
                  </>
                ) : (
                  <p>Choose a coloured chapter in the menu on the left, then select a sub-topic.</p>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
