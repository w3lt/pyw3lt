import { useEffect, useState } from "react"

const useNow = () => {
  const [now, setNow] = useState(new Date())

  useEffect(() => { // Update after each minute
    const interval = setInterval(() => {
      setNow(new Date())
    }, 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return now
}

export default useNow