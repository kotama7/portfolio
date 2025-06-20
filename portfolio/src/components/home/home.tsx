import { useState } from 'react';
import { ChatBox } from 'react-chatbox-component';

import MessageFormProps from './module/message_form';
import FirstReply from './module/first_reply';

import 'react-chatbox-component/dist/style.css';
import './home.css';


export default function Home(props: {lang: string}) {

    const [messages, setMessages] = useState<[MessageFormProps]>()

    const user = {
        "uid" : "Guest"
    }

    if (messages === undefined) {
        setTimeout(
            FirstReply,
            1750,
            {
                seter: setMessages, 
                lang: props.lang
            }
        )
    }

    return (
        <div>
            <div className='chatbox'>
                <ChatBox 
                    messages={messages}
                    user={user} 
                />
            </div>
        </div>
    );
}

