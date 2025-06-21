import { LangOnlyProps } from '../LanguageSwitch';
import { useState, useEffect } from 'react';
import LanguageSwitch, { LangProps } from '../LanguageSwitch';
import { ChatBox } from 'react-chatbox-component';

import 'react-chatbox-component/dist/style.css';
import './home.css';

import MessageFormProps from './module/message_form';
import FirstReply from './module/first_reply';

async function callSelectFunction(text: string): Promise<string | undefined> {
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


export default function Home(props: LangOnlyProps) {

    const [messages, setMessages] = useState<MessageFormProps[]>([])

    const user = {
        "uid" : "Guest"
    }

    const handleSendMessage = async (input: string) => {
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
    }

    useEffect(() => {
        if (messages.length === 0) {
            const timer = setTimeout(() =>
                FirstReply({
                    seter: setMessages,
                    lang: props.lang
                }),
                1750
            );
            return () => clearTimeout(timer);
        }
    }, [messages.length, props.lang]);

    return (
        <div>
            <div className='chatbox'>
                <ChatBox
                    messages={messages}
                    user={user}
                    onSubmit={handleSendMessage}
                />
            </div>
        </div>
    );
}

