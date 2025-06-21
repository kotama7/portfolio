import { useState, useEffect } from 'react';
import { ChatBox } from 'react-chatbox-component';

import MessageFormProps from './module/message_form';
import FirstReply from './module/first_reply';

import 'react-chatbox-component/dist/style.css';
import './home.css';

async function callSelectFunction(text: string): Promise<string | undefined> {
    const url = process.env.REACT_APP_SELECT_FUNCTION_URL;
    if (!url) {
        console.error('REACT_APP_SELECT_FUNCTION_URL not set');
        return undefined;
    }
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


export default function Home(props: {lang: string}) {

    const [messages, setMessages] = useState<MessageFormProps[]>([])
    const [loading, setLoading] = useState(false)

    const user = {
        "uid" : "Guest"
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            // Only auto reply if the user hasn't started chatting yet
            if (messages.length === 0) {
                FirstReply({
                    seter: setMessages,
                    lang: props.lang
                });
            }
        }, 1750);
        return () => clearTimeout(timer);
    }, [props.lang, messages.length]);

    const sendMessage = async (text: string): Promise<void> => {
        if (!text.trim()) return;
        setLoading(true)
        const userMsg: MessageFormProps = {
            text,
            id: messages.length + 1,
            sender: {
                uid: 'Guest',
                name: 'Guest',
                avatar: 'https://www.w3schools.com/howto/img_avatar.png'
            }
        };
        setMessages(prev => [...prev, userMsg]);

        const func = await callSelectFunction(text);
        const botMsg: MessageFormProps = {
            text: func ? `Function selected: ${func}` : 'Failed to get response',
            id: userMsg.id + 1,
            sender: {
                uid: 'Takanori Kotama',
                name: 'Takanori Kotama',
                avatar: `${process.env.PUBLIC_URL}/kotama_icon.jpg`
            }
        };
        setMessages(prev => [...prev, botMsg]);
        setLoading(false)
    };

    return (
        <div>
            <div className='chatbox'>
                <ChatBox
                    messages={messages}
                    user={user}
                    onSubmit={sendMessage}
                    isLoading={loading}
                />
            </div>
        </div>
    );
}

