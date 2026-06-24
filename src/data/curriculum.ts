/** Leaf lesson — `assetCode` is the curriculum label (e.g. LS_OS_SK); files use `mediaAssetStem()`. */
export type Topic = {
  id: string;
  title: string;
  assetCode: string;
  questionnairePath?: string;
};

/** Section with nested topics, or a single leaf when `topics` is omitted. */
export type Section = {
  id: string;
  title: string;
  topics?: Topic[];
  assetCode?: string;
  questionnairePath?: string;
};

export type System = {
  id: string;
  title: string;
  /** Chapter bar colour (Moral Philosophy palette). */
  color: string;
  sections: Section[];
};

export const courseTitle = "Human Anatomy I";

export const systems: System[] = [
  {
    id: "ls",
    title: "Locomotor System",
    color: "#14213d",
    sections: [
      {
        id: "ls-at",
        title: "Anatomical Terminology",
        topics: [
          { id: "ls-at-sec", title: "Sections", assetCode: "LS_AT_S" },
          { id: "ls-at-loc", title: "Localization", assetCode: "LS_AT_L" },
          { id: "ls-at-mt", title: "Movement terms", assetCode: "LS_AT_MT" },
        ],
      },
      {
        id: "ls-os",
        title: "Osteology",
        topics: [
          { id: "ls-os-sk", title: "Skull", assetCode: "LS_OS_SK" },
          { id: "ls-os-as", title: "Axial skeleton", assetCode: "LS_OS_AS" },
          { id: "ls-os-aps", title: "Appendicular skeleton", assetCode: "LS_OS_APS" },
        ],
      },
      {
        id: "ls-ar",
        title: "Arthrology",
        topics: [
          { id: "ls-ar-jd", title: "Joint dynamics", assetCode: "LS_AR_JD" },
          { id: "ls-ar-vc", title: "Vertebral column", assetCode: "LS_AR_VC" },
          { id: "ls-ar-thx", title: "Thorax", assetCode: "LS_AR_THX" },
          { id: "ls-ar-lim", title: "Limbs", assetCode: "LS_AR_LIM" },
        ],
      },
      {
        id: "ls-my",
        title: "Myology",
        topics: [
          { id: "ls-my-ntm", title: "Neck and trunk muscles", assetCode: "LS_MY_NTM" },
          { id: "ls-my-cam", title: "Chest and abdomen muscles", assetCode: "LS_MY_CAM" },
          { id: "ls-my-lm", title: "Limb muscles", assetCode: "LS_MY_LM" },
        ],
      },
    ],
  },
  {
    id: "cls",
    title: "Cardiovascular and Lymphatic Systems",
    color: "#2d4636",
    sections: [
      {
        id: "cls-ph",
        title: "Pericardium and heart",
        assetCode: "CLS_PH",
        questionnairePath: "/CLS_PH_Q.csv",
      },
      {
        id: "cls-cabv",
        title: "Chest and abdomen blood vessels",
        assetCode: "CLS_CABV",
        questionnairePath: "/CLS_CABV_Q.csv",
      },
      {
        id: "cls-hnv",
        title: "Head and neck vessels",
        assetCode: "CLS_HNV",
        questionnairePath: "/CLS_HNV_Q.csv",
      },
    ],
  },
  {
    id: "rs",
    title: "Respiratory System and Cavities",
    color: "#d36b31",
    sections: [
      {
        id: "rs-oc",
        title: "Oral Cavity",
        topics: [
          { id: "rs-oc-tt", title: "Teeth and tongue", assetCode: "RS_OC_TT" },
          { id: "rs-oc-sg", title: "Salivary glands", assetCode: "RS_OC_SG" },
          { id: "rs-oc-fm", title: "Face muscles", assetCode: "RS_OC_FM" },
        ],
      },
      {
        id: "rs-ncs",
        title: "Nasal cavity and sinuses",
        assetCode: "RS_NCS",
      },
      {
        id: "rs-pl",
        title: "Pharynx and larynx",
        assetCode: "RS_PL",
      },
      {
        id: "rs-tl",
        title: "Trachea and lungs",
        assetCode: "RS_TL",
      },
      {
        id: "rs-pm",
        title: "Pleura and mediastinum",
        assetCode: "RS_PM",
      },
    ],
  },
];

export type ResolvedLesson = {
  system: System;
  section: Section;
  topic: Topic | null;
  assetCode: string;
  questionnairePath?: string;
};

export function sectionHasTopics(section: Section): boolean {
  return (section.topics?.length ?? 0) > 0;
}

export function resolveLesson(
  systemId: string,
  sectionId: string,
  topicId: string | null,
): ResolvedLesson | null {
  const system = systems.find((s) => s.id === systemId);
  if (!system) return null;
  const section = system.sections.find((sec) => sec.id === sectionId);
  if (!section) return null;

  if (sectionHasTopics(section)) {
    if (!topicId) return null;
    const topic = section.topics!.find((t) => t.id === topicId);
    if (!topic) return null;
    return {
      system,
      section,
      topic,
      assetCode: topic.assetCode,
      questionnairePath: topic.questionnairePath ?? section.questionnairePath,
    };
  }

  if (topicId !== null) return null;
  if (!section.assetCode) return null;
  return {
    system,
    section,
    topic: null,
    assetCode: section.assetCode,
    questionnairePath: section.questionnairePath,
  };
}

/** Curriculum label → filename stem in `public/`. */
const MEDIA_STEM: Record<string, string> = {
  LS_OS_SK: "LS_O_S",
  // File stems were swapped on disk: AS_* holds appendicular, APS_* holds axial.
  LS_OS_AS: "LS_O_APS",
  LS_OS_APS: "LS_O_AS",
  LS_AR_JD: "LS_A_JD",
  LS_AR_VC: "LS_A_VC",
  LS_AR_THX: "LS_A_T",
  LS_AR_LIM: "LS_A_L",
  LS_MY_NTM: "LS_M_NTM",
  LS_MY_CAM: "LS_M_CAM",
  LS_MY_LM: "LS_M_LM",
  RS_OC_TT: "RSC_OC_TT",
  RS_OC_SG: "RSC_OC_SG",
  RS_OC_FM: "RSC_OC_FM",
  RS_NCS: "RSC_NCS",
  RS_PL: "RSC_PL",
  RS_TL: "RSC_TL",
  RS_PM: "RSC_PM",
};

export function mediaAssetStem(assetCode: string): string {
  return MEDIA_STEM[assetCode] ?? assetCode;
}

export function videoUrl(assetCode: string): string {
  const stem = mediaAssetStem(assetCode);
  if (stem === "LS_A_JD") return `/${stem}_Dx.mp4`;
  if (stem.startsWith("LS_AT_") || stem.startsWith("CLS_")) {
    return `/${stem}_V.mp4`;
  }
  return `/${stem}_Vx.mp4`;
}

export function podcastUrl(assetCode: string): string {
  return `/${mediaAssetStem(assetCode)}_P.m4a`;
}

export function infographicUrl(assetCode: string): string {
  return `/${mediaAssetStem(assetCode)}_I.png`;
}

export function questionnairePathFor(
  assetCode: string,
  override?: string,
): string {
  if (override) return override;
  return `/${mediaAssetStem(assetCode)}_Q.csv`;
}
