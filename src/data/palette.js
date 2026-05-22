// Vanderbilt University brand palette
export const BRAND = {
  gold:    '#CFAE70',
  goldD:   '#B49248',
  oak:     '#946E24',
  black:   '#1C1C1C',
  ink:     '#2A2825',
  cream:   '#F5F3EF',
  paper:   '#FBFAF7',
  sand:    '#E0D5C0',
  rule:    '#D8D2C5',
  muted:   '#6F6A60',
}

// Chip colors available when adding stakeholders
export const CHIP_COLORS = [
  { label: 'Gold',        value: '#CFAE70' },
  { label: 'Oak',         value: '#946E24' },
  { label: 'Warm Brown',  value: '#8B5E3C' },
  { label: 'Sage',        value: '#4A7C59' },
  { label: 'Forest',      value: '#2D5F3F' },
  { label: 'Teal',        value: '#1A6B6B' },
  { label: 'Slate Blue',  value: '#3B5B8C' },
  { label: 'Rose',        value: '#C0524F' },
  { label: 'Charcoal',    value: '#3D3D3D' },
  { label: 'Plum',        value: '#6B5B8C' },
]

export const BLAST_RADIUS_LEVELS = ['critical', 'high', 'medium', 'low']

export const BLAST_RADIUS_META = {
  critical: { label: 'Critical', color: '#9B2226', bg: '#FDF0EF' },
  high:     { label: 'High',     color: '#AE5A1A', bg: '#FBF3E8' },
  medium:   { label: 'Medium',   color: '#2D6B8C', bg: '#EDF4F8' },
  low:      { label: 'Low',      color: '#4A5568', bg: '#F5F3EF' },
}

export const QUADRANT_META = {
  'high-high': {
    label: 'Manage Closely',
    sub:   'Actively engage',
    bg:    '#FAF3E0',
  },
  'high-low': {
    label: 'Keep Satisfied',
    sub:   'Meet their needs',
    bg:    '#F5F3EF',
  },
  'low-high': {
    label: 'Keep Informed',
    sub:   'Regular updates',
    bg:    '#EEF4F8',
  },
  'low-low': {
    label: 'Monitor',
    sub:   'Minimal effort',
    bg:    '#FBFAF7',
  },
}
