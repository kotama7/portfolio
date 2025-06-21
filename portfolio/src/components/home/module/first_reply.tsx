import { useEffect } from 'react';
import MessageFormProps from './message_form';

import Reply from './return_respond';

interface FirstReplyProps {
    seter: Function;
    lang: string;
}

export default function FirstReply(props: FirstReplyProps) {

    useEffect(() => {
        const message = props.lang === 'en'
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

        props.seter(first_messages);

        fetch('/autoReply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lang: props.lang })
        })
            .then(res => res.json())
            .then(data => {
                Reply({
                    seter: props.seter,
                    messages: first_messages,
                    next_message: data.message
                });
            })
            .catch(err => {
                console.error('autoReply failed', err);
            });
    }, [props.lang, props.seter]);

    return null;
}
