import ChartChip from './ChartChip'
import { BLAST_RADIUS_LEVELS, BLAST_RADIUS_META } from '../data/palette'
import styles from './BlastRadius.module.css'

const RINGS = [
  { level: 'critical', r: 0.24 },
  { level: 'high',     r: 0.46 },
  { level: 'medium',   r: 0.68 },
  { level: 'low',      r: 0.90 },
]

export default function BlastRadius({ stakeholders, programName, selectedId, onSelect }) {
  const byLevel = {}
  BLAST_RADIUS_LEVELS.forEach((l) => { byLevel[l] = [] })
  stakeholders.forEach((s) => {
    if (byLevel[s.blastRadius]) byLevel[s.blastRadius].push(s)
  })

  return (
    <div className={styles.layout}>
      {/* SVG diagram */}
      <div className={styles.svgWrap}>
        <svg viewBox="-1 -1 2 2" preserveAspectRatio="xMidYMid meet" className={styles.svg}>
          {[...RINGS].reverse().map(({ level, r }) => (
            <circle
              key={level}
              cx={0} cy={0} r={r}
              fill={BLAST_RADIUS_META[level].bg}
              stroke={BLAST_RADIUS_META[level].color}
              strokeWidth={0.014}
              strokeDasharray="0.05 0.025"
              opacity={0.9}
            />
          ))}

          {/* Epicenter dot */}
          <circle cx={0} cy={0} r={0.12}
            fill={`${BLAST_RADIUS_META.critical.color}18`}
            stroke={BLAST_RADIUS_META.critical.color}
            strokeWidth={0.018}
          />

          {/* Spoke lines at 45° intervals */}
          {[0, 45, 90, 135].map((deg) => {
            const rad = (deg * Math.PI) / 180
            const x = Math.cos(rad) * 0.90
            const y = Math.sin(rad) * 0.90
            return (
              <line key={deg} x1={-x} y1={-y} x2={x} y2={y}
                stroke="rgba(11,18,32,0.05)" strokeWidth={0.010} />
            )
          })}

          {/* Ring labels at top of each ring */}
          {RINGS.map(({ level, r }) => (
            <text key={level}
              x={0} y={-(r - 0.03)}
              textAnchor="middle"
              fontSize={0.07}
              fontFamily="'Inter Tight', sans-serif"
              fontWeight="700"
              fill={BLAST_RADIUS_META[level].color}
              opacity={0.8}
            >
              {BLAST_RADIUS_META[level].label.toUpperCase()}
            </text>
          ))}

          {/* Epicenter text */}
          <text x={0} y={-0.005}
            textAnchor="middle"
            fontSize={0.065}
            fontFamily="'Inter Tight', sans-serif"
            fontWeight="800"
            fill={BLAST_RADIUS_META.critical.color}
            letterSpacing="0.01"
          >
            EPICENTER
          </text>
          {programName && (
            <text x={0} y={0.075}
              textAnchor="middle"
              fontSize={0.055}
              fontFamily="'Inter Tight', sans-serif"
              fontWeight="500"
              fill="#4B5563"
            >
              {programName.length > 18 ? programName.slice(0, 17) + '…' : programName}
            </text>
          )}
        </svg>
      </div>

      {/* Grouped chip legend */}
      <div className={styles.legend}>
        {BLAST_RADIUS_LEVELS.map((level) => {
          const items = byLevel[level]
          const meta  = BLAST_RADIUS_META[level]
          return (
            <div key={level} className={styles.group}>
              <div className={styles.groupHeader} style={{ '--level-color': meta.color }}>
                <span className={styles.groupDot} />
                <span className={styles.groupLabel}>{meta.label} Impact</span>
                <span className={styles.groupCount}>{items.length}</span>
              </div>
              {items.length === 0 ? (
                <p className={styles.empty}>No stakeholders assigned</p>
              ) : (
                <div className={styles.chips}>
                  {items.map((s) => (
                    <ChartChip
                      key={s.id}
                      name={s.name}
                      color={s.color}
                      size="sm"
                      selected={s.id === selectedId}
                      onClick={() => onSelect(s.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
