import React, { useState } from 'react';
import MessageFormProps from './module/message_form';

interface AiChatBoxProps {
  messages: MessageFormProps[];
  setMessages: React.Dispatch<React.SetStateAction<MessageFormProps[]>>;
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

const AiChatBox: React.FC<AiChatBoxProps> = ({ messages, setMessages }) => {
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: MessageFormProps = {
      text: input,
      id: messages.length + 1,
      sender: {
        uid: 'Guest',
        name: 'Guest',
        avatar: 'https://www.w3schools.com/howto/img_avatar.png'
      }
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    const func = await callSelectFunction(input);
    const botText = func ? `Function selected: ${func}` : 'Failed to get response';
    const botMsg: MessageFormProps = {
      text: botText,
      id: userMsg.id + 1,
      sender: {
        uid: 'Takanori Kotama',
        name: 'Takanori Kotama',
        avatar: `${process.env.PUBLIC_URL}/kotama_icon.jpg`
      }
    };
    setMessages(prev => [...prev, botMsg]);
  };

  return (
    <div className="ai-input">
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
