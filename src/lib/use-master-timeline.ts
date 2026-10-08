'use client';
import { useEffect, useRef, useState } from 'react';
import type Lenis from 'lenis';
import { checkpoints, chapterAt, mediaTime, projectAt, SCROLL_UNITS, type Checkpoint } from './timeline';

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
          for (const entry of entries) {
            if (entry.isIntersecting) setChapter(entry.target.id as Checkpoint);
            if (entry.target.id === 'hero' && !entry.isIntersecting) element?.pause();
          }
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
      if (loadVideo && element) { element.pause(); element.loop = false; element.preload = 'auto'; element.style.display = ''; delete element.dataset.ready; element.src = '/media/anime-eye.mp4'; element.load(); }
      let lastChapter: Checkpoint = 'hero'; let lastProject = 0;
      const workRange = checkpoints.find(point => point.id === 'projects')!;
      lenis.current = new LenisController({ lerp: 0.12, smoothWheel: true, syncTouch: false });
      lenis.current.on('scroll', ScrollTrigger.update);
      gsap.ticker.lagSmoothing(0);
      const drive = (time: number) => {
        if (document.hidden) return;
        lenis.current?.raf(time * 1000);
        if (loadVideo && element && element.readyState >= 2 && Number.isFinite(element.duration) && !element.seeking) {
          const heldHero = checkpoints[0].end - 1 / SCROLL_UNITS * 100;
          const target = mediaTime(Math.min(1, progress.current / heldHero), element.duration);
          if (Math.abs(element.currentTime - target) > 1 / 60) element.currentTime = target;
        }
      };
      gsap.ticker.add(drive);
      const context = gsap.context(() => {
        // Lenis provides the easing; every scroll transform follows its exact position.
        const sequence = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true, onUpdate: self => {
          progress.current = self.progress;
          const next = chapterAt(self.progress);
          if (next !== lastChapter) { lastChapter = next; setChapter(next); }
          const nextProject = projectAt(self.progress, projectCount);
          if (self.progress >= workRange.start && self.progress <= workRange.end && nextProject !== lastProject) { lastProject = nextProject; setProject(nextProject); }
        } } });
        progress.current = sequence.scrollTrigger!.progress;
        // GSAP owns scene transforms. Motion owns only nested interaction elements.
        // Static manga masks ride a reversible camera; the text remains readable.
        const slotWidth = () => root.current?.querySelector<HTMLElement>('.project-slot')?.offsetWidth ?? 600;
        gsap.set('.project-slide', { rotateY: 0, scale: 1 });
        sequence.fromTo('.perspective-track', { x: () => -slotWidth() / 2 }, {
          x: () => -(projectCount - 0.5) * slotWidth(),
          duration: workRange.end - workRange.start - 100 / SCROLL_UNITS - 0.03, ease: 'none',
        }, workRange.start + 0.015);
        const heldHero = checkpoints[0].end - 100 / SCROLL_UNITS;
        sequence.to('.anime-city img', { scale: 1.02, xPercent: -6, duration: heldHero, ease: 'none' }, 0)
          .to('.anime-film', { rotation: 0, yPercent: -55, xPercent: 8, scale: 1.06, duration: heldHero, ease: 'none' }, 0)
          .to('.anime-index', { yPercent: 30, duration: heldHero, ease: 'none' }, 0);
        checkpoints.slice(1).forEach(point => {
          const scene = root.current?.querySelector(`#${point.id} .scene`);
          if (!scene) return;
          // A diagonal match cut clears as the next scene reaches the viewport top.
          sequence.to(scene.querySelectorAll('.chapter-seam > span'), {
            xPercent: index => index % 2 ? 125 : -125,
            duration: 100 / SCROLL_UNITS, ease: 'power2.inOut',
          }, Math.max(0, point.start - 100 / SCROLL_UNITS));
        });
        sequence.from('.about-art-image img', { yPercent: 12, scale: 1.12, duration: 0.07, ease: 'none' }, 0.08)
          .from('.about-intro', { y: 36, duration: 0.07, ease: 'none' }, 0.08);
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
      const position = (range.start + 0.015 + next / Math.max(1, projectCount - 1) * (range.end - range.start - 100 / SCROLL_UNITS - 0.03)) * (document.documentElement.scrollHeight - innerHeight);
      lenis.current?.scrollTo(position);
    }
  }
  return { root, video, chapter, project, cinematic, navigate, selectProject, lenis };
}
