import './CircularProgress.css'

interface CircularProgressProps {
  value: number
  max: number
  size?: number
  strokeWidth?: number
  label?: string
  showValue?: boolean
  color?: string
}

export function CircularProgress({
  value,
  max,
  size = 120,
  strokeWidth = 8,
  label,
  showValue = true,
  color,
}: CircularProgressProps) {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  const defaultColor = 'var(--color-accent)'
  const progressColor = color || defaultColor

  return (
    <div className="circular-progress-wrapper">
      <svg
        className="circular-progress"
        width={size}
        height={size}
        style={{ '--progress-color': progressColor } as React.CSSProperties}
      >
        {}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={strokeWidth}
        />
        {}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="circular-progress-bar"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="circular-progress-content">
        {showValue && (
          <div className="circular-progress-value">
            <span className="circular-progress-number">{Math.round(percentage)}</span>
            <span className="circular-progress-percent">%</span>
          </div>
        )}
        {label && <div className="circular-progress-label">{label}</div>}
      </div>
    </div>
  )
}

