import React, { useState, useEffect } from 'react';
import { ChatBox } from 'react-chatbox-component';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAI, getGenerativeModel, GoogleAIBackend } from '@firebase/ai';

import 'react-chatbox-component/dist/style.css';
import './home.css';

import MessageFormProps from './module/message_form';
import FirstReply from './module/first_reply';
import Reply from './module/return_respond';
import FunctionSidebar, { labels } from './FunctionSidebar';
import BioTree from '../bio/BioTree';
import SkillTree from '../skills/SkillTree';
import InterestGraph from '../interests/InterestGraph';

import OtherSiteLinks from '../links/OtherSiteLinks';
import ThesisSummary from '../thesis/ThesisSummary';
import FusepThesisSummary from '../thesis/FusepThesisSummary';
import GraduationThesisSummary from '../thesis/GraduationThesisSummary';
import MajorProjects from '../projects/MajorProjects';
import Contributions from '../contributions/Contributions';
import ResearchWorks from '../research/ResearchWorks';
import { fallbackSelectFunction } from '../../utils/selectFunction';

const FUNC_NAMES: Record<string, { en: string; ja: string }> = {
  bioGraph: { en: 'Biography', ja: '経歴' },
  skillTree: { en: 'Skills', ja: 'スキル' },
  interestGraph: { en: 'Interests', ja: '興味' },

  contactInfo: { en: 'Contact Info', ja: '連絡先' },
  portfolioSummary: { en: 'Portfolio Summary', ja: 'ポートフォリオ概要' },
  otherSiteLinks: { en: 'Other Site Links', ja: 'その他のリンク' },
  profileInfo: { en: 'Profile Info', ja: 'プロフィール情報' },
  briefIntro: { en: 'Brief Intro', ja: '自己紹介' },
  thesisSummary: { en: 'Thesis Summary', ja: '論文要約' },
  fusepThesisSummary: { en: 'FuSEP Thesis Summary', ja: '夏研論文要約' },
  graduationThesis: { en: 'Graduation Thesis', ja: '卒業論文' },
  favoriteLanguage: { en: 'Favorite Language', ja: '好きな言語' },
  majorProjects: { en: 'Major Projects', ja: '主要プロジェクト' },
  contributions: { en: 'Contributions', ja: 'コントリビューション' },
  researchWorks: { en: 'Research Works', ja: '研究功績' },
};

const FUNC_MESSAGES: Record<string, { en: string; ja: string }> = {
  bioGraph: {
    en: 'The following graph shows my biography.',
    ja: '以下のグラフが私の経歴です。',
  },
  skillTree: {
    en: 'Here is a breakdown of my skills.',
    ja: '以下は私のスキルの構成です。',
  },
  interestGraph: {
    en: 'These are my interests.',
    ja: 'こちらが私の興味の一覧です。',
  },

  contactInfo: {
    en: 'Here is my contact information.',
    ja: 'こちらが連絡先です。',
  },
  portfolioSummary: {
    en: 'Here is a summary of my portfolio.',
    ja: 'ポートフォリオの概要です。',
  },
  otherSiteLinks: {
    en: 'You can find me at these other sites.',
    ja: 'その他のリンクはこちらです。',
  },
  profileInfo: {
    en: 'Here is my life summary, awards and lab info.',
    ja: '概要や受賞、所属研究室の情報です。',
  },
  briefIntro: {
    en: 'Here is a short self introduction.',
    ja: '簡単な自己紹介です。',
  },
  favoriteLanguage: {
    en: 'My favorite programming language is Python because of its readability and rich ecosystem.',
    ja: '好きなプログラミング言語は Python です。読みやすく豊富なライブラリがあります。',
  },
  thesisSummary: {
    en: 'This is the Encouragement Award thesis summary.',
    ja: '奨励賞論文の要約です。',
  },
  fusepThesisSummary: {
    en: 'This is the FuSEP thesis summary.',
    ja: '夏研論文の要約です。',
  },
  graduationThesis: {
    en: 'This is my graduation thesis summary.',
    ja: '卒業論文の要約です。',
  },
  majorProjects: {
    en: 'Here are my major projects.',
    ja: '主要プロジェクトの一覧です。',
  },
  contributions: {
    en: 'Here are my open-source contributions.',
    ja: 'OSSコントリビューションの一覧です。',
  },
  researchWorks: {
    en: 'Here are my research works.',
    ja: '研究功績の一覧です。',
  },
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

const VALID_FUNCTIONS = Object.keys(FUNC_MESSAGES);

function extractFunctionName(raw: string): string | undefined {
  const cleaned = raw.replace(/[`"'.\s]/g, '');
  if (VALID_FUNCTIONS.indexOf(cleaned) !== -1) return cleaned;
  const lower = cleaned.toLowerCase();
  const found = VALID_FUNCTIONS.find(name => name.toLowerCase() === lower);
  return found;
}

async function callSelectFunction(
  text: string,
  lang: 'en' | 'ja'
): Promise<string | undefined> {
  const basePrompt =
    'Possible functions include:\n' +
    '- bioGraph: returns the biography graph.\n' +
    '- skillTree: returns the skill hierarchy.\n' +
    '- interestGraph: returns an interest graph.\n' +

    '- contactInfo: returns contact information.\n' +
    '- portfolioSummary: gives a summary of the portfolio.\n' +
    '- otherSiteLinks: returns links to other sites.\n' +
    '- profileInfo: returns life summary, award, qualifications and lab info.\n' +
    '- briefIntro: returns a short self introduction.\n' +
    '- favoriteLanguage: tells my favorite programming language.\n' +
    '- thesisSummary: returns the Encouragement Award thesis summary.\n' +
    '- fusepThesisSummary: returns the FuSEP thesis summary.\n' +
    '- graduationThesis: returns the graduation thesis summary about HPC-AutoResearch.\n' +
    '- majorProjects: returns a list of major projects.\n' +
    '- contributions: returns open-source contributions.\n' +
    '- researchWorks: returns research works and publications.\n' +
    'Respond with ONLY the function name. Do not add any explanation, quotes, or formatting.';
  const prompt =
    lang === 'ja'
      ? `あなたはユーザーのリクエストを関数名に対応付けるアシスタントです。\n${basePrompt}`
      : `You are a helpful assistant that maps user requests to function names.\n${basePrompt}`;
  try {
    const result = await getModel().generateContent({
      contents: [{ role: 'user', parts: [{ text: `${prompt}\n${text}` }] }],
      generationConfig: { maxOutputTokens: 10, temperature: 0 },
    });
    const raw = result.response.text().trim();
    const matched = extractFunctionName(raw);
    if (matched) return matched;
    return fallbackSelectFunction(text);
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

    const renderMessageBubble = (message: MessageFormProps) => {
        const isUser = user.uid === message.sender.uid;
        const name = isUser ? null : (
            <div className='sender-name'>{message.sender.name}</div>
        );
        return (
            <div
                key={message.id}
                className='chat-bubble-row'
                style={{ flexDirection: isUser ? 'row-reverse' : 'row' }}
            >
                <img
                    src={message.sender.avatar}
                    alt='sender avatar'
                    className='avatar'
                    style={isUser ? { marginLeft: '15px' } : { marginRight: '15px' }}
                />
                <div className={`chat-bubble ${isUser ? 'is-user' : 'is-other'}`}> 
                    {name}
                    <div className='message' style={{ color: isUser ? '#FFF' : '#2D313F' }}>
                        {message.element ?? message.text}
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
        const current = [...messages, userMsg];
        setMessages(current);

        setIsReplying(true);

        const func = await callSelectFunction(input, props.lang);
        const botText = func
            ? FUNC_MESSAGES[func]?.[props.lang] ??
              (props.lang === 'en'
                ? `Function selected: ${FUNC_NAMES[func]?.en ?? func}`
                : `選択された機能: ${FUNC_NAMES[func]?.ja ?? func}`)
            : props.lang === 'en'
                ? "Sorry, I couldn't determine an appropriate response to your message. Please try rephrasing your request or feel free to ask about my portfolio, professional experience, or anything else you're curious about, and I'll do my best to assist you."
                : '申し訳ありませんが、ご入力の内容から適切な応答を判断できませんでした。お手数ですが別の言い方で再度質問していただくか、私のポートフォリオや経歴など知りたいことがあれば何でもお聞かせください。できる限り対応いたします。';

        Reply({
            seter: setMessages,
            messages: current,
            next_message: botText,
            onEnd: () => {
                if (func) {
                    const elementMsg: MessageFormProps = {
                        text: '',
                        id: current.length + 2,
                        sender: {
                            uid: 'Takanori Kotama',
                            name: 'Takanori Kotama',
                            avatar: `${process.env.PUBLIC_URL}/kotama_icon.jpg`
                        },
                        element: getFunctionComponent(func)
                    };
                    setMessages(prev => [...prev, elementMsg]);
                    setSelectedFunc(func);
                }
                setIsReplying(false);
            },
        });
    }

    const handleSidebarSelect = (name: string) => {
        if (name === 'newChat') {
            setMessages([]);
            setSelectedFunc(null);
            setAutoFirstReply(false);
            setIsReplying(false);
        } else {
            const baseId = messages.length + 1;
            const userMsg: MessageFormProps = {
                text: labels[name][props.lang],
                id: baseId,
                sender: {
                    uid: 'Guest',
                    name: 'Guest',
                    avatar: 'https://www.w3schools.com/howto/img_avatar.png',
                },
            };
            const current = [...messages, userMsg];
            setMessages(current);
            setIsReplying(true);
            Reply({
                seter: setMessages,
                messages: current,
                next_message: FUNC_MESSAGES[name][props.lang],
                onEnd: () => {
                    const elementMsg: MessageFormProps = {
                        text: '',
                        id: baseId + 2,
                        sender: {
                            uid: 'Takanori Kotama',
                            name: 'Takanori Kotama',
                            avatar: `${process.env.PUBLIC_URL}/kotama_icon.jpg`,
                        },
                        element: getFunctionComponent(name),
                    };
                    setMessages(prev => [...prev, elementMsg]);
                    setSelectedFunc(name);
                    setIsReplying(false);
                },
            });
            setAutoFirstReply(false);
        }
    }

    const getFunctionComponent = (name: string | null) => {
        switch (name) {
            case 'bioGraph':
                return <BioTree lang={props.lang} />;
            case 'skillTree':
                return <SkillTree lang={props.lang} />;
            case 'interestGraph':
                return <InterestGraph lang={props.lang} />;
            case 'otherSiteLinks':
                return <OtherSiteLinks />;
            case 'contactInfo':
                return (
                    <div>
                        {props.lang === 'en'
                            ? 'Contact: kotamatakanori2@gmail.com'
                            : '連絡先: kotamatakanori2@gmail.com'}
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
            case 'profileInfo':
                return (
                    <div>
                        {props.lang === 'en'
                            ? 'Takanori Kotama is a CS student in Nagoya University\'s Information Systems program, graduating in March 2026 and advancing to graduate school. He received the 2024 Student Paper Contest Encouragement Award.'
                            : '名古屋大学情報学部情報システム専攻の学部生です。2024年の学生論文コンテストで奨励賞を受賞し、2026年3月に学士取得予定。同大学大学院へ進学予定です。'}
                    </div>
                );
            case 'briefIntro':
                return (
                    <div>
                        {props.lang === 'en'
                            ? 'I am Takanori Kotama, a CS student at Nagoya University.'
                            : '名古屋大学情報学部の樹神宇徳です。'}
                    </div>
                );
            case 'thesisSummary':
                return <ThesisSummary lang={props.lang} />;
            case 'fusepThesisSummary':
                return <FusepThesisSummary lang={props.lang} />;
            case 'graduationThesis':
                return <GraduationThesisSummary lang={props.lang} />;
            case 'favoriteLanguage':
                return (
                    <div>
                        {props.lang === 'en'
                            ? 'My favorite programming language is Python because of its readability and rich ecosystem.'
                            : '好きなプログラミング言語は Python です。読みやすく豊富なライブラリがあります。'}
                    </div>
                );
            case 'majorProjects':
                return <MajorProjects lang={props.lang} />;
            case 'contributions':
                return <Contributions lang={props.lang} />;
            case 'researchWorks':
                return <ResearchWorks lang={props.lang} />;
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
                1000
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
        <div className={`home-container${sidebarOpen ? ' sidebar-opened' : ''}`}>
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
                        <ChatBox
                            messages={messages}
                            user={user}
                            onSubmit={handleSendMessage}
                            renderMessage={renderMessageBubble}
                        />
                    </div>
                    {isReplying && <div className='chatbox-overlay'></div>}
                </div>
            </div>
        </div>
    );
}

