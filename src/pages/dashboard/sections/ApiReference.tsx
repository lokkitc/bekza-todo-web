import { apiCatalog } from '@/shared/api'

export function ApiReference() {
  return (
    <article className="card">
      <header className="card-header">
        <h2>API покрытие фронта</h2>
        <p>Каждый endpoint из спецификации FastAPI отражён в клиентском SDK.</p>
      </header>
      <div className="api-table">
        {apiCatalog.map((section) => (
          <div key={section.title}>
            <p className="api-section">{section.title}</p>
            <ul>
              {section.endpoints.map((endpoint) => (
                <li key={`${endpoint.method}-${endpoint.path}`} className="api-row">
                  <span className={`method-badge method-${endpoint.method.toLowerCase()}`}>
                    {endpoint.method}
                  </span>
                  <code>{endpoint.path}</code>
                  <p>{endpoint.description}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </article>
  )
}

