'use client';
import { useEffect, useRef, useState } from 'react';
import type Lenis from 'lenis';
import { checkpoints, chapterAt, mediaTime, projectAt, smoothProgress, type Checkpoint } from './timeline';

export function useMasterTimeline(projectCount: number) {
  const root = useRef<HTMLElement>(null); const video = useRef<HTMLVideoElement>(null);
  const progress = useRef(0); const lenis = useRef<Lenis | null>(null);
  const [chapter, setChapter] = useState<Checkpoint>('hero'); const [project, setProject] = useState(0);
  const [ready, setReady] = useState(false); const [cinematic, setCinematic] = useState(false);

  useEffect(() => {
    const desktop = matchMedia('(min-width: 1024px)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let generation = 0; let dispose: (() => void) | undefined;
    let boot = 0;
    const setup = async () => {
      const run = ++generation;
      dispose?.(); dispose = undefined; window.clearTimeout(boot);
      const enhanced = desktop.matches && !reduced.matches;
      root.current?.classList.toggle('cinematic', enhanced); setCinematic(enhanced);
      let visited = false;
      try { visited = Boolean(sessionStorage.getItem('astraa-visited')); sessionStorage.setItem('astraa-visited', '1'); }
      catch { /* Private browsing can disable storage; the experience still works. */ }
      boot = window.setTimeout(() => setReady(true), enhanced && !visited ? 850 : 150);
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
      if (loadVideo && element) { element.style.display = ''; element.src = '/media/orbital.mp4'; element.load(); }
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
          const target = mediaTime(current, element.duration);
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
        gsap.from('.hero-word', { yPercent: 110, duration: 1.15, stagger: 0.12, ease: 'power4.out', delay: 0.4 });
        gsap.from('.hero-meta', { opacity: 0, y: 12, duration: 0.7, stagger: 0.1, delay: 0.85 });
        const shade = element?.parentElement?.querySelector('.world-shade');
        const heroEnd = checkpoints.find(point => point.id === 'hero')!.end;
        const stackEnd = checkpoints.find(point => point.id === 'stack')!.end;
        const contactStart = checkpoints.find(point => point.id === 'contact')!.start;
        gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.55 } })
          .to('.hero-line-one', { xPercent: -28, opacity: 0, ease: 'none', duration: heroEnd * 0.6 }, heroEnd * 0.4)
          .to('.hero-line-two', { xPercent: 22, opacity: 0, ease: 'none', duration: heroEnd * 0.6 }, heroEnd * 0.4)
          .to(shade ?? [], { opacity: 0.75, duration: heroEnd * 2 / 3, ease: 'none' }, heroEnd * 2 / 3)
          .to('.orbit-field', { scale: 1.25, opacity: 0, duration: 0.04, ease: 'none' }, stackEnd - 0.04)
          .to(shade ?? [], { opacity: 0.35, duration: 0.08, ease: 'none' }, contactStart)
          .to({}, { duration: 0.04 }, 0.96);
        ScrollTrigger.refresh();
      }, root);
      dispose = () => { context.revert(); gsap.ticker.remove(drive); lenis.current?.destroy(); lenis.current = null; };
    };
    void setup(); desktop.addEventListener('change', setup); reduced.addEventListener('change', setup);
    return () => { generation++; window.clearTimeout(boot); dispose?.(); desktop.removeEventListener('change', setup); reduced.removeEventListener('change', setup); };
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
  return { root, video, chapter, project, ready, cinematic, navigate, selectProject, lenis };
}
