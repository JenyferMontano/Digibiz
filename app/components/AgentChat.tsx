'use client';

import { useEffect, useRef, useState } from 'react';

interface AgentChatProps {
  agentId: string;
  agentEnvId: string;
  orchestrationId: string;
  hostURL: string;
  crn?: string;
  onMessage?: (message: string) => void;
  onResponse?: (response: string) => void;
  initialMessage?: string;
  visible?: boolean;
  rootElementId?: string;
}

export default function AgentChat({
  agentId,
  agentEnvId,
  orchestrationId,
  hostURL,
  crn,
  onMessage,
  onResponse,
  initialMessage,
  visible = false,
  rootElementId
}: AgentChatProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  // Generate unique ID for this agent instance
  const uniqueRootId = rootElementId || `wxo-chat-${agentId.substring(0, 8)}`;

  useEffect(() => {
    if (!containerRef.current || isLoaded || !visible) return;

    // Set the container ID immediately
    if (containerRef.current) {
      containerRef.current.id = uniqueRootId;
      containerRef.current.style.display = 'block';
      containerRef.current.style.visibility = 'visible';
      containerRef.current.style.height = '500px';
      containerRef.current.style.width = '100%';
      containerRef.current.style.position = 'relative';
      containerRef.current.style.backgroundColor = '#ffffff';
      containerRef.current.style.overflow = 'hidden';
    }

    // Wait for React to mount the element
    const initTimeout = setTimeout(() => {
      const mountElement = document.getElementById(uniqueRootId);
      if (!mountElement) {
        console.error(`Mount element ${uniqueRootId} not found`);
        return;
      }

      // Set up wxOConfiguration exactly as in the embed script
      (window as any).wxOConfiguration = {
        orchestrationID: orchestrationId,
        hostURL: hostURL,
        rootElementID: uniqueRootId,
        deploymentPlatform: "ibmcloud",
        crn: crn || `crn:v1:bluemix:public:watsonx-orchestrate:ca-tor:a/${orchestrationId.split('_')[0]}:${orchestrationId.split('_')[1]}::`,
        chatOptions: {
          agentId: agentId,
          agentEnvironmentId: agentEnvId,
        }
      };

      // Check if script is already loaded
      if ((window as any).wxoLoader) {
        initializeChat(mountElement);
      } else {
        // Load the script
        loadScript(mountElement);
      }
    }, 300);

    return () => {
      clearTimeout(initTimeout);
      cleanup();
    };
  }, [agentId, agentEnvId, orchestrationId, hostURL, crn, initialMessage, visible, isLoaded, uniqueRootId]);

  const loadScript = (mountElement: HTMLElement) => {
    // Remove existing script if any
    const existingScript = document.querySelector(`script[src*="wxoLoader.js"]`);
    if (existingScript && existingScript.parentNode) {
      existingScript.parentNode.removeChild(existingScript);
    }

    const script = document.createElement('script');
    script.src = `${hostURL}/wxochat/wxoLoader.js?embed=true`;
    script.async = true;
    
    script.addEventListener('load', () => {
      setTimeout(() => initializeChat(mountElement), 500);
    });

    script.onerror = () => {
      console.error('Failed to load watsonx Orchestrate script');
    };

    document.head.appendChild(script);
    scriptRef.current = script;
  };

  const initializeChat = (mountElement: HTMLElement) => {
    if (!(window as any).wxoLoader) {
      console.error('wxoLoader not available');
      return;
    }

    try {
      console.log(`Initializing chat for agent ${agentId.substring(0, 8)} in element ${uniqueRootId}`);
      
      // Ensure element is ready
      mountElement.style.display = 'block';
      mountElement.style.visibility = 'visible';
      mountElement.style.height = '500px';
      mountElement.style.width = '100%';

      // Initialize the chat
      (window as any).wxoLoader.init();
      setIsLoaded(true);
      console.log('✓ watsonx Orchestrate chat initialized');

      // Set up MutationObserver to capture responses
      if (onResponse) {
        observerRef.current = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1) {
                const element = node as HTMLElement;
                const text = element.textContent || element.innerText || '';
                
                // Look for agent responses (not user input)
                if (text.length > 20 && 
                    !element.querySelector('input, textarea, [contenteditable="true"]') &&
                    text !== initialMessage) {
                  console.log('Agent response detected:', text.substring(0, 100));
                  onResponse(text);
                }
              }
            });
          });
        });

        observerRef.current.observe(mountElement, {
          childList: true,
          subtree: true,
          characterData: true
        });
      }

      // Send initial message after chat is ready
      if (initialMessage) {
        setTimeout(() => {
          sendInitialMessage(mountElement);
        }, 3000);
      }

      // Verify chat rendered
      setTimeout(() => {
        const chatUI = mountElement.querySelector('iframe, [class*="chat"], [id*="chat"], [class*="message"]');
        if (chatUI) {
          console.log('✓ Chat UI rendered successfully');
        } else {
          console.warn('⚠ Chat UI not visible in DOM');
        }
      }, 2000);

    } catch (error) {
      console.error('Error initializing watsonx Orchestrate:', error);
    }
  };

  const sendInitialMessage = (mountElement: HTMLElement) => {
    const selectors = [
      'input[type="text"]',
      'textarea',
      '[contenteditable="true"]',
      '.chat-input',
      'input',
    ];

    let chatInput: HTMLInputElement | null = null;
    for (const selector of selectors) {
      chatInput = mountElement.querySelector(selector) as HTMLInputElement;
      if (chatInput) break;
    }

    if (chatInput) {
      chatInput.value = initialMessage || '';
      chatInput.dispatchEvent(new Event('input', { bubbles: true }));
      chatInput.dispatchEvent(new Event('change', { bubbles: true }));
      
      // Try to find send button
      const sendButton = mountElement.querySelector('button[type="submit"], button[aria-label*="send"], .send-button, [class*="send"]') as HTMLButtonElement;
      if (sendButton) {
        sendButton.click();
      } else {
        // Fallback: Enter key
        const enterEvent = new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          bubbles: true,
          cancelable: true
        });
        chatInput.dispatchEvent(enterEvent);
      }
      console.log('Initial message sent:', initialMessage);
    } else {
      console.warn('Could not find chat input to send initial message');
    }
  };

  const cleanup = () => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    if (scriptRef.current && document.head.contains(scriptRef.current)) {
      document.head.removeChild(scriptRef.current);
    }
    if ((window as any).wxOConfiguration) {
      delete (window as any).wxOConfiguration;
    }
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <div style={{ width: '100%', marginBottom: '1rem' }}>
      <div 
        ref={containerRef}
        id={uniqueRootId}
        style={{ 
          width: '100%', 
          minHeight: '500px',
          height: '500px',
          border: '2px solid #007bff',
          borderRadius: '8px',
          display: 'block',
          position: 'relative',
          backgroundColor: '#ffffff',
          overflow: 'hidden'
        }}
      >
        {!isLoaded && (
          <div style={{ 
            padding: '2rem', 
            textAlign: 'center', 
            color: '#666',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1
          }}>
            <div>Loading watsonx Orchestrate chat...</div>
            <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Agent: {agentId.substring(0, 8)}...</div>
          </div>
        )}
      </div>
      {isLoaded && (
        <div style={{ padding: '0.5rem', fontSize: '0.9rem', color: '#28a745' }}>
          ✓ Chat loaded and ready
        </div>
      )}
    </div>
  );
}
