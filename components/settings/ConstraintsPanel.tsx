interface ConstraintsPanelProps {
  must: string[]
  prohibited: string[]
}

export default function ConstraintsPanel({ must, prohibited }: ConstraintsPanelProps) {
  return (
    <div className="bg-surface border border-border rounded-lg p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-text mb-4">Constraints</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-text mb-3">Must</h3>
          <ul className="space-y-2">
            {must.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-text">
                <span className="text-success mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-medium text-text mb-3">Prohibited</h3>
          <ul className="space-y-2">
            {prohibited.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-text">
                <span className="text-error mt-0.5">✕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
