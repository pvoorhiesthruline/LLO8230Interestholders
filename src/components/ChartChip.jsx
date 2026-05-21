import styles from './ChartChip.module.css'

/**
 * A small pill-shaped label used to represent a stakeholder on charts.
 *
 * Props:
 *   name     – stakeholder name
 *   color    – background color for the leading dot
 *   size     – 'sm' | 'md' (default 'md')
 *   selected – highlight ring
 *   onClick  – handler
 */
export default function ChartChip({ name, color, size = 'md', selected = false, onClick }) {
  return (
    <button
      type="button"
      className={[styles.chip, styles[size], selected ? styles.selected : ''].filter(Boolean).join(' ')}
      style={{ '--dot-color': color }}
      onClick={onClick}
      title={name}
    >
      <span className={styles.dot} />
      <span className={styles.label}>{name}</span>
    </button>
  )
}
