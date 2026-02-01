'use client';

import React from 'react';

interface ChatSectionProps {
  children: React.ReactNode;
}

const ChatSection: React.FC<ChatSectionProps> = ({ children }) => {
  return (
    <div className="chat-section">
      <h2>AI Assistant</h2>
      <div className="widget-container">
        {children}
      </div>
    </div>
  );
};

export default ChatSection;