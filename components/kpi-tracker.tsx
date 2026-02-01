'use client';

import React from 'react';
import { UserType } from '../hooks/useBusinessState';

interface KPITrackerProps {
  kpis: Record<string, number>;
  userType: UserType;
  onKPIUpdate: (kpiName: string, value: number) => void;
}

const KPITracker: React.FC<KPITrackerProps> = ({ kpis, userType, onKPIUpdate }) => {
  // Customize KPIs based on user type
  const getKPIConfig = () => {
    switch (userType) {
      case 'small':
        return [
          { id: 'efficiency', label: 'Operational Visibility', unit: '%' },
          { id: 'wasteReduction', label: 'Basic Metrics', unit: '%' },
          { id: 'productivity', label: 'Stability Index', unit: '%' },
          { id: 'costSavings', label: 'Financial Health', unit: '%' },
        ];
      case 'micro':
        return [
          { id: 'efficiency', label: 'Process Efficiency', unit: '%' },
          { id: 'wasteReduction', label: 'Cost Reduction', unit: '%' },
          { id: 'productivity', label: 'Consistency Score', unit: '%' },
          { id: 'costSavings', label: 'Profitability', unit: '%' },
        ];
      case 'medium':
        return [
          { id: 'efficiency', label: 'Performance Index', unit: '%' },
          { id: 'wasteReduction', label: 'Optimization Rate', unit: '%' },
          { id: 'productivity', label: 'Growth Potential', unit: '%' },
          { id: 'costSavings', label: 'ROI', unit: '%' },
          { id: 'quality', label: 'Quality Score', unit: '%' },
        ];
      default:
        return [
          { id: 'efficiency', label: 'Process Efficiency', unit: '%' },
          { id: 'wasteReduction', label: 'Waste Reduction', unit: '%' },
          { id: 'productivity', label: 'Productivity', unit: '%' },
          { id: 'costSavings', label: 'Cost Savings', unit: '%' },
          { id: 'quality', label: 'Quality Score', unit: '%' },
        ];
    }
  };

  const kpiConfig = getKPIConfig();

  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: '#0f172a' }}>KPI Tracker</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        {kpiConfig.map((kpi) => (
          <div key={kpi.id} style={{
            border: '1px solid #e2e8f0',
            borderRadius: 6,
            padding: 12,
            background: '#ffffff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <h3 style={{ fontSize: 13, color: '#64748b', margin: 0 }}>{kpi.label}</h3>
              <span style={{ fontWeight: 600, color: '#3b82f6', fontSize: 16 }}>{kpis[kpi.id] || 0}{kpi.unit}</span>
            </div>
            <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(100, kpis[kpi.id] || 0)}%`,
                  background: '#3b82f6',
                  transition: 'width 0.3s ease'
                }}
              ></div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                onClick={() => onKPIUpdate(kpi.id, Math.min(100, (kpis[kpi.id] || 0) + 5))}
                style={{
                  flex: 1,
                  padding: '4px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: 11,
                  fontWeight: 500
                }}
              >
                +5%
              </button>
              <button
                onClick={() => onKPIUpdate(kpi.id, Math.max(0, (kpis[kpi.id] || 0) - 5))}
                style={{
                  flex: 1,
                  padding: '4px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: 11,
                  fontWeight: 500
                }}
              >
                -5%
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KPITracker;