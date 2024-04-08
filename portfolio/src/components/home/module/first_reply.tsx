import MessageFormProps from "./massage_form"

export default function FirstReply(seter:(args:[MessageFormProps]) => void, lang:string) {

    const first_message: [MessageFormProps] = [
        {
            text: (lang === 'en' ? "Please introduce yourself." : "あなたのことを教えてください"),
            id: 1,
            sender: {
                uid: "Guest",
                name: "Guest",
                avatar: "https://www.w3schools.com/howto/img_avatar.png"
            }
        }
    ]

    seter(first_message)

    // first_message.push()
}