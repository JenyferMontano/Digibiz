'use client';

import React from 'react';
import { Mission, BusinessSegment, MissionStatus, UserType } from '../hooks/useBusinessState';

interface MissionsPanelProps {
  missions: Mission[];
  currentSegment: BusinessSegment;
  onMissionStatusUpdate: (missionId: string, status: MissionStatus) => void;
  onAddEvidence: (missionId: string, evidence: string) => void;
}

const MissionsPanel: React.FC<MissionsPanelProps> = ({
  missions,
  currentSegment,
  onMissionStatusUpdate,
  onAddEvidence
}) => {
  // Filter missions based on current segment
  const segmentMissions = missions.filter(
    mission => mission.segment === currentSegment
  );

  const getStatusIcon = (status: MissionStatus) => {
    switch (status) {
      case 'locked':
        return '🔒';
      case 'available':
        return '🔓';
      case 'in-progress':
        return '⏳';
      case 'completed':
        return '✅';
      case 'validated':
        return '🏆';
      default:
        return '❓';
    }
  };

  const getStatusClass = (status: MissionStatus) => {
    switch (status) {
      case 'locked':
        return 'status-locked';
      case 'available':
        return 'status-available';
      case 'in-progress':
        return 'status-in-progress';
      case 'completed':
        return 'status-completed';
      case 'validated':
        return 'status-validated';
      default:
        return '';
    }
  };

  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: '#0f172a' }}>{currentSegment.charAt(0).toUpperCase() + currentSegment.slice(1)} Missions</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {segmentMissions.map((mission) => (
          <div
            key={mission.id}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              padding: 14,
              marginBottom: 10,
              opacity: mission.status === 'locked' ? 0.6 : 1
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: '#0f172a' }}>{mission.title}</div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{mission.description}</div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 500, minWidth: 60, textAlign: 'right' }}>
                {mission.status === 'in-progress' && 'In Progress'}
                {mission.status === 'locked' && 'Locked'}
                {(mission.status === 'completed' || mission.status === 'validated') && 'Completed'}
                {mission.status === 'available' && 'Available'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {mission.status === 'available' && (
                <button
                  onClick={() => onMissionStatusUpdate(mission.id, 'in-progress')}
                  style={{
                    padding: '6px 12px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 12,
                    cursor: 'pointer'
                  }}
                >
                  Start Mission
                </button>
              )}
              {mission.status === 'in-progress' && (
                <button
                  onClick={() => onMissionStatusUpdate(mission.id, 'completed')}
                  style={{
                    padding: '6px 12px',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 12,
                    cursor: 'pointer'
                  }}
                >
                  Mark Complete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MissionsPanel;