import React, { useState, useEffect, useRef } from 'react';
import MessageFormProps from './module/message_form';

interface ChatBoxProps {
  messages: MessageFormProps[];
  user: { uid: string };
  onSubmit: (text: string) => void;
  renderMessage: (msg: MessageFormProps) => React.ReactNode;
}

export default function ChatBox({ messages, user, onSubmit, renderMessage }: ChatBoxProps) {
  const [input, setInput] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const atBottomRef = useRef(true);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 20;
    atBottomRef.current = atBottom;
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (atBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSubmit(input);
    setInput('');
  };

  return (
    <div className="chat-box" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        className="msg-page"
        ref={containerRef}
        onScroll={handleScroll}
        style={{ flex: '1 1 auto', overflowY: 'auto' }}
      >
        {messages.map(renderMessage)}
      </div>
      <div className="msg-footer">
        <form className="message-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              className="form-control message-input"
              placeholder="Type something"
              value={input}
              onChange={e => setInput(e.target.value)}
              required
            />
          </div>
        </form>
      </div>
    </div>
  );
}
