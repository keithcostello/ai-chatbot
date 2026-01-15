'use client';

import { strategicPartnerBlock } from '@/data/strategicPartnerBlock';
import { IdentityPanel } from '@/components/settings/IdentityPanel';
import { ConstraintsPanel } from '@/components/settings/ConstraintsPanel';

export function BlockSettingsPanel() {
  if (!strategicPartnerBlock) {
    return (
      <div className="text-zinc-500 text-sm">
        Block data unavailable
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
        role={strategicPartnerBlock.identity.role}
        scope={strategicPartnerBlock.identity.scope}
        is={strategicPartnerBlock.identity.is}
        isNot={strategicPartnerBlock.identity.isNot}
      />

      {/* Constraints Panel */}
      <ConstraintsPanel
        must={strategicPartnerBlock.constraints.must}
        prohibited={strategicPartnerBlock.constraints.prohibited}
      />
    </div>
  );
}
