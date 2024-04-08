import MessageFormProps from "./massage_form"

export default function FirstReply(props: {seter: Function, lang: string}) {

    const first_message: [MessageFormProps] = [
        {
            text: (props.lang === 'en' ? "Please introduce yourself." : "あなたのことを教えてください"),
            id: 1,
            sender: {
                uid: "Guest",
                name: "Guest",
                avatar: "https://www.w3schools.com/howto/img_avatar.png"
            }
        }
    ]

    props.seter(first_message)

    // first_message.push()
}