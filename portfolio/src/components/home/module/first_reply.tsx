import { useEffect, useState } from "react"

import MessageFormProps from "./massage_form"

import Reply from "./return_respond"
import { default_second_message_ja, default_second_message_en } from "./data"

interface FirstReplyProps {
    seter: Function;
    lang: string;
}

const FirstReply: React.FC<FirstReplyProps> = (props) => {

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
        lang: props.lang,
        messages: first_messages,
        next_message: next_message
    })

    return null;
}

export default FirstReply;