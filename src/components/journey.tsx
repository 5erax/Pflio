'use client';
import { useReducedMotion } from '@/lib/use-reduced-motion';
import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { journey, panels } from '@/data/portfolio';
import { motionTokens } from '@/lib/timeline';

// ForgeUI Animated Tabs, underline variant: https://forgeui.in/components/animated-tabs.
// Shared layout highlight and spring 500/30 retained; ARIA/keyboard behavior added.
// Copyright 2025 Aman Shakya. Application use only; see THIRD_PARTY_NOTICES.md.
export function Journey() {
  const [selected, setSelected] = useState(0);
  const [tab, setTab] = useState(2);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduce = useReducedMotion();
  const note = journey[selected];

  return <div className="journey-layout field-notes">
    <div className="file-system field-index">
      <span className="field-label mono">2020 — PRESENT</span>
      <p className="field-index-copy">From foundations<br />to fullstack.</p>
      <ol className="field-file-list" aria-label="Field note index">
        {journey.map((entry, index) => <li key={entry.id}>
          <button type="button" className={`file-row ${selected === index ? 'selected' : ''}`}
            aria-current={selected === index ? 'true' : undefined}
            aria-controls="field-note" onClick={() => setSelected(index)}>
            <span className="field-file-number mono" aria-hidden>0{index + 1}</span>
            <span className="field-file-name">{entry.file}</span>
            <span className="field-file-arrow" aria-hidden>↗</span>
          </button>
        </li>)}
      </ol>
    </div>

    <div className="field-reading">
      <article id="field-note" className="file-detail field-note" aria-live="polite" aria-atomic="true">
        <span className="field-note-number mono">NOTE 0{selected + 1} / 0{journey.length}</span>
        <h3>{note.title}</h3>
        <p className="field-note-body">{note.text}</p>
        <footer className="field-note-footer mono"><span>{note.date}</span><span>{note.file}</span></footer>
      </article>

      <aside className="journey-tabs field-background" aria-label="Professional background">
        <div className="field-context-bar">
          <span className="field-label mono">BACKGROUND</span>
          <div role="tablist" aria-label="Background" className="tab-list">
            {panels.map((panel, index) => <button key={panel.id} type="button"
              ref={element => { tabs.current[index] = element; }}
              id={`tab-${panel.id}`} role="tab" aria-selected={tab === index}
              aria-controls={`panel-${panel.id}`} tabIndex={tab === index ? 0 : -1}
              onClick={() => setTab(index)} onKeyDown={event => {
                let next = index;
                if (event.key === 'ArrowRight') next = (index + 1) % panels.length;
                else if (event.key === 'ArrowLeft') next = (index + panels.length - 1) % panels.length;
                else if (event.key === 'Home') next = 0;
                else if (event.key === 'End') next = panels.length - 1;
                else return;
                event.preventDefault();
                setTab(next);
                tabs.current[next]?.focus();
              }}>
              {tab === index && <motion.span className="tab-highlight" aria-hidden
                layoutId="journey-active-tab" initial={false}
                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 30 }} />}
              <span>{panel.name}</span>
            </button>)}
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={panels[tab].id} role="tabpanel" tabIndex={0}
            id={`panel-${panels[tab].id}`} aria-labelledby={`tab-${panels[tab].id}`} className="tab-panel"
            initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: reduce ? 0 : motionTokens.duration }}>
            <h3>{panels[tab].title}</h3><p>{panels[tab].text}</p>
          </motion.div>
        </AnimatePresence>
      </aside>
    </div>
  </div>;
}
