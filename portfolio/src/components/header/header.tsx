export default function Header(props: {lang: string, setLang: (lang: string) => void}){

    const changeLanguage = () => {
        if (props.lang === 'en') {
            props.setLang('ja');
        } else {
            props.setLang('en');
        }
    }    

    return (
        <header>
            <button onClick={changeLanguage}>
                {props.lang === 'en' ? '日本語に切り替える' : 'Switch to English'}
            </button>
            <h1>
                {props.lang === 'en' ? 'Takanori Kotama' : '樹神 宇徳'}
            </h1>
        </header>
    );
}