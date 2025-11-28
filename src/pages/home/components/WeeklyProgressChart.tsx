import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import './Charts.css'

interface WeeklyProgressChartProps {
  tasksThisWeek: number
  tasksCompletedThisWeek: number
}

export function WeeklyProgressChart({ tasksThisWeek, tasksCompletedThisWeek }: WeeklyProgressChartProps) {
  const data = [
    {
      name: 'Эта неделя',
      Создано: tasksThisWeek,
      Выполнено: tasksCompletedThisWeek,
    },
  ]

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="name"
            tick={{ fill: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}
          />
          <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 'var(--font-size-sm)' }}
            formatter={(value) => value}
          />
          <Bar dataKey="Создано" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Выполнено" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

