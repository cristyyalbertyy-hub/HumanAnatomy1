import { useEffect, useRef, useState } from "react";
import { type ResolvedLesson } from "../data/curriculum";
import { useMediaProgress } from "../hooks/useMediaProgress";
import { bindPlaybackProgress } from "../lib/playbackProgress";
import {
  infographicPathCandidates,
  podcastPathCandidates,
  questionnairePathCandidates,
  videoPathCandidates,
} from "../utils/mediaPaths";
import { assetUrl } from "../utils/assetUrl";
import { MediaBlock } from "./MediaBlock";
import { MediaTabs, type MediaTabId } from "./MediaTabs";
import { MediaWithFallback } from "./MediaWithFallback";
import { Questionnaire } from "./Questionnaire";

type Props = { lesson: ResolvedLesson };

function progressItemKeyFor(lesson: ResolvedLesson): string {
  if (lesson.topic) return lesson.topic.id;
  return `${lesson.system.id}/${lesson.section.id}`;
}

function ProgressVideo({
  src,
  onError,
  onComplete,
}: {
  src: string;
  onError: () => void;
  onComplete: () => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !src) return;
    return bindPlaybackProgress(el, onComplete);
  }, [src, onComplete]);

  return (
    <video
      ref={ref}
      className="video"
      controls
      controlsList="nodownload"
      playsInline
      preload="metadata"
      src={src}
      onError={onError}
    />
  );
}

function ProgressAudio({
  src,
  onError,
  onComplete,
}: {
  src: string;
  onError: () => void;
  onComplete: () => void;
}) {
  const ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !src) return;
    return bindPlaybackProgress(el, onComplete);
  }, [src, onComplete]);

  return (
    <audio
      ref={ref}
      className="audio"
      controls
      controlsList="nodownload"
      preload="metadata"
      src={src}
      onError={onError}
    >
      Podcast
    </audio>
  );
}

export function LessonContent({ lesson }: Props) {
  const { section, topic, assetCode, questionnairePath } = lesson;
  const title = topic?.title ?? section.title;
  const breadcrumb = topic ? `${lesson.system.title} › ${section.title}` : lesson.system.title;
  const progressItemKey = progressItemKeyFor(lesson);
  const { trackWatchComplete } = useMediaProgress(progressItemKey);

  const [tab, setTab] = useState<MediaTabId>("video");

  useEffect(() => {
    setTab("video");
  }, [assetCode]);

  const onVideoComplete = () => void trackWatchComplete("V");
  const onPodcastComplete = () => void trackWatchComplete("P");

  const videoPaths = videoPathCandidates(assetCode);
  const audioPaths = podcastPathCandidates(assetCode);
  const imagePaths = infographicPathCandidates(assetCode);
  const qPaths = questionnairePathCandidates(assetCode, questionnairePath);

  const videoKey = videoPaths.map((p) => assetUrl(p)).join("|");
  const audioKey = audioPaths.map((p) => assetUrl(p)).join("|");
  const imageKey = imagePaths.map((p) => assetUrl(p)).join("|");
  const qKey = qPaths.map((p) => assetUrl(p)).join("|");

  return (
    <div className="lesson-view">
      <header className="subchapter-head">
        <p className="eyebrow">{breadcrumb}</p>
        <h2>{title}</h2>
      </header>

      <MediaTabs active={tab} onChange={setTab} />

      <div
        className="media-stage"
        role="tabpanel"
        id={`panel-${tab}`}
        aria-labelledby={`tab-${tab}`}
        onContextMenu={(event) => event.preventDefault()}
      >
        {tab === "video" ? (
          <MediaBlock key={`${assetCode}-v`} urlKey={videoKey} bare>
            {({ onMissing }) => (
              <MediaWithFallback
                paths={videoPaths}
                urlKey={videoKey}
                onExhausted={onMissing}
                render={({ src, onError }) => (
                  <ProgressVideo src={src} onError={onError} onComplete={onVideoComplete} />
                )}
              />
            )}
          </MediaBlock>
        ) : null}

        {tab === "podcast" ? (
          <MediaBlock key={`${assetCode}-p`} urlKey={audioKey} bare>
            {({ onMissing }) => (
              <MediaWithFallback
                paths={audioPaths}
                urlKey={audioKey}
                onExhausted={onMissing}
                render={({ src, onError }) => (
                  <ProgressAudio src={src} onError={onError} onComplete={onPodcastComplete} />
                )}
              />
            )}
          </MediaBlock>
        ) : null}

        {tab === "infographic" ? (
          <MediaBlock key={`${assetCode}-i`} urlKey={imageKey} bare>
            {({ onMissing }) => (
              <MediaWithFallback
                paths={imagePaths}
                urlKey={imageKey}
                onExhausted={onMissing}
                render={({ src, onError }) => (
                  <img
                    className="infographic"
                    src={src}
                    alt={`Infographic: ${title}`}
                    onError={onError}
                  />
                )}
              />
            )}
          </MediaBlock>
        ) : null}

        {tab === "questions" ? (
          <div key={`${assetCode}-q`} className="media-panel media-panel--questions">
            <Questionnaire paths={qPaths} urlKey={qKey} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
