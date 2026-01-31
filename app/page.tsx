'use client';

import { useState } from 'react';
import AgentOrchestrator from './components/AgentOrchestrator';

export default function Home() {
  const [businessId, setBusinessId] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [started, setStarted] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    if (!businessId.trim() || !businessDescription.trim()) {
      setError('Please fill in both Business ID and Business Description');
      return;
    }
    setError(null);
    setStarted(true);
    setResults(null);
  };

  const handleComplete = async (agentResults: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          businessDescription,
          agentResults
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save results');
      }
      
      const data = await response.json();
      setResults(data);
      
      // Fetch progress
      const progressResponse = await fetch(`/api/progress?businessId=${businessId}`);
      if (progressResponse.ok) {
        const progressData = await progressResponse.json();
        console.log('Progress:', progressData);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (errorMsg: string) => {
    setError(errorMsg);
  };

  const handleReset = () => {
    setStarted(false);
    setResults(null);
    setError(null);
    setBusinessDescription('');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg,rgb(213, 221, 255) 0%,rgb(237, 224, 251) 100%)',
          color: 'white',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '2.5rem', 
            fontWeight: 'bold',
            marginBottom: '0.5rem'
          }}>
            Digibiz
          </h1>
          <p style={{ 
            margin: 0, 
            fontSize: '1.1rem', 
            opacity: 0.9 
          }}>
            Lean AI Consultant for SMEs
          </p>
          <p style={{ 
            margin: '0.5rem 0 0 0', 
            fontSize: '0.9rem', 
            opacity: 0.8 
          }}>
            HOLIS
          </p>
        </div>

        {/* Main Content */}
        <div style={{ padding: '2rem' }}>
          {!started ? (
            <div>
              <h2 style={{ 
                marginBottom: '1.5rem', 
                color: '#333',
                fontSize: '1.5rem'
              }}>
                Start Your Lean Journey
              </h2>
              
              {error && (
                <div style={{
                  padding: '1rem',
                  background: '#ffebee',
                  borderRadius: '8px',
                  color: '#c62828',
                  marginBottom: '1.5rem',
                  border: '1px solid #ef5350'
                }}>
                  <strong>Error:</strong> {error}
                </div>
              )}

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#555'
                }}>
                  Business ID *
                </label>
                <input
                  type="text"
                  value={businessId}
                  onChange={(e) => setBusinessId(e.target.value)}
                  placeholder="e.g., business-123"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#555'
                }}>
                  Business Description *
                </label>
                <textarea
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  placeholder="Describe your business challenges... e.g., I run a small retail shop. We have long waiting times during inventory restocking."
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>

              <button
                onClick={handleStart}
                disabled={!businessId.trim() || !businessDescription.trim()}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: businessId.trim() && businessDescription.trim() 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: businessId.trim() && businessDescription.trim() ? 'pointer' : 'not-allowed',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: businessId.trim() && businessDescription.trim() 
                    ? '0 4px 15px rgba(102, 126, 234, 0.4)'
                    : 'none'
                }}
                onMouseEnter={(e) => {
                  if (businessId.trim() && businessDescription.trim()) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = businessId.trim() && businessDescription.trim() 
                    ? '0 4px 15px rgba(102, 126, 234, 0.4)'
                    : 'none';
                }}
              >
                Start Mission
              </button>
            </div>
          ) : (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h2 style={{ margin: 0, color: '#333' }}>
                  Agent Orchestration
                </h2>
                <button
                  onClick={handleReset}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#f5f5f5',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Start New Mission
                </button>
              </div>

              {error && (
                <div style={{
                  padding: '1rem',
                  background: '#ffebee',
                  borderRadius: '8px',
                  color: '#c62828',
                  marginBottom: '1.5rem'
                }}>
                  <strong>Error:</strong> {error}
                </div>
              )}

              <AgentOrchestrator
                businessDescription={businessDescription}
                businessState={null}
                onComplete={handleComplete}
                onError={handleError}
              />

              {loading && (
                <div style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  background: '#e3f2fd',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  Saving results to Cloudant...
                </div>
              )}

              {results && (
                <div style={{
                  marginTop: '2rem',
                  padding: '1.5rem',
                  background: '#e8f5e9',
                  borderRadius: '12px',
                  border: '2px solid #4caf50'
                }}>
                  <h3 style={{ marginTop: 0, color: '#2e7d32' }}>
                    Mission Started Successfully!
                  </h3>
                  <div style={{ marginTop: '1rem' }}>
                    <p><strong>Business ID:</strong> {results.businessId}</p>
                    <p><strong>Current Level:</strong> {results.currentLevel}</p>
                    {results.activeMission && (
                      <p><strong>Active Mission:</strong> {results.activeMission}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
