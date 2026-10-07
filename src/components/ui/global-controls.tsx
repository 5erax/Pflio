'use client';
import { useReducedMotion } from '@/lib/use-reduced-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';
import { HouseSimple, User, Planet, SquaresFour, FolderOpen, ArrowUpRight } from '@phosphor-icons/react';
import { checkpoints, motionTokens, type Checkpoint } from '@/lib/timeline';
const icons = [HouseSimple, User, Planet, SquaresFour, FolderOpen, ArrowUpRight];

// Adapted from VengeanceUI GlassDock, MIT © 2025–2026 Ashutoshx7.
// https://github.com/Ashutoshx7/VengeanceUI/blob/main/src/components/ui/glass-dock.tsx
export function Dock({ active, navigate }: { active: Checkpoint; navigate: (id: Checkpoint) => void }) {
  const dock = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<{ index: number; center: number; direction: number } | null>(null);
  const showTooltip = (index: number, button: HTMLButtonElement) => {
    const buttonBox = button.getBoundingClientRect();
    const dockBox = dock.current!.getBoundingClientRect();
    setHovered(previous => ({ index, center: buttonBox.left - dockBox.left + buttonBox.width / 2,
      direction: previous && previous.index !== index ? (index > previous.index ? 1 : -1) : 0 }));
  };
  const clearTooltip = () => setHovered(null);
  const textVariants = {
    enter: (direction: number) => ({ x: reduced ? 0 : direction > 0 ? 35 : -35, opacity: 0, filter: reduced ? 'none' : 'blur(6px)' }),
    visible: { x: 0, opacity: 1, filter: 'blur(0px)' },
    exit: (direction: number) => ({ x: reduced ? 0 : direction > 0 ? -35 : 35, opacity: 0, filter: reduced ? 'none' : 'blur(6px)' }),
  };
  return <nav ref={dock} className="dock" aria-label="Experience chapters"
    onPointerLeave={() => { if (!dock.current?.querySelector(':focus-visible')) clearTooltip(); }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) clearTooltip(); }}>
    <span className="dock-prefix" aria-hidden>EXPLORE</span>
    {checkpoints.map((point, index) => {
      const Icon = icons[index];
      const isHovered = hovered?.index === index;
      return <motion.button type="button" key={point.id} aria-label={point.label} aria-current={active === point.id ? 'location' : undefined}
        className={active === point.id ? 'active' : ''} onClick={() => navigate(point.id)}
        onPointerEnter={event => { if (event.pointerType === 'mouse') showTooltip(index, event.currentTarget); }}
        onFocus={event => showTooltip(index, event.currentTarget)}
        animate={{ scale: reduced ? 1 : isHovered ? 1.1 : 1, y: reduced ? 0 : isHovered ? -3 : 0 }}
        whileTap={reduced ? undefined : { scale: 0.95 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
        <Icon size={20} weight={active === point.id ? 'fill' : 'regular'} aria-hidden />
        <span className="dock-dot" aria-hidden />
      </motion.button>;
    })}
    <AnimatePresence>
      {hovered !== null && <motion.div className="dock-tooltip-shell" aria-hidden
        initial={{ opacity: 0, scale: reduced ? 1 : 0.92, y: reduced ? -54 : 12, x: hovered.center }}
        animate={{ opacity: 1, scale: 1, y: -54, x: hovered.center }}
        exit={{ opacity: 0, scale: reduced ? 1 : 0.92, y: reduced ? -54 : 12 }}
        transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 18 }}>
        <div className="dock-tooltip-surface"><div className="dock-tooltip-clip">
          <AnimatePresence mode="popLayout" custom={hovered.direction}>
            <motion.span key={checkpoints[hovered.index].label} className="dock-tooltip-text" custom={hovered.direction}
              variants={textVariants} initial="enter" animate="visible" exit="exit"
              transition={{ duration: reduced ? 0 : 0.3, ease: 'easeOut' }}>{checkpoints[hovered.index].label}</motion.span>
          </AnimatePresence>
        </div></div>
      </motion.div>}
    </AnimatePresence>
  </nav>;
}

// Adapted from Animate UI Cursor + CursorFollow, MIT + Commons Clause © 2025 Elliot Sutton.
// https://github.com/imskyleen/animate-ui/blob/main/apps/www/registry/primitives/animate/cursor/index.tsx
// The native cursor remains visible; this is the decorative ring and contextual follow element.
export function Cursor() {
  const x = useMotionValue(-100); const y = useMotionValue(-100);
  const followX = useMotionValue(-100); const followY = useMotionValue(-100);
  const springX = useSpring(followX, { stiffness: 500, damping: 50, bounce: 0 });
  const springY = useSpring(followY, { stiffness: 500, damping: 50, bounce: 0 });
  const follow = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState(''); const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();
  const positionFollow = useCallback((pointerX: number, pointerY: number) => {
    const width = follow.current?.offsetWidth ?? 0;
    const height = follow.current?.offsetHeight ?? 0;
    followX.set(Math.max(width / 2 + 12, Math.min(window.innerWidth - width / 2 - 12, pointerX + width / 2 + 18)));
    followY.set(Math.max(height / 2 + 12, Math.min(window.innerHeight - height / 2 - 12, pointerY + height / 2 + 18)));
  }, [followX, followY]);
  useEffect(() => {
    if (reduced) return;
    const media = matchMedia('(pointer: fine) and (min-width: 1024px)');
    const move = (event: PointerEvent) => {
      if (!media.matches || event.pointerType !== 'mouse') return;
      x.set(event.clientX); y.set(event.clientY); positionFollow(event.clientX, event.clientY); setVisible(true);
      const target = event.target instanceof Element ? event.target.closest('[data-cursor], a, button') : null;
      setLabel(target?.getAttribute('data-cursor') ?? (target?.tagName === 'A' ? 'OPEN ↗' : ''));
    };
    const leave = (event: PointerEvent) => { if (event.relatedTarget === null) setVisible(false); };
    const visibility = () => { if (document.visibilityState === 'hidden') setVisible(false); };
    const mediaChange = () => setVisible(false);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerout', leave, { passive: true });
    document.addEventListener('visibilitychange', visibility);
    media.addEventListener('change', mediaChange);
    return () => {
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerout', leave);
      document.removeEventListener('visibilitychange', visibility); media.removeEventListener('change', mediaChange);
    };
  }, [reduced, x, y, positionFollow]);
  useEffect(() => { if (label) positionFollow(x.get(), y.get()); }, [label, x, y, positionFollow]);
  return <AnimatePresence>
    {!reduced && visible && <motion.div key="cursor" className="custom-cursor" aria-hidden style={{ x, y }}
      initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.15 }} />}
    {!reduced && visible && label && <motion.div key="cursor-follow" ref={follow} className="cursor-follow" aria-hidden
      style={{ left: springX, top: springY }} transformTemplate={(_, transform) => "translate(-50%, -50%) " + transform} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.15 }}>{label}</motion.div>}
  </AnimatePresence>;
}

export function MagneticButton({ children, onClick, className = '' }: { children: React.ReactNode; onClick: () => void; className?: string }) {
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, motionTokens.spring); const sy = useSpring(y, motionTokens.spring);
  const ref = useRef<HTMLButtonElement>(null); const reduced = useReducedMotion();
  return <motion.button type="button" ref={ref} onClick={onClick} className={className} style={{ x: sx, y: sy }}
    whileTap={reduced ? undefined : { scale: 0.98 }}
    onPointerMove={event => { if (reduced || event.pointerType !== 'mouse') return; const box = ref.current!.getBoundingClientRect(); x.set((event.clientX - box.left - box.width / 2) * 0.10); y.set((event.clientY - box.top - box.height / 2) * 0.10); }}
    onPointerLeave={() => { x.set(0); y.set(0); }}>{children}</motion.button>;
}
