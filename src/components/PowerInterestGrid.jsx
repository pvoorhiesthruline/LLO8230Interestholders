import { useRef, useState, useCallback, useLayoutEffect } from 'react'
import ChartChip from './ChartChip'
import { toPixelPos, fromPixelPos } from '../utils/gridUtils'
import { QUADRANT_META } from '../data/palette'
import styles from './PowerInterestGrid.module.css'

const PADDING = 0
const CHIP_OFFSET = 10 // half-height of chip for centering

export default function PowerInterestGrid({ stakeholders, selectedId, onSelect, onUpdate }) {
  const gridRef = useRef(null)
  const dragging = useRef(null)
  const [gridSize, setGridSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    if (!gridRef.current) return
    const update = () => {
      const { width, height } = gridRef.current.getBoundingClientRect()
      setGridSize({ width, height })
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(gridRef.current)
    return () => ro.disconnect()
  }, [])

  const startDrag = useCallback((e, id) => {
    e.preventDefault()
    onSelect(id)
    dragging.current = id

    const onMove = (ev) => {
      const el = gridRef.current
      if (!el || !dragging.current) return
      const rect = el.getBoundingClientRect()
      const clientX = ev.touches ? ev.touches[0].clientX : ev.clientX
      const clientY = ev.touches ? ev.touches[0].clientY : ev.clientY
      const x = clientX - rect.left
      const y = clientY - rect.top
      const { interest, power } = fromPixelPos(x, y, rect.width, rect.height, PADDING)
      onUpdate(dragging.current, { interest, power })
    }

    const onUp = () => {
      dragging.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onUp)
  }, [onSelect, onUpdate])

  const quadrants = [
    { key: 'high-high', label: 'High Power · High Interest', style: { top: 0, left: '50%', width: '50%', height: '50%' } },
    { key: 'high-low',  label: 'High Power · Low Interest',  style: { top: 0, left: 0, width: '50%', height: '50%' } },
    { key: 'low-high',  label: 'Low Power · High Interest',  style: { top: '50%', left: '50%', width: '50%', height: '50%' } },
    { key: 'low-low',   label: 'Low Power · Low Interest',   style: { top: '50%', left: 0, width: '50%', height: '50%' } },
  ]

  return (
    <div className={styles.wrapper}>
      <div className={styles.axisLabelY}>
        <span>Power</span>
        <span className={styles.axisArrow}>↑ High</span>
      </div>

      <div className={styles.gridCol}>
        <div className={styles.grid} ref={gridRef}>
          {/* Quadrant backgrounds */}
          {quadrants.map(({ key, style }) => (
            <div
              key={key}
              className={styles.quadrant}
              style={{ ...style, background: QUADRANT_META[key].bg }}
            >
              <span className={styles.quadrantLabel}>{QUADRANT_META[key].label}</span>
              <span className={styles.quadrantSub}>{QUADRANT_META[key].sub}</span>
            </div>
          ))}

          {/* Axis lines */}
          <div className={styles.axisH} />
          <div className={styles.axisV} />

          {/* Chips */}
          {gridSize.width > 0 && stakeholders.map((s) => {
            const { x, y } = toPixelPos(s.interest, s.power, gridSize.width, gridSize.height, PADDING)
            return (
              <div
                key={s.id}
                className={styles.chipWrapper}
                style={{ left: x, top: y - CHIP_OFFSET }}
                onMouseDown={(e) => startDrag(e, s.id)}
                onTouchStart={(e) => startDrag(e, s.id)}
              >
                <ChartChip
                  name={s.name}
                  color={s.color}
                  selected={s.id === selectedId}
                  size="sm"
                />
              </div>
            )
          })}
        </div>

        <div className={styles.axisLabelX}>
          <span>Low Interest</span>
          <span className={styles.axisArrow}>→</span>
          <span>High Interest</span>
        </div>
      </div>
    </div>
  )
}
