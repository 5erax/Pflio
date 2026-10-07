'use client';
import Image from 'next/image';
import { useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import { projects, type Project } from '@/data/portfolio';
import { Dialog } from './ui/dialog';
import { motionTokens } from '@/lib/timeline';

export function ProjectGallery({ active, select, open }: { active: number; select: (index: number) => void; open: (index: number) => void }) {
  const pointer = useRef<{ x: number; id: number } | null>(null);
  const dragged = useRef(false); const reduce = useReducedMotion();
  return <div className="work-gallery" role="region" aria-label="Project gallery" tabIndex={0} data-cursor="DRAG"
    onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); select(active + (event.key === 'ArrowRight' ? 1 : -1)); } }}
    onPointerDown={event => { pointer.current = { x: event.clientX, id: event.pointerId }; dragged.current = false; }}
    onPointerUp={event => { if (!pointer.current || pointer.current.id !== event.pointerId) return; const distance = event.clientX - pointer.current.x; if (Math.abs(distance) > 45) { dragged.current = true; select(active + (distance < 0 ? 1 : -1)); } pointer.current = null; }}
    onPointerCancel={() => { pointer.current = null; }}>
    <div className="gallery-stage">
      {projects.map((project, index) => {
        const offset = index - active;
        return <motion.div key={project.slug} className={`project-slide ${offset === 0 ? 'current' : ''}`} aria-hidden={Math.abs(offset) > 1}
          animate={{ x: reduce ? 0 : `${offset * 76}%`, rotateY: reduce ? 0 : offset === 0 ? 0 : offset < 0 ? 28 : -28, scale: offset === 0 ? 1 : 0.78, opacity: offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.35 : 0 }}
          style={{ zIndex: offset === 0 ? 2 : 1, pointerEvents: Math.abs(offset) > 1 ? 'none' : 'auto', visibility: reduce && offset !== 0 ? 'hidden' : 'visible' }}
          transition={{ duration: reduce ? 0 : 0.65, ease: motionTokens.ease }}>
          <motion.button className={`project-visual artwork-${index}`} whileHover={reduce ? undefined : { scale: 0.985 }} transition={{ duration: motionTokens.duration }} tabIndex={offset === 0 ? 0 : -1} aria-label={`${offset === 0 ? 'Explore' : 'Select'} ${project.name}. ${project.pending ? 'Pending project' : 'Personal experiment'}. ${index === 0 ? 'First contact. Portfolio://Experience' : index === 1 ? 'What if? A space for future work' : 'Empty canvas. A space for future work'}. 0${index + 1}`} data-cursor="EXPLORE ↗"
            onClick={() => { if (dragged.current) { dragged.current = false; return; } if (offset === 0) open(index); else select(index); }}>
            <Image src={project.cover} alt="Abstract metallic orbital sculpture" fill sizes="(max-width: 768px) 90vw, 60vw" draggable={false} />
            <span className="project-visual-top"><span>{project.pending ? 'PENDING PROJECT' : 'PERSONAL EXPERIMENT'}</span><ArrowUpRight size={22} aria-hidden /></span>
            <span className="project-extra" aria-hidden>{project.pending ? 'Waiting for a real idea.' : `${project.role} / ${project.technologies.join(' + ')}`}</span>
            <span className="project-art-title">{index === 0 ? <>FIRST<br /><i>CONTACT.</i></> : index === 1 ? <>WHAT<br /><i>IF?</i></> : <>EMPTY<br /><i>CANVAS.</i></>}</span>
            <span className="project-visual-bottom"><span>{project.pending ? 'A SPACE FOR FUTURE WORK' : 'PORTFOLIO://EXPERIENCE'}</span><span>0{index + 1}</span></span>
          </motion.button>
        </motion.div>;
      })}
    </div>
    <div className="project-caption" aria-live="polite">
      <div><span className="mono muted">0{active + 1} / 0{projects.length} <span className="caption-divider">/</span> {projects[active].tagline}</span><h3>{projects[active].name}</h3></div>
      <button className="text-link" onClick={() => open(active)}>Explore {projects[active].pending ? 'the space' : 'project'} <ArrowUpRight size={20} aria-hidden /></button>
    </div>
    <div className="gallery-controls"><span className="mono muted">SCROLL, DRAG OR USE THE ARROWS</span><div>
      <button aria-label="Previous project" disabled={active === 0} onClick={() => select(active - 1)}><ArrowLeft size={22} aria-hidden /></button>
      <span className="gallery-dots">{projects.map((project, index) => <button key={project.slug} aria-label={`Select project ${index + 1}`} aria-pressed={active === index} onClick={() => select(index)} />)}</span>
      <button aria-label="Next project" disabled={active === projects.length - 1} onClick={() => select(active + 1)}><ArrowRight size={22} aria-hidden /></button>
    </div></div>
  </div>;
}

export function ProjectDetail({ project, close, onOpen }: { project: Project | null; close: () => void; onOpen: (open: boolean) => void }) {
  return <Dialog open={Boolean(project)} onClose={close} titleId="case-study-title" onOpen={onOpen}>
    {project && <article className="case-study">
      <p className="mono accent">{project.status} / {project.year}</p><h2 id="case-study-title">{project.name}</h2><p className="case-intro">{project.description}</p>
      <div className="case-image"><Image src={project.cover} alt="Metallic orbital artwork for this portfolio experience" fill sizes="100vw" /></div>
      <dl className="case-meta">{[['Role', project.role], ['Year', project.year], ['Stack', project.technologies.join(' / ') || 'Pending'], ['Status', project.status]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      <div className="case-sections">{[['Challenge', project.challenge], ['Solution', project.solution], ['Implementation', project.implementation], ['Result', project.result]].map(([label, text]) => <section key={label}><h3>{label}</h3><p>{text}</p></section>)}</div>
      {project.repositoryUrl && <a className="text-link" href={project.repositoryUrl} target="_blank" rel="noreferrer">View repository <ArrowUpRight aria-hidden /></a>}
      {project.liveUrl && <a className="text-link" href={project.liveUrl} target="_blank" rel="noreferrer">Visit project <ArrowUpRight aria-hidden /></a>}
    </article>}
  </Dialog>;
}
