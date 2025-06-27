import { useState, useEffect } from 'react';
import CustomChatBox from './CustomChatBox';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAI, getGenerativeModel, GoogleAIBackend } from '@firebase/ai';

import 'react-chatbox-component/dist/style.css';
import './home.css';

import MessageFormProps from './module/message_form';
import FirstReply from './module/first_reply';
import FunctionSidebar from './FunctionSidebar';
import BioTree from '../bio/BioTree';
import SkillTree from '../skills/SkillTree';
import InterestGraph from '../interests/InterestGraph';
import PersonalityRadar from '../personality/PersonalityRadar';
import OtherSiteLinks from '../links/OtherSiteLinks';
import { fallbackSelectFunction } from '../../utils/selectFunction';

const FUNC_NAMES: Record<string, { en: string; ja: string }> = {
  bioGraph: { en: 'Biography', ja: '経歴' },
  skillTree: { en: 'Skills', ja: 'スキル' },
  interestGraph: { en: 'Interests', ja: '興味' },
  personalityRadar: { en: 'Personality', ja: '性格' },
  contactInfo: { en: 'Contact Info', ja: '連絡先' },
  portfolioSummary: { en: 'Portfolio Summary', ja: 'ポートフォリオ概要' },
  otherSiteLinks: { en: 'Other Site Links', ja: 'その他のリンク' },
};

let model: ReturnType<typeof getGenerativeModel> | null = null;

function getModel() {
  if (!model) {
    const app = getApps().length
      ? getApp()
      : initializeApp({
          apiKey: process.env.REACT_APP_FIREBASE_WEB_API_KEY!,
          projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID!,
          appId: process.env.REACT_APP_FIREBASE_APP_ID!,
        });
    const ai = getAI(app, { backend: new GoogleAIBackend() });
    model = getGenerativeModel(ai, { model: 'gemini-1.5-pro' });
  }
  return model;
}

async function callSelectFunction(text: string): Promise<string | undefined> {
  const prompt = `You are a helpful assistant that maps user requests to function names.\nPossible functions include:\n- bioGraph: returns the biography graph.\n- skillTree: returns the skill hierarchy.\n- interestGraph: returns an interest graph.\n- personalityRadar: shows a personality radar chart.\n- contactInfo: returns contact information.\n- portfolioSummary: gives a summary of the portfolio.\nRespond with only the function name that best matches the user's request.`;
  try {
    const result = await getModel().generateContent({
      contents: [{ role: 'user', parts: [{ text: `${prompt}\n${text}` }] }],
      generationConfig: { maxOutputTokens: 10, temperature: 0 },
    });
    return result.response.text().trim();
  } catch (err) {
    console.error('Failed to call selectFunction', err);
    return fallbackSelectFunction(text);
  }
}


export default function Home(props: { lang: 'en' | 'ja' }) {

    const [messages, setMessages] = useState<MessageFormProps[]>([])
    const [selectedFunc, setSelectedFunc] = useState<string | null>(null)
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)
    const [autoFirstReply, setAutoFirstReply] = useState<boolean>(true)
    const [isReplying, setIsReplying] = useState<boolean>(false)

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

        setIsReplying(true);

        const func = await callSelectFunction(input);
        const botText = func
            ? (props.lang === 'en'
                ? `Function selected: ${FUNC_NAMES[func]?.en ?? func}`
                : `選択された機能: ${FUNC_NAMES[func]?.ja ?? func}`)
            : props.lang === 'en'
                ? 'Failed to get response'
                : '返答を取得できませんでした';
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
        if (func) {
            setSelectedFunc(func);
        }
        setIsReplying(false);
    }

    const handleSidebarSelect = (name: string) => {
        if (name === 'newChat') {
            setMessages([]);
            setSelectedFunc(null);
            setAutoFirstReply(false);
            setIsReplying(false);
        } else {
            setSelectedFunc(name);
        }
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
                return (
                    <div>
                        {props.lang === 'en'
                            ? 'Contact: example@example.com'
                            : '連絡先: example@example.com'}
                    </div>
                );
            case 'portfolioSummary':
                return (
                    <div>
                        {props.lang === 'en'
                            ? 'This portfolio showcases my work with React and TypeScript.'
                            : 'このポートフォリオでは React と TypeScript を用いた成果を紹介しています。'}
                    </div>
                );
            default:
                return null;
        }
    };

    useEffect(() => {
        if (autoFirstReply && messages.length === 0) {
            const timer = setTimeout(() => {
                    FirstReply({
                        seter: setMessages,
                        lang: props.lang,
                        onStart: () => setIsReplying(true),
                        onEnd: () => setIsReplying(false),
                    });
                    setAutoFirstReply(false);
                },
                1750
            );
            return () => clearTimeout(timer);
        }
    }, [messages.length, props.lang, autoFirstReply]);

    // Reset conversation when language changes
    useEffect(() => {
        setMessages([]);
        setSelectedFunc(null);
        setAutoFirstReply(true);
        setIsReplying(false);
    }, [props.lang]);

    return (
        <div className='home-container'>
            {sidebarOpen ? (
                <FunctionSidebar
                    onSelect={handleSidebarSelect}
                    selected={selectedFunc}
                    onClose={() => setSidebarOpen(false)}
                    lang={props.lang}
                />
            ) : (
                <button className='sidebar-open' onClick={() => setSidebarOpen(true)}>Open</button>
            )}
            <div className='chat-container'>
                <div className='chatbox-wrapper'>
                    <div className='chatbox'>
                        <CustomChatBox
                            messages={messages}
                            user={user}
                            onSubmit={handleSendMessage}
                        />
                    </div>
                    {isReplying && <div className='chatbox-overlay'></div>}
                </div>
                {renderFunction()}
            </div>
        </div>
    );
}

