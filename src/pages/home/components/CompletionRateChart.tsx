import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import './Charts.css'

interface CompletionRateChartProps {
  completed: number
  notCompleted: number
}

export function CompletionRateChart({ completed, notCompleted }: CompletionRateChartProps) {
  const data = [
    { name: 'Выполнено', value: completed, color: '#10b981' },
    { name: 'Не выполнено', value: notCompleted, color: '#ef4444' },
  ].filter((item) => item.value > 0)

  if (data.length === 0) {
    return (
      <div className="chart-empty">
        <p>Нет данных</p>
      </div>
    )
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
            outerRadius={60}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value} задач`, '']}
            contentStyle={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
            }}
          />
          <Legend
            formatter={(value) => value}
            wrapperStyle={{ fontSize: 'var(--font-size-xs)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

