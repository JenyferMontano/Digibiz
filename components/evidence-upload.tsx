'use client';

import React, { useState } from 'react';

interface EvidenceUploadProps {
  onEvidenceSubmit: (evidence: string) => void;
}

const EvidenceUpload: React.FC<EvidenceUploadProps> = ({ onEvidenceSubmit }) => {
  const [evidence, setEvidence] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidence.trim()) return;

    setIsUploading(true);
    setUploadStatus('idle');

    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onEvidenceSubmit(evidence);
      setUploadStatus('success');
      setEvidence('');
      
      // Reset status after showing success
      setTimeout(() => setUploadStatus('idle'), 3000);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus('error');
      
      // Reset status after showing error
      setTimeout(() => setUploadStatus('idle'), 3000);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      style={{
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        padding: 20,
        background: '#f8fafc'
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: '#0f172a' }}>Upload Evidence</div>
      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 14 }}>
        Submit documentation or proof for mission validation
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={evidence}
          onChange={(e) => setEvidence(e.target.value)}
          placeholder="Paste link, upload file, or describe evidence..."
          disabled={isUploading}
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: 6,
            fontSize: 14
          }}
        />
        <button
          type="submit"
          disabled={!evidence.trim() || isUploading}
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 14
          }}
        >
          {isUploading ? 'Uploading...' : 'Submit'}
        </button>
      </form>

      {uploadStatus === 'success' && (
        <div style={{
          padding: '8px',
          borderRadius: '4px',
          backgroundColor: '#dcfce7',
          color: '#166534',
          marginTop: '8px',
          fontSize: 13
        }}>
          ✅ Evidence submitted successfully! Awaiting validation...
        </div>
      )}

      {uploadStatus === 'error' && (
        <div style={{
          padding: '8px',
          borderRadius: '4px',
          backgroundColor: '#fee2e2',
          color: '#b91c1c',
          marginTop: '8px',
          fontSize: 13
        }}>
          ❌ Submission failed. Please try again.
        </div>
      )}
    </div>
  );
};

export default EvidenceUpload;