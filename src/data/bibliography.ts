export type BibliographyEntry = {
  authors: string;
  title: string;
  edition?: string;
  publisher?: string;
  note?: string;
};

export const furtherStudyTitle = "Further study";

export const furtherStudyIntro =
  "When you want to go deeper after a Studio9 lesson, we recommend these books for your own reading — a practical next step alongside your university programme, not a replacement for it.";

export const furtherStudy: BibliographyEntry[] = [
  {
    authors: "Frank H. Netter, MD",
    title: "Atlas of Human Anatomy",
    edition: "8th edition",
    publisher: "Elsevier",
    note: "Excellent for visual revision and regional anatomy.",
  },
  {
    authors: "Standring et al.",
    title: "Gray's Anatomy: The Anatomical Basis of Clinical Practice",
    edition: "39th edition",
    publisher: "Elsevier",
    note: "Comprehensive text for in-depth study and clinical context.",
  },
];
