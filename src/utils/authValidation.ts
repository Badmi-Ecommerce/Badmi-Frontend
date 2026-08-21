export const EMAIL_MAX = 254
export const PASSWORD_MIN = 8
export const PASSWORD_MAX = 64

const COMMON_PASSWORDS = new Set([
  '12345678',
  '123456789',
  '1234567890',
  'password',
  'password1',
  'password12',
  'password123',
  'qwerty123',
  'qwertyui',
  '11111111',
  '00000000',
  'abcdefgh',
  'letmein1',
  'admin123',
  'welcome1',
  'iloveyou',
  '1q2w3e4r',
  'passw0rd',
  'abc123456',
  'welcome1!',
])

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function validateEmail(email: string): string | null {
  const trimmed = email.trim()
  if (!trimmed) return 'Vui lòng nhập email'
  if (trimmed.length > EMAIL_MAX) return 'Email không được vượt quá 254 ký tự'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'Email không hợp lệ'
  return null
}

export function validatePassword(
  password: string,
  identity?: { email?: string; name?: string }
): string | null {
  if (!password) return 'Vui lòng nhập mật khẩu'
  if (password.length < PASSWORD_MIN) return 'Mật khẩu phải có ít nhất 8 ký tự'
  if (password.length > PASSWORD_MAX) return 'Mật khẩu không được vượt quá 64 ký tự'
  if (/\s/.test(password)) return 'Mật khẩu không được chứa khoảng trắng'
  if (!/\p{L}/u.test(password)) return 'Mật khẩu phải chứa ít nhất 1 chữ cái'
  if (!/\d/.test(password)) return 'Mật khẩu phải chứa ít nhất 1 chữ số'
  if (!/\p{Lu}/u.test(password)) return 'Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa'
  if (!/[^\p{L}\d\s]/u.test(password)) return 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt'
  if (COMMON_PASSWORDS.has(password.toLowerCase())) return 'Mật khẩu quá yếu'
  if (containsIdentity(password, identity)) {
    return 'Mật khẩu không được chứa tên người dùng hoặc email'
  }
  return null
}

export function validatePhone(phone: string): string | null {
  const trimmed = phone.trim()
  if (!trimmed) return null
  if (/\p{L}/u.test(trimmed)) return 'Số điện thoại không hợp lệ'
  const compact = trimmed.replace(/[\s.\-()]/g, '')
  const normalized = compact.startsWith('+84')
    ? `0${compact.slice(3)}`
    : compact.startsWith('84') && compact.length === 11
      ? `0${compact.slice(2)}`
      : compact
  if (!/^0[35789]\d{8}$/.test(normalized)) return 'Số điện thoại không hợp lệ'
  return null
}

export function normalizePhone(phone: string): string | undefined {
  const trimmed = phone.trim()
  if (!trimmed) return undefined
  const compact = trimmed.replace(/[\s.\-()]/g, '')
  if (compact.startsWith('+84')) return `0${compact.slice(3)}`
  if (compact.startsWith('84') && compact.length === 11) return `0${compact.slice(2)}`
  return compact
}

export const PASSWORD_HINT = 'Tối thiểu 8 ký tự, gồm chữ hoa, số và ký tự đặc biệt (!@#...)'

export function validateConfirmPassword(password: string, confirm: string): string | null {
  if (!confirm) return 'Vui lòng xác nhận mật khẩu'
  if (password !== confirm) return 'Mật khẩu xác nhận không khớp'
  return null
}

export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong'

export function passwordStrength(password: string): PasswordStrength | null {
  if (!password) return null
  const hasLetter = /\p{L}/u.test(password)
  const hasUpper = /\p{Lu}/u.test(password)
  const hasDigit = /\d/.test(password)
  const hasSpecial = /[^\p{L}\d\s]/u.test(password)
  const long = password.length >= 12
  if (password.length < PASSWORD_MIN || !hasLetter || !hasUpper || !hasDigit || !hasSpecial || /\s/.test(password)) {
    return 'weak'
  }
  if (long) return 'strong'
  return 'good'
}

function containsIdentity(password: string, identity?: { email?: string; name?: string }): boolean {
  const lower = password.toLowerCase()
  const email = identity?.email?.trim().toLowerCase()
  if (email) {
    const local = email.split('@')[0] ?? ''
    if (local.length >= 3 && lower.includes(local)) return true
  }
  const name = identity?.name?.trim().toLowerCase()
  if (!name) return false
  const compact = name.replace(/\s+/g, '')
  if (compact.length >= 3 && lower.includes(compact)) return true
  return name.split(/\s+/).some((part) => part.length >= 3 && lower.includes(part))
}
