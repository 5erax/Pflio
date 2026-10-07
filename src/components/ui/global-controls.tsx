'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';
import { HouseSimple, User, Planet, SquaresFour, FolderOpen, ArrowUpRight } from '@phosphor-icons/react';
import { checkpoints, motionTokens, type Checkpoint } from '@/lib/timeline';
const icons = [HouseSimple, User, Planet, SquaresFour, FolderOpen, ArrowUpRight];

// Vengeance Glass Dock interaction concept, restyled as chapter navigation.
export function Dock({ active, navigate }: { active: Checkpoint; navigate: (id: Checkpoint) => void }) {
  return <nav className="dock" aria-label="Experience chapters">
    <span className="dock-prefix" aria-hidden>EXPLORE</span>
    {checkpoints.map((point, index) => {
      const Icon = icons[index];
      return <button key={point.id} aria-label={point.label} aria-current={active === point.id ? 'location' : undefined}
        className={active === point.id ? 'active' : ''} onClick={() => navigate(point.id)}>
        <Icon size={20} weight={active === point.id ? 'fill' : 'regular'} aria-hidden />
        <span className="dock-tooltip">{point.label}</span><span className="dock-dot" />
      </button>;
    })}
  </nav>;
}

// Animate UI cursor concept. Native pointer stays visible as an accessible fallback.
export function Cursor() {
  const x = useMotionValue(-100); const y = useMotionValue(-100);
  const sx = useSpring(x, motionTokens.spring); const sy = useSpring(y, motionTokens.spring);
  const [label, setLabel] = useState(''); const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce || !matchMedia('(pointer: fine) and (min-width: 1024px)').matches) return;
    const move = (event: PointerEvent) => {
      x.set(event.clientX); y.set(event.clientY); setVisible(true);
      const target = (event.target as HTMLElement).closest<HTMLElement>('[data-cursor], a, button');
      setLabel(target?.dataset.cursor ?? (target?.tagName === 'A' ? 'OPEN ↗' : ''));
    };
    const leave = () => setVisible(false);
    window.addEventListener('pointermove', move); document.documentElement.addEventListener('pointerleave', leave);
    return () => { window.removeEventListener('pointermove', move); document.documentElement.removeEventListener('pointerleave', leave); };
  }, [reduce, x, y]);
  return <motion.div className={`custom-cursor ${label ? 'expanded' : ''}`} aria-hidden style={{ x: sx, y: sy, opacity: visible ? 1 : 0 }}>{label}</motion.div>;
}

export function MagneticButton({ children, onClick, className = '' }: { children: React.ReactNode; onClick: () => void; className?: string }) {
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, motionTokens.spring); const sy = useSpring(y, motionTokens.spring);
  const ref = useRef<HTMLButtonElement>(null); const reduce = useReducedMotion();
  return <motion.button ref={ref} onClick={onClick} className={className} style={{ x: sx, y: sy }}
    onPointerMove={event => { if (reduce || event.pointerType !== 'mouse') return; const box = ref.current!.getBoundingClientRect(); x.set((event.clientX - box.left - box.width / 2) * 0.10); y.set((event.clientY - box.top - box.height / 2) * 0.10); }}
    onPointerLeave={() => { x.set(0); y.set(0); }}>{children}</motion.button>;
}
