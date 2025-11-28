import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import './Charts.css'

interface TaskStatusChartProps {
  pending: number
  inProgress: number
  completed: number
}

const COLORS = {
  pending: '#facc15',
  inProgress: '#3b82f6',
  completed: '#10b981',
}

export function TaskStatusChart({ pending, inProgress, completed }: TaskStatusChartProps) {
  const data = [
    { name: 'В ожидании', value: pending, color: COLORS.pending },
    { name: 'В работе', value: inProgress, color: COLORS.inProgress },
    { name: 'Завершено', value: completed, color: COLORS.completed },
  ].filter((item) => item.value > 0)

  if (data.length === 0) {
    return (
      <div className="chart-empty">
        <p>Нет данных для отображения</p>
      </div>
    )
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
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
            wrapperStyle={{ fontSize: 'var(--font-size-sm)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

