import { useState, useCallback } from 'react'
import { SAMPLE_STAKEHOLDERS } from '../data/sampleData'
import { uid } from '../utils/gridUtils'

const STORAGE_KEY = 'llo8230-stakeholders'
const PROGRAM_KEY = 'llo8230-program-name'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : SAMPLE_STAKEHOLDERS
  } catch {
    return SAMPLE_STAKEHOLDERS
  }
}

function save(stakeholders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stakeholders))
}

function loadProgram() {
  return localStorage.getItem(PROGRAM_KEY) || ''
}

function saveProgram(name) {
  localStorage.setItem(PROGRAM_KEY, name)
}

export default function useStakeholders() {
  const [stakeholders, setStakeholders] = useState(load)
  const [programName, setProgramNameState] = useState(loadProgram)

  const setProgramName = useCallback((name) => {
    setProgramNameState(name)
    saveProgram(name)
  }, [])

  const add = useCallback((fields) => {
    setStakeholders((prev) => {
      const next = [...prev, { id: uid(), power: 0.5, interest: 0.5, blastRadius: 'medium', role: 'Primary', notes: '', ...fields }]
      save(next)
      return next
    })
  }, [])

  const update = useCallback((id, fields) => {
    setStakeholders((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...fields } : s))
      save(next)
      return next
    })
  }, [])

  const remove = useCallback((id) => {
    setStakeholders((prev) => {
      const next = prev.filter((s) => s.id !== id)
      save(next)
      return next
    })
  }, [])

  const reset = useCallback(() => {
    setStakeholders(SAMPLE_STAKEHOLDERS)
    save(SAMPLE_STAKEHOLDERS)
  }, [])

  return { stakeholders, programName, setProgramName, add, update, remove, reset }
}
