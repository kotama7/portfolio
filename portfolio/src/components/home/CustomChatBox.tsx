import React, { useRef, useState, useEffect, FormEvent } from 'react';
import MessageFormProps from './module/message_form';

interface ChatBoxProps {
  messages: MessageFormProps[];
  user: { uid: string; name?: string; avatar?: string };
  onSubmit: (text: string) => void;
}

export default function CustomChatBox({ messages, user, onSubmit }: ChatBoxProps) {
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const nearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;
    if (nearBottom) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(input);
    setInput('');
  };

  return (
    <div className="chat-box">
      <div className="msg-page" ref={containerRef} style={{ overflowY: 'auto', maxHeight: '100%' }}>
        {messages.map((msg) => {
          const isUser = user.uid === msg.sender.uid;
          return (
            <div key={msg.id} className="chat-bubble-row" style={{ flexDirection: isUser ? 'row-reverse' : 'row' }}>
              <img
                src={msg.sender.avatar}
                alt="sender avatar"
                className="avatar"
                style={isUser ? { marginLeft: '15px' } : { marginRight: '15px' }}
              />
              <div className={`chat-bubble ${isUser ? 'is-user' : 'is-other'}`}
                style={{ color: isUser ? '#FFF' : '#2D313F' }}>
                {msg.sender.uid !== user.uid && (
                  <div className="sender-name">{msg.sender.name}</div>
                )}
                <div className="message">{msg.text}</div>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
      <div className="chat-box-bottom">
        <form className="message-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              className="form-control message-input"
              placeholder="Type something"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              required
            />
          </div>
        </form>
      </div>
    </div>
  );
}
