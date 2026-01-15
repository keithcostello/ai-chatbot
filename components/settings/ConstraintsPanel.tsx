'use client'

import { useState } from 'react'

interface ConstraintsPanelProps {
  must: string[]
  prohibited: string[]
  onMustChange?: (values: string[]) => void
  onProhibitedChange?: (values: string[]) => void
}

export default function ConstraintsPanel({ must, prohibited, onMustChange, onProhibitedChange }: ConstraintsPanelProps) {
  const [newMust, setNewMust] = useState('')
  const [newProhibited, setNewProhibited] = useState('')

  const handleAddMust = () => {
    if (newMust.trim() && onMustChange) {
      onMustChange([...must, newMust.trim()])
      setNewMust('')
    }
  }

  const handleAddProhibited = () => {
    if (newProhibited.trim() && onProhibitedChange) {
      onProhibitedChange([...prohibited, newProhibited.trim()])
      setNewProhibited('')
    }
  }

  const handleRemoveMust = (index: number) => {
    if (onMustChange) {
      const newMust = must.filter((_, i) => i !== index)
      onMustChange(newMust)
    }
  }

  const handleRemoveProhibited = (index: number) => {
    if (onProhibitedChange) {
      const newProhibited = prohibited.filter((_, i) => i !== index)
      onProhibitedChange(newProhibited)
    }
  }

  const handleMustKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddMust()
    }
  }

  const handleProhibitedKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddProhibited()
    }
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-text mb-4">Constraints</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-text mb-3">Must</h3>
          <ul className="space-y-2 mb-3">
            {must.map((item, index) => (
              <li key={index} className="flex items-start justify-between gap-2 text-sm text-text">
                <div className="flex items-start gap-2">
                  <span className="text-success mt-0.5">✓</span>
                  <span>{item}</span>
                </div>
                {onMustChange && (
                  <button
                    onClick={() => handleRemoveMust(index)}
                    className="text-text/50 hover:text-error transition-colors flex-shrink-0"
                    aria-label={`Remove ${item}`}
                  >
                    ✕
                  </button>
                )}
              </li>
            ))}
          </ul>
          {onMustChange && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newMust}
                onChange={(e) => setNewMust(e.target.value)}
                onKeyPress={handleMustKeyPress}
                placeholder="Add new constraint..."
                className="flex-1 px-3 py-2 bg-bg border border-border rounded text-text text-sm"
              />
              <button
                onClick={handleAddMust}
                className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm hover:opacity-90 transition-opacity"
              >
                Add
              </button>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium text-text mb-3">Prohibited</h3>
          <ul className="space-y-2 mb-3">
            {prohibited.map((item, index) => (
              <li key={index} className="flex items-start justify-between gap-2 text-sm text-text">
                <div className="flex items-start gap-2">
                  <span className="text-error mt-0.5">✕</span>
                  <span>{item}</span>
                </div>
                {onProhibitedChange && (
                  <button
                    onClick={() => handleRemoveProhibited(index)}
                    className="text-text/50 hover:text-error transition-colors flex-shrink-0"
                    aria-label={`Remove ${item}`}
                  >
                    ✕
                  </button>
                )}
              </li>
            ))}
          </ul>
          {onProhibitedChange && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newProhibited}
                onChange={(e) => setNewProhibited(e.target.value)}
                onKeyPress={handleProhibitedKeyPress}
                placeholder="Add new constraint..."
                className="flex-1 px-3 py-2 bg-bg border border-border rounded text-text text-sm"
              />
              <button
                onClick={handleAddProhibited}
                className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm hover:opacity-90 transition-opacity"
              >
                Add
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
