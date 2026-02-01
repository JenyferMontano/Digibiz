import { useState } from 'react';
import { saveAgentEvent } from '../lib/cloudant';

// Define types for agent events
export type AgentEventType =
  | 'assessment_detected_issue'
  | 'coach_assigned_mission'
  | 'execution_provided_steps'
  | 'validation_approved'
  | 'validation_rejected'
  | 'kpi_updated'
  | 'mission_status_changed';

export interface AgentEventPayload {
  [key: string]: any;
}

export interface AgentEvent {
  id: string;
  type: AgentEventType;
  payload: AgentEventPayload;
  timestamp: Date;
  userId: string;
}

export const useAgentEvents = (userId: string) => {
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Process incoming agent events
  const processAgentEvent = async (eventData: Partial<AgentEvent>) => {
    setIsLoading(true);
    setError(null);

    try {
      // Create event object
      const event: AgentEvent = {
        id: `event_${Date.now()}`,
        type: eventData.type as AgentEventType || 'generic_event',
        payload: eventData.payload || {},
        timestamp: new Date(),
        userId
      };

      // Add to local state
      setEvents(prev => [event, ...prev]);

      // Save to Cloudant
      await saveAgentEvent(userId, event);

      // Handle specific event types
      switch (event.type) {
        case 'coach_assigned_mission':
          console.log(`Lean Coach: Assigned mission ${event.payload.missionId}`);
          break;

        case 'validation_approved':
          console.log(`Validation Agent: Approved mission ${event.payload.missionId}`);
          break;

        case 'assessment_detected_issue':
          console.log(`Assessment Agent: Detected issue ${event.payload.issueId}`);
          break;

        case 'execution_provided_steps':
          console.log(`Execution Agent: Provided steps for ${event.payload.taskId}`);
          break;

        default:
          console.log(`Agent Event: ${event.type}`, event.payload);
      }
    } catch (err) {
      console.error('Error processing agent event:', err);
      setError('Failed to process agent event');
    } finally {
      setIsLoading(false);
    }
  };

  // Get recent events
  const getRecentEvents = (limit: number = 10) => {
    return events.slice(0, limit);
  };

  // Clear events
  const clearEvents = () => {
    setEvents([]);
  };

  return {
    events,
    isLoading,
    error,
    processAgentEvent,
    getRecentEvents,
    clearEvents
  }}