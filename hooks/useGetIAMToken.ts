"use client"
import { useCallback, useEffect, useState } from "react"

export function useIamToken() {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchToken = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/auth/token", { method: "POST" })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "IAM error")

      setToken(data.access_token)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchToken()
  }, [fetchToken])

  return { token, loading, error, refresh: fetchToken }
}