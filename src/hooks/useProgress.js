import { useState, useEffect } from 'react'
import progressService from '../services/progressService'

export function useProgress() {
  const [progress, setProgress] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProgress = async () => {
    try {
      setLoading(true)
      const [progressData, statsData] = await Promise.all([
        progressService.getOverallProgress(),
        progressService.getStats(),
      ])
      setProgress(progressData)
      setStats(statsData)
    } catch (err) {
      console.error('Failed to fetch progress:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProgress()
  }, [])

  return { progress, stats, loading, refetch: fetchProgress }
}
