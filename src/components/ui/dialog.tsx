'use client';
import { useReducedMotion } from '@/lib/use-reduced-motion';
import { useEffect, useRef, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { X } from '@phosphor-icons/react';
import { motionTokens } from '@/lib/timeline';

// Native dialog supplies focus containment, Escape handling, and top-layer rendering.
export function Dialog({ open, onClose, titleId, children, onOpen }: {
  open: boolean; onClose: () => void; titleId: string; children: ReactNode;
  onOpen?: (open: boolean) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    const focus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog.showModal(); document.body.style.overflow = 'hidden'; onOpen?.(true);
    return () => { dialog.close(); document.body.style.overflow = overflow; onOpen?.(false); focus?.focus({ preventScroll: true }); };
  }, [open, onOpen]);
  return <dialog ref={ref} className="immersive-dialog" aria-labelledby={titleId} data-lenis-prevent
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { if (event.target === ref.current) onClose(); }}>
    {open && <motion.div className="dialog-inner" initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: motionTokens.duration }}>
      <button className="dialog-close text-link" onClick={onClose} autoFocus>Close <X size={18} aria-hidden /></button>
      {children}
    </motion.div>}
  </dialog>;
}
