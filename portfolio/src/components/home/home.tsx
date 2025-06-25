import { useState, useEffect, ReactNode } from 'react';
import { ChatBox } from 'react-chatbox-component';

import 'react-chatbox-component/dist/style.css';
import './home.css';

import MessageFormProps from './module/message_form';
import { respondToIrregularInput } from '../../utils/irregular';
import FirstReply from './module/first_reply';
import FunctionSidebar from './FunctionSidebar';
import BioTree from '../bio/BioTree';
import SkillTree from '../skills/SkillTree';
import InterestGraph from '../interests/InterestGraph';
import PersonalityRadar from '../personality/PersonalityRadar';
import OtherSiteLinks from '../links/OtherSiteLinks';

async function callSelectFunction(text: string): Promise<string | undefined> {
  const url = process.env.REACT_APP_SELECT_FUNCTION_URL || '/selectFunction';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error('Response is not JSON');
    }

    const data = await res.json();
    return data.function as string;
  } catch (err) {
    console.error('Failed to call selectFunction', err);
    return undefined;
  }
}


export default function Home(props: { lang: string }) {

    const [messages, setMessages] = useState<MessageFormProps[]>([])
    const [selectedFunc, setSelectedFunc] = useState<string | null>(null)
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)

    const user = {
        "uid" : "Guest"
    }

    const renderChatMessage = (message: MessageFormProps) => {
        const isUser = user.uid === message.sender.uid;
        const renderName = isUser ? null : (
            <div className='sender-name'>{message.sender.name}</div>
        );
        return (
            <div
                key={message.id}
                className='chat-bubble-row'
                style={{ flexDirection: isUser ? 'row-reverse' : 'row' }}>
                <img
                    src={message.sender.avatar}
                    alt='sender avatar'
                    className='avatar'
                    style={isUser ? { marginLeft: '15px' } : { marginRight: '15px' }}
                />
                <div className={`chat-bubble ${isUser ? 'is-user' : 'is-other'}`}
                >
                    {renderName}
                    <div className='message' style={{ color: isUser ? '#FFF' : '#2D313F' }}>
                        {message.component ? message.component : message.text}
                    </div>
                </div>
            </div>
        );
    };

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

        const irregular = respondToIrregularInput(input);
        if (irregular) {
            const errMsg: MessageFormProps = {
                text: irregular,
                id: userMsg.id + 1,
                sender: {
                    uid: 'Takanori Kotama',
                    name: 'Takanori Kotama',
                    avatar: `${process.env.PUBLIC_URL}/kotama_icon.jpg`
                }
            };
            setMessages(prev => [...prev, errMsg]);
            return;
        }

        const func = await callSelectFunction(input);
        setSelectedFunc(func || null);
        let component: ReactNode | undefined;
        switch (func) {
            case 'bioGraph':
                component = <BioTree />;
                break;
            case 'skillTree':
                component = <SkillTree />;
                break;
            case 'interestGraph':
                component = <InterestGraph />;
                break;
            case 'personalityRadar':
                component = <PersonalityRadar />;
                break;
            case 'otherSiteLinks':
                component = <OtherSiteLinks />;
                break;
            case 'contactInfo':
                component = <div>Contact: example@example.com</div>;
                break;
            case 'portfolioSummary':
                component = <div>This portfolio showcases my work with React and TypeScript.</div>;
                break;
            default:
                break;
        }

        const botMsg: MessageFormProps = component ? {
            text: '',
            id: userMsg.id + 1,
            sender: {
                uid: 'Takanori Kotama',
                name: 'Takanori Kotama',
                avatar: `${process.env.PUBLIC_URL}/kotama_icon.jpg`
            },
            component
        } : {
            text: func ? `Function selected: ${func}` : 'Failed to get response',
            id: userMsg.id + 1,
            sender: {
                uid: 'Takanori Kotama',
                name: 'Takanori Kotama',
                avatar: `${process.env.PUBLIC_URL}/kotama_icon.jpg`
            }
        };
        setMessages(prev => [...prev, botMsg]);
    }

    const renderFunction = () => {
        switch (selectedFunc) {
            case 'bioGraph':
                return <BioTree />;
            case 'skillTree':
                return <SkillTree />;
            case 'interestGraph':
                return <InterestGraph />;
            case 'personalityRadar':
                return <PersonalityRadar />;
            case 'otherSiteLinks':
                return <OtherSiteLinks />;
            case 'contactInfo':
                return <div>Contact: example@example.com</div>;
            case 'portfolioSummary':
                return <div>This portfolio showcases my work with React and TypeScript.</div>;
            default:
                return null;
        }
    };

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
        <div className='home-container'>
            {sidebarOpen ? (
                <FunctionSidebar
                    onSelect={setSelectedFunc}
                    selected={selectedFunc}
                    onClose={() => setSidebarOpen(false)}
                />
            ) : (
                <button className='sidebar-open' onClick={() => setSidebarOpen(true)}>Open</button>
            )}
            <div className='chat-container'>
                <div className='chatbox'>
                    <ChatBox
                        messages={messages}
                        user={user}
                        onSubmit={handleSendMessage}
                        renderMessage={renderChatMessage}
                    />
                </div>
                {renderFunction()}
            </div>
        </div>
    );
}

