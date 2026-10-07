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
export const motionTokens = { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const, spring: { stiffness: 170, damping: 25 } };
export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
export function chapterAt(progress: number): Checkpoint {
  return (checkpoints.find(point => clamp(progress) < point.end) ?? checkpoints.at(-1)!).id;
}
export function projectAt(progress: number, count: number) {
  const range = checkpoints.find(point => point.id === 'projects')!;
  return Math.min(count - 1, Math.floor(clamp((progress - range.start) / (range.end - range.start)) * count));
}
export function smoothProgress(current: number, target: number, delta: number) {
  return current + (clamp(target) - current) * (1 - Math.exp(-Math.min(delta, 0.1) * 12));
}
export function mediaTime(progress: number, duration: number) {
  return clamp(progress) * Math.max(0, duration - 1 / 30);
}
