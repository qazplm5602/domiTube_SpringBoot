import { Link } from 'react-router-dom';
import Button from '../Recycle/Button';
import style from './aside.module.css';

import homeSvg from './home.svg';
import { useEffect, useState } from 'react';

export default function Aside({sideState, forceHide = false}: {forceHide?: boolean, sideState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]}) {
    const [minimun, setMinimun] = useState(false);
    const screenChange = function(e: MediaQueryListEvent) {
        setMinimun(e.matches || forceHide);
    }

    useEffect(() => {
        const media = window.matchMedia("(max-width: 768px)");
        setMinimun(media.matches || forceHide);
        media.addEventListener("change", screenChange);

        return () => media.removeEventListener("change", screenChange);
    }, []);

    useEffect(() => {
        if (minimun && sideState[0])
            sideState[1](false);
    }, [minimun]);

    return <>
        {((!sideState[0] || minimun) && !forceHide) && <ShortSide />}
        {(sideState[0] || minimun) && <DetailSide fixed={minimun} open={sideState[0]} />}
    </>;
}

function DetailSide({fixed, open}: {fixed: boolean, open: boolean}) {
    const classList = [style.side];
    if (fixed) {
        classList.push(style.fixed);
        
        if (open)
            classList.push(style.opend);
    }

    return <aside className={classList.join(" ")}>
        <Link to="/">
            <Button icon={homeSvg} className={[style.menu, style.active].join(" ")}>홈</Button>
        </Link>
        
        <Link to="/">
            <Button icon={homeSvg} className={style.menu}>구독</Button>
        </Link>

        <div className={style.line}></div>

        {/* ---- 구독 ---- */}
        <div className={style.title} style={{margin: "15px 15px", marginBottom: "5px"}}>구독</div>
        <Link to="/">
            <Button icon="https://yt3.ggpht.com/_QGPHrnarLactSDLIisKwBFZ58FiqlaGVJNTznx5KaP75-WLNmmpxCPtgCZNh5us9D-8ZZg5KQ=s88-c-k-c0x00ffffff-no-rj" className={[style.menu, style.channel].join(" ")}>도미임</Button>
        </Link>    
    </aside>;
}

function ShortSide() {
    return <aside className={[style.side, style.short].join(" ")}>
        <Link to="/">
            <Button icon={homeSvg} className={[style.menu, style.active].join(" ")}>홈</Button>
        </Link>
        
        <Link to="/">
            <Button icon={homeSvg} className={style.menu}>구독</Button>
        </Link>
    </aside>;
}