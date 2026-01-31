'use client';

import { useState } from 'react';
import AgentChat from './AgentChat';

interface AgentOrchestratorProps {
  businessDescription: string;
  businessState?: any;
  onComplete: (results: {
    assessment: any;
    mission: any;
    execution: any;
  }) => void;
  onError: (error: string) => void;
}

export default function AgentOrchestrator({
  businessDescription,
  businessState,
  onComplete,
  onError
}: AgentOrchestratorProps) {
  const [currentStep, setCurrentStep] = useState<'assessment' | 'lean_coach' | 'execution' | 'done'>('assessment');
  const [assessmentResult, setAssessmentResult] = useState<any>(null);
  const [missionResult, setMissionResult] = useState<any>(null);
  const [executionResult, setExecutionResult] = useState<any>(null);

  const orchestrationId = process.env.NEXT_PUBLIC_ORCHESTRATION_ID;
  const hostURL = process.env.NEXT_PUBLIC_WATSONX_HOST_URL;
  
  if (!orchestrationId || !hostURL) {
    onError('Missing required environment variables. Please configure NEXT_PUBLIC_ORCHESTRATION_ID and NEXT_PUBLIC_WATSONX_HOST_URL in .env.local');
    return null;
  }
  
  const crn = `crn:v1:bluemix:public:watsonx-orchestrate:ca-tor:a/${orchestrationId.split('_')[0]}:${orchestrationId.split('_')[1]}::`;
  
  const assessmentAgentId = process.env.NEXT_PUBLIC_ASSESSMENT_AGENT_ID;
  const assessmentEnvId = process.env.NEXT_PUBLIC_ASSESSMENT_AGENT_ENV_ID;
  
  const leanCoachAgentId = process.env.NEXT_PUBLIC_LEAN_COACH_AGENT_ID;
  const leanCoachEnvId = process.env.NEXT_PUBLIC_LEAN_COACH_AGENT_ENV_ID;
  
  const executionAgentId = process.env.NEXT_PUBLIC_EXECUTION_AGENT_ID;
  const executionEnvId = process.env.NEXT_PUBLIC_EXECUTION_AGENT_ENV_ID;
  
  if (!assessmentAgentId || !assessmentEnvId || !leanCoachAgentId || !leanCoachEnvId || !executionAgentId || !executionEnvId) {
    onError('Missing required agent environment variables. Please configure all NEXT_PUBLIC_*_AGENT_ID and NEXT_PUBLIC_*_AGENT_ENV_ID in .env.local');
    return null;
  }

  const handleAssessmentResponse = (response: string) => {
    try {
      let parsed = JSON.parse(response);
      setAssessmentResult(parsed);
      setCurrentStep('lean_coach');
    } catch (e) {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          setAssessmentResult(JSON.parse(jsonMatch[0]));
          setCurrentStep('lean_coach');
        } catch (e2) {
          onError('Failed to parse Assessment Agent response');
        }
      } else {
        onError('Assessment Agent response was not valid JSON');
      }
    }
  };

  const handleLeanCoachResponse = (response: string) => {
    try {
      let parsed = JSON.parse(response);
      setMissionResult(parsed);
      setCurrentStep('execution');
    } catch (e) {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          setMissionResult(JSON.parse(jsonMatch[0]));
          setCurrentStep('execution');
        } catch (e2) {
          onError('Failed to parse Lean Coach Agent response');
        }
      } else {
        onError('Lean Coach Agent response was not valid JSON');
      }
    }
  };

  const handleExecutionResponse = (response: string) => {
    try {
      let parsed = JSON.parse(response);
      setExecutionResult(parsed);
      setCurrentStep('done');
      onComplete({
        assessment: assessmentResult,
        mission: missionResult,
        execution: parsed
      });
    } catch (e) {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          setExecutionResult(parsed);
          setCurrentStep('done');
          onComplete({
            assessment: assessmentResult,
            mission: missionResult,
            execution: parsed
          });
        } catch (e2) {
          onError('Failed to parse Execution Agent response');
        }
      } else {
        onError('Execution Agent response was not valid JSON');
      }
    }
  };

  const getLeanCoachMessage = () => {
    if (!assessmentResult) return '';
    const businessStateStr = businessState ? JSON.stringify(businessState) : '';
    return `Assessment findings: ${JSON.stringify(assessmentResult)}\nBusiness state: ${businessStateStr || 'No previous state'}`;
  };

  const getExecutionMessage = () => {
    if (!missionResult) return '';
    return JSON.stringify(missionResult);
  };

  const steps = [
    { id: 'assessment', name: 'Assessment', description: 'Analyzing business wastes' },
    { id: 'lean_coach', name: 'Lean Coach', description: 'Selecting mission' },
    { id: 'execution', name: 'Execution', description: 'Generating action steps' },
    { id: 'done', name: 'Complete', description: 'Mission ready' }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div>
      {/* Progress Steps */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        position: 'relative'
      }}>
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          
          return (
            <div key={step.id} style={{ flex: 1, position: 'relative' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                zIndex: 2
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: isCompleted 
                    ? '#4caf50' 
                    : isActive 
                      ? '#667eea' 
                      : '#e0e0e0',
                  color: isCompleted || isActive ? 'white' : '#999',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  marginBottom: '0.5rem',
                  transition: 'all 0.3s'
                }}>
                  {isCompleted ? '✓' : index + 1}
                </div>
                <div style={{
                  textAlign: 'center',
                  fontSize: '0.85rem'
                }}>
                  <div style={{
                    fontWeight: isActive ? '600' : '400',
                    color: isActive ? '#667eea' : '#999',
                    marginBottom: '0.25rem'
                  }}>
                    {step.name}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#999'
                  }}>
                    {step.description}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '50%',
                  width: '100%',
                  height: '2px',
                  background: isCompleted ? '#4caf50' : '#e0e0e0',
                  zIndex: 1
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Agent Chat Sections */}
      {currentStep === 'assessment' && (
        <div style={{
          border: '2px solid #667eea',
          borderRadius: '12px',
          padding: '1.5rem',
          background: '#f8f9ff'
        }}>
          <h3 style={{
            marginTop: 0,
            color: '#667eea',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#667eea',
              animation: 'pulse 2s infinite'
            }} />
            Step 1: Assessment Agent
          </h3>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Analyzing your business description to identify Lean wastes...
          </p>
          <AgentChat
            agentId={assessmentAgentId}
            agentEnvId={assessmentEnvId}
            orchestrationId={orchestrationId}
            hostURL={hostURL}
            crn={crn}
            onResponse={handleAssessmentResponse}
            initialMessage={businessDescription}
            visible={true}
          />
        </div>
      )}

      {currentStep === 'lean_coach' && (
        <div style={{
          border: '2px solid #667eea',
          borderRadius: '12px',
          padding: '1.5rem',
          background: '#f8f9ff'
        }}>
          <h3 style={{
            marginTop: 0,
            color: '#667eea',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#667eea',
              animation: 'pulse 2s infinite'
            }} />
            Step 2: Lean Coach Agent
          </h3>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Selecting the best mission for your business level...
          </p>
          <AgentChat
            agentId={leanCoachAgentId}
            agentEnvId={leanCoachEnvId}
            orchestrationId={orchestrationId}
            hostURL={hostURL}
            crn={crn}
            onResponse={handleLeanCoachResponse}
            initialMessage={getLeanCoachMessage()}
            visible={true}
          />
        </div>
      )}

      {currentStep === 'execution' && (
        <div style={{
          border: '2px solid #667eea',
          borderRadius: '12px',
          padding: '1.5rem',
          background: '#f8f9ff'
        }}>
          <h3 style={{
            marginTop: 0,
            color: '#667eea',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#667eea',
              animation: 'pulse 2s infinite'
            }} />
            Step 3: Execution Agent
          </h3>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Generating actionable steps and templates...
          </p>
          <AgentChat
            agentId={executionAgentId}
            agentEnvId={executionEnvId}
            orchestrationId={orchestrationId}
            hostURL={hostURL}
            crn={crn}
            onResponse={handleExecutionResponse}
            initialMessage={getExecutionMessage()}
            visible={true}
          />
        </div>
      )}

      {currentStep === 'done' && (
        <div style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
          borderRadius: '12px',
          textAlign: 'center',
          border: '2px solid #4caf50'
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem'
          }}>
            ✅
          </div>
          <h3 style={{
            margin: 0,
            color: '#2e7d32',
            fontSize: '1.5rem',
            marginBottom: '0.5rem'
          }}>
            All Agents Completed!
          </h3>
          <p style={{
            color: '#555',
            margin: 0
          }}>
            Your mission has been generated and saved. Results are being processed...
          </p>
        </div>
      )}
    </div>
  );
}
