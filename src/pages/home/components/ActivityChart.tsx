import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts'
import './Charts.css'

interface ActivityChartProps {
  activityScore: number
}

export function ActivityChart({ activityScore }: ActivityChartProps) {
  const getColor = (score: number) => {
    if (score >= 80) return '#ef4444'
    if (score >= 60) return '#f59e0b'
    if (score >= 40) return '#3b82f6'
    if (score >= 20) return '#8b5cf6'
    return '#10b981'
  }

  const data = [
    {
      name: 'Активность',
      value: activityScore,
      fill: getColor(activityScore),
    },
  ]

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={250}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="50%"
          outerRadius="85%"
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar
            background={{ fill: 'var(--color-surface-alt)' }}
            dataKey="value"
            cornerRadius={10}
          />
          <Tooltip
            formatter={(value: number) => [`${value}%`, 'Активность']}
            contentStyle={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
            }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  )
}

