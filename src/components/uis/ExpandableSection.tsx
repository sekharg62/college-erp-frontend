import { ChevronDown, type LucideIcon } from 'lucide-react'
import {
  createContext,
  useCallback,
  useContext,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react'

const DEFAULT_DURATION_MS = 300

type ExpandableContextValue = {
  open: boolean
  toggle: () => void
  setOpen: (open: boolean) => void
  disabled: boolean
  triggerId: string
  panelId: string
  durationMs: number
}

const ExpandableContext = createContext<ExpandableContextValue | null>(null)

function useExpandableContext() {
  const context = useContext(ExpandableContext)
  if (!context) {
    throw new Error('ExpandableSection subcomponents must be used within ExpandableSection')
  }
  return context
}

const PANEL_TRANSITION_CLASS =
  'transition-[grid-template-rows,opacity] ease-in-out'

export type ExpandablePanelProps = {
  open: boolean
  children: ReactNode
  className?: string
  contentClassName?: string
  durationMs?: number
}

/** Animated height + fade panel — use alone when you control open state externally */
export function ExpandablePanel({
  open,
  children,
  className = '',
  contentClassName = '',
  durationMs = DEFAULT_DURATION_MS,
}: ExpandablePanelProps) {
  return (
    <div
      className={`grid ${PANEL_TRANSITION_CLASS} ${
        open
          ? 'grid-rows-[1fr] opacity-100'
          : 'pointer-events-none grid-rows-[0fr] opacity-0'
      } ${className}`}
      style={{ transitionDuration: `${durationMs}ms` }}
    >
      <div className={`min-h-0 overflow-hidden ${contentClassName}`}>{children}</div>
    </div>
  )
}

export type ExpandableTriggerProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'type'
> & {
  children: ReactNode
  /** Chevron placement relative to trigger label */
  iconPosition?: 'left' | 'right' | 'none'
  icon?: LucideIcon
  iconSize?: number
  /** Rotate chevron when open */
  rotateIconWhenOpen?: boolean
}

export function ExpandableTrigger({
  children,
  iconPosition = 'left',
  icon: Icon = ChevronDown,
  iconSize = 18,
  rotateIconWhenOpen = true,
  className = '',
  disabled: disabledProp,
  onClick,
  ...props
}: ExpandableTriggerProps) {
  const { open, toggle, disabled, triggerId, panelId, durationMs } =
    useExpandableContext()

  const isDisabled = disabled || disabledProp
  const showIcon = iconPosition !== 'none'

  const iconNode = showIcon ? (
    <Icon
      size={iconSize}
      aria-hidden
      className={`shrink-0 text-amber-500 transition-transform ease-in-out ${
        rotateIconWhenOpen && open ? 'rotate-180' : ''
      }`}
      style={{ transitionDuration: `${durationMs}ms` }}
    />
  ) : null

  return (
    <button
      type="button"
      id={triggerId}
      aria-expanded={open}
      aria-controls={panelId}
      disabled={isDisabled}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) toggle()
      }}
      className={`inline-flex w-full items-center gap-2 text-left transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {iconPosition === 'left' && iconNode}
      <span className="min-w-0 flex-1">{children}</span>
      {iconPosition === 'right' && iconNode}
    </button>
  )
}

export type ExpandableSectionPanelProps = {
  children: ReactNode
  className?: string
  contentClassName?: string
}

function ExpandableSectionPanel({
  children,
  className = '',
  contentClassName = '',
}: ExpandableSectionPanelProps) {
  const { open, panelId, triggerId, durationMs } = useExpandableContext()

  return (
    <div id={panelId} role="region" aria-labelledby={triggerId}>
      <ExpandablePanel
        open={open}
        className={className}
        contentClassName={contentClassName}
        durationMs={durationMs}
      >
        {children}
      </ExpandablePanel>
    </div>
  )
}

export type ExpandableSectionProps = {
  children?: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  className?: string
  durationMs?: number
  /** Convenience: renders built-in trigger + panel (FAQ / card accordion) */
  title?: ReactNode
  triggerClassName?: string
  panelClassName?: string
  contentClassName?: string
  iconPosition?: ExpandableTriggerProps['iconPosition']
  icon?: LucideIcon
  showIcon?: boolean
  iconSize?: number
  triggerProps?: Omit<ExpandableTriggerProps, 'children'>
}

function ExpandableSectionRoot({
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  className = '',
  durationMs = DEFAULT_DURATION_MS,
  title,
  triggerClassName = '',
  panelClassName = '',
  contentClassName = '',
  iconPosition = 'left',
  icon,
  showIcon = true,
  iconSize,
  triggerProps,
}: ExpandableSectionProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const isControlled = openProp !== undefined
  const open = isControlled ? openProp : uncontrolledOpen
  const baseId = useId()

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange],
  )

  const toggle = useCallback(() => {
    if (disabled) return
    setOpen(!open)
  }, [disabled, open, setOpen])

  const contextValue: ExpandableContextValue = {
    open,
    toggle,
    setOpen,
    disabled,
    triggerId: `${baseId}-trigger`,
    panelId: `${baseId}-panel`,
    durationMs,
  }

  const resolvedIconPosition = showIcon ? iconPosition : 'none'

  if (title !== undefined) {
    return (
      <ExpandableContext.Provider value={contextValue}>
        <div className={className}>
          <ExpandableTrigger
            iconPosition={resolvedIconPosition}
            icon={icon}
            iconSize={iconSize}
            className={triggerClassName}
            {...triggerProps}
          >
            {title}
          </ExpandableTrigger>
          <ExpandableSectionPanel
            className={panelClassName}
            contentClassName={contentClassName}
          >
            {children}
          </ExpandableSectionPanel>
        </div>
      </ExpandableContext.Provider>
    )
  }

  return (
    <ExpandableContext.Provider value={contextValue}>
      <div className={className}>{children}</div>
    </ExpandableContext.Provider>
  )
}

const ExpandableSection = Object.assign(ExpandableSectionRoot, {
  Trigger: ExpandableTrigger,
  Panel: ExpandableSectionPanel,
})

export default ExpandableSection
