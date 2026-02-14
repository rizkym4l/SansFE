export function formatXP(xp) {
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}k XP`
  }
  return `${xp} XP`
}

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function formatAccuracy(correct, total) {
  if (total === 0) return '0%'
  return `${Math.round((correct / total) * 100)}%`
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatStreak(days) {
  if (days === 0) return 'Belum ada streak'
  if (days === 1) return '1 hari'
  return `${days} hari`
}
