import type { LucideIcon } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { getButtonVariantClass, type ButtonVariant } from '../../theme/button'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  icon?: LucideIcon
  loading?: boolean
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    icon: Icon,
    loading = false,
    fullWidth = false,
    className = '',
    children,
    disabled,
    type = 'button',
    ...props
  },
  ref,
) {
  const { theme } = useTheme()
  const variantClass = getButtonVariantClass(theme, variant)

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${fullWidth ? 'w-full' : ''} ${variantClass} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        Icon && <Icon size={18} className="shrink-0" />
      )}
      {children}
    </button>
  )
})

export default Button
