import MessageFormProps from "./message_form"

import Reply from "./return_respond"
import { default_second_message_ja, default_second_message_en } from "./data"

interface FirstReplyProps {
    seter: (msgs: MessageFormProps[]) => void;
    messages?: MessageFormProps[];
    const existing = props.messages ?? [];
    const first_message: MessageFormProps = {
        text: message,
        id: existing.length + 1,
        sender: {
            uid: "Guest",
            name: "Guest",
            avatar: "https://www.w3schools.com/howto/img_avatar.png"
    };
    const newMessages = [...existing, first_message];
    props.seter(newMessages);
        messages: newMessages,
    });
        next_message = default_second_message_ja
    }
    

    const first_messages: [MessageFormProps] = [
        {
            text: message,
            id: 1,
            sender: {
                uid: "Guest",
                name: "Guest",
                avatar: "https://www.w3schools.com/howto/img_avatar.png"
            }
        }
    ]

    props.seter(first_messages)

    Reply({
        seter: props.seter,
        messages: first_messages,
        next_message: next_message,
    })
}

