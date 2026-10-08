'use client';
import { useState } from 'react';
import { ArrowUpRight, GithubLogo } from '@phosphor-icons/react';
import { profile, projects } from '@/data/portfolio';

const layers = [
  { title: 'Worlds', project: 0, note: 'A browser sandbox where exploration, survival and a growing colony share one persistent world.', stack: 'TYPESCRIPT / PIXIJS / VITE', detail: 'Procedural regions · versioned saves · game simulation' },
  { title: 'Interfaces', project: 1, note: 'Patient intake, care discovery and administrative workflows, connected to real backend services.', stack: 'REACT / VITE / MAPLIBRE', detail: 'Pre-visit intake · maps · patient workflows' },
  { title: 'Systems', project: 2, note: 'A shared foundation for personal finance across a web app, a mobile app and an API.', stack: 'NEXT.JS / NESTJS / EXPO', detail: 'PostgreSQL · Prisma · shared TypeScript types' },
];

export function About({ open }: { open: (index: number) => void }) {
  const [selected, select] = useState(0);
  const layer = layers[selected], project = projects[layer.project];
  return <div className="profile-layout">
    <div className="profile-top mono"><span>02 / THE PERSON BEHIND THE WORK</span><span>VIETNAM ↗</span></div>
    <div className="profile-bio"><h2>astraa<span>.</span></h2><p className="profile-role">Fullstack developer.<br />Web, mobile & games.</p><p className="profile-copy">I move between interfaces, mobile apps and the systems behind them. Right now, I’m building ProZ0: a pixel-art survival and exploration sandbox for the browser.</p><a className="text-link" href={profile.github} target="_blank" rel="noreferrer"><GithubLogo size={20} aria-hidden /> 5erax on GitHub <ArrowUpRight size={18} aria-hidden /></a><span className="profile-availability mono">OPEN TO FRONTEND & FULLSTACK OPPORTUNITIES</span></div>
    <div className="profile-work">
      <div className="folio-controls" aria-label="Explore my work by layer">{layers.map((item, index) => <button key={item.title} type="button" aria-pressed={selected === index} onClick={() => select(index)}><span className="mono">0{index + 1}</span>{item.title}<ArrowUpRight size={18} aria-hidden /></button>)}</div>
      <div className="folio-stage" aria-hidden="true">{layers.map((item, index) => {
        const rank = (index - selected + layers.length) % layers.length;
        return <div key={item.title} className={`folio-sheet folio-${projects[item.project].slug}`} style={{ '--rank': rank, zIndex: layers.length - rank } as React.CSSProperties}>
          <div className="folio-title mono"><span>{item.title.toUpperCase()} / 0{index + 1}</span><span>ASTRAA</span></div>
          <div className="folio-art">{projects[item.project].cover ? <><strong className="folio-project">{projects[item.project].name}<small>{projects[item.project].tagline}</small></strong><svg className="folio-illustration" viewBox="680 0 600 500" preserveAspectRatio="xMidYMid slice"><image href={projects[item.project].cover} width="1280" height="500" /></svg></> : <span className="folio-finance">FinGenie<span>↗</span><small>WEB + MOBILE + API</small></span>}</div>
          <div className="folio-caption"><strong>{projects[item.project].role}</strong><span className="mono">{item.stack}</span></div>
        </div>;
      })}</div>
      <div className="folio-reading" key={layer.title}><span className="mono">{project.status.toUpperCase()}</span><h3>{project.name}</h3><p>{layer.note}</p><span className="folio-detail mono">{layer.detail}</span><div className="folio-links"><button type="button" onClick={() => open(layer.project)}>Read the project <ArrowUpRight size={18} aria-hidden /></button><a href={project.repositoryUrl} target="_blank" rel="noreferrer">Source <ArrowUpRight size={16} aria-hidden /></a></div></div>
    </div>
    <div className="profile-bottom mono"><span>INTERFACE → LOGIC → WORLD</span><span>ONE PRACTICE. DIFFERENT SCALES.</span></div>
  </div>;
}
