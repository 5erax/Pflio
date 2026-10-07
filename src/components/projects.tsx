'use client';
import { useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import type { Project } from '@/data/portfolio';
import { checkpoints } from '@/lib/timeline';
import { useReducedMotion } from '@/lib/use-reduced-motion';
import { Dialog } from './ui/dialog';

// Adapted from VengeanceUI PerspectiveCarousel, Copyright (c) 2025–2026 Ashutoshx7, MIT.
// https://github.com/Ashutoshx7/VengeanceUI/blob/main/public/r/perspective-carousel.json
// The moving flex track, per-slide perspective, controlled selection, and spring are retained.
// The upstream license is included in THIRD_PARTY_NOTICES.md.

export const WORK_PLATES = [
  { id: 'interface', label: 'Interface', tagline: 'IDENTITY & LAYOUT' },
  { id: 'motion', label: 'Motion', tagline: 'SCROLL & INTERACTION' },
  { id: 'system', label: 'System', tagline: 'SOURCE & STRUCTURE' },
] as const;

function ProjectArtwork({ plateIndex }: { plateIndex: number }) {
  if (plateIndex === 0) return <span className="project-artwork work-plate plate-interface" aria-hidden="true">
    <span className="plate-interface-rule" />
    <span className="plate-interface-copy">A personal space.<br />An independent point of view.</span>
    <span className="plate-interface-mark"><svg viewBox="0 0 200 200" fill="currentColor"><path d="M82 4h36v65l56-32 18 31-56 32 56 32-18 31-56-32v65H82v-65l-56 32-18-31 56-32-56-32 18-31 56 32Z" /></svg></span>
    <span className="plate-interface-brand">astraa</span>
    <span className="plate-interface-note">DESIGNED & BUILT FROM ZERO</span>
  </span>;
  if (plateIndex === 1) {
    const longestCue = Math.max(...checkpoints.map(point => point.end - point.start));
    return <span className="project-artwork work-plate plate-motion" aria-hidden="true">
      <span className="motion-title">scroll<br /><span>is time.</span></span>
      <span className="motion-cues">{checkpoints.map((point, index) => <span className="motion-cue" key={point.id}>
        <span className="motion-cue-number">0{index + 1}</span><span className="motion-cue-name">{point.label}</span>
        <span className="motion-cue-track"><span className="motion-cue-bar" style={{ width: `${(point.end - point.start) / longestCue * 100}%` }} /></span>
        <span className="motion-cue-range">{Math.round((point.end - point.start) * 100)}%</span>
      </span>)}</span>
      <span className="motion-axis"><span>0</span><span>0.25</span><span>0.5</span><span>0.75</span><span>1</span><span className="motion-scrub" style={{ left: 'calc(var(--master-progress, 0) * 100%)' }} /></span>
      <span className="motion-meta"><span>video.meta</span><span>H.264 / BIDIRECTIONAL SEEK</span><span>currentTime ← scroll progress</span></span>
    </span>;
  }
  return <span className="project-artwork work-plate plate-system" aria-hidden="true">
    <span className="system-title">from<br />source.</span>
    <span className="system-stack"><span>Next.js</span><span>React</span><span>TypeScript</span></span>
    <span className="system-tree"><span className="system-file system-root">src/</span>{[
      '├ app/page.tsx', '├ app/globals.css', '├ components/experience.tsx', '├ components/projects.tsx', '└ lib/timeline.ts',
    ].map(file => <span key={file} className="system-file">{file}</span>)}</span>
    <span className="system-note">GSAP / MOTION / LENIS<br />ONE SHARED TIMELINE</span>
  </span>;
}

export function ProjectGallery({ active, select, open }: { active: number; select: (index: number) => void; open: (index: number) => void }) {
  const stage = useRef<HTMLDivElement>(null);
  const pointer = useRef<{ x: number; id: number } | null>(null);
  const dragged = useRef(false);
  const reduce = useReducedMotion();
  const [slideWidth, setSlideWidth] = useState(600);
  const currentIndex = Math.min(Math.max(active, 0), WORK_PLATES.length - 1);
  const selectSlide = (index: number) => select(Math.min(Math.max(index, 0), WORK_PLATES.length - 1));
  const transition = reduce ? { duration: 0 } : { type: 'spring' as const, bounce: 0.14, duration: 0.9 };
  const currentPlate = WORK_PLATES[currentIndex];

  useLayoutEffect(() => {
    const viewport = stage.current;
    if (!viewport) return;
    const measure = () => {
      const width = viewport.getBoundingClientRect().width;
      setSlideWidth(Math.max(96, Math.round(window.innerWidth < 768 ? width * 0.92 : Math.min(1040, width * 0.66))));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  return <div className="work-gallery" role="region" aria-roledescription="carousel" aria-label="Portfolio study views" tabIndex={0} data-cursor="DRAG"
    onKeyDown={event => {
      if (event.defaultPrevented) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); selectSlide(currentIndex + (event.key === 'ArrowRight' ? 1 : -1)); }
      if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); selectSlide(event.key === 'Home' ? 0 : WORK_PLATES.length - 1); }
    }}
    onPointerDown={event => { if (event.button !== 0) return; pointer.current = { x: event.clientX, id: event.pointerId }; dragged.current = false; }}
    onPointerUp={event => {
      if (!pointer.current || pointer.current.id !== event.pointerId) return;
      const distance = event.clientX - pointer.current.x;
      if (Math.abs(distance) > 45) { dragged.current = true; selectSlide(currentIndex + (distance < 0 ? 1 : -1)); }
      pointer.current = null;
    }}
    onPointerCancel={() => { pointer.current = null; }}>
    <div ref={stage} className="gallery-stage" style={{ perspective: '1200px', overflow: 'hidden' }}>
      <motion.div className="perspective-track" style={{ position: 'absolute', left: '50%', top: '50%', y: '-50%', display: 'flex', width: 'max-content', height: '100%', alignItems: 'center' }}
        animate={{ x: -(currentIndex * slideWidth + slideWidth / 2) }} transition={transition}>
        {WORK_PLATES.map((plate, index) => {
          const isActive = currentIndex === index;
          return <div key={plate.id} className="project-slot" style={{ width: slideWidth, height: '100%', flexShrink: 0, perspective: '1200px' }} aria-hidden={!isActive}>
            <motion.div className={`project-slide ${isActive ? 'current' : ''}`}
              animate={{ rotateY: reduce ? 0 : (currentIndex - index) * 38, scale: isActive ? 1 : 0.85 }}
              transition={transition} style={{ transformStyle: 'preserve-3d' }}>
              <motion.div className={`project-visual work-plate-${index}`} whileHover={reduce || !isActive ? undefined : { y: -4 }} transition={transition}>
                <ProjectArtwork plateIndex={index} />
                <span className="project-visual-top"><span>ASTRAA / PERSONAL PORTFOLIO</span><ArrowUpRight size={22} aria-hidden /></span>
                <span className="project-visual-bottom"><span>0{index + 1} / {plate.label.toUpperCase()}</span><span>2026</span></span>
                <button type="button" className="project-open" tabIndex={isActive ? 0 : -1} aria-current={isActive ? 'true' : undefined}
                  aria-label={`${isActive ? 'Explore' : 'Select'} ${plate.label} view of the astraa portfolio`} data-cursor={isActive ? 'OPEN ↗' : 'SELECT'}
                  onClick={() => { if (dragged.current) { dragged.current = false; return; } if (isActive) open(index); else selectSlide(index); }} />
              </motion.div>
            </motion.div>
          </div>;
        })}
      </motion.div>
    </div>
    <div className="project-caption" aria-live="polite" aria-atomic="true">
      <div><span className="mono muted">VIEW 0{currentIndex + 1} / 0{WORK_PLATES.length} <span className="caption-divider">/</span> {currentPlate.tagline}</span><h3>{currentPlate.label}</h3></div>
      <button type="button" className="text-link" onClick={() => open(currentIndex)}>Open project <ArrowUpRight size={20} aria-hidden /></button>
    </div>
    <div className="gallery-controls"><span className="mono muted">ONE BUILD. THREE POINTS OF VIEW.</span><div>
      <button type="button" aria-label="Previous view" disabled={currentIndex === 0} onClick={() => selectSlide(currentIndex - 1)}><ArrowLeft size={22} aria-hidden /></button>
      <span className="gallery-dots">{WORK_PLATES.map((plate, index) => <button type="button" key={plate.id} aria-label={`Select ${plate.label} view`} aria-pressed={currentIndex === index} onClick={() => selectSlide(index)} />)}</span>
      <button type="button" aria-label="Next view" disabled={currentIndex === WORK_PLATES.length - 1} onClick={() => selectSlide(currentIndex + 1)}><ArrowRight size={22} aria-hidden /></button>
    </div></div>
  </div>;
}

export function ProjectDetail({ project, plateIndex = 0, close, onOpen }: { project: Project | null; plateIndex?: number; close: () => void; onOpen: (open: boolean) => void }) {
  const index = Math.min(Math.max(plateIndex, 0), WORK_PLATES.length - 1);
  const plate = WORK_PLATES[index];
  return <Dialog open={Boolean(project)} onClose={close} titleId="case-study-title" onOpen={onOpen}>
    {project && <article className="case-study">
      <div className="case-heading"><span className="case-number mono">01 / PERSONAL PROJECT</span><div className="case-header-copy"><p className="mono accent">{project.status} / {project.year}</p><h2 id="case-study-title">{project.name}</h2><p className="case-intro">{project.description}</p></div></div>
      <p className="case-plate-label mono">0{index + 1} / {plate.label.toUpperCase()} STUDY</p>
      <div className="case-image"><ProjectArtwork plateIndex={index} /></div>
      <dl className="case-meta">{[['Role', project.role], ['Year', project.year], ['Stack', project.technologies.join(' / ')], ['Status', project.status]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      <div className="case-sections">{[['Challenge', project.challenge], ['Solution', project.solution], ['Implementation', project.implementation], ['Result', project.result]].map(([label, text], sectionIndex) => <section key={label}><span className="case-section-number mono">0{sectionIndex + 1}</span><h3>{label}</h3><p>{text}</p></section>)}</div>
      <div className="case-links">{project.repositoryUrl && <a className="text-link" href={project.repositoryUrl} target="_blank" rel="noreferrer">View repository <ArrowUpRight aria-hidden /></a>}{project.liveUrl && <a className="text-link" href={project.liveUrl} target="_blank" rel="noreferrer">Visit project <ArrowUpRight aria-hidden /></a>}</div>
    </article>}
  </Dialog>;
}
