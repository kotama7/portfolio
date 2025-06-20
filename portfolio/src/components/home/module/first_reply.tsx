import MessageFormProps from "./message_form"

import Reply from "./return_respond"
import { default_second_message_ja, default_second_message_en } from "./data"

interface FirstReplyProps {
    seter: Function;
    lang: string;
}

export default function FirstReply(props: FirstReplyProps) {

    let message:string = "あなたのことを教えてください"
    let next_message:string = default_second_message_ja

    if (props.lang === 'en') {
        message = "Tell me about yourself"
        next_message = default_second_message_en
    } else {
        message = "あなたのことを教えてください"
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

