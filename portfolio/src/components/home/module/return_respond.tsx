import MessageFormProps from './message_form';


interface ReplyProps {
    seter: Function;
    messages: MessageFormProps[];
    next_message: string;
    onStart?: () => void;
    onEnd?: () => void;
}

export default function Reply(props: ReplyProps) {
    const { seter, messages, next_message, onStart, onEnd } = props;

    const append_message_base: MessageFormProps = {
        text: "",
        id: messages.length + 1,
        sender: {
            uid: "Takanori Kotama",
            name: "Takanori Kotama",
            avatar: `${process.env.PUBLIC_URL}/kotama_icon.jpg`
        }
    };

    let i = 0;
    const append_message_text = next_message;
    const append_message_length = append_message_text.length;
    const current_messages = [...messages];

    const message_adder = () => {
        if (i < append_message_length) {
            const newMessage = {
                ...append_message_base,
                text: append_message_text.slice(0, i + 1),
            };
            current_messages[current_messages.length - 1] = newMessage;
            seter([...current_messages]);
            i += 1;
            setTimeout(message_adder, 25);
        } else {
            const newMessage = { ...append_message_base, text: append_message_text };
            current_messages[current_messages.length - 1] = newMessage;
            seter([...current_messages]);
            onEnd && onEnd();
        }
    };

    current_messages.push(append_message_base);
    seter([...current_messages]);
    onStart && onStart();
    message_adder();
}

