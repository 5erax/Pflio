'use client';
import { useReducedMotion } from '@/lib/use-reduced-motion';
import Image from 'next/image';
import { useCallback, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowDown, ArrowUp, ArrowUpRight, Asterisk, GithubLogo } from '@phosphor-icons/react';
import { profile, projects } from '@/data/portfolio';
import { checkpoints, SCROLL_UNITS, type Checkpoint } from '@/lib/timeline';
import { useMasterTimeline } from '@/lib/use-master-timeline';
import { Dock, Cursor, MagneticButton } from './ui/global-controls';
import { ProjectGallery, ProjectDetail } from './projects';
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
  const system = useMasterTimeline(projects.length);
  const [detail, setDetail] = useState<number | null>(null); const [contact, setContact] = useState(false);
  const reduced = useReducedMotion();
  const modalState = useCallback((open: boolean) => { if (open) system.lenis.current?.stop(); else system.lenis.current?.start(); }, [system.lenis]);
  return <>
    <a className="skip-link" href="#about">Skip to content</a>
    <div className="cinematic-world" aria-hidden>
      <Image src="/media/orbital.webp" alt="" fill priority sizes="100vw" className="world-poster" />
      <video ref={system.video} className="world-video" muted playsInline preload="metadata" poster="/media/orbital.webp" disablePictureInPicture onError={event => { event.currentTarget.style.display = 'none'; }} />
      <div className="world-vignette" /><div className="world-shade" />
    </div>
    <header className="identity-bar"><a className="wordmark" href="#hero" onClick={event => { event.preventDefault(); system.navigate('hero'); }} aria-label="astraa, back to start">{profile.name}<Asterisk size={21} weight="bold" aria-hidden /></a><span className="identity-center mono">INDEPENDENT MIND. OPEN CANVAS.</span><a className="identity-contact mono" href="#contact" onClick={event => { event.preventDefault(); system.navigate('contact'); }}>LET’S TALK <ArrowUpRight size={16} aria-hidden /></a></header>
    <AnimatePresence>{!system.ready && <motion.div className="boot-screen" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.4 }} aria-hidden><span className="wordmark">{profile.name}<Asterisk size={24} /></span><div className="boot-console"><span className="mono muted">PORTFOLIO SYSTEM</span><span className="mono">INITIALIZING EXPERIENCE...</span><div className="boot-progress" /><span className="mono accent">READY TO BEGIN</span></div></motion.div>}</AnimatePresence>
    <main ref={system.root} className={system.cinematic ? 'experience cinematic' : 'experience'}>
      <Chapter id="hero"><div className="hero-top hero-meta"><span className="mono">CREATIVE DEVELOPMENT / {profile.year}</span><span className="mono muted">THE FIRST CHAPTER</span></div>
        <div className="hero-composition"><div className="hero-side-label hero-meta mono">/ A PERSONAL EXPLORATION</div><h1><span className="hero-line hero-line-one"><span className="hero-word">CREATIVE</span></span><span className="hero-line hero-line-two"><span className="hero-word outlined">DEVELOPER<span className="title-period">.</span></span></span></h1>
          <div className="hero-description hero-meta"><span className="hero-star"><Asterisk size={35} weight="light" aria-hidden /></span><p>Code, curiosity,<br />and a little <i>beautiful chaos.</i></p></div>
        </div>
        <div className="hero-bottom hero-meta"><button className="scroll-invitation mono" onClick={() => system.navigate('about')}><span className="scroll-line" aria-hidden /><span>SCROLL TO ENTER</span><ArrowDown size={16} aria-hidden /></button><span className="mono muted">BASED IN {profile.location.toUpperCase()}<br /><span className="hero-coordinate">BEGINNING FROM ZERO</span></span><span className="hero-edition mono">PORTFOLIO / 2026</span></div>
      </Chapter>
      <Chapter id="about"><div className="about-layout"><div className="about-heading"><span className="chapter-marker mono">01 / THE HUMAN BEHIND THE SCREEN</span><h2>WHO<br />IS THIS<br /><i>GUY?</i></h2></div>
        <div className="about-bento"><div className="identity-art" aria-label="Etched monogram identity plate for astraa"><div className="identity-etching" aria-hidden /><span className="identity-art-top mono">ASTRAA / IDENTITY STUDY — 001</span><span className="identity-art-letter" aria-hidden>a<span>*</span></span><span className="identity-registration" aria-hidden>+</span><div className="identity-art-bottom"><span className="mono">NO FINISH LINE.<br />JUST A START.</span><span className="identity-signature">astraa</span></div></div>
          <div className="about-intro"><span className="mono accent">HELLO, I’M {profile.name.toUpperCase()}.</span><h3>Curious by nature.<br />Builder in the making.</h3><p>{profile.intro}</p><a className="text-link" href={profile.github} target="_blank" rel="noreferrer"><GithubLogo size={20} aria-hidden /> Follow the journey <ArrowUpRight size={18} aria-hidden /></a></div>
          <div className="about-location"><span className="location-status mono"><span aria-hidden /> CURRENTLY IN THE MAKING</span><p>Learning.<br /><i>Every day.</i></p><span className="mono">{profile.location} / GMT +7</span></div><div className="about-status"><Asterisk size={32} weight="light" aria-hidden /><p>{profile.availability}</p></div>
        </div></div>
      </Chapter>
      <Chapter id="stack"><TechnologyUniverse navigate={system.navigate} /></Chapter>
      <Chapter id="projects"><div className="work-heading"><span className="chapter-marker mono">03 / THE EXPERIMENT LOG</span><h2>Small beginnings.<br /><i>Wide possibilities.</i></h2><p>One real first project. Space for what comes next.</p></div><ProjectGallery active={system.project} select={system.selectProject} open={setDetail} /></Chapter>
      <Chapter id="journey"><div className="journey-heading"><h2>MY JOURNEY<br />IS A <i>FILESYSTEM.</i></h2><p>A few files. An unwritten future.</p></div><Journey /></Chapter>
      <Chapter id="contact"><div className="contact-scene"><span className="mono accent">THE NEXT CHAPTER STARTS WITH A HELLO</span><h2>HAVE<br /><i>AN IDEA?</i></h2><p>Let’s make something<br />we haven’t made before.</p><MagneticButton className="conversation-button" onClick={() => setContact(true)}><span>Start a conversation</span><span className="conversation-arrow"><ArrowUpRight size={24} aria-hidden /></span></MagneticButton><a className="contact-github text-link" href={profile.github} target="_blank" rel="noreferrer">Or find me on GitHub <ArrowUpRight size={17} aria-hidden /></a></div>
        <footer><span className="mono">© {profile.year} {profile.name.toUpperCase()}</span><span className="footer-note mono muted">BUILT WITH CURIOSITY. STILL LEARNING.</span><button className="text-link mono" onClick={() => system.navigate('hero')}>BACK TO START <ArrowUp size={16} aria-hidden /></button></footer>
      </Chapter>
    </main>
    <div className="experience-rail" aria-hidden><span className="mono">0{checkpoints.findIndex(point => point.id === system.chapter) + 1}</span><div className="rail-line"><span /></div><span className="mono muted">06</span></div>
    <Dock active={system.chapter} navigate={system.navigate} /><Cursor />
    <ProjectDetail project={detail === null ? null : projects[detail]} close={() => setDetail(null)} onOpen={modalState} />
    <Contact open={contact} close={() => setContact(false)} onOpen={modalState} />
    <noscript><style>{'.boot-screen { display: none !important; }'}</style><p className="noscript-note">JavaScript is needed for interactive controls. All chapters remain available by scrolling.</p></noscript>
  </>;
}
