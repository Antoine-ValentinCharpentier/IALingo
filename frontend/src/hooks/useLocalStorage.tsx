import { useEffect, useState } from 'react'

const PREFIX = 'IALingo-'

export default function useLocalStorage(key: string, defaultValue: any) {
  const prefixedKey = PREFIX + key
  
  const [value, setValue] = useState(() => {
    const jsonValue = localStorage.getItem(prefixedKey)
    if (jsonValue) {
      try {
        return JSON.parse(jsonValue)
      } catch (e) {
        return jsonValue
      }
    }
    return defaultValue
  })

  useEffect(() => {
    if (typeof value === 'string') {
      localStorage.setItem(prefixedKey, value)
    } else {
      localStorage.setItem(prefixedKey, JSON.stringify(value))
    }
  }, [prefixedKey, value])

  return [value, setValue]
}
