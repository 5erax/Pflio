'use client';
import { useReducedMotion } from '@/lib/use-reduced-motion';
import Image from 'next/image';
import { useCallback, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowDown, ArrowUp, ArrowUpRight, GithubLogo } from '@phosphor-icons/react';
import { profile, projects } from '@/data/portfolio';
import { checkpoints, SCROLL_UNITS, type Checkpoint } from '@/lib/timeline';
import { useMasterTimeline } from '@/lib/use-master-timeline';
import { Dock, Cursor, MagneticButton } from './ui/global-controls';
import { ProjectGallery, ProjectDetail, WORK_PLATES } from './projects';
import { Journey } from './journey';
import { Contact } from './contact';
import { TechnologyUniverse } from './technology-universe';

function Chapter({ id, children, className = '' }: { id: Checkpoint; children: React.ReactNode; className?: string }) {
  const range = checkpoints.find(point => point.id === id)!;
  return <section id={id} data-chapter className={`chapter chapter-${id} ${className}`} style={{ '--chapter-height': `${(range.end - range.start) * SCROLL_UNITS + (id === 'contact' ? 100 : 0)}dvh` } as CSSProperties}>
    <div className="scene">{children}</div>
  </section>;
}

export function Experience() {
  const system = useMasterTimeline(WORK_PLATES.length);
  const [detail, setDetail] = useState<number | null>(null); const [contact, setContact] = useState(false);
  const reduced = useReducedMotion();
  const modalState = useCallback((open: boolean) => { if (open) system.lenis.current?.stop(); else system.lenis.current?.start(); }, [system.lenis]);
  return <>
    <a className="skip-link" href="#about">Skip to content</a>
    <a className="rail-brand" href="#hero" onClick={event => { event.preventDefault(); system.navigate('hero'); }} aria-label="astraa, back to start">a<span aria-hidden>↗</span></a>
    <span className="rail-edition mono" aria-hidden>ASTRAA / {profile.year}</span>
    <AnimatePresence>{!system.ready && <motion.div className="boot-screen" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.25 }} aria-hidden><span>astraa</span></motion.div>}</AnimatePresence>
    <main ref={system.root} className={system.cinematic ? 'experience cinematic' : 'experience'}>
      <Chapter id="hero"><div className="cover-top hero-meta"><span className="mono">PERSONAL PORTFOLIO</span><span className="mono">{profile.year}</span></div>
        <h1 className="cover-name"><span className="hero-word">astraa<span className="cover-period">.</span></span></h1>
        <div className="cover-lower"><div className="cover-intro hero-meta"><p>Starting from zero.<br />Learning by making.</p><button className="cover-link" onClick={() => system.navigate('about')}>Meet the person <ArrowDown size={23} aria-hidden /></button></div>
          <div className="study-aperture" role="img" aria-label="An original six-arm identity mark, animated by scrolling">
            <Image src="/media/study-poster.webp" alt="" fill priority sizes="(max-width: 767px) 68vw, 35vw" className="world-poster" />
            <video ref={system.video} className="world-video" muted playsInline preload="metadata" poster="/media/study-poster.webp" disablePictureInPicture aria-hidden onError={event => { event.currentTarget.style.display = 'none'; }} />
          </div>
        </div>
        <div className="cover-bottom hero-meta"><span className="mono">INDEPENDENT / {profile.location.toUpperCase()}</span><span className="mono">OPEN TO LEARNING & COLLABORATION</span></div>
      </Chapter>
      <Chapter id="about"><div className="about-layout"><div className="about-origin"><span className="origin-number" aria-hidden>00</span><span className="mono">MY STARTING POINT</span></div>
        <div className="about-intro"><h2>I’m astraa.<br />This is my<br /><span>first build.</span></h2><p>I’m learning in public. Exploring code, design, and the space between an idea and something you can use.</p><a className="text-link" href={profile.github} target="_blank" rel="noreferrer"><GithubLogo size={22} aria-hidden /> Follow the journey <ArrowUpRight size={20} aria-hidden /></a></div>
        <div className="about-strip"><span>Curiosity first.</span><span className="mono">THE REST COMES WITH PRACTICE.</span><ArrowUpRight size={34} aria-hidden /></div></div>
      </Chapter>
      <Chapter id="stack"><TechnologyUniverse navigate={system.navigate} /></Chapter>
      <Chapter id="projects"><div className="work-heading"><h2>One build.<br />Every detail.</h2><span className="work-number" aria-hidden>001</span></div><ProjectGallery active={system.project} select={system.selectProject} open={setDetail} /></Chapter>
      <Chapter id="journey"><div className="journey-heading"><h2>Still in<br />the making.</h2></div><Journey /></Chapter>
      <Chapter id="contact"><div className="contact-scene"><h2>Let’s start<br />something.</h2><div className="contact-lower"><MagneticButton className="conversation-button" onClick={() => setContact(true)}><span>Start a conversation</span><ArrowUpRight size={44} aria-hidden /></MagneticButton><a className="contact-github text-link" href={profile.github} target="_blank" rel="noreferrer"><GithubLogo size={22} aria-hidden /> GitHub / 5erax <ArrowUpRight size={20} aria-hidden /></a></div></div>
        <div className="contact-mark" aria-hidden><svg viewBox="0 0 200 200" fill="currentColor"><path d="M82 4h36v65l56-32 18 31-56 32 56 32-18 31-56-32v65H82v-65l-56 32-18-31 56-32-56-32 18-31 56 32Z" /></svg></div>
        <footer className="experience-footer"><span className="mono">© {profile.year} {profile.name.toUpperCase()}</span><button className="text-link mono" onClick={() => system.navigate('hero')}>BACK TO START <ArrowUp size={18} aria-hidden /></button></footer>
      </Chapter>
    </main>
    <Dock active={system.chapter} navigate={system.navigate} /><Cursor />
    <ProjectDetail project={detail === null ? null : projects[0]} plateIndex={detail ?? 0} close={() => setDetail(null)} onOpen={modalState} />
    <Contact open={contact} close={() => setContact(false)} onOpen={modalState} />
    <noscript><style>{'.boot-screen { display: none !important; }'}</style><p className="noscript-note">JavaScript is needed for interactive controls. All chapters remain available by scrolling.</p></noscript>
  </>;
}
