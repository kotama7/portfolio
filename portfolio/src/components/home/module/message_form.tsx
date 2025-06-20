export default interface MessageFormProps {
    text: string;
    id: number;
    sender: {
        uid: string;
        name: string;
        avatar: string;
    }
}

