export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export function validatePassword(password) {
  return password.length >= 6
}

export function validateUsername(username) {
  const re = /^[a-zA-Z0-9_]{3,20}$/
  return re.test(username)
}
