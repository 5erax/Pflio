export const checkpoints = [
  { id: 'hero', label: 'Start', start: 0, end: 0.15 },
  { id: 'about', label: 'About', start: 0.15, end: 0.30 },
  { id: 'stack', label: 'Toolkit', start: 0.30, end: 0.45 },
  { id: 'projects', label: 'Work', start: 0.45, end: 0.75 },
  { id: 'journey', label: 'Journey', start: 0.75, end: 0.88 },
  { id: 'contact', label: 'Contact', start: 0.88, end: 1 },
] as const;
export type Checkpoint = typeof checkpoints[number]['id'];
export const SCROLL_UNITS = 900;
export const HERO_HOLD = checkpoints[0].end - 100 / SCROLL_UNITS;
export const motionTokens = { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const, spring: { stiffness: 170, damping: 25 } };
export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
export function chapterAt(progress: number): Checkpoint {
  return (checkpoints.find(point => clamp(progress) < point.end) ?? checkpoints.at(-1)!).id;
}
export function projectAt(progress: number, count: number) {
  return Math.round(projectPosition(progress, count));
}
export function projectPosition(progress: number, count: number) {
  const range = checkpoints.find(point => point.id === 'projects')!;
  // Finish travelling before the sticky scene leaves the viewport.
  return clamp((progress - range.start - 0.015) / (range.end - range.start - 100 / SCROLL_UNITS - 0.03)) * Math.max(0, count - 1);
}
export function mediaTime(progress: number, duration: number) {
  return clamp(progress) * Math.max(0, duration - 1 / 30);
}
