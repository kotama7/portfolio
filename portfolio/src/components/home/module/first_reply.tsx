import { useEffect } from 'react';
import MessageFormProps from './message_form';

import Reply from './return_respond';

interface FirstReplyProps {
    seter: Function;
    lang: string;
}

export default function FirstReply({ seter, lang }: FirstReplyProps) {

    useEffect(() => {
        const message = lang === 'en'
            ? 'Tell me about yourself'
            : 'あなたのことを教えてください';

        const first_messages: [MessageFormProps] = [
            {
                text: message,
                id: 1,
                sender: {
                    uid: 'Guest',
                    name: 'Guest',
                    avatar: 'https://www.w3schools.com/howto/img_avatar.png'
                }
            }
        ];

        seter(first_messages);

        fetch('/autoReply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lang })
        })
            .then(res => res.json())
            .then(data => {
                Reply({
                    seter,
                    messages: first_messages,
                    next_message: data.message
                });
            })
            .catch(err => {
                console.error('autoReply failed', err);
            });
    }, [lang, seter]);

    return null;
}
