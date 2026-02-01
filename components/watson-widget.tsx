import React, { useState } from 'react';
import './mock-watson-widget.css';

interface MockWatsonWidgetProps {
  config: {
    apiKey?: string;
    serviceUrl?: string;
    assistantId?: string;
  };
  onReady?: () => void;
  onMessage?: (message: any) => void;
  onError?: (error: any) => void;
}

const MockWatsonWidget: React.FC<MockWatsonWidgetProps> = ({
  config,
  onReady,
  onMessage,
  onError
}) => {
  const [messages, setMessages] = useState<{id: number, text: string, sender: 'user' | 'ai'}[]>([
    { id: 1, text: 'Hello! I\'m your AI consultant. How can I help you today?', sender: 'ai' }
  ]);
  const [inputValue, setInputValue] = useState('');

  // Simulate widget initialization
  React.useEffect(() => {
    if (onReady) {
      // Simulate async initialization
      setTimeout(() => {
        onReady();
      }, 500);
    }
  }, [onReady]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user' as const
    };

    setMessages(prev => [...prev, newUserMessage]);

    // Trigger onMessage callback
    if (onMessage) {
      onMessage({ type: 'user_message', payload: { text: inputValue } });
    }

    // Simulate AI response after delay
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: `I received your message: "${inputValue}". This is a simulated response from the AI consultant.`,
        sender: 'ai' as const
      };

      setMessages(prev => [...prev, aiResponse]);

      // Trigger onMessage callback for AI response
      if (onMessage) {
        onMessage({
          type: 'ai_response',
          payload: {
            text: aiResponse.text,
            intent: 'general_response'
          }
        });
      }
    }, 1000);

    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="mock-watson-widget">
      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.sender}`}
          >
            <div className="message-bubble">
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input-area">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          rows={2}
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputValue.trim()}
          className="send-button"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MockWatsonWidget;