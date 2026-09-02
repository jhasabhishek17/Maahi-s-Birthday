import { createContext, useContext, useState, useCallback } from 'react'

export const HiddenFlowerContext = createContext(null)

export function HiddenFlowerProvider({ children }) {
  const [foundFlowers, setFoundFlowers] = useState(new Set())
  const totalFlowers = 7

  const findFlower = useCallback((id) => {
    setFoundFlowers(prev => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }, [])

  const allFound = foundFlowers.size >= totalFlowers

  return (
    <HiddenFlowerContext.Provider value={{ foundFlowers, totalFlowers, findFlower, allFound }}>
      {children}
    </HiddenFlowerContext.Provider>
  )
}

export function useHiddenFlowers() {
  const ctx = useContext(HiddenFlowerContext)
  if (!ctx) throw new Error('useHiddenFlowers must be used within HiddenFlowerProvider')
  return ctx
}
