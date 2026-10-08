'use client';
import { useEffect, useRef, useState } from 'react';
import type Lenis from 'lenis';
import { checkpoints, chapterAt, mediaTime, projectAt, smoothProgress, SCROLL_UNITS, type Checkpoint } from './timeline';

export function useMasterTimeline(projectCount: number) {
  const root = useRef<HTMLElement>(null); const video = useRef<HTMLVideoElement>(null);
  const progress = useRef(0); const lenis = useRef<Lenis | null>(null);
  const [chapter, setChapter] = useState<Checkpoint>('hero'); const [project, setProject] = useState(0);
  const [cinematic, setCinematic] = useState(false);

  useEffect(() => {
    const desktop = matchMedia('(min-width: 1024px)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let generation = 0; let dispose: (() => void) | undefined;
    const setup = async () => {
      const run = ++generation;
      dispose?.(); dispose = undefined;
      const enhanced = desktop.matches && !reduced.matches;
      root.current?.classList.toggle('cinematic', enhanced); setCinematic(enhanced);
      const element = video.current;
      if (!enhanced) {
        if (element) { element.removeAttribute('src'); element.load(); }
        const observer = new IntersectionObserver(entries => {
          for (const entry of entries) if (entry.isIntersecting) setChapter(entry.target.id as Checkpoint);
        }, { rootMargin: '-25% 0px -50% 0px' });
        root.current?.querySelectorAll('section[data-chapter]').forEach(section => observer.observe(section));
        dispose = () => observer.disconnect();
        return;
      }

      // Desktop-only libraries stay out of the mobile/reduced-motion critical path.
      const [{ default: gsap }, { ScrollTrigger }, { default: LenisController }] = await Promise.all([
        import('gsap'), import('gsap/ScrollTrigger'), import('lenis'),
      ]);
      if (run !== generation) return;
      gsap.registerPlugin(ScrollTrigger);
      const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
      const loadVideo = !connection?.saveData && connection?.effectiveType !== '2g';
      if (loadVideo && element) { element.style.display = ''; element.src = '/media/study.mp4'; element.load(); }
      let lastChapter: Checkpoint = 'hero'; let lastProject = 0;
      let current = 0; let previousTime = 0;
      const workRange = checkpoints.find(point => point.id === 'projects')!;
      lenis.current = new LenisController({ duration: 0.9, smoothWheel: true, syncTouch: false });
      lenis.current.on('scroll', ScrollTrigger.update);
      const drive = (time: number) => {
        if (document.hidden) { previousTime = time; return; }
        lenis.current?.raf(time * 1000);
        const delta = previousTime ? time - previousTime : 1 / 60; previousTime = time;
        if (Math.abs(progress.current - current) >= 0.0001) {
          current = smoothProgress(current, progress.current, delta);
          document.documentElement.style.setProperty('--master-progress', `${current}`);
        }
        if (loadVideo && element && element.readyState >= 2 && Number.isFinite(element.duration) && !element.seeking) {
          const heldHero = checkpoints[0].end - 1 / SCROLL_UNITS * 100;
          const target = mediaTime(Math.min(1, current / heldHero), element.duration);
          if (Math.abs(element.currentTime - target) > 1 / 60) element.currentTime = target;
        }
      };
      gsap.ticker.add(drive);
      const context = gsap.context(() => {
        const master = ScrollTrigger.create({ trigger: root.current, start: 'top top', end: 'bottom bottom', onUpdate: self => {
          progress.current = self.progress;
          const next = chapterAt(self.progress);
          if (next !== lastChapter) { lastChapter = next; setChapter(next); }
          const nextProject = projectAt(self.progress, projectCount);
          if (self.progress >= workRange.start && self.progress <= workRange.end && nextProject !== lastProject) { lastProject = nextProject; setProject(nextProject); }
        } });
        progress.current = master.progress;
        // GSAP owns scene transforms. Motion owns only nested interaction elements.
        // Registration drift: five cuts of the same word separate, then find one axis.
        // Every authored scroll effect belongs to this seekable, reversible timeline.
        const sequence = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.35 } });
        const offsets = [-18, 13, -9, 21, -14];
        gsap.utils.toArray<HTMLElement>('.name-band').forEach((band, index) => {
          sequence.to(band, { xPercent: offsets[index], rotationY: index % 2 ? -18 : 18, duration: 0.014, ease: 'none' }, 0.003)
            .to(band, { xPercent: 0, rotationY: 0, duration: 0.016, ease: 'power2.inOut' }, 0.017)
            .to(band, { xPercent: index % 2 ? 100 : -100, duration: 0.06, ease: 'power2.inOut' }, 0.05);
        });
        sequence.to('.study-aperture', { rotation: 0, xPercent: -28, duration: 0.039, ease: 'none' }, 0)
          .to('.cover-intro', { clipPath: 'inset(0 100% 0 0)', duration: 0.041, ease: 'none' }, 0.109);
        checkpoints.slice(1).forEach(point => {
          const scene = root.current?.querySelector(`#${point.id} .scene`);
          if (!scene) return;
          // Alternating paper cuts reveal the next surface without fading the content.
          sequence.to(scene.querySelectorAll('.chapter-seam > span'), {
            yPercent: index => index % 2 ? -105 : 105,
            stagger: { each: 0.003, from: 'center' }, duration: 0.035, ease: 'power2.inOut',
          }, Math.max(0, point.start - 0.07));
        });
        sequence.from('.about-intro', { clipPath: 'inset(0 100% 0 0)', duration: 0.04, ease: 'power2.inOut' }, 0.11)
          .from('.about-strip', { xPercent: -110, duration: 0.04, ease: 'power2.inOut' }, 0.11)
          .from('.toolkit-panel', { clipPath: 'inset(0 0 100% 0)', duration: 0.045, ease: 'power2.inOut' }, 0.255)
          .from('.work-heading', { clipPath: 'inset(0 100% 0 0)', duration: 0.04, ease: 'power2.inOut' }, 0.405)
          .from('.field-reading', { clipPath: 'inset(0 100% 0 0)', duration: 0.045, ease: 'power2.inOut' }, 0.705)
          .from('.contact-scene', { clipPath: 'inset(0 0 100% 0)', duration: 0.045, ease: 'power2.inOut' }, 0.835);
        gsap.utils.toArray<SVGPathElement>('.origin-mark .identity-fold').forEach((fold, index) => {
          sequence.from(fold, { x: [-65, 65, -20][index], y: [25, -25, 80][index], duration: 0.04, ease: 'power2.inOut' }, 0.095 + index * 0.007)
            .to(fold, { x: [60, -60, 0][index], y: [0, 0, -80][index], duration: 0.04, ease: 'none' }, 0.26);
        });
        sequence.from('.contact-mark', { rotation: -30, xPercent: 45, duration: 0.12, ease: 'power2.inOut' }, 0.82)
          .to({}, { duration: 0.04 }, 0.96);
        ScrollTrigger.refresh();
      }, root);
      dispose = () => { context.revert(); gsap.ticker.remove(drive); lenis.current?.destroy(); lenis.current = null; };
    };
    void setup(); desktop.addEventListener('change', setup); reduced.addEventListener('change', setup);
    return () => { generation++; dispose?.(); desktop.removeEventListener('change', setup); reduced.removeEventListener('change', setup); };
  }, [projectCount]);

  function navigate(id: Checkpoint) {
    const section = document.getElementById(id);
    if (!section) return;
    const position = cinematic ? checkpoints.find(point => point.id === id)!.start * (document.documentElement.scrollHeight - innerHeight) : section.offsetTop;
    if (lenis.current) lenis.current.scrollTo(position);
    else window.scrollTo({ top: position, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  function selectProject(index: number) {
    const next = Math.max(0, Math.min(projectCount - 1, index)); setProject(next);
    if (cinematic) {
      const range = checkpoints.find(point => point.id === 'projects')!;
      const position = (range.start + (next + 0.35) / projectCount * (range.end - range.start)) * (document.documentElement.scrollHeight - innerHeight);
      lenis.current?.scrollTo(position);
    }
  }
  return { root, video, chapter, project, cinematic, navigate, selectProject, lenis };
}
