'use client';
import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { FileText, FolderOpen, CaretDown, ArrowUpRight } from '@phosphor-icons/react';
import { journey, panels } from '@/data/portfolio';
import { motionTokens } from '@/lib/timeline';

// Animate UI Files and Tabs behavior concepts, using semantic buttons and accessible tabs.
export function Journey() {
  const [selected, setSelected] = useState(0); const [tab, setTab] = useState(2);
  const [expanded, setExpanded] = useState(true); const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduce = useReducedMotion();
  return <div className="journey-layout">
    <div className="file-system">
      <div className="file-bar"><span className="mono">~/astraa/journey</span><span className="mono muted">3 FILES</span></div>
      <div className="file-columns"><div className="file-tree">
        <button className="folder-row" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}><CaretDown size={14} style={{ rotate: expanded ? '0deg' : '-90deg' }} aria-hidden /><FolderOpen size={20} aria-hidden /><span>2026</span><span className="accent">/</span></button>
        {expanded && journey.map((entry, index) => <button key={entry.id} className={`file-row ${selected === index ? 'selected' : ''}`} onClick={() => setSelected(index)} aria-pressed={selected === index}><FileText size={16} aria-hidden /><span>{entry.file}</span><ArrowUpRight size={14} aria-hidden /></button>)}
      </div><div className="file-detail" aria-live="polite">
        <p className="mono accent">{journey[selected].date} / {journey[selected].file}</p><h3>{journey[selected].title}</h3><p>{journey[selected].text}</p><span className="file-caret" aria-hidden>_</span>
      </div></div>
    </div>
    <div className="journey-tabs"><div role="tablist" aria-label="Background" className="tab-list">
      {panels.map((panel, index) => <button key={panel.id} ref={el => { tabs.current[index] = el; }} id={`tab-${panel.id}`} role="tab" aria-selected={tab === index} aria-controls={`panel-${panel.id}`} tabIndex={tab === index ? 0 : -1} onClick={() => setTab(index)}
        onKeyDown={event => { let next = index; if (event.key === 'ArrowRight') next = (index + 1) % panels.length; else if (event.key === 'ArrowLeft') next = (index + panels.length - 1) % panels.length; else if (event.key === 'Home') next = 0; else if (event.key === 'End') next = panels.length - 1; else return; event.preventDefault(); setTab(next); tabs.current[next]?.focus(); }}>{panel.name}</button>)}
    </div><AnimatePresence mode="wait"><motion.div key={panels[tab].id} role="tabpanel" tabIndex={0} id={`panel-${panels[tab].id}`} aria-labelledby={`tab-${panels[tab].id}`} className="tab-panel"
      initial={reduce ? false : { opacity: 0, y: 12, filter: 'blur(5px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={reduce ? undefined : { opacity: 0, y: -8, filter: 'blur(5px)' }} transition={{ duration: motionTokens.duration }}>
      <h3>{panels[tab].title}</h3><p>{panels[tab].text}</p>
    </motion.div></AnimatePresence></div>
  </div>;
}
