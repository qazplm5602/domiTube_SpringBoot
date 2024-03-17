import { Link } from 'react-router-dom';
import style from './header.module.css';

import youtubeLogo from './youtube.svg';
import listSVG from './list.svg';
import searchSVG from './search.svg';

export default function Header(): JSX.Element {
    return <header className={style.main}>
        <Section>
            <IconButton icon={listSVG} text="목록" />
            <Link to="/" className={style.logo}><img src={youtubeLogo} /></Link>
        </Section>

        <SearchBox />

        <Section>
            <Link to="/login" className={style.login}><button>로그인</button></Link>
        </Section>
    </header>;
}

function IconButton({icon, text}: {icon: string, text?: string}): JSX.Element {
    return <button className={style.iconBtn}>
        <img src={icon} />
        {text && <span>{text}</span>}
    </button>;
}

function Section({children, ...props}: {children: React.ReactNode, [key: string]: any}): JSX.Element {
    return <section {...props}>
        {children}
    </section>;
}

function SearchBox() {
    return <Section className={style.searchMain}>
        <input placeholder='검색' type="text" />
        <IconButton icon={searchSVG} />
    </Section>;
}