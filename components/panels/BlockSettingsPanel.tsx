'use client';

import { useEffect, useState } from 'react';
import { strategicPartnerBlock } from '@/data/strategicPartnerBlock';
import IdentityPanel from '@/components/settings/IdentityPanel';
import ConstraintsPanel from '@/components/settings/ConstraintsPanel';
import { loadBlockSettings, saveBlockSettings } from '@/lib/settingsStorage';
import { useUnsavedChangesWarning } from '@/lib/useUnsavedChangesWarning';
import { toast } from 'sonner';

export function BlockSettingsPanel() {
  // Local state for editable fields
  const [role, setRole] = useState('');
  const [scope, setScope] = useState('');
  const [is, setIs] = useState<string[]>([]);
  const [isNot, setIsNot] = useState<string[]>([]);
  const [must, setMust] = useState<string[]>([]);
  const [prohibited, setProhibited] = useState<string[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const saved = loadBlockSettings();

    if (saved) {
      // Load from localStorage
      setRole(saved.role);
      setScope(saved.scope);
      setIs(saved.is);
      setIsNot(saved.isNot);
      setMust(saved.must);
      setProhibited(saved.prohibited);
    } else {
      // Check if version mismatch occurred
      const hadStoredData = localStorage.getItem('block-settings') !== null;

      // Fall back to defaults
      setRole(strategicPartnerBlock.identity.role);
      setScope(strategicPartnerBlock.identity.scope);
      setIs(strategicPartnerBlock.identity.is);
      setIsNot(strategicPartnerBlock.identity.isNot);
      setMust(strategicPartnerBlock.constraints.must);
      setProhibited(strategicPartnerBlock.constraints.prohibited);

      // Show toast if there was data but version mismatch
      if (hadStoredData && saved === null) {
        toast.info('Settings reset to defaults due to app update');
      }
    }

    setIsInitialized(true);
  }, []);

  // Track dirty state
  useEffect(() => {
    if (!isInitialized) return;

    const hasChanges =
      role !== strategicPartnerBlock.identity.role ||
      scope !== strategicPartnerBlock.identity.scope ||
      JSON.stringify(is) !== JSON.stringify(strategicPartnerBlock.identity.is) ||
      JSON.stringify(isNot) !== JSON.stringify(strategicPartnerBlock.identity.isNot) ||
      JSON.stringify(must) !== JSON.stringify(strategicPartnerBlock.constraints.must) ||
      JSON.stringify(prohibited) !== JSON.stringify(strategicPartnerBlock.constraints.prohibited);

    setIsDirty(hasChanges);
  }, [role, scope, is, isNot, must, prohibited, isInitialized]);

  // Unsaved changes warning
  useUnsavedChangesWarning(isDirty);

  // Save handler
  const handleSave = () => {
    const success = saveBlockSettings({
      role,
      scope,
      is,
      isNot,
      must,
      prohibited,
    });

    if (success) {
      toast.success('Settings saved');
      setIsDirty(false);
    } else {
      toast.error('Could not save settings. Storage full.');
    }
  };

  if (!strategicPartnerBlock) {
    return (
      <div className="text-zinc-500 text-sm">
        Block data unavailable
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Unsaved changes indicator and Save button */}
      {isDirty && (
        <div className="flex items-center justify-between p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <span className="text-sm text-amber-400">
            Unsaved changes
          </span>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      )}

      {/* Block Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20">
            {strategicPartnerBlock.layer}
          </span>
          <span className="text-xs text-zinc-500">{strategicPartnerBlock.id}</span>
        </div>
        <h3 className="text-lg font-semibold text-zinc-100">
          {strategicPartnerBlock.name}
        </h3>
        <p className="text-sm text-zinc-400">
          {strategicPartnerBlock.description}
        </p>
        <div className="text-xs text-zinc-500">
          Version {strategicPartnerBlock.version}
        </div>
      </div>

      {/* Triggers */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wide">
          Triggers
        </h4>
        <div className="flex flex-wrap gap-2">
          {strategicPartnerBlock.triggers.map((trigger) => (
            <span
              key={trigger}
              className="text-xs px-2 py-1 bg-zinc-800 text-zinc-300 rounded border border-zinc-700"
            >
              {trigger}
            </span>
          ))}
        </div>
      </div>

      {/* Decay Settings */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wide">
          Decay
        </h4>
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-zinc-400">Enabled:</span>
            <span className="text-zinc-200">
              {strategicPartnerBlock.decay.enabled ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Preset:</span>
            <span className="text-zinc-200">
              {strategicPartnerBlock.decay.preset}
            </span>
          </div>
        </div>
      </div>

      {/* Identity Panel */}
      <IdentityPanel
        role={role}
        scope={scope}
        is={is}
        isNot={isNot}
        onRoleChange={setRole}
        onScopeChange={setScope}
        onIsChange={setIs}
        onIsNotChange={setIsNot}
      />

      {/* Constraints Panel */}
      <ConstraintsPanel
        must={must}
        prohibited={prohibited}
        onMustChange={setMust}
        onProhibitedChange={setProhibited}
      />
    </div>
  );
}
