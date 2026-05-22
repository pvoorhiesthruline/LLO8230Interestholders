import { useState, useEffect } from 'react'
import { CHIP_COLORS, BLAST_RADIUS_LEVELS, BLAST_RADIUS_META } from '../data/palette'
import styles from './StakeholderList.module.css'

const ROLES = ['Primary', 'Secondary', 'Tertiary']
const SCALE = Array.from({ length: 10 }, (_, i) => i + 1)

const toScale = (v) => Math.max(1, Math.min(10, Math.round((v ?? 0.5) * 10)))
const fromScale = (n) => n / 10

function AddForm({ onAdd, onCancel }) {
  const [name,     setName]     = useState('')
  const [color,    setColor]    = useState(CHIP_COLORS[0].value)
  const [role,     setRole]     = useState('Primary')
  const [blast,    setBlast]    = useState('medium')
  const [notes,    setNotes]    = useState('')
  const [power,    setPower]    = useState(5)
  const [interest, setInterest] = useState(5)

  const submit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onAdd({
      name: name.trim(), color, role, blastRadius: blast, notes,
      power: fromScale(power), interest: fromScale(interest),
    })
  }

  return (
    <form className={styles.addForm} onSubmit={submit}>
      <div className={styles.formRow}>
        <input
          className={styles.input}
          placeholder="Stakeholder name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          required
        />
      </div>

      <div className={styles.formRow2}>
        <div className={styles.formField}>
          <label className={styles.label}>Chip color</label>
          <div className={styles.colorPicker}>
            {CHIP_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                className={[styles.swatch, color === c.value ? styles.swatchActive : ''].join(' ')}
                style={{ '--sw': c.value }}
                title={c.label}
                onClick={() => setColor(c.value)}
              />
            ))}
          </div>
        </div>

        <div className={styles.formField}>
          <label className={styles.label}>Role</label>
          <select className={styles.select} value={role} onChange={(e) => setRole(e.target.value)}>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className={styles.formField}>
          <label className={styles.label}>Impact level</label>
          <select className={styles.select} value={blast} onChange={(e) => setBlast(e.target.value)}>
            {BLAST_RADIUS_LEVELS.map((l) => (
              <option key={l} value={l}>{BLAST_RADIUS_META[l].label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.formRow2}>
        <div className={styles.formField}>
          <label className={styles.label}>Power (1–10)</label>
          <select className={styles.select} value={power} onChange={(e) => setPower(Number(e.target.value))}>
            {SCALE.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        <div className={styles.formField}>
          <label className={styles.label}>Interest (1–10)</label>
          <select className={styles.select} value={interest} onChange={(e) => setInterest(Number(e.target.value))}>
            {SCALE.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <textarea
        className={styles.textarea}
        placeholder="Notes (optional)"
        rows={2}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <div className={styles.formActions}>
        <button type="button" className={styles.btnGhost} onClick={onCancel}>Cancel</button>
        <button type="submit" className={styles.btnPrimary} disabled={!name.trim()}>Add stakeholder</button>
      </div>
    </form>
  )
}

function EditRow({ stakeholder, onUpdate, onRemove, onClose }) {
  const [name,     setName]     = useState(stakeholder.name)
  const [color,    setColor]    = useState(stakeholder.color)
  const [role,     setRole]     = useState(stakeholder.role || 'Primary')
  const [blast,    setBlast]    = useState(stakeholder.blastRadius)
  const [notes,    setNotes]    = useState(stakeholder.notes || '')
  const [power,    setPower]    = useState(() => toScale(stakeholder.power))
  const [interest, setInterest] = useState(() => toScale(stakeholder.interest))

  // Keep dropdowns in sync if the grid chip is dragged while this form is open
  useEffect(() => {
    setPower(toScale(stakeholder.power))
    setInterest(toScale(stakeholder.interest))
  }, [stakeholder.power, stakeholder.interest])

  const save = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onUpdate(stakeholder.id, {
      name: name.trim(), color, role, blastRadius: blast, notes,
      power: fromScale(power), interest: fromScale(interest),
    })
    onClose()
  }

  return (
    <form className={styles.editForm} onSubmit={save}>
      <div className={styles.formRow}>
        <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className={styles.formRow2}>
        <div className={styles.formField}>
          <label className={styles.label}>Color</label>
          <div className={styles.colorPicker}>
            {CHIP_COLORS.map((c) => (
              <button key={c.value} type="button"
                className={[styles.swatch, color === c.value ? styles.swatchActive : ''].join(' ')}
                style={{ '--sw': c.value }} title={c.label}
                onClick={() => setColor(c.value)}
              />
            ))}
          </div>
        </div>
        <div className={styles.formField}>
          <label className={styles.label}>Role</label>
          <select className={styles.select} value={role} onChange={(e) => setRole(e.target.value)}>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className={styles.formField}>
          <label className={styles.label}>Impact</label>
          <select className={styles.select} value={blast} onChange={(e) => setBlast(e.target.value)}>
            {BLAST_RADIUS_LEVELS.map((l) => (
              <option key={l} value={l}>{BLAST_RADIUS_META[l].label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles.formRow2}>
        <div className={styles.formField}>
          <label className={styles.label}>Power (1–10)</label>
          <select className={styles.select} value={power} onChange={(e) => setPower(Number(e.target.value))}>
            {SCALE.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className={styles.formField}>
          <label className={styles.label}>Interest (1–10)</label>
          <select className={styles.select} value={interest} onChange={(e) => setInterest(Number(e.target.value))}>
            {SCALE.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>
      <textarea className={styles.textarea} placeholder="Notes" rows={2}
        value={notes} onChange={(e) => setNotes(e.target.value)} />
      <div className={styles.formActions}>
        <button type="button" className={[styles.btnGhost, styles.btnDanger].join(' ')}
          onClick={() => { onRemove(stakeholder.id); onClose() }}>
          Delete
        </button>
        <button type="button" className={styles.btnGhost} onClick={onClose}>Cancel</button>
        <button type="submit" className={styles.btnPrimary}>Save</button>
      </div>
    </form>
  )
}

export default function StakeholderList({ stakeholders, selectedId, onSelect, onAdd, onUpdate, onRemove }) {
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState(null)

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3 className={styles.title}>Interest Holders</h3>
        <span className={styles.count}>{stakeholders.length}</span>
        <button
          type="button"
          className={styles.addBtn}
          onClick={() => { setAdding(true); setEditing(null) }}
        >
          + Add
        </button>
      </div>

      {adding && (
        <AddForm
          onAdd={(fields) => { onAdd(fields); setAdding(false) }}
          onCancel={() => setAdding(false)}
        />
      )}

      <ul className={styles.list}>
        {stakeholders.map((s) => {
          const meta = BLAST_RADIUS_META[s.blastRadius]
          const isEditing = editing === s.id
          return (
            <li key={s.id} className={[styles.item, selectedId === s.id ? styles.itemSelected : ''].join(' ')}>
              <div
                className={styles.itemMain}
                onClick={() => { onSelect(s.id === selectedId ? null : s.id); setEditing(null) }}
              >
                <span className={styles.itemDot} style={{ background: s.color }} />
                <span className={styles.itemName}>{s.name}</span>
                <span
                  className={styles.levelBadge}
                  style={{ '--badge-color': meta.color, '--badge-bg': meta.bg }}
                >
                  {meta.label}
                </span>
                {s.role && (
                  <span className={styles.roleBadge}>{s.role}</span>
                )}
                <button
                  type="button"
                  className={styles.editBtn}
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditing(isEditing ? null : s.id)
                    setAdding(false)
                  }}
                  aria-label="Edit"
                >
                  ✎
                </button>
              </div>

              {isEditing && (
                <EditRow
                  stakeholder={s}
                  onUpdate={onUpdate}
                  onRemove={onRemove}
                  onClose={() => setEditing(null)}
                />
              )}

              {!isEditing && s.notes && selectedId === s.id && (
                <p className={styles.notes}>{s.notes}</p>
              )}
            </li>
          )
        })}

        {stakeholders.length === 0 && (
          <li className={styles.emptyState}>
            No stakeholders yet. Click <strong>+ Add</strong> to begin.
          </li>
        )}
      </ul>
    </div>
  )
}
