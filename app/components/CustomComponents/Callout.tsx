import { ReactNode } from 'react'

type CalloutVariant = 'tip' | 'note' | 'warning' | 'error' | 'info'

const variantStyles: Record<CalloutVariant, { bg: string; border: string; label: string }> = {
  tip:     { bg: 'bg-green-300/20 dark:bg-green-700/30',   border: 'border-green-500',   label: 'Tip' },
  note:    { bg: 'bg-blue-300/20 dark:bg-blue-700/30',     border: 'border-blue-500',    label: 'Note' },
  warning: { bg: 'bg-yellow-300/20 dark:bg-yellow-700/30', border: 'border-yellow-500',  label: 'Warning' },
  error:   { bg: 'bg-red-300/20 dark:bg-red-700/30',       border: 'border-red-500',     label: 'Error' },
  info:    { bg: 'bg-indigo-300/20 dark:bg-indigo-700/30', border: 'border-indigo-500',  label: 'Info' },
}

interface CalloutProps {
  variant: CalloutVariant
  children: ReactNode
}

export function Callout({ variant, children }: CalloutProps) {
  const { bg, border, label } = variantStyles[variant]
  return (
    <div className={`${bg} border-l-4 ${border} rounded-md px-5 pb-5 mb-5 text-neutral-800 dark:text-neutral-200`}>
      <div className="flex items-center pt-5">
        <span className="font-extrabold">{label}</span>
      </div>
      {children}
    </div>
  )
}

// 하위 호환 래퍼 — MDX에서 <TipCallout>, <NoteCallout> 등 기존 사용법 유지
export const TipCallout = ({ children }: { children: ReactNode }) => <Callout variant="tip">{children}</Callout>
export const NoteCallout = ({ children }: { children: ReactNode }) => <Callout variant="note">{children}</Callout>
export const WarningCallout = ({ children }: { children: ReactNode }) => <Callout variant="warning">{children}</Callout>
export const ErrorCallout = ({ children }: { children: ReactNode }) => <Callout variant="error">{children}</Callout>
export const InfoCallout = ({ children }: { children: ReactNode }) => <Callout variant="info">{children}</Callout>
