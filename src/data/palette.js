// Thruline brand color palette
export const BRAND = {
  forestTeal: '#0E6B5E',
  neoMint:    '#10B981',
  aquaFoam:   '#6EE7C7',
  navy:       '#1B1F4B',
  cobalt:     '#2D5BE3',
  sky:        '#5B9BF0',
  veriPeri:   '#6B4FD8',
  periwinkle: '#A78BFA',
  blueIris:   '#3D4EBF',
  ink:        '#0B1220',
  inkDeep:    '#06091A',
  paper:      '#FAFAF7',
  paperWarm:  '#F3F1EA',
  paperDark:  '#0E1530',
}

// Chip colors available when adding stakeholders
export const CHIP_COLORS = [
  { label: 'Teal',       value: '#0E6B5E' },
  { label: 'Mint',       value: '#10B981' },
  { label: 'Cobalt',     value: '#2D5BE3' },
  { label: 'Sky',        value: '#5B9BF0' },
  { label: 'Violet',     value: '#6B4FD8' },
  { label: 'Periwinkle', value: '#A78BFA' },
  { label: 'Rose',       value: '#E45B8B' },
  { label: 'Amber',      value: '#D97706' },
  { label: 'Slate',      value: '#475569' },
  { label: 'Navy',       value: '#1B1F4B' },
]

export const BLAST_RADIUS_LEVELS = ['critical', 'high', 'medium', 'low']

export const BLAST_RADIUS_META = {
  critical: { label: 'Critical',  color: '#C0392B', bg: '#FEF2F2' },
  high:     { label: 'High',      color: '#D97706', bg: '#FFFBEB' },
  medium:   { label: 'Medium',    color: '#2D5BE3', bg: '#EEF2FF' },
  low:      { label: 'Low',       color: '#475569', bg: '#F8FAFC' },
}

export const QUADRANT_META = {
  'high-high': {
    label: 'Manage Closely',
    sub:   'Actively engage',
    bg:    '#EFF6FF',
  },
  'high-low': {
    label: 'Keep Satisfied',
    sub:   'Meet their needs',
    bg:    '#F0FDF4',
  },
  'low-high': {
    label: 'Keep Informed',
    sub:   'Regular updates',
    bg:    '#FDF4FF',
  },
  'low-low': {
    label: 'Monitor',
    sub:   'Minimal effort',
    bg:    '#F8FAFC',
  },
}
