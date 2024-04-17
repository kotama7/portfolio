import React, { useEffect } from 'react';
import MessageFormProps from './massage_form';

import { default_second_message_ja, default_second_message_en } from './data';

interface ReplyProps {
    seter: Function;
    lang: string;
    messages: MessageFormProps[];
    next_message: string;
}

const Reply: React.FC<ReplyProps> = (props) => {
    const { seter, lang, messages } = props;

    useEffect(() => {
        const append_message: MessageFormProps = {
            text: "",
            id: messages.length + 1,
            sender: {
                uid: "Takanori Kotama",
                name: "Takanori Kotama",
                avatar: `${process.env.PUBLIC_URL}/kotama_icon.jpg`
            }
        };

        let i = 0;
        let append_message_text = lang === 'en' ? default_second_message_en : default_second_message_ja;
        const append_message_length = append_message_text.length;

        const message_adder = () => {
            if (i < append_message_length) {
                append_message.text = append_message_text.slice(0, i + 1);
                seter([...messages, append_message]); // Avoid direct mutation
                i += 1;
                setTimeout(message_adder, 50);
            } else {
                append_message.text = append_message_text;
                seter([...messages, append_message]); // Avoid direct mutation
            }
        };

        message_adder();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only once when component mounts

    return null; // Adjust the return value as needed
};

export default Reply;
