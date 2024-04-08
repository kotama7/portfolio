export default interface MessageFormProps {
    text: string;
    id: number;
    sender: {
        uid: number;
        name: string;
        avatar: string;
    }
}
