import { useEffect, useState } from 'react'

const PREFIX = 'IALingo-'

export default function useLocalStorage(key: string, defaultValue: any) {
  const prefixedKey = PREFIX + key
  
  const [value, setValue] = useState(() => {
    const jsonValue = localStorage.getItem(prefixedKey)
    if (jsonValue && jsonValue !== 'undefined') {
      return JSON.parse(jsonValue)
    }
    return defaultValue
  })

  useEffect(() => {
    localStorage.setItem(prefixedKey, JSON.stringify(value))
  }, [prefixedKey, value])

  return [value, setValue]
}