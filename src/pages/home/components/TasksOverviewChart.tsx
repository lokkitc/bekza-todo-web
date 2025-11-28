import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import './Charts.css'

interface TasksOverviewChartProps {
  pending: number
  inProgress: number
  completed: number
}

export function TasksOverviewChart({ pending, inProgress, completed }: TasksOverviewChartProps) {
  const data = [
    { name: 'Задачи', pending, inProgress, completed },
  ]

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#facc15" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#facc15" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorInProgress" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="name"
            tick={{ fill: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}
          />
          <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }} />
          <Tooltip
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
          <Area
            type="monotone"
            dataKey="pending"
            stackId="1"
            stroke="#facc15"
            fill="url(#colorPending)"
            name="В ожидании"
          />
          <Area
            type="monotone"
            dataKey="inProgress"
            stackId="1"
            stroke="#3b82f6"
            fill="url(#colorInProgress)"
            name="В работе"
          />
          <Area
            type="monotone"
            dataKey="completed"
            stackId="1"
            stroke="#10b981"
            fill="url(#colorCompleted)"
            name="Завершено"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

