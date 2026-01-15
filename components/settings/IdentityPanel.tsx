interface IdentityPanelProps {
  role: string
  scope: string
  is: string[]
  isNot: string[]
}

export default function IdentityPanel({ role, scope, is, isNot }: IdentityPanelProps) {
  return (
    <div className="bg-surface border border-border rounded-lg p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-text mb-4">Identity</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text mb-2">Role</label>
          <input
            type="text"
            value={role}
            readOnly
            className="w-full px-3 py-2 bg-bg border border-border rounded text-text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">Scope</label>
          <input
            type="text"
            value={scope}
            readOnly
            className="w-full px-3 py-2 bg-bg border border-border rounded text-text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">Is</label>
          <div className="flex flex-wrap gap-2">
            {is.map((item, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-success/10 text-success rounded-full text-sm border border-success/20"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">Is Not</label>
          <div className="flex flex-wrap gap-2">
            {isNot.map((item, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-error/10 text-error rounded-full text-sm border border-error/20"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
