import { useState, useEffect } from 'react';
import LanguageSwitch, { LangProps } from '../LanguageSwitch';
import { ChatBox } from 'react-chatbox-component';
import AiChatBox from './AiChatBox';

import MessageFormProps from './module/message_form';
import FirstReply from './module/first_reply';

import 'react-chatbox-component/dist/style.css';
import './home.css';


export default function Home(props: LangProps) {

    const [messages, setMessages] = useState<MessageFormProps[]>([])

    const user = {
        "uid" : "Guest"
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
            <LanguageSwitch lang={props.lang} setLang={props.setLang} />
            <div className='chatbox'>
                <ChatBox
                    messages={messages}
                    user={user}
                />
            </div>
            <AiChatBox />
        </div>
    );
}

