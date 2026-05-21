import { useState } from 'react'
import useStakeholders from '../hooks/useStakeholders'
import PowerInterestGrid from './PowerInterestGrid'
import BlastRadius from './BlastRadius'
import StakeholderList from './StakeholderList'
import styles from './InterestHolderWorksheet.module.css'

export default function InterestHolderWorksheet() {
  const { stakeholders, programName, setProgramName, add, update, remove, reset } = useStakeholders()
  const [selectedId, setSelectedId] = useState(null)
  const [activeTab, setActiveTab] = useState('grid')
  const [editingTitle, setEditingTitle] = useState(false)

  const handleSelect = (id) => setSelectedId(id === selectedId ? null : id)

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.wordmark}>
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="6" fill="#0E6B5E" />
              <path d="M8 10h16M16 10v12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="16" cy="24" r="2" fill="#6EE7C7" />
            </svg>
            <span className={styles.wordmarkText}>Thruline</span>
          </div>
          <div className={styles.titleBlock}>
            <h1 className={styles.titleMain}>Interest Holder Mapping</h1>
            <div className={styles.titleMeta}>
              <span className={styles.badge}>LLO 8230</span>
              <span className={styles.badgeSep}>·</span>
              <span className={styles.badgeLight}>Vanderbilt Peabody College</span>
            </div>
          </div>
        </div>

        <div className={styles.headerRight}>
          {editingTitle ? (
            <input
              className={styles.programInput}
              value={programName}
              placeholder="Enter program name…"
              onChange={(e) => setProgramName(e.target.value)}
              onBlur={() => setEditingTitle(false)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') setEditingTitle(false) }}
              autoFocus
            />
          ) : (
            <button
              type="button"
              className={styles.programBtn}
              onClick={() => setEditingTitle(true)}
              title="Click to set program name"
            >
              {programName || '+ Set program name'}
            </button>
          )}
          <button
            type="button"
            className={[styles.iconBtn, 'no-print'].join(' ')}
            onClick={() => window.print()}
            title="Print / Export PDF"
          >
            ⎙ Print
          </button>
          <button
            type="button"
            className={[styles.iconBtn, styles.iconBtnGhost, 'no-print'].join(' ')}
            onClick={() => { if (window.confirm('Reset to sample data?')) reset() }}
            title="Reset to sample data"
          >
            ↺ Reset
          </button>
        </div>
      </header>

      {/* Main layout */}
      <div className={styles.main}>
        {/* Left sidebar: stakeholder list */}
        <aside className={[styles.sidebar, 'no-print'].join(' ')}>
          <StakeholderList
            stakeholders={stakeholders}
            selectedId={selectedId}
            onSelect={handleSelect}
            onAdd={add}
            onUpdate={update}
            onRemove={remove}
          />
        </aside>

        {/* Charts area */}
        <div className={styles.charts}>
          {/* Tab switcher */}
          <div className={[styles.tabs, 'no-print'].join(' ')}>
            <button
              type="button"
              className={[styles.tab, activeTab === 'grid' ? styles.tabActive : ''].join(' ')}
              onClick={() => setActiveTab('grid')}
            >
              Power-Interest Grid
            </button>
            <button
              type="button"
              className={[styles.tab, activeTab === 'blast' ? styles.tabActive : ''].join(' ')}
              onClick={() => setActiveTab('blast')}
            >
              Blast Radius
            </button>
            <button
              type="button"
              className={[styles.tab, activeTab === 'both' ? styles.tabActive : ''].join(' ')}
              onClick={() => setActiveTab('both')}
            >
              Both
            </button>
          </div>

          <div className={styles.chartPanels}>
            {/* Power-Interest Grid panel */}
            {(activeTab === 'grid' || activeTab === 'both') && (
              <section className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h2 className={styles.panelTitle}>Power-Interest Grid</h2>
                  <p className={styles.panelSub}>
                    Drag stakeholders to position them by power and interest.
                  </p>
                </div>
                <div className={styles.gridContainer}>
                  <PowerInterestGrid
                    stakeholders={stakeholders}
                    selectedId={selectedId}
                    onSelect={handleSelect}
                    onUpdate={update}
                  />
                </div>
                <div className={styles.quadrantKey}>
                  <QuadrantKey />
                </div>
              </section>
            )}

            {/* Blast Radius panel */}
            {(activeTab === 'blast' || activeTab === 'both') && (
              <section className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h2 className={styles.panelTitle}>Blast Radius</h2>
                  <p className={styles.panelSub}>
                    Stakeholders grouped by proximity of impact from the program epicenter.
                  </p>
                </div>
                <BlastRadius
                  stakeholders={stakeholders}
                  programName={programName}
                  selectedId={selectedId}
                  onSelect={handleSelect}
                />
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Print-only list */}
      <div className={styles.printList}>
        <h2 className={styles.printHeading}>Interest Holder List</h2>
        <table className={styles.printTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Impact Level</th>
              <th>Power</th>
              <th>Interest</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {stakeholders.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.role}</td>
                <td style={{ textTransform: 'capitalize' }}>{s.blastRadius}</td>
                <td>{Math.round(s.power * 10)}/10</td>
                <td>{Math.round(s.interest * 10)}/10</td>
                <td>{s.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function QuadrantKey() {
  const items = [
    { q: 'high-high', label: 'High Power · High Interest', action: 'Manage Closely' },
    { q: 'high-low',  label: 'High Power · Low Interest',  action: 'Keep Satisfied' },
    { q: 'low-high',  label: 'Low Power · High Interest',  action: 'Keep Informed' },
    { q: 'low-low',   label: 'Low Power · Low Interest',   action: 'Monitor' },
  ]
  const bgs = { 'high-high': '#EFF6FF', 'high-low': '#F0FDF4', 'low-high': '#FDF4FF', 'low-low': '#F8FAFC' }
  return (
    <div className={styles.keyGrid}>
      {items.map(({ q, label, action }) => (
        <div key={q} className={styles.keyItem} style={{ background: bgs[q] }}>
          <strong className={styles.keyAction}>{action}</strong>
          <span className={styles.keyLabel}>{label}</span>
        </div>
      ))}
    </div>
  )
}
