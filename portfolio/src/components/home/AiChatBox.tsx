import React, { useState } from 'react';

interface AiMessage {
  id: number;
  sender: 'user' | 'bot';
  text: string;
}

async function callSelectFunction(text: string): Promise<string | undefined> {
  // Default to calling the Cloud Function via a relative path when no
  // environment variable is provided. This allows the app to work even if the
  // build-time variable is missing (e.g. in preview deployments).
  const url = process.env.REACT_APP_SELECT_FUNCTION_URL || '/selectFunction';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const data = await res.json();
    return data.function as string;
  } catch (err) {
    console.error('Failed to call selectFunction', err);
    return undefined;
  }
}

const AiChatBox: React.FC = () => {
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: AiMessage = { id: messages.length + 1, sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    const func = await callSelectFunction(input);
    const botText = func ? `Function selected: ${func}` : 'Failed to get response';
    const botMsg: AiMessage = { id: userMsg.id + 1, sender: 'bot', text: botText };
    setMessages(prev => [...prev, botMsg]);
  };

  return (
    <div>
      <div className="chatbox">
        {messages.map(m => (
          <div key={m.id} className={`msg-${m.sender}`}>{m.text}</div>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type your question"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default AiChatBox;
