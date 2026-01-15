'use client'

import { useState } from 'react'

interface IdentityPanelProps {
  role: string
  scope: string
  is: string[]
  isNot: string[]
  onRoleChange?: (value: string) => void
  onScopeChange?: (value: string) => void
  onIsChange?: (values: string[]) => void
  onIsNotChange?: (values: string[]) => void
}

export default function IdentityPanel({
  role,
  scope,
  is,
  isNot,
  onRoleChange,
  onScopeChange,
  onIsChange,
  onIsNotChange
}: IdentityPanelProps) {
  const [newIs, setNewIs] = useState('')
  const [newIsNot, setNewIsNot] = useState('')

  const handleRemoveIs = (index: number) => {
    if (onIsChange) {
      const newIsArray = is.filter((_, i) => i !== index)
      onIsChange(newIsArray)
    }
  }

  const handleRemoveIsNot = (index: number) => {
    if (onIsNotChange) {
      const newIsNotArray = isNot.filter((_, i) => i !== index)
      onIsNotChange(newIsNotArray)
    }
  }

  const handleAddIs = () => {
    if (newIs.trim() && onIsChange) {
      onIsChange([...is, newIs.trim()])
      setNewIs('')
    }
  }

  const handleAddIsNot = () => {
    if (newIsNot.trim() && onIsNotChange) {
      onIsNotChange([...isNot, newIsNot.trim()])
      setNewIsNot('')
    }
  }

  const handleIsKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddIs()
    }
  }

  const handleIsNotKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddIsNot()
    }
  }

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
            onChange={(e) => onRoleChange?.(e.target.value)}
            className="w-full px-3 py-2 bg-bg border border-border rounded text-text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">Scope</label>
          <input
            type="text"
            value={scope}
            onChange={(e) => onScopeChange?.(e.target.value)}
            className="w-full px-3 py-2 bg-bg border border-border rounded text-text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">Is</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {is.map((item, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-success/10 text-success rounded-full text-sm border border-success/20 flex items-center gap-2"
              >
                {item}
                {onIsChange && (
                  <button
                    onClick={() => handleRemoveIs(index)}
                    className="hover:opacity-70 transition-opacity"
                    aria-label={`Remove ${item}`}
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
          {onIsChange && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newIs}
                onChange={(e) => setNewIs(e.target.value)}
                onKeyPress={handleIsKeyPress}
                placeholder="Add new item..."
                className="flex-1 px-3 py-2 bg-bg border border-border rounded text-text text-sm"
              />
              <button
                onClick={handleAddIs}
                className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm hover:opacity-90 transition-opacity"
              >
                Add
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">Is Not</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {isNot.map((item, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-error/10 text-error rounded-full text-sm border border-error/20 flex items-center gap-2"
              >
                {item}
                {onIsNotChange && (
                  <button
                    onClick={() => handleRemoveIsNot(index)}
                    className="hover:opacity-70 transition-opacity"
                    aria-label={`Remove ${item}`}
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
          {onIsNotChange && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newIsNot}
                onChange={(e) => setNewIsNot(e.target.value)}
                onKeyPress={handleIsNotKeyPress}
                placeholder="Add new item..."
                className="flex-1 px-3 py-2 bg-bg border border-border rounded text-text text-sm"
              />
              <button
                onClick={handleAddIsNot}
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
