import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { passwordStrength, type PasswordStrength } from '../../utils/authValidation'

const STRENGTH_LABEL: Record<PasswordStrength, string> = {
  weak: 'Yếu',
  fair: 'Trung bình',
  good: 'Khá',
  strong: 'Mạnh',
}

type Props = {
  id: string
  label: string
  value: string
  error?: string
  placeholder?: string
  autoComplete?: string
  hint?: string
  showStrength?: boolean
  onChange: (value: string) => void
}

const PasswordField = ({
  id,
  label,
  value,
  error,
  placeholder = '••••••••',
  autoComplete = 'new-password',
  hint,
  showStrength = false,
  onChange,
}: Props) => {
  const [visible, setVisible] = useState(false)
  const strength = showStrength ? passwordStrength(value) : null

  return (
    <div className={`input-wrap${error ? ' input-error' : ''}`}>
      <label className="input-label" htmlFor={id}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          className="input-field"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          style={{ paddingRight: 44 }}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-text-muted)',
          }}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {hint && !error && <span className="input-hint">{hint}</span>}
      {showStrength && strength && (
        <div className={`pw-strength pw-strength-${strength}`}>
          Độ mạnh: {STRENGTH_LABEL[strength]}
        </div>
      )}
      {error && <span className="input-message">{error}</span>}
    </div>
  )
}

export default PasswordField
