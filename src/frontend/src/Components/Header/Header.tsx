import { Link } from 'react-router-dom';
import style from './header.module.css';

import youtubeLogo from './youtube.svg';
import listSVG from './list.svg';
import searchSVG from './search.svg';

export default function Header({sideState}: {sideState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]}): JSX.Element {
    return <header className={style.main}>
        <Section>
            <IconButton onClick={() => sideState[1](!sideState[0])} icon={listSVG} text="목록" />
            <Link to="/" className={style.logo}><img src={youtubeLogo} /></Link>
        </Section>

        <SearchBox />

        <Section>
            <Link to="/login" className={style.login}><button>로그인</button></Link>
            <IconButton className={[style.myProfile]} text='프로필' icon='https://nng-phinf.pstatic.net/MjAyMjA2MTdfNzcg/MDAxNjU1NDYwOTk4MzIx.2GtboKl1AANbxW8mwf7_-3rl1joA5z70GdLSuhVzWssg.ubvmA6JPVkX2fRl0DLLBKY9eBbL2Gh3cN03_MMAwnuAg.PNG/1.png?type=f120_120_na' />
        </Section>
    </header>;
}

function IconButton({icon, text, className, onClick}: {icon: string, text?: string, className?: string[], onClick?: React.MouseEventHandler}): JSX.Element {
    return <button onClick={onClick} className={[style.iconBtn, ...(className || [])].join(" ")}>
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