import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Radio, 
  ArrowRight
} from 'lucide-react';

interface ChatMessageItem {
  id: string;
  sender: 'ai' | 'visitor' | 'admin' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
}

export const ChatWidget: React.FC = () => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'ai' | 'live'>('ai');

  // AI Chat State
  const [aiMessages, setAiMessages] = useState<ChatMessageItem[]>([
    {
      id: 'welcome',
      sender: 'ai',
      senderName: t.chat?.aiTitle || 'APX AI Assistant',
      text: t.chat?.welcome || "Hi! Welcome to APX Digital. I'm your AI assistant. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Update initial welcome message on language switch
  useEffect(() => {
    setAiMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'welcome') {
        return [
          {
            id: 'welcome',
            sender: 'ai',
            senderName: t.chat?.aiTitle || 'APX AI Assistant',
            text: t.chat?.welcome || "Hi! Welcome to APX Digital. I'm your AI assistant. How can I help you today?",
            timestamp: prev[0].timestamp,
          },
        ];
      }
      return prev;
    });
  }, [t.chat?.welcome, t.chat?.aiTitle]);
  const [aiInput, setAiInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Live Chat State
  const [visitorName, setVisitorName] = useState(() => localStorage.getItem('apx_visitor_name') || '');
  const [visitorEmail, setVisitorEmail] = useState(() => localStorage.getItem('apx_visitor_email') || '');
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [liveAdminOnline, setLiveAdminOnline] = useState(false);
  const [liveStatusText, setLiveStatusText] = useState('');
  const [liveMessages, setLiveMessages] = useState<ChatMessageItem[]>([]);
  const [liveInput, setLiveInput] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(() => localStorage.getItem('apx_conv_id'));

  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, aiMessages, liveMessages, isAiTyping]);

  // Connect to Live Support via WebSocket
  const startLiveChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!visitorName.trim() || !visitorEmail.trim()) return;

    localStorage.setItem('apx_visitor_name', visitorName.trim());
    localStorage.setItem('apx_visitor_email', visitorEmail.trim());

    let convId = conversationId;
    if (!convId) {
      convId = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      setConversationId(convId);
      localStorage.setItem('apx_conv_id', convId);
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsLiveConnected(true);
      ws.send(JSON.stringify({
        type: 'visitor:init',
        conversationId: convId,
        visitorId: visitorEmail.trim(),
        name: visitorName.trim(),
        email: visitorEmail.trim(),
      }));
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'visitor:ready') {
          setLiveAdminOnline(msg.online);
          setLiveStatusText(msg.statusMessage);
          if (msg.history && msg.history.length > 0) {
            const formatted: ChatMessageItem[] = msg.history.map((h: any) => ({
              id: h.id,
              sender: h.sender,
              senderName: h.sender_name,
              text: h.message,
              timestamp: new Date(h.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }));
            setLiveMessages(formatted);
          }
        } else if (msg.type === 'system:status') {
          setLiveAdminOnline(msg.online);
          setLiveStatusText(msg.message);
        } else if (msg.type === 'chat:new_message' || msg.type === 'chat:message_ack') {
          const newMsg: ChatMessageItem = {
            id: msg.id,
            sender: msg.sender,
            senderName: msg.sender_name,
            text: msg.message,
            timestamp: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setLiveMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      } catch (err) {
        console.error('Visitor WS parse error:', err);
      }
    };

    ws.onclose = () => {
      setIsLiveConnected(false);
    };
  };

  // Send AI message
  const handleAiSend = async (textToSend?: string) => {
    const text = (textToSend || aiInput).trim();
    if (!text) return;

    const userMsg: ChatMessageItem = {
      id: `usr_${Date.now()}`,
      sender: 'visitor',
      senderName: 'You',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setAiMessages((prev) => [...prev, userMsg]);
    setAiInput('');
    setIsAiTyping(true);

    try {
      const res = await fetch('/api/chat/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language,
        }),
      });

      const data = await res.json();
      if (res.ok && data.reply) {
        const aiMsg: ChatMessageItem = {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          senderName: 'APX AI Assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setAiMessages((prev) => [...prev, aiMsg]);
      }
    } catch {
      setAiMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'ai',
          senderName: 'APX AI Assistant',
          text: "I'm having trouble connecting to the network right now. Please explore our Services page or contact our team directly!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsAiTyping(false);
    }
  };

  // Send Live Chat Message
  const handleLiveSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveInput.trim() || !wsRef.current || !conversationId) return;

    const text = liveInput.trim();
    wsRef.current.send(JSON.stringify({
      type: 'visitor:message',
      conversationId,
      text,
      senderName: visitorName || 'Visitor',
    }));

    setLiveInput('');
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
        }}
      >
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="chat-widget-btn"
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'var(--accent-gradient)',
              color: 'var(--accent-contrast)',
              border: 'none',
              boxShadow: 'var(--shadow-glow)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            aria-label="Open APX AI Chat and Live Support"
          >
            <MessageSquare size={26} />
          </button>
        )}
      </div>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          className="chat-widget-panel"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: 'min(420px, calc(100vw - 32px))',
            height: 'min(620px, calc(100vh - 48px))',
            backgroundColor: 'var(--bg-card)',
            borderRadius: '24px',
            border: '1px solid var(--border-highlight)',
            boxShadow: 'var(--shadow-lg), var(--shadow-glow)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            className="chat-widget-header"
            style={{
              padding: '1rem 1.2rem',
              backgroundColor: 'var(--bg-surface)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: mode === 'ai' ? 'var(--accent-subtle)' : 'rgba(16,185,129,0.18)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: mode === 'ai' ? 'var(--accent-primary)' : '#10B981',
                  }}
                >
                  {mode === 'ai' ? <Bot size={18} /> : <Radio size={18} />}
                </div>
                <div>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    {mode === 'ai' ? t.chat?.aiTitle || 'Chat with APX AI' : t.chat?.liveTitle || 'Live Human Support'}
                  </h3>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    {mode === 'ai' ? t.chat?.aiSubtitle || 'Official Agency Assistant' : liveAdminOnline ? t.chat?.agentOnline || 'Specialist Online' : t.chat?.agentOffline || 'Specialist Offline'}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-secondary)',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div
            className="chat-widget-tabs"
            style={{
              display: 'flex',
              backgroundColor: 'var(--bg-secondary)',
              padding: '6px',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <button
              onClick={() => setMode('ai')}
              className={mode === 'ai' ? 'active' : ''}
              style={{
                flex: 1,
                padding: '6px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: mode === 'ai' ? 'var(--bg-surface)' : 'transparent',
                color: mode === 'ai' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s',
              }}
            >
              <Sparkles size={14} />
              <span>{t.chat?.tabAi || 'APX AI'}</span>
            </button>
            <button
              onClick={() => {
                setMode('live');
                if (visitorName && visitorEmail && !isLiveConnected) {
                  startLiveChat();
                }
              }}
              className={mode === 'live' ? 'active' : ''}
              style={{
                flex: 1,
                padding: '6px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: mode === 'live' ? 'var(--bg-surface)' : 'transparent',
                color: mode === 'live' ? '#10B981' : 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s',
              }}
            >
              <User size={14} />
              <span>{t.chat?.tabLive || 'Talk to a Live Agent'}</span>
            </button>
          </div>

          {/* MODE 1: AI CHAT */}
          {mode === 'ai' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Message History */}
              <div
                style={{
                  flex: 1,
                  padding: '1rem',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                }}
              >
                {aiMessages.map((msg) => {
                  const isAi = msg.sender === 'ai';
                  return (
                    <div
                      key={msg.id}
                      className={isAi ? 'chat-bubble-ai' : 'chat-bubble-visitor'}
                      style={{
                        alignSelf: isAi ? 'flex-start' : 'flex-end',
                        maxWidth: '85%',
                        padding: '0.85rem 1rem',
                        borderRadius: isAi ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                        backgroundColor: isAi ? 'var(--bg-surface)' : 'var(--accent-primary)',
                        color: isAi ? 'var(--text-primary)' : 'var(--accent-contrast)',
                        border: isAi ? '1px solid var(--border-subtle)' : 'none',
                        fontSize: '0.88rem',
                        lineHeight: 1.55,
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    >
                      <div style={{ fontSize: '0.68rem', fontWeight: 800, marginBottom: '4px', opacity: 0.75 }}>
                        {msg.senderName}
                      </div>
                      <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                      <div style={{ fontSize: '0.65rem', textAlign: 'right', marginTop: '4px', opacity: 0.6 }}>
                        {msg.timestamp}
                      </div>
                    </div>
                  );
                })}

                {isAiTyping && (
                  <div
                    style={{
                      alignSelf: 'flex-start',
                      padding: '0.75rem 1rem',
                      borderRadius: '16px 16px 16px 4px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }} />
                    <span>{t.chat?.thinking || 'APX AI is thinking...'}</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Pills */}
              <div
                className="chat-input-bar"
                style={{
                  padding: '6px 10px',
                  display: 'flex',
                  gap: '6px',
                  overflowX: 'auto',
                  borderTop: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                }}
              >
                {(t.chat?.pills || [
                  'What services do you offer?',
                  'Social Media Management',
                  'Tell me about your team',
                  'How do we start a project?',
                ]).map((prompt: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => handleAiSend(prompt)}
                    className="chat-prompt-pill"
                    style={{
                      whiteSpace: 'nowrap',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '0.74rem',
                      cursor: 'pointer',
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAiSend();
                }}
                className="chat-input-bar"
                style={{
                  padding: '0.8rem',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  gap: '8px',
                  backgroundColor: 'var(--bg-surface)',
                }}
              >
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder={t.chat?.placeholder || 'Ask APX AI anything...'}
                  className="chat-input-field"
                  style={{
                    flex: 1,
                    padding: '0.65rem 0.9rem',
                    borderRadius: '10px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  disabled={!aiInput.trim()}
                  className="chat-send-btn"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'var(--accent-gradient)',
                    color: 'var(--accent-contrast)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    opacity: aiInput.trim() ? 1 : 0.5,
                  }}
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          )}

          {/* MODE 2: LIVE HUMAN AGENT */}
          {mode === 'live' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {!isLiveConnected && (!visitorName || !visitorEmail) ? (
                /* Visitor Registration Form */
                <div style={{ padding: '2rem 1.5rem', margin: 'auto 0', textAlign: 'center' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(16,185,129,0.15)',
                      color: '#10B981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1rem auto',
                    }}
                  >
                    <User size={24} />
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                    {t.chat?.liveHeading || 'Connect with an APX Specialist'}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                    {t.chat?.liveSubheading || 'Please enter your contact details so our team can assist you directly and preserve your conversation.'}
                  </p>

                  <form onSubmit={startLiveChat} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', textAlign: 'left' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                        {t.chat?.nameLabel || 'Your Full Name'}
                      </label>
                      <input
                        type="text"
                        required
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        placeholder={t.chat?.namePlaceholder || 'e.g. John Doe'}
                        className="chat-input-field"
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          backgroundColor: 'var(--bg-card)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-primary)',
                          fontSize: '0.88rem',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                        {t.chat?.emailLabel || 'Email Address'}
                      </label>
                      <input
                        type="email"
                        required
                        value={visitorEmail}
                        onChange={(e) => setVisitorEmail(e.target.value)}
                        placeholder={t.chat?.emailPlaceholder || 'you@company.com'}
                        className="chat-input-field"
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          backgroundColor: 'var(--bg-card)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-primary)',
                          fontSize: '0.88rem',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      style={{
                        marginTop: '0.5rem',
                        padding: '0.75rem',
                        borderRadius: '10px',
                        backgroundColor: '#10B981',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>{t.chat?.startLiveBtn || 'Start Conversation'}</span>
                      <ArrowRight size={15} />
                    </button>
                  </form>
                </div>
              ) : (
                /* Active Live Chat Thread */
                <>
                  {/* Status Banner */}
                  <div
                    className="chat-status-banner"
                    style={{
                      padding: '8px 12px',
                      backgroundColor: liveAdminOnline ? 'rgba(16,185,129,0.1)' : 'var(--accent-subtle)',
                      borderBottom: '1px solid var(--border-subtle)',
                      fontSize: '0.74rem',
                      color: liveAdminOnline ? '#10B981' : 'var(--accent-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span
                      className="chat-status-dot"
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        backgroundColor: liveAdminOnline ? '#10B981' : 'var(--accent-primary)',
                      }}
                    />
                    <span>{liveStatusText || (liveAdminOnline ? 'An APX Digital specialist is online.' : 'Our team is currently unavailable. Please leave your message, and we\'ll get back to you.')}</span>
                  </div>

                  {/* Messages */}
                  <div
                    style={{
                      flex: 1,
                      padding: '1rem',
                      overflowY: 'auto',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.85rem',
                    }}
                  >
                    {liveMessages.length === 0 ? (
                      <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.82rem', padding: '1rem' }}>
                        Type your message below to communicate with our engineering & design team in real time.
                      </div>
                    ) : (
                      liveMessages.map((msg) => {
                        const isAdmin = msg.sender === 'admin';
                        return (
                          <div
                            key={msg.id}
                            className={isAdmin ? 'chat-bubble-ai' : 'chat-bubble-visitor'}
                            style={{
                              alignSelf: isAdmin ? 'flex-start' : 'flex-end',
                              maxWidth: '85%',
                              padding: '0.85rem 1rem',
                              borderRadius: isAdmin ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                              backgroundColor: isAdmin ? 'var(--bg-surface)' : '#10B981',
                              color: isAdmin ? 'var(--text-primary)' : '#FFFFFF',
                              border: isAdmin ? '1px solid var(--border-subtle)' : 'none',
                              fontSize: '0.88rem',
                              lineHeight: 1.5,
                              boxShadow: 'var(--shadow-sm)',
                            }}
                          >
                            <div style={{ fontSize: '0.68rem', fontWeight: 800, marginBottom: '4px', color: isAdmin ? 'var(--accent-primary)' : '#D1FAE5' }}>
                              {msg.senderName} {isAdmin ? '(Human Specialist)' : ''}
                            </div>
                            <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                            <div style={{ fontSize: '0.65rem', textAlign: 'right', marginTop: '4px', opacity: 0.7 }}>
                              {msg.timestamp}
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Live Message Input */}
                  <form
                    onSubmit={handleLiveSend}
                    className="chat-input-bar"
                    style={{
                      padding: '0.8rem',
                      borderTop: '1px solid var(--border-subtle)',
                      display: 'flex',
                      gap: '8px',
                      backgroundColor: 'var(--bg-surface)',
                    }}
                  >
                    <input
                      type="text"
                      value={liveInput}
                      onChange={(e) => setLiveInput(e.target.value)}
                      placeholder={liveAdminOnline ? (t.chat?.liveInputPlaceholder || "Message our live specialist...") : (t.chat?.agentOffline || "Leave an offline message...")}
                      className="chat-input-field"
                      style={{
                        flex: 1,
                        padding: '0.65rem 0.9rem',
                        borderRadius: '10px',
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                        fontSize: '0.88rem',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="submit"
                      disabled={!liveInput.trim()}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: '#10B981',
                        color: '#FFFFFF',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        opacity: liveInput.trim() ? 1 : 0.5,
                      }}
                    >
                      <Send size={15} />
                    </button>
                  </form>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};
