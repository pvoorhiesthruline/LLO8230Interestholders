import { useRef, useState, useCallback, useLayoutEffect } from 'react'
import ChartChip from './ChartChip'
import { BLAST_RADIUS_LEVELS, BLAST_RADIUS_META } from '../data/palette'
import styles from './BlastRadius.module.css'

const RINGS = [
  { level: 'critical', r: 0.24 },
  { level: 'high',     r: 0.46 },
  { level: 'medium',   r: 0.68 },
  { level: 'low',      r: 0.90 },
]

const RING_RADII = { critical: 0.24, high: 0.46, medium: 0.68, low: 0.90 }

function hitLevel(svgEl, clientX, clientY) {
  const rect = svgEl.getBoundingClientRect()
  const x = ((clientX - rect.left) / rect.width) * 2 - 1
  const y = ((clientY - rect.top) / rect.height) * 2 - 1
  const d = Math.sqrt(x * x + y * y)
  if (d <= 0.24) return 'critical'
  if (d <= 0.46) return 'high'
  if (d <= 0.68) return 'medium'
  return 'low'
}

function overSvg(svgEl, clientX, clientY) {
  const r = svgEl.getBoundingClientRect()
  return clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom
}

// Distribute n chips evenly around a ring, starting at 45° (bottom-right in SVG coords)
// to stay clear of the ring label which sits at the top (270°).
function chipPos(level, index, total, w, h) {
  const r = RING_RADII[level]
  const angle = Math.PI / 4 + (2 * Math.PI * index) / Math.max(total, 1)
  return {
    x: (r * Math.cos(angle) + 1) / 2 * w,
    y: (r * Math.sin(angle) + 1) / 2 * h,
  }
}

export default function BlastRadius({ stakeholders, programName, selectedId, onSelect, onUpdate }) {
  const svgRef = useRef(null)
  const activeId = useRef(null)
  const captureRef = useRef(null)
  const [svgSize, setSvgSize] = useState({ width: 400, height: 400 })
  const [draggingId, setDraggingId] = useState(null)
  const [ghost, setGhost] = useState(null)
  const [hoverLevel, setHoverLevel] = useState(null)

  // Keep svgSize in sync with actual rendered dimensions
  useLayoutEffect(() => {
    if (!svgRef.current) return
    const update = () => {
      const { width, height } = svgRef.current.getBoundingClientRect()
      setSvgSize({ width, height })
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(svgRef.current)
    return () => ro.disconnect()
  }, [])

  const exportPng = useCallback(async () => {
    if (!captureRef.current) return
    const { toPng } = await import('html-to-image')
    const dataUrl = await toPng(captureRef.current, {
      pixelRatio: 2,
      backgroundColor: '#FBFAF7',
    })
    const a = document.createElement('a')
    a.download = 'blast-radius.png'
    a.href = dataUrl
    a.click()
  }, [])

  const byLevel = {}
  BLAST_RADIUS_LEVELS.forEach((l) => { byLevel[l] = [] })
  stakeholders.forEach((s) => {
    if (byLevel[s.blastRadius]) byLevel[s.blastRadius].push(s)
  })

  const startDrag = useCallback((e, s) => {
    e.preventDefault()
    onSelect(s.id)

    const startX = e.touches ? e.touches[0].clientX : e.clientX
    const startY = e.touches ? e.touches[0].clientY : e.clientY
    let moved = false
    activeId.current = s.id

    const onMove = (ev) => {
      const x = ev.touches ? ev.touches[0].clientX : ev.clientX
      const y = ev.touches ? ev.touches[0].clientY : ev.clientY
      const dx = x - startX, dy = y - startY
      if (!moved && Math.sqrt(dx * dx + dy * dy) < 5) return
      if (!moved) {
        moved = true
        setDraggingId(s.id)
        setGhost({ x, y, name: s.name, color: s.color })
      } else {
        setGhost(g => ({ ...g, x, y }))
      }
      setHoverLevel(
        svgRef.current && overSvg(svgRef.current, x, y)
          ? hitLevel(svgRef.current, x, y)
          : null
      )
    }

    const onUp = (ev) => {
      const x = ev.changedTouches ? ev.changedTouches[0].clientX : ev.clientX
      const y = ev.changedTouches ? ev.changedTouches[0].clientY : ev.clientY
      if (moved && svgRef.current && activeId.current && overSvg(svgRef.current, x, y)) {
        onUpdate(activeId.current, { blastRadius: hitLevel(svgRef.current, x, y) })
      }
      activeId.current = null
      setDraggingId(null)
      setGhost(null)
      setHoverLevel(null)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onUp)
  }, [onUpdate, onSelect])

  return (
    <>
    <div className={styles.layout} ref={captureRef}>
      {/* Ghost chip follows cursor during drag */}
      {ghost && (
        <div
          style={{
            position: 'fixed',
            left: ghost.x,
            top: ghost.y,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        >
          <ChartChip name={ghost.name} color={ghost.color} size="sm" />
        </div>
      )}

      {/* SVG diagram + chips overlaid on rings */}
      <div className={styles.svgWrap}>
        <svg
          ref={svgRef}
          viewBox="-1 -1 2 2"
          preserveAspectRatio="xMidYMid meet"
          className={styles.svg}
          style={{ cursor: draggingId ? 'crosshair' : 'default' }}
        >
          {[...RINGS].reverse().map(({ level, r }) => {
            const isHovered = hoverLevel === level
            const dimmed = !!draggingId && !isHovered
            return (
              <circle
                key={level}
                cx={0} cy={0} r={r}
                fill={isHovered
                  ? BLAST_RADIUS_META[level].color + '28'
                  : BLAST_RADIUS_META[level].bg}
                stroke={BLAST_RADIUS_META[level].color}
                strokeWidth={isHovered ? 0.028 : 0.014}
                strokeDasharray={isHovered ? undefined : '0.05 0.025'}
                opacity={dimmed ? 0.45 : 0.9}
              />
            )
          })}

          <circle cx={0} cy={0} r={0.12}
            fill={`${BLAST_RADIUS_META.critical.color}18`}
            stroke={BLAST_RADIUS_META.critical.color}
            strokeWidth={0.018}
          />

          {[0, 45, 90, 135].map((deg) => {
            const rad = (deg * Math.PI) / 180
            const x = Math.cos(rad) * 0.90
            const y = Math.sin(rad) * 0.90
            return (
              <line key={deg} x1={-x} y1={-y} x2={x} y2={y}
                stroke="rgba(44,40,35,0.05)" strokeWidth={0.010} />
            )
          })}

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
              fill="#6F6A60"
            >
              {programName.length > 18 ? programName.slice(0, 17) + '…' : programName}
            </text>
          )}
        </svg>

        {/* Chips live on the rings */}
        {BLAST_RADIUS_LEVELS.flatMap(level =>
          byLevel[level].map((s, i) => {
            const { x, y } = chipPos(level, i, byLevel[level].length, svgSize.width, svgSize.height)
            return (
              <div
                key={s.id}
                className={styles.chipOnRing}
                style={{
                  left: x,
                  top: y,
                  opacity: draggingId === s.id ? 0.2 : 1,
                  zIndex: selectedId === s.id ? 5 : 2,
                }}
                onMouseDown={(e) => startDrag(e, s)}
                onTouchStart={(e) => startDrag(e, s)}
              >
                <ChartChip
                  name={s.name}
                  color={s.color}
                  size="sm"
                  selected={s.id === selectedId}
                />
              </div>
            )
          })
        )}
      </div>

      {/* Text legend — read-only reference */}
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
                <p className={styles.empty}>None assigned</p>
              ) : (
                <ul className={styles.nameList}>
                  {items.map((s) => (
                    <li
                      key={s.id}
                      className={[styles.nameItem, selectedId === s.id ? styles.nameItemSelected : ''].filter(Boolean).join(' ')}
                      onClick={() => onSelect(s.id)}
                    >
                      <span className={styles.nameDot} style={{ background: s.color }} />
                      {s.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </div>
    <div className={['no-print', styles.exportRow].join(' ')}>
      <button className={styles.exportBtn} onClick={exportPng}>⬇ Export as image</button>
    </div>
    </>
  )
}
