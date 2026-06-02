import { mediaAssetStem } from "../data/curriculum";

function stemsFor(assetCode: string): string[] {
  const mapped = mediaAssetStem(assetCode);
  return mapped === assetCode ? [assetCode] : [mapped, assetCode];
}

function unique(paths: string[]): string[] {
  return [...new Set(paths)];
}

export function videoPathCandidates(assetCode: string): string[] {
  const out: string[] = [];
  for (const stem of stemsFor(assetCode)) {
    if (stem === "LS_A_JD") {
      out.push(`/${stem}_Dx.mp4`);
      continue;
    }
    if (stem.startsWith("LS_AT_") || stem.startsWith("CLS_")) {
      out.push(`/${stem}_V.mp4`, `/${stem}_Vx.mp4`);
      continue;
    }
    out.push(`/${stem}_Vx.mp4`, `/${stem}_V.mp4`);
  }
  return unique(out);
}

export function podcastPathCandidates(assetCode: string): string[] {
  return unique(stemsFor(assetCode).map((stem) => `/${stem}_P.m4a`));
}

export function infographicPathCandidates(assetCode: string): string[] {
  const out: string[] = [];
  for (const stem of stemsFor(assetCode)) {
    out.push(`/${stem}_I.png`, `/${stem}_II.png`);
  }
  return unique(out);
}

export function questionnairePathCandidates(
  assetCode: string,
  override?: string,
): string[] {
  if (override) return [override];
  return unique(stemsFor(assetCode).map((stem) => `/${stem}_Q.csv`));
}
