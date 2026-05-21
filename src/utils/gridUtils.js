/**
 * Convert normalized [0,1] interest/power values to pixel position within a grid element.
 * interest → X axis (left to right = low to high)
 * power    → Y axis (top to bottom = high to low)
 */
export function toPixelPos(interest, power, width, height, padding = 0) {
  return {
    x: padding + interest * (width - padding * 2),
    y: padding + (1 - power) * (height - padding * 2),
  }
}

/**
 * Convert pixel position back to [0,1] normalized values.
 */
export function fromPixelPos(x, y, width, height, padding = 0) {
  const inner = { w: width - padding * 2, h: height - padding * 2 }
  return {
    interest: Math.min(1, Math.max(0, (x - padding) / inner.w)),
    power:    Math.min(1, Math.max(0, 1 - (y - padding) / inner.h)),
  }
}

/**
 * Determine which quadrant a stakeholder belongs to.
 * Returns one of: 'high-high' | 'high-low' | 'low-high' | 'low-low'
 * (power-interest)
 */
export function getQuadrant(power, interest) {
  const p = power    >= 0.5 ? 'high' : 'low'
  const i = interest >= 0.5 ? 'high' : 'low'
  return `${p}-${i}`
}

/**
 * Generate a unique ID.
 */
export function uid() {
  return `sh-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}
