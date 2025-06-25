import { useState, useEffect } from 'react';
import { ChatBox } from 'react-chatbox-component';

import 'react-chatbox-component/dist/style.css';
import './home.css';

import MessageFormProps from './module/message_form';
import FirstReply from './module/first_reply';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai';
import FunctionSidebar from './FunctionSidebar';
import BioTree from '../bio/BioTree';
import SkillTree from '../skills/SkillTree';
import InterestGraph from '../interests/InterestGraph';
import PersonalityRadar from '../personality/PersonalityRadar';
import OtherSiteLinks from '../links/OtherSiteLinks';

let generativeModel: ReturnType<typeof getGenerativeModel> | null = null;
async function callSelectFunction(text: string): Promise<string | undefined> {
  try {
    if (!generativeModel) {
      const app = getApps().length
        ? getApp()
        : initializeApp({
            apiKey: process.env.REACT_APP_FIREBASE_WEB_API_KEY,
            projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
            appId: process.env.REACT_APP_FIREBASE_APP_ID,
          });
      const ai = getAI(app, { backend: new GoogleAIBackend() });
      generativeModel = getGenerativeModel(ai, { model: 'gemini-1.5-pro' });
    }

    const prompt =
      "You are a helpful assistant that maps user requests to function names.\n" +
      "Possible functions include:\n" +
      "- bioGraph: returns the biography graph.\n" +
      "- skillTree: returns the skill hierarchy.\n" +
      "- interestGraph: returns an interest graph.\n" +
      "- personalityRadar: shows a personality radar chart.\n" +
      "- contactInfo: returns contact information.\n" +
      "- portfolioSummary: gives a summary of the portfolio.\n" +
      "Respond with only the function name that best matches the user's request.";

    const result = await generativeModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: `${prompt}\n${text}` }] }],
      generationConfig: { maxOutputTokens: 10, temperature: 0 },
    });
    return result.response.text().trim();
  } catch (err) {
    console.error('Failed to select function', err);
    const normalized = text.toLowerCase();
    const fallbackMap = [
      { keyword: 'bio', func: 'bioGraph' },
      { keyword: 'skill', func: 'skillTree' },
      { keyword: 'interest', func: 'interestGraph' },
      { keyword: 'personality', func: 'personalityRadar' },
      { keyword: 'contact', func: 'contactInfo' },
      { keyword: 'portfolio', func: 'portfolioSummary' },
      { keyword: 'link', func: 'otherSiteLinks' },
      { keyword: 'external', func: 'otherSiteLinks' },
    ];
    const matched = fallbackMap.find(({ keyword }) =>
      normalized.includes(keyword)
    );
    return matched?.func;
  }
}


export default function Home(props: { lang: string }) {

    const [messages, setMessages] = useState<MessageFormProps[]>([])
    const [selectedFunc, setSelectedFunc] = useState<string | null>(null)

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
            <FunctionSidebar onSelect={setSelectedFunc} selected={selectedFunc} />
            <div className='chat-container'>
                <div className='chatbox'>
                    <ChatBox
                        messages={messages}
                        user={user}
                        onSubmit={handleSendMessage}
                    />
                </div>
                {renderFunction()}
            </div>
        </div>
    );
}

