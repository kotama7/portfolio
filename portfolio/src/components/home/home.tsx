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
import QualificationList from '../qualification/QualificationList';
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

  greeting: { en: 'Greeting', ja: '挨拶' },
  thankYou: { en: 'Thank You', ja: 'お礼' },
  goodbye: { en: 'Goodbye', ja: 'お別れ' },
  help: { en: 'Help', ja: 'ヘルプ' },
  aboutThisSite: { en: 'About This Site', ja: 'このサイトについて' },
  qualifications: { en: 'Qualifications', ja: '学歴・資格' },
  workExperience: { en: 'Work Experience', ja: '職歴・インターン' },
  awards: { en: 'Awards', ja: '受賞歴' },
  futureGoals: { en: 'Future Goals', ja: '将来の目標' },
  spokenLanguages: { en: 'Spoken Languages', ja: '話せる言語' },
  devEnvironment: { en: 'Dev Environment', ja: '開発環境' },
};

const FUNC_MESSAGES: Record<string, { en: string; ja: string }> = {
  bioGraph: {
    en: 'Here is an interactive timeline of my journey from university enrollment through research and internships.',
    ja: '大学入学から研究・インターンに至るまでの歩みをインタラクティブなタイムラインでご紹介します。',
  },
  skillTree: {
    en: 'I work primarily with Python for research and JS/TS for web development. Here is a breakdown of my technical skills.',
    ja: '研究では主にPython、Web開発ではJS/TSを使用しています。技術スキルの内訳をご覧ください。',
  },
  interestGraph: {
    en: 'My research interests center on autonomous research frameworks in HPC environments, with additional work in AI-driven scientific discovery.',
    ja: 'HPC環境での自律的研究フレームワークを中心に、AI駆動の科学的発見にも取り組んでいます。',
  },

  contactInfo: {
    en: 'Feel free to reach out! I am always open to discussing research collaborations and opportunities.',
    ja: 'お気軽にご連絡ください。研究に関する議論やコラボレーションのご相談を歓迎します。',
  },
  portfolioSummary: {
    en: 'This chat-based portfolio is built with React, TypeScript, and Firebase, and uses Gemini AI to understand your questions. Let me give you an overview.',
    ja: 'このチャット型ポートフォリオはReact・TypeScript・Firebaseで構築され、Gemini AIで質問を理解しています。概要をご紹介します。',
  },
  otherSiteLinks: {
    en: 'You can find my work and profiles on these platforms. Feel free to connect!',
    ja: '各プラットフォームで活動しています。ぜひつながってください。',
  },
  profileInfo: {
    en: 'I am Takanori Kotama, a CS student at Nagoya University researching autonomous research frameworks in HPC environments. Here is a detailed profile.',
    ja: '名古屋大学情報学部の樹神宇徳です。HPC環境における自律的研究フレームワークを研究しています。詳しいプロフィールをご覧ください。',
  },
  briefIntro: {
    en: 'Nice to meet you! Let me introduce myself briefly.',
    ja: 'はじめまして！簡単に自己紹介させてください。',
  },
  favoriteLanguage: {
    en: 'Great question! Python is my go-to language for both research and daily development.',
    ja: '良い質問ですね！研究にも日常の開発にもPythonを愛用しています。',
  },
  thesisSummary: {
    en: 'This is my Encouragement Award thesis that proposes "Youth Information Entropy" — a novel metric combining linguistics and information theory.',
    ja: '情報理論と言語学を融合した「青春情報エントロピー」を提案した奨励賞受賞論文です。',
  },
  fusepThesisSummary: {
    en: 'During the FuSEP program at USTC, I developed a machine-learning potential for predicting crystal energies of high-entropy alloys.',
    ja: 'USTC FuSEPプログラムで、高エントロピー合金の結晶エネルギーを予測する機械学習ポテンシャルを開発しました。',
  },
  graduationThesis: {
    en: 'My graduation thesis presents HPC-AutoResearch, an autonomous research framework combining BFTS tree search, Singularity containers, and LLM integration.',
    ja: '卒業論文ではBFTS木探索・Singularityコンテナ・LLM統合を組み合わせた自律的研究フレームワーク HPC-AutoResearch を提案しました。',
  },
  majorProjects: {
    en: 'Here are the projects I have been working on, ranging from HPC-driven automated research to web applications.',
    ja: 'HPC駆動の自動研究からWebアプリケーションまで、手がけてきたプロジェクトをご紹介します。',
  },
  contributions: {
    en: 'I actively contribute to open-source projects, particularly in the areas of AI-driven scientific discovery and HPC.',
    ja: 'AI駆動の科学的発見やHPC分野を中心に、オープンソースプロジェクトに貢献しています。',
  },
  researchWorks: {
    en: 'Here are my research publications. I presented a poster at HPC Asia 2026 on adapting AI Scientist v2 for HPC environments.',
    ja: 'HPC Asia 2026でAI Scientist v2のHPC環境適用に関するポスター発表を行いました。研究業績の一覧です。',
  },

  greeting: {
    en: 'Hello! Welcome to my portfolio. I am Takanori Kotama, a CS student at Nagoya University. Feel free to ask about my research, projects, skills, or anything else!',
    ja: 'こんにちは！名古屋大学情報学部の樹神宇徳です。研究やプロジェクト、スキルなど何でも聞いてください！',
  },
  thankYou: {
    en: "You're welcome! If you'd like to know more about a specific topic, feel free to ask anytime.",
    ja: 'どういたしまして！特定のトピックについてもっと知りたい場合は、いつでもお気軽にどうぞ。',
  },
  goodbye: {
    en: 'Thank you for visiting my portfolio! Feel free to come back anytime. Have a great day!',
    ja: 'ポートフォリオをご覧いただきありがとうございます！いつでもまたお越しください。良い一日を！',
  },
  help: {
    en: 'You can ask me about: biography, skills, interests, contact info, portfolio summary, other site links, profile info, self-introduction, favorite language, thesis summaries, projects, contributions, research works, qualifications, work experience, awards, future goals, spoken languages, or development environment.',
    ja: '以下のことについて聞けます：経歴、スキル、興味、連絡先、ポートフォリオ概要、外部リンク、プロフィール、自己紹介、好きな言語、論文要約、プロジェクト、コントリビューション、研究功績、学歴・資格、職歴・インターン、受賞歴、将来の目標、話せる言語、開発環境。',
  },
  aboutThisSite: {
    en: 'This portfolio is a chat-based website built with React, TypeScript, and Firebase. Gemini AI powers the natural language understanding to route your questions to the right information. The source code is available on GitHub!',
    ja: 'このポートフォリオはReact・TypeScript・Firebaseで構築されたチャット型サイトです。Gemini AIが自然言語を理解し、適切な情報にルーティングしています。ソースコードはGitHubで公開しています！',
  },
  qualifications: {
    en: 'Here is my educational background. I am graduating from Nagoya University in March 2026 and advancing to graduate school.',
    ja: '学歴の一覧です。2026年3月に名古屋大学を卒業し、同大学大学院に進学予定です。',
  },
  workExperience: {
    en: 'I have gained hands-on experience through internships at Panasonic, USTC, and RIKEN R-CCS, spanning AI, materials science, and HPC.',
    ja: 'パナソニック・USTC・理化学研究所R-CCSでのインターンを通じて、AI・材料科学・HPCの実務経験を積んできました。',
  },
  awards: {
    en: 'I received the Encouragement Award for a paper that quantifies "youth" using information theory and large language models.',
    ja: '情報理論と大規模言語モデルを用いて「青春」を定量化した論文で奨励賞を受賞しました。',
  },
  futureGoals: {
    en: 'I will be advancing to graduate school in April 2026 to deepen my research on autonomous research frameworks in HPC environments.',
    ja: '2026年4月に大学院に進学し、HPC環境における自律的研究フレームワークの研究をさらに深めていく予定です。',
  },
  spokenLanguages: {
    en: 'I speak three languages — Japanese, English, and Chinese — which has helped me collaborate in international research environments.',
    ja: '日本語・英語・中国語の3か国語を話し、国際的な研究環境での協働に活かしています。',
  },
  devEnvironment: {
    en: 'My development stack spans research computing (Python, MPI, CUDA) and web development (React, TypeScript, Firebase).',
    ja: '研究計算（Python, MPI, CUDA）とWeb開発（React, TypeScript, Firebase）にまたがる技術スタックを使用しています。',
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
    '- greeting: responds to greetings like hello, hi, hey.\n' +
    '- thankYou: responds to thank-you messages.\n' +
    '- goodbye: responds to farewell messages.\n' +
    '- help: lists available topics the user can ask about.\n' +
    '- aboutThisSite: explains how this portfolio site was built.\n' +
    '- qualifications: returns education and qualifications.\n' +
    '- workExperience: returns internship and work experience.\n' +
    '- awards: returns awards and achievements.\n' +
    '- futureGoals: returns future career goals and plans.\n' +
    '- spokenLanguages: returns spoken languages.\n' +
    '- devEnvironment: returns development tools and technologies used.\n' +
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
                        {props.lang === 'en' ? (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li>Email: <a href="mailto:kotamatakanori2@gmail.com">kotamatakanori2@gmail.com</a></li>
                                <li>GitHub: <a href="https://github.com/kotama7" target="_blank" rel="noopener noreferrer">kotama7</a></li>
                                <li>LinkedIn: <a href="https://www.linkedin.com/in/takanori-kotama-b785b52a4/" target="_blank" rel="noopener noreferrer">Takanori Kotama</a></li>
                                <li>ORCID: <a href="https://orcid.org/0009-0001-0749-5486" target="_blank" rel="noopener noreferrer">0009-0001-0749-5486</a></li>
                            </ul>
                        ) : (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li>Email: <a href="mailto:kotamatakanori2@gmail.com">kotamatakanori2@gmail.com</a></li>
                                <li>GitHub: <a href="https://github.com/kotama7" target="_blank" rel="noopener noreferrer">kotama7</a></li>
                                <li>LinkedIn: <a href="https://www.linkedin.com/in/takanori-kotama-b785b52a4/" target="_blank" rel="noopener noreferrer">Takanori Kotama</a></li>
                                <li>ORCID: <a href="https://orcid.org/0009-0001-0749-5486" target="_blank" rel="noopener noreferrer">0009-0001-0749-5486</a></li>
                            </ul>
                        )}
                    </div>
                );
            case 'portfolioSummary':
                return (
                    <div>
                        {props.lang === 'en' ? (
                            <>
                                <p>This portfolio is a chat-based interactive website where you can explore my profile through conversation. It is built with:</p>
                                <ul>
                                    <li><strong>Frontend:</strong> React + TypeScript with interactive visualizations (D3.js for graphs, react-chatbox-component for chat UI)</li>
                                    <li><strong>Backend:</strong> Firebase Cloud Functions with a unified API endpoint for LLM agents</li>
                                    <li><strong>AI:</strong> Gemini 1.5 Pro for natural language understanding and function routing</li>
                                </ul>
                                <p>The source code is available on <a href="https://github.com/kotama7/portfolio" target="_blank" rel="noopener noreferrer">GitHub</a>.</p>
                            </>
                        ) : (
                            <>
                                <p>このポートフォリオは、会話を通じてプロフィールを探索できるチャット型インタラクティブWebサイトです。以下の技術で構築されています：</p>
                                <ul>
                                    <li><strong>フロントエンド：</strong> React + TypeScript、インタラクティブな可視化（D3.jsによるグラフ、react-chatbox-componentによるチャットUI）</li>
                                    <li><strong>バックエンド：</strong> Firebase Cloud Functions、LLMエージェント向け統合APIエンドポイント</li>
                                    <li><strong>AI：</strong> Gemini 1.5 Proによる自然言語理解と関数ルーティング</li>
                                </ul>
                                <p>ソースコードは<a href="https://github.com/kotama7/portfolio" target="_blank" rel="noopener noreferrer">GitHub</a>で公開しています。</p>
                            </>
                        )}
                    </div>
                );
            case 'profileInfo':
                return (
                    <div>
                        {props.lang === 'en' ? (
                            <>
                                <p><strong>Takanori Kotama</strong> — Computer Science, Nagoya University (Information Systems)</p>
                                <ul>
                                    <li>Graduating March 2026, advancing to graduate school at Nagoya University</li>
                                    <li>Research: Autonomous research frameworks in HPC environments (HPC-AutoResearch)</li>
                                    <li>Award: Encouragement Award at the 2024 Nagoya University Student Paper Contest</li>
                                    <li>Experience: Internships at Panasonic (AI), USTC FuSEP (materials science), and RIKEN R-CCS (HPC). Research part-timer at RIKEN R-CCS since November 2025</li>
                                    <li>Vice-President of app development group "jack" (2022-2024)</li>
                                </ul>
                            </>
                        ) : (
                            <>
                                <p><strong>樹神 宇徳（こたま たかのり）</strong> — 名古屋大学情報学部コンピュータ科学科情報システム専攻</p>
                                <ul>
                                    <li>2026年3月卒業予定、同大学大学院へ進学予定</li>
                                    <li>研究テーマ：HPC環境における自律的研究フレームワーク（HPC-AutoResearch）</li>
                                    <li>受賞：2024年 名古屋大学学生論文コンテスト 奨励賞</li>
                                    <li>経験：パナソニック（AI）、USTC FuSEP（材料科学）、理化学研究所R-CCS（HPC）でインターン。2025年11月より理化学研究所R-CCSで研究パートタイマー</li>
                                    <li>アプリ開発団体「jack」副代表（2022-2024）</li>
                                </ul>
                            </>
                        )}
                    </div>
                );
            case 'briefIntro':
                return (
                    <div>
                        {props.lang === 'en'
                            ? 'I am Takanori Kotama, a Computer Science student at Nagoya University majoring in Information Systems. My research focuses on building autonomous research frameworks for HPC environments. I have interned at Panasonic, USTC, and RIKEN R-CCS, and I will be advancing to graduate school in April 2026.'
                            : '名古屋大学情報学部コンピュータ科学科情報システム専攻の樹神宇徳です。HPC環境における自律的研究フレームワークの構築を研究しています。パナソニック・USTC・理化学研究所R-CCSでのインターン経験があり、2026年4月に大学院へ進学予定です。'}
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
                            ? 'My favorite programming language is Python. Its clean syntax makes prototyping fast, and the ecosystem — PyTorch, NumPy, MPI4py, ASE — covers everything from deep learning to HPC and computational materials science. Most of my research code, including HPC-AutoResearch, is written in Python.'
                            : '好きなプログラミング言語はPythonです。簡潔な構文でプロトタイピングが速く、PyTorch・NumPy・MPI4py・ASEなどのエコシステムが深層学習からHPC・計算材料科学まで幅広くカバーしています。HPC-AutoResearchをはじめ、研究コードのほとんどをPythonで書いています。'}
                    </div>
                );
            case 'majorProjects':
                return <MajorProjects lang={props.lang} />;
            case 'contributions':
                return <Contributions lang={props.lang} />;
            case 'researchWorks':
                return <ResearchWorks lang={props.lang} />;
            case 'qualifications':
                return <QualificationList lang={props.lang} />;
            case 'workExperience':
                return (
                    <div>
                        {props.lang === 'en' ? (
                            <ul>
                                <li><strong>Panasonic — AI Intern</strong> (Summer 2024)<br />Applied machine learning models to manufacturing process optimization and data analysis.</li>
                                <li><strong>USTC FuSEP — Summer Researcher</strong> (Jul–Aug 2024)<br />Developed CrysEnergyModel, a GNN-based machine-learning potential for predicting crystal energies of Nb-Mo-Ta-W high-entropy alloys. Achieved test RMSE of 0.00139 eV.</li>
                                <li><strong>RIKEN R-CCS — HPC Intern</strong> (Sep 2025)<br />Worked with the AI for Science team. Extended AI Scientist v2 for HPC environments with Singularity container support and local LLM integration.</li>
                                <li><strong>RIKEN R-CCS — Research Part-timer</strong> (Nov 2025–present)<br />Continuing research on autonomous scientific discovery frameworks in large-scale HPC environments.</li>
                            </ul>
                        ) : (
                            <ul>
                                <li><strong>パナソニック — AIインターン</strong>（2024年夏）<br />機械学習モデルを製造プロセスの最適化・データ分析に適用。</li>
                                <li><strong>USTC FuSEP — 夏季研究員</strong>（2024年7–8月）<br />Nb-Mo-Ta-W系高エントロピー合金の結晶エネルギーを予測するGNNベースの機械学習ポテンシャル CrysEnergyModel を開発。テストRMSE 0.00139 eV を達成。</li>
                                <li><strong>理化学研究所R-CCS — HPCインターン</strong>（2025年9月）<br />AI for Scienceチームに所属。AI Scientist v2をHPC環境向けに拡張し、Singularityコンテナ対応とローカルLLM統合を実装。</li>
                                <li><strong>理化学研究所R-CCS — 研究パートタイマー</strong>（2025年11月–現在）<br />大規模HPC環境における自律的科学発見フレームワークの研究を継続。</li>
                            </ul>
                        )}
                    </div>
                );
            case 'awards':
                return (
                    <div>
                        {props.lang === 'en' ? (
                            <>
                                <p><strong>Encouragement Award</strong> — 2024 Nagoya University Student Paper Contest</p>
                                <p>Paper: "A quantitative definition of youth using large language models"</p>
                                <p>Proposed "Youth Information Entropy," a novel metric that integrates surprise, positivity, and grammatical fluency using information theory. Validated with Japanese BERT and Llama-3-ELYZA-JP-8B, demonstrating a significant positive correlation (r=0.333, p=0.035).</p>
                            </>
                        ) : (
                            <>
                                <p><strong>奨励賞</strong> — 2024年 名古屋大学学生論文コンテスト</p>
                                <p>論文：「大規模言語モデルを用いた青春の定量的定義」</p>
                                <p>情報理論を用いて意外性・ポジティブさ・文法流暢性を統合した新指標「青春情報エントロピー」を提案。日本語BERTとLlama-3-ELYZA-JP-8Bで検証し、有意な正相関（r=0.333, p=0.035）を確認しました。</p>
                            </>
                        )}
                    </div>
                );
            case 'futureGoals':
                return (
                    <div>
                        {props.lang === 'en' ? (
                            <>
                                <p>I will be advancing to graduate school at Nagoya University starting April 2026. My goals include:</p>
                                <ul>
                                    <li>Deepening research on HPC-AutoResearch — making autonomous scientific discovery more scalable and reliable in large-scale HPC environments</li>
                                    <li>Publishing research at top-tier venues in HPC and AI for Science</li>
                                    <li>Contributing to open-source tools that democratize AI-driven research automation</li>
                                </ul>
                            </>
                        ) : (
                            <>
                                <p>2026年4月から名古屋大学大学院に進学予定です。以下の目標を掲げています：</p>
                                <ul>
                                    <li>HPC-AutoResearchの研究深化 — 大規模HPC環境での自律的科学発見をよりスケーラブルかつ信頼性の高いものに</li>
                                    <li>HPCおよびAI for Science分野のトップカンファレンスでの研究発表</li>
                                    <li>AI駆動の研究自動化を広く活用可能にするオープンソースツールへの貢献</li>
                                </ul>
                            </>
                        )}
                    </div>
                );
            case 'spokenLanguages':
                return (
                    <div>
                        {props.lang === 'en' ? (
                            <ul>
                                <li><strong>Japanese</strong> — Native</li>
                                <li><strong>English</strong> — Advanced (research papers, international collaboration at USTC and RIKEN)</li>
                                <li><strong>Chinese</strong> — Intermediate (studied during FuSEP program at USTC, Hefei)</li>
                            </ul>
                        ) : (
                            <ul>
                                <li><strong>日本語</strong> — 母語</li>
                                <li><strong>英語</strong> — 上級（論文執筆、USTC・理化学研究所での国際的な共同研究）</li>
                                <li><strong>中国語</strong> — 中級（USTC FuSEPプログラム（合肥）を通じて習得）</li>
                            </ul>
                        )}
                    </div>
                );
            case 'devEnvironment':
                return (
                    <div>
                        {props.lang === 'en' ? (
                            <ul>
                                <li><strong>Research & ML:</strong> Python, PyTorch, TensorFlow 1.x, NumPy, ASE, OpenSpiel, LightGBM</li>
                                <li><strong>HPC:</strong> MPI (MPI4py), CUDA, Singularity/Apptainer containers, SLURM job scheduling</li>
                                <li><strong>Web Development:</strong> React, TypeScript, Firebase (Hosting, Cloud Functions, AI)</li>
                                <li><strong>DevOps & Tools:</strong> Docker, CMake, Git, GitHub Actions</li>
                            </ul>
                        ) : (
                            <ul>
                                <li><strong>研究・ML：</strong> Python, PyTorch, TensorFlow 1.x, NumPy, ASE, OpenSpiel, LightGBM</li>
                                <li><strong>HPC：</strong> MPI (MPI4py), CUDA, Singularity/Apptainerコンテナ, SLURMジョブスケジューリング</li>
                                <li><strong>Web開発：</strong> React, TypeScript, Firebase (Hosting, Cloud Functions, AI)</li>
                                <li><strong>DevOps・ツール：</strong> Docker, CMake, Git, GitHub Actions</li>
                            </ul>
                        )}
                    </div>
                );
            // Conversation functions (text-only, no element component)
            case 'greeting':
            case 'thankYou':
            case 'goodbye':
            case 'help':
            case 'aboutThisSite':
                return null;
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

