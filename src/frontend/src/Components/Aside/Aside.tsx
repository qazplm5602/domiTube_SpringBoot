import { Link } from 'react-router-dom';
import Button from '../Recycle/Button';
import style from './aside.module.css';

import homeSvg from './home.svg';

export default function Aside() {
    return <>
        <DetailSide fixed={false} />
        {/* <ShortSide /> */}
    </>;
}

function DetailSide({fixed}: {fixed: boolean}) {
    const classList = [style.side];
    if (fixed)
        classList.push(style.fixed);

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