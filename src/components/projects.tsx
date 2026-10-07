'use client';
import { useReducedMotion } from '@/lib/use-reduced-motion';
import Image from 'next/image';
import { useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import { projects, type Project } from '@/data/portfolio';
import { Dialog } from './ui/dialog';

// Adapted from VengeanceUI PerspectiveCarousel, Copyright (c) 2025–2026 Ashutoshx7, MIT.
// https://github.com/Ashutoshx7/VengeanceUI/blob/main/public/r/perspective-carousel.json
// The moving flex track, per-slide perspective, controlled selection, and spring are retained.
// The upstream license is included in THIRD_PARTY_NOTICES.md.

function ProjectArtwork({ project }: { project: Project }) {
  const index = projects.findIndex(item => item.slug === project.slug);
  if (index === 0) return <span className="project-artwork portfolio-preview" aria-hidden="true">
    <span className="preview-bar"><span className="preview-window-dots"><i /><i /><i /></span><span>ASTRAA / PERSONAL PORTFOLIO</span><ArrowUpRight size={14} /></span>
    <span className="preview-screen">
      <span className="preview-orb"><Image src={project.cover} alt="" fill sizes="(max-width: 767px) 90vw, 60vw" draggable={false} /></span>
      <span className="preview-wordmark">astraa<span>✳</span></span>
      <span className="preview-marker">01 — THE STARTING POINT</span>
      <span className="preview-title">CREATIVE<br /><i>DEVELOPER.</i></span>
      <span className="preview-footer"><span>Starting from zero.<br />Learning by making.</span><span className="preview-mini-dock"><i /><i /><i /><i /><i /><i /></span></span>
    </span>
  </span>;
  if (index === 1) return <span className="project-artwork pending-study" aria-hidden="true">
    <span className="study-grid" /><span className="study-tag">UNWRITTEN / 02</span>
    <span className="study-orbit"><i /><i /><i /><span>✳</span></span>
    <span className="study-display">what<br /><i>if?</i></span>
    <span className="study-note">A future experiment.<br />The idea is still taking shape.</span>
  </span>;
  return <span className="project-artwork canvas-study" aria-hidden="true">
    <span className="canvas-lines" /><span className="study-tag">RESERVED / 03</span>
    <span className="canvas-cross"><i /><i /></span>
    <span className="study-display">an open<br /><i>canvas.</i></span>
    <span className="study-note">Space for the next first step.<br />No project to show here yet.</span>
  </span>;
}

export function ProjectGallery({ active, select, open }: { active: number; select: (index: number) => void; open: (index: number) => void }) {
  const stage = useRef<HTMLDivElement>(null);
  const pointer = useRef<{ x: number; id: number } | null>(null);
  const dragged = useRef(false);
  const reduce = useReducedMotion();
  const [slideWidth, setSlideWidth] = useState(600);
  const currentIndex = Math.min(Math.max(active, 0), projects.length - 1);
  const selectSlide = (index: number) => select(Math.min(Math.max(index, 0), projects.length - 1));
  const transition = reduce ? { duration: 0 } : { type: 'spring' as const, bounce: 0.14, duration: 0.9 };

  useLayoutEffect(() => {
    const viewport = stage.current;
    if (!viewport) return;
    const measure = () => {
      const width = viewport.getBoundingClientRect().width;
      setSlideWidth(Math.max(96, Math.round(window.innerWidth < 768 ? width * 0.9 : Math.min(750, width * 0.66))));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  return <div className="work-gallery" role="region" aria-roledescription="carousel" aria-label="Project gallery" tabIndex={0} data-cursor="DRAG"
    onKeyDown={event => {
      if (event.defaultPrevented) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); selectSlide(currentIndex + (event.key === 'ArrowRight' ? 1 : -1)); }
      if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); selectSlide(event.key === 'Home' ? 0 : projects.length - 1); }
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
        {projects.map((project, index) => {
          const isActive = currentIndex === index;
          return <div key={project.slug} className="project-slot" style={{ width: slideWidth, height: '100%', flexShrink: 0, perspective: '1200px' }} aria-hidden={!isActive}>
            <motion.div className={`project-slide ${isActive ? 'current' : ''}`}
              animate={{ rotateY: reduce ? 0 : (currentIndex - index) * 38, scale: isActive ? 1 : 0.85 }}
              transition={transition} style={{ transformStyle: 'preserve-3d' }}>
              <motion.button type="button" className={`project-visual artwork-${index}`} whileHover={reduce || !isActive ? undefined : { y: -4 }} transition={transition}
                tabIndex={isActive ? 0 : -1} aria-current={isActive ? 'true' : undefined} aria-label={`${isActive ? 'Explore' : 'Select'} ${project.name}. ${project.pending ? 'Pending project' : 'Personal experiment'}. 0${index + 1}`}
                data-cursor={isActive ? 'EXPLORE ↗' : 'SELECT'}
                onClick={() => { if (dragged.current) { dragged.current = false; return; } if (isActive) open(index); else selectSlide(index); }}>
                <ProjectArtwork project={project} />
                <span className="project-visual-top"><span>{project.pending ? 'PENDING PROJECT' : 'PERSONAL EXPERIMENT'}</span><ArrowUpRight size={22} aria-hidden /></span>
                <span className="project-visual-bottom"><span>{project.pending ? 'A SPACE FOR FUTURE WORK' : 'PORTFOLIO://EXPERIENCE'}</span><span>0{index + 1}</span></span>
              </motion.button>
            </motion.div>
          </div>;
        })}
      </motion.div>
    </div>
    <div className="project-caption" aria-live="polite" aria-atomic="true">
      <div><span className="mono muted">0{currentIndex + 1} / 0{projects.length} <span className="caption-divider">/</span> {projects[currentIndex].tagline}</span><h3>{projects[currentIndex].name}</h3></div>
      <button type="button" className="text-link" onClick={() => open(currentIndex)}>Explore {projects[currentIndex].pending ? 'the space' : 'project'} <ArrowUpRight size={20} aria-hidden /></button>
    </div>
    <div className="gallery-controls"><span className="mono muted">SCROLL, DRAG OR USE THE ARROWS</span><div>
      <button type="button" aria-label="Previous project" disabled={currentIndex === 0} onClick={() => selectSlide(currentIndex - 1)}><ArrowLeft size={22} aria-hidden /></button>
      <span className="gallery-dots">{projects.map((project, index) => <button type="button" key={project.slug} aria-label={`Select project ${index + 1}`} aria-pressed={currentIndex === index} onClick={() => selectSlide(index)} />)}</span>
      <button type="button" aria-label="Next project" disabled={currentIndex === projects.length - 1} onClick={() => selectSlide(currentIndex + 1)}><ArrowRight size={22} aria-hidden /></button>
    </div></div>
  </div>;
}

export function ProjectDetail({ project, close, onOpen }: { project: Project | null; close: () => void; onOpen: (open: boolean) => void }) {
  const index = project ? projects.findIndex(item => item.slug === project.slug) : 0;
  return <Dialog open={Boolean(project)} onClose={close} titleId="case-study-title" onOpen={onOpen}>
    {project && <article className="case-study">
      <div className="case-heading"><span className="case-number mono">0{index + 1} / EXPERIMENT LOG</span><div className="case-header-copy"><p className="mono accent">{project.status} / {project.year}</p><h2 id="case-study-title">{project.name}</h2><p className="case-intro">{project.description}</p></div></div>
      <div className="case-image"><ProjectArtwork project={project} /></div>
      <dl className="case-meta">{[['Role', project.role], ['Year', project.year], ['Stack', project.technologies.join(' / ') || 'Pending'], ['Status', project.status]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      <div className="case-sections">{[['Challenge', project.challenge], ['Solution', project.solution], ['Implementation', project.implementation], ['Result', project.result]].map(([label, text], sectionIndex) => <section key={label}><span className="case-section-number mono">0{sectionIndex + 1}</span><h3>{label}</h3><p>{text}</p></section>)}</div>
      <div className="case-links">{project.repositoryUrl && <a className="text-link" href={project.repositoryUrl} target="_blank" rel="noreferrer">View repository <ArrowUpRight aria-hidden /></a>}{project.liveUrl && <a className="text-link" href={project.liveUrl} target="_blank" rel="noreferrer">Visit project <ArrowUpRight aria-hidden /></a>}</div>
    </article>}
  </Dialog>;
}
