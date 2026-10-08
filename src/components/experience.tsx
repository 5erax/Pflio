'use client';
import Image from 'next/image';
import animeCity from '../../public/media/anime-city.webp';
import animeEye from '../../public/media/anime-eye.webp';
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
import { Dialog } from './ui/dialog';
import { AnimeShader } from './anime-shader';
import { About } from './about';

function Chapter({ id, children, className = '' }: { id: Checkpoint; children: React.ReactNode; className?: string }) {
  const range = checkpoints.find(point => point.id === id)!;
  return <section id={id} data-chapter className={`chapter chapter-${id} ${className}`} style={{ '--chapter-height': `${(range.end - range.start) * SCROLL_UNITS + (id === 'contact' ? 100 : 0)}dvh` } as CSSProperties}>
    <div className="scene">{children}{id !== 'hero' && <div className="chapter-seam" aria-hidden><span /><span /></div>}</div>
  </section>;
}

export function Experience() {
  const system = useMasterTimeline(projects.length);
  const [detail, setDetail] = useState<number | null>(null); const [contact, setContact] = useState(false);
  const [credits, setCredits] = useState(false); const [playing, setPlaying] = useState(false);
  const modalState = useCallback((open: boolean) => { if (open) system.lenis.current?.stop(); else system.lenis.current?.start(); }, [system.lenis]);
  return <>
    <a className="skip-link" href="#about">Skip to content</a>
    <a className="rail-brand" href="#hero" onClick={event => { event.preventDefault(); system.navigate('hero'); }} aria-label="astraa, back to start">a<span aria-hidden>↗</span></a>
    <span className="rail-edition mono" aria-hidden>ASTRAA / {profile.year}</span>
    <main ref={system.root} className={system.cinematic ? 'experience cinematic' : 'experience'}>
      <Chapter id="hero">
        <div className="cover-top"><a className="hero-signature" href={profile.github} target="_blank" rel="noreferrer">astraa<span>↗</span></a><span className="mono">FULLSTACK DEVELOPER<br />VIETNAM / {profile.year}</span></div>
        <div className="anime-cover">
          <div className="cover-intro"><span className="mono hero-kicker">WEB / MOBILE / WORLDS</span><h1>From code<br />to <span>worlds.</span></h1><p>I’m astraa. I build interfaces,<br />the systems behind them,<br />and places to get lost in.</p><button className="cover-link" onClick={() => system.navigate('projects')}>Explore selected work <ArrowDown size={23} aria-hidden /></button></div>
          <div className="anime-composition" aria-label="Anime visual study featuring Morevna">
            <div className="anime-city"><Image src={animeCity} alt="A ruined cyberpunk city from the Morevna anime" fill preload sizes="(max-width: 767px) 100vw, 60vw" /></div>
            <div className="anime-film">
              <Image src={animeEye} alt="" fill preload sizes="(max-width: 767px) 85vw, 40vw" className="world-poster" />
              <video ref={system.video} className="world-video" muted playsInline preload="none" poster={animeEye.src} disablePictureInPicture aria-hidden onLoadedData={event => { event.currentTarget.dataset.ready = 'true'; }} onPause={() => setPlaying(false)} onPlay={() => setPlaying(true)} onError={event => { event.currentTarget.style.display = 'none'; setPlaying(false); }} />
            </div>
            <AnimeShader progress={system.progress} video={system.video} />
            <span className="anime-frame-label mono">MOREVNA / A WORLD IN MOTION</span>
            <span className="anime-camera-note mono" aria-hidden>MOVE TO LOOK AROUND ↗</span>
            <button className="anime-play mono" type="button" aria-pressed={playing} onClick={() => { const video = system.video.current; if (!video) return; if (playing) video.pause(); else { video.style.display = ''; if (!video.getAttribute('src')) video.src = '/media/anime-eye.mp4'; video.loop = true; void video.play().catch(() => setPlaying(false)); } }}>{playing ? 'PAUSE FILM' : 'PLAY FILM'} <span aria-hidden>{playing ? 'Ⅱ' : '▶'}</span></button>
          </div>
        </div>
        <div className="cover-bottom"><span className="mono">CURRENTLY BUILDING / PROZ0</span><span className="cover-scroll-note mono">SCROLL TO ADVANCE THE FILM ↓</span><button className="visual-credits mono" onClick={() => setCredits(true)}>VISUAL CREDITS <ArrowUpRight size={14} aria-hidden /></button></div>
      </Chapter>
      <Chapter id="about"><About open={setDetail} /></Chapter>
      <Chapter id="stack"><TechnologyUniverse navigate={system.navigate} /></Chapter>
      <Chapter id="projects"><div className="work-heading"><h2>Worlds. Care.<br />Everyday life.</h2><span className="work-number" aria-hidden>003</span></div><ProjectGallery active={system.project} cinematic={system.cinematic} select={system.selectProject} open={setDetail} /></Chapter>
      <Chapter id="journey"><div className="journey-heading"><h2>The work<br />behind it.</h2></div><Journey /></Chapter>
      <Chapter id="contact"><div className="contact-scene"><h2>Have a project<br />in mind?</h2><div className="contact-lower"><MagneticButton className="conversation-button" onClick={() => setContact(true)}><span>Start a conversation</span><ArrowUpRight size={44} aria-hidden /></MagneticButton><div className="contact-links"><a className="text-link contact-email" href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={20} aria-hidden /></a><a className="text-link" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn<ArrowUpRight size={20} aria-hidden /></a><a className="contact-github text-link" href={profile.github} target="_blank" rel="noreferrer"><GithubLogo size={22} aria-hidden /> GitHub<ArrowUpRight size={20} aria-hidden /></a></div></div></div>
        <div className="contact-mark" aria-hidden><IdentityMark /></div>
        <footer className="experience-footer"><span className="mono">© {profile.year} {profile.name.toUpperCase()}</span><button className="text-link mono" onClick={() => system.navigate('hero')}>BACK TO START <ArrowUp size={18} aria-hidden /></button></footer>
      </Chapter>
    </main>
    <Dock active={system.chapter} navigate={system.navigate} /><Cursor />
    <ProjectDetail project={detail === null ? null : projects[detail]} plateIndex={detail ?? 0} close={() => setDetail(null)} onOpen={modalState} />
    <Contact open={contact} close={() => setContact(false)} onOpen={modalState} />
    <Dialog open={credits} onClose={() => setCredits(false)} titleId="visual-credits-title" onOpen={modalState}><article className="media-credits"><p className="mono accent">VISUAL REFERENCES / OPEN ANIME</p><h2 id="visual-credits-title">Art has authors.</h2><p>Anime imagery gives this portfolio its visual atmosphere. The artwork and animation below are by Morevna Project and its artists.</p><h3>Ruined City (2)</h3><p>Morevna Project · resized and converted to WebP; shader parallax, smoke, fog, lighting and rain added. <a href="https://morevnaproject.org/artwork/ruined-city/" target="_blank" rel="noreferrer">Original artwork ↗</a> · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a></p><h3>Morevna Episode 3.0.2</h3><p>Morevna Project · directed by Konstantin Dmitriev. Silent excerpt at 04:58–05:01, resized and re-encoded; matching poster extracted. This media adaptation is available under <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>. <a href="https://morevnaproject.org/anime/episode-3/" target="_blank" rel="noreferrer">Full film & credits ↗</a> · <a href="/media/anime-eye.mp4" download>Download excerpt ↓</a></p></article></Dialog>
    <noscript><p className="noscript-note">JavaScript is needed for interactive controls. All chapters remain available by scrolling.</p></noscript>
  </>;
}
