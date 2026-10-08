'use client';
import Image from 'next/image';
import studyPoster from '../../public/media/study-poster.webp';
import { useCallback, useState, type CSSProperties } from 'react';
import { ArrowDown, ArrowUp, ArrowUpRight, GithubLogo } from '@phosphor-icons/react';
import { profile, projects } from '@/data/portfolio';
import { checkpoints, SCROLL_UNITS, type Checkpoint } from '@/lib/timeline';
import { useMasterTimeline } from '@/lib/use-master-timeline';
import { Dock, Cursor, MagneticButton } from './ui/global-controls';
import { ProjectGallery, ProjectDetail } from './projects';
import { IdentityMark } from './identity-mark';
import { Journey } from './journey';
import { Contact } from './contact';
import { TechnologyUniverse } from './technology-universe';

function Chapter({ id, children, className = '' }: { id: Checkpoint; children: React.ReactNode; className?: string }) {
  const range = checkpoints.find(point => point.id === id)!;
  return <section id={id} data-chapter className={`chapter chapter-${id} ${className}`} style={{ '--chapter-height': `${(range.end - range.start) * SCROLL_UNITS + (id === 'contact' ? 100 : 0)}dvh` } as CSSProperties}>
    <div className="scene">{children}{id !== 'hero' && <div className="chapter-seam" aria-hidden>{Array.from({ length: 6 }, (_, index) => <span key={index} />)}</div>}</div>
  </section>;
}

export function Experience() {
  const system = useMasterTimeline(projects.length);
  const [detail, setDetail] = useState<number | null>(null); const [contact, setContact] = useState(false);
  const [unfolded, setUnfolded] = useState(false);
  const modalState = useCallback((open: boolean) => { if (open) system.lenis.current?.stop(); else system.lenis.current?.start(); }, [system.lenis]);
  return <>
    <a className="skip-link" href="#about">Skip to content</a>
    <a className="rail-brand" href="#hero" onClick={event => { event.preventDefault(); system.navigate('hero'); }} aria-label="astraa, back to start">a<span aria-hidden>↗</span></a>
    <span className="rail-edition mono" aria-hidden>ASTRAA / {profile.year}</span>
    <main ref={system.root} className={system.cinematic ? 'experience cinematic' : 'experience'}>
      <Chapter id="hero"><div className="cover-top hero-meta"><span className="mono">FULLSTACK DEVELOPER / VIETNAM</span><span className="mono">{profile.year}</span></div>
        <h1 className="cover-name" aria-label="astraa"><span className="hero-word" aria-hidden>astraa<span className="cover-period">.</span></span>
          <span className="name-layers" aria-hidden>{Array.from({ length: 5 }, (_, index) => <span key={index} className="name-band" style={{ clipPath: `inset(${Math.max(0, index * 20 - 0.3)}% 0 ${Math.max(0, 100 - (index + 1) * 20 - 0.3)}% 0)` }}>astraa<span className="cover-period">.</span></span>)}</span>
        </h1>
        <div className="cover-lower"><div className="cover-intro hero-meta"><p>Fullstack developer.<br />An eye for the interface.</p><button className="cover-link" onClick={() => system.navigate('projects')}>Explore selected work <ArrowDown size={23} aria-hidden /></button><span className="cover-scroll-note mono">SCROLL TO PULL THE LAYERS APART ↓</span></div>
          <div className="study-aperture">
            <Image src={studyPoster} alt="" fill priority sizes="(max-width: 767px) 68vw, 35vw" className="world-poster" />
            <video ref={system.video} className="world-video" muted playsInline preload="metadata" poster={studyPoster.src} disablePictureInPicture aria-hidden onError={event => { event.currentTarget.style.display = 'none'; }} />
            <button type="button" className="study-unfold" aria-label={unfolded ? 'Tap to reassemble the astraa mark' : 'Tap to unfold the astraa mark'} aria-pressed={unfolded} data-unfolded={unfolded} onClick={() => setUnfolded(!unfolded)}><IdentityMark /><span className="mono">{unfolded ? 'TAP TO REASSEMBLE' : 'TAP TO UNFOLD'}</span></button>
          </div>
        </div>
        <div className="cover-bottom hero-meta"><span className="mono">CURRENT FOCUS / PROZ0</span><span className="mono">FRONTEND & FULLSTACK OPPORTUNITIES</span></div>
      </Chapter>
      <Chapter id="about"><div className="about-layout"><div className="about-origin"><IdentityMark className="origin-mark" /><span className="mono">BEHIND THE INTERFACE</span></div>
        <div className="about-intro"><h2>A focus on<br />what you<br /><span>feel.</span></h2><p>I’m astraa, a fullstack developer in Vietnam. I build components, APIs and data flows — with extra care for expressive UI, thoughtful motion and the details that make an experience feel finished.</p><a className="text-link" href={profile.github} target="_blank" rel="noreferrer"><GithubLogo size={22} aria-hidden /> Behind the work <ArrowUpRight size={20} aria-hidden /></a></div>
        <div className="about-strip"><span>Make it work.<br />Make it feel right.</span><span className="mono">INTERFACES / MOBILE / BACKEND</span><ArrowUpRight size={34} aria-hidden /></div></div>
      </Chapter>
      <Chapter id="stack"><TechnologyUniverse navigate={system.navigate} /></Chapter>
      <Chapter id="projects"><div className="work-heading"><h2>Worlds. Care.<br />Everyday life.</h2><span className="work-number" aria-hidden>003</span></div><ProjectGallery active={system.project} select={system.selectProject} open={setDetail} /></Chapter>
      <Chapter id="journey"><div className="journey-heading"><h2>The work<br />behind it.</h2></div><Journey /></Chapter>
      <Chapter id="contact"><div className="contact-scene"><h2>Have a project<br />in mind?</h2><div className="contact-lower"><MagneticButton className="conversation-button" onClick={() => setContact(true)}><span>Start a conversation</span><ArrowUpRight size={44} aria-hidden /></MagneticButton><div className="contact-links"><a className="text-link contact-email" href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={20} aria-hidden /></a><a className="text-link" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn<ArrowUpRight size={20} aria-hidden /></a><a className="contact-github text-link" href={profile.github} target="_blank" rel="noreferrer"><GithubLogo size={22} aria-hidden /> GitHub<ArrowUpRight size={20} aria-hidden /></a></div></div></div>
        <div className="contact-mark" aria-hidden><IdentityMark /></div>
        <footer className="experience-footer"><span className="mono">© {profile.year} {profile.name.toUpperCase()}</span><button className="text-link mono" onClick={() => system.navigate('hero')}>BACK TO START <ArrowUp size={18} aria-hidden /></button></footer>
      </Chapter>
    </main>
    <Dock active={system.chapter} navigate={system.navigate} /><Cursor />
    <ProjectDetail project={detail === null ? null : projects[detail]} plateIndex={detail ?? 0} close={() => setDetail(null)} onOpen={modalState} />
    <Contact open={contact} close={() => setContact(false)} onOpen={modalState} />
    <noscript><p className="noscript-note">JavaScript is needed for interactive controls. All chapters remain available by scrolling.</p></noscript>
  </>;
}
