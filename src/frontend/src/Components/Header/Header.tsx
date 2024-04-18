import style from './header.module.css';

import youtubeLogo from './youtube.svg';
import listSVG from './list.svg';
import searchSVG from './search.svg';
import logoutSVG from './logout.svg';
import noProfile from '../../assets/no-profile.png';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from '../Recycle/Button';

import StoreType from '../Redux/Type';
import { IloginStore } from '../Redux/LoginStore';

export default function Header({sideState}: {sideState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]}): JSX.Element {
    const [showAccount, setShowAccount] = useState(false);
    const login = useSelector<StoreType>(value => value.login) as IloginStore;

    const accountMenuToggle = function() {
        setShowAccount(!showAccount);
    }

    return <header className={style.main}>
        <Section>
            <IconButton onClick={() => sideState[1](!sideState[0])} icon={listSVG} text="목록" />
            <Link to="/" className={style.logo}><img src={youtubeLogo} /></Link>
        </Section>

        <SearchBox />

        <Section>
            {!login.logined && <Link to="/login" className={style.login}><button>로그인</button></Link>}
            {login.logined && <IconButton className={[style.myProfile]} onClick={accountMenuToggle} text='프로필' icon={(login.image ? `/api/image/user/${login.id}` : noProfile)} />}
            {(login.logined && showAccount) && <AccountMenu login={login} />}
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
    const classList = [style.searchMain];
    const [focus, setFocus] = useState(false);

    if (focus)
        classList.push(style.active);

    return <Section className={classList.join(" ")}>
        <input placeholder='검색' type="text" onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} />
        <IconButton icon={searchSVG} />
    </Section>;
}

function LinkButton({to, icon, text, className}: {to: string, icon?: string, className?: string, text: string}) {
    return <Link className={className} to={to}><Button icon={icon}>
        {text}
    </Button></Link>
}

function AccountMenu({ login }: { login: IloginStore }) {
    return <Section className={style.accountMenu}>
        <div className={style.account}>
            <img src={(login.image ? `/api/image/user/${login.id}` : noProfile)} />
            <div className={style.info}>
                <span>{login.id}</span>
                <span>{login.name}</span>
            </div>
        </div>

        <div className={style.line}></div>

        <LinkButton className={style.linkBtn} to="/logout" icon={logoutSVG} text="로그아웃" />
    </Section>;
}