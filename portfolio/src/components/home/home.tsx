import { useState, useEffect } from 'react';
import LanguageSwitch, { LangProps } from '../LanguageSwitch';
export default function Home({ lang, setLang }: LangProps) {
    const [messages, setMessages] = useState<MessageFormProps[]>([]);
        uid: 'Guest'
    };

    useEffect(() => {
        if (messages.length === 0) {
            const timer = setTimeout(() =>
                FirstReply({
                    seter: setMessages,
                    lang
                }),
                1750
            );
            return () => clearTimeout(timer);
        }
    }, [messages.length, lang]);
            <LanguageSwitch lang={lang} setLang={setLang} />

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
            <LanguageSwitch lang={props.lang} setLang={props.setLang} />
            <div className='chatbox'>
                <ChatBox
                    messages={messages}
                    user={user}
                />
            </div>
            <AiChatBox messages={messages} setMessages={setMessages} />
        </div>
    );
}

