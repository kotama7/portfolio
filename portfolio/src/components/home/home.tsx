import { useState } from 'react';
import MessageFormProps from './massage_form';
import { ChatBox } from 'react-chatbox-component';


export default function Home() {

    const [messages, setMessages] = useState<[MessageFormProps]>()

    const user = {
        "uid" : "Takanori Kotama"
    }

    return (
        <div>
            <h1>Home</h1>
            <ChatBox 
                messages={messages}
                user={user} 
            />
            
        </div>
    );
}

