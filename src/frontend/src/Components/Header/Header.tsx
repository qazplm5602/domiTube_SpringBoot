import { Link } from 'react-router-dom';
import style from './header.module.css';

import youtubeLogo from './youtube.svg';
import listSVG from './list.svg';

export default function Header(): JSX.Element {
    return <header className={style.main}>
        <Section>
            <IconButton icon={listSVG} text="목록" />
            <Link to="/" className={style.logo}><img src={youtubeLogo} /></Link>
        </Section>

        <Section>
            <Link to="/login" className={style.login}><button>로그인</button></Link>
        </Section>
    </header>;
}

function IconButton({icon, text}: {icon: string, text: string}): JSX.Element {
    return <button className={style.iconBtn}>
        <img src={icon} />
        <span>{text}</span>
    </button>;
}

function Section({children}: {children: React.ReactNode}): JSX.Element {
    return <section>
        {children}
    </section>;
}