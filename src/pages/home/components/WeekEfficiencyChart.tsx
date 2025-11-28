import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import './Charts.css'

interface WeekEfficiencyChartProps {
  tasksThisWeek: number
  tasksCompletedThisWeek: number
}

export function WeekEfficiencyChart({ tasksThisWeek, tasksCompletedThisWeek }: WeekEfficiencyChartProps) {
  const efficiency = tasksThisWeek > 0 ? Math.round((tasksCompletedThisWeek / tasksThisWeek) * 100) : 0
  
  const data = [
    { name: 'Эффективность', value: efficiency, target: 100 },
  ]

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="name"
            tick={{ fill: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}
          />
          <Tooltip
            formatter={(value: number) => [`${value}%`, '']}
            contentStyle={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 'var(--font-size-xs)' }}
            formatter={(value) => value}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: '#10b981', r: 6 }}
            name="Ваш результат"
          />
          <Line
            type="monotone"
            dataKey="target"
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Цель (100%)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

