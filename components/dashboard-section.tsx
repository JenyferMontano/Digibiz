'use client';

import React from 'react';
import { BusinessState, MissionStatus } from '../hooks/useBusinessState';

interface DashboardSectionProps {
  state: BusinessState;
  onSegmentChange: (segment: 'organize' | 'improve' | 'grow') => void;
  onUserTypeChange?: (userType: 'small' | 'micro' | 'medium') => void;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({
  state,
  onSegmentChange,
  onUserTypeChange
}) => {
  // Calculate progress percentage
  const calculateProgress = () => {
    const totalMissions = state.missions.length;
    const completedMissions = state.missions.filter(
      mission => mission.status === 'completed' || mission.status === 'validated'
    ).length;

    return Math.round((completedMissions / totalMissions) * 100);
  };

  const progressPercentage = calculateProgress();

  // Customize dashboard based on user type
  const getUserTypeDescription = () => {
    switch (state.userType) {
      case 'small':
        return 'Focused on basic organization, visibility, and stability';
      case 'micro':
        return 'Focused on process improvement, cost reduction, and consistency';
      case 'medium':
        return 'Focused on scalability, performance optimization, and growth';
      default:
        return 'Focused on lean journey progression';
    }
  };

  // Customize KPIs based on user type
  const getRelevantKPIs = () => {
    switch (state.userType) {
      case 'small':
        return [
          { id: 'efficiency', label: 'Operational Visibility', unit: '%' },
          { id: 'wasteReduction', label: 'Basic Metrics', unit: '%' },
          { id: 'productivity', label: 'Stability Index', unit: '%' },
        ];
      case 'micro':
        return [
          { id: 'efficiency', label: 'Process Efficiency', unit: '%' },
          { id: 'wasteReduction', label: 'Cost Reduction', unit: '%' },
          { id: 'productivity', label: 'Consistency Score', unit: '%' },
        ];
      case 'medium':
        return [
          { id: 'efficiency', label: 'Performance Index', unit: '%' },
          { id: 'wasteReduction', label: 'Optimization Rate', unit: '%' },
          { id: 'productivity', label: 'Growth Potential', unit: '%' },
        ];
      default:
        return [
          { id: 'efficiency', label: 'Efficiency', unit: '%' },
          { id: 'wasteReduction', label: 'Waste Reduction', unit: '%' },
          { id: 'productivity', label: 'Productivity', unit: '%' },
        ];
    }
  };

  return (
    <div style={{ marginBottom: 32 }}>
      {/* Segments */}
      <div style={{ marginBottom: 32 }}>
        {(['Organize', 'Improve', 'Grow'] as const).map((w, i) => (
          <div
            key={w}
            style={{
              background: state.currentSegment === w.toLowerCase() ? '#3b82f6' : '#ffffff',
              color: state.currentSegment === w.toLowerCase() ? 'white' : '#0f172a',
              border: `1px solid ${state.currentSegment === w.toLowerCase() ? '#3b82f6' : '#e2e8f0'}`,
              borderRadius: 8,
              padding: 12,
              marginBottom: 10,
              cursor: 'pointer'
            }}
            onClick={() => onSegmentChange(w.toLowerCase() as 'organize' | 'improve' | 'grow')}
          >
            <div style={{ fontWeight: 600, fontSize: 16 }}>{`${w}`}</div>
            <div style={{ fontSize: 13, color: state.currentSegment === w.toLowerCase() ? '#cbd5e1' : '#64748b' }}>
              {w === 'Organize' && 'Create visibility & stability'}
              {w === 'Improve' && 'Eliminate waste'}
              {w === 'Grow' && 'Scale with confidence'}
            </div>
          </div>
        ))}
      </div>

      <div className="kpis-grid">
        {getRelevantKPIs().map(kpi => (
          <div className="kpi-card" key={kpi.id}>
            <h3>{kpi.label}</h3>
            <p>{state.kpis[kpi.id] || 0}{kpi.unit}</p>
          </div>
        ))}
      </div>

      <div className="user-role">
        <h3>User Role: {state.userRole.charAt(0).toUpperCase() + state.userRole.slice(1)}</h3>
      </div>
    </div>
  );
};

export default DashboardSection;