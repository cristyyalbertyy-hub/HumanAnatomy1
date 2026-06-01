import { useEffect, useState } from "react";
import {
  infographicUrl,
  podcastUrl,
  questionnairePathFor,
  videoUrl,
  type ResolvedLesson,
} from "../data/curriculum";
import { assetUrl } from "../utils/assetUrl";
import { MediaBlock } from "./MediaBlock";
import { MediaTabs, type MediaTabId } from "./MediaTabs";
import { Questionnaire } from "./Questionnaire";

type Props = { lesson: ResolvedLesson };

export function LessonContent({ lesson }: Props) {
  const { system, section, topic, assetCode, questionnairePath } = lesson;
  const title = topic?.title ?? section.title;
  const breadcrumb = topic ? `${system.title} › ${section.title}` : system.title;

  const [tab, setTab] = useState<MediaTabId>("video");

  useEffect(() => {
    setTab("video");
  }, [assetCode]);

  const qPath = assetUrl(questionnairePathFor(assetCode, questionnairePath));
  const audioUrl = assetUrl(podcastUrl(assetCode));
  const imageUrl = assetUrl(infographicUrl(assetCode));
  const videoPrimary = assetUrl(videoUrl(assetCode));

  return (
    <div className="lesson-view">
      <header className="subchapter-head">
        <p className="eyebrow">{breadcrumb}</p>
        <h2>{title}</h2>
        <p className="lesson-code">{assetCode}</p>
      </header>

      <MediaTabs active={tab} onChange={setTab} />

      <div
        className="media-stage"
        role="tabpanel"
        id={`panel-${tab}`}
        aria-labelledby={`tab-${tab}`}
      >
        {tab === "video" ? (
          <MediaBlock key={`${assetCode}-v`} urlKey={videoPrimary} bare>
            {({ onMissing }) => (
              <video
                className="video"
                controls
                preload="metadata"
                src={videoPrimary}
                onError={onMissing}
              />
            )}
          </MediaBlock>
        ) : null}

        {tab === "podcast" ? (
          <MediaBlock key={`${assetCode}-p`} urlKey={audioUrl} bare>
            {({ onMissing }) => (
              <audio className="audio" controls preload="metadata" src={audioUrl} onError={onMissing}>
                Podcast
              </audio>
            )}
          </MediaBlock>
        ) : null}

        {tab === "infographic" ? (
          <MediaBlock key={`${assetCode}-i`} urlKey={imageUrl} bare>
            {({ onMissing }) => (
              <img
                className="infographic"
                src={imageUrl}
                alt={`Infographic: ${title}`}
                onError={onMissing}
              />
            )}
          </MediaBlock>
        ) : null}

        {tab === "questions" ? (
          <div key={`${assetCode}-q`} className="media-panel media-panel--questions">
            <Questionnaire src={qPath} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
