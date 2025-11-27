import { ApiReference } from './sections/ApiReference'
import { TodoList } from '@/features/tasks/components/TodoList'

export function DashboardPage() {
  return (
    <div className="page">
      <section className="cards-grid">
        <TodoList />
        <ApiReference />
      </section>
    </div>
  )
}

