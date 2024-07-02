import { Link, useLocation } from 'react-router-dom';
import Button from '../Recycle/Button';
import style from './aside.module.css';

import homeSvg from './home.svg';
import { useEffect, useState } from 'react';
import { request } from '../Utils/Fetch';
import IStore from '../Redux/Type';
import { useSelector } from 'react-redux';

import noProfile from '../../assets/no-profile.png';

type minChannel = {id:string, name: string, icon: boolean};

const MENU = [
    ["홈", "/", homeSvg],
    ["구독", "/subscribes", homeSvg],
];

export default function Aside({sideState, forceHide = false}: {forceHide?: boolean, sideState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]}) {
    const logined = useSelector<IStore>(value => value.login.logined) as boolean;

    const [minimun, setMinimun] = useState(false);
    const [subscribes, setSubscribes] = useState<minChannel[] | boolean>(false);

    const screenChange = function(e: MediaQueryListEvent) {
        setMinimun(e.matches || forceHide);
    }
    const requestSubscribes = async function() {
        const { code, data } = await request("/api/user/my_subscribes");
        
        if (code !== 200 || data?.result !== true) return;

        const waitPromises: Promise<{code: number, data: any}>[] = [];
        data.data.forEach((channelId: string) => {
            waitPromises.push(request(`/api/channel/${channelId}/info?min=1`));
        });

        const channels = (await Promise.all(waitPromises)).filter(response => response.code === 200).map(response => response.data) as minChannel[];
        setSubscribes(channels);
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

    useEffect(() => {
        if (logined === true)
            requestSubscribes();
    }, [logined]);

    return <>
        {((!sideState[0] || minimun) && !forceHide) && <ShortSide />}
        {(sideState[0] || minimun) && <DetailSide fixed={minimun} open={sideState[0]} subscribes={subscribes} />}
    </>;
}

function DetailSide({fixed, open, subscribes}: {fixed: boolean, open: boolean, subscribes: minChannel[] | boolean}) {
    const location = useLocation();
    let pathname = location.pathname;
    
    if (pathname.length > 1 && pathname[pathname.length - 1] === "/") {
        pathname = pathname.substring(0, pathname.length - 2);
    }

    const classList = [style.side];
    if (fixed) {
        classList.push(style.fixed);
        
        if (open)
            classList.push(style.opend);
    }

    return <aside className={classList.join(" ")}>
        {MENU.map(v => <Link to={v[1]}>
            <Button icon={v[2]} className={[style.menu, (pathname === v[1] ? style.active : "")].join(" ")}>{v[0]}</Button>
        </Link>)}

        <div className={style.line}></div>

        {/* ---- 구독 타이틀  ---- */}
        {subscribes !== false && <div className={style.title} style={{margin: "15px 15px", marginBottom: "5px"}}>구독</div>}
        
        {/* ---- 구독 콘텐츠 ---- */}
        {(typeof subscribes === "object") && subscribes.map(value => <Link key={value.id} to={`/channel/${value.id}`}>
            <Button icon={(value.icon ? `/api/image/user/${value.id}` : noProfile)} className={[style.menu, style.channel].join(" ")}>{value.name}</Button>
        </Link> )}
    </aside>;
}

function ShortSide() {
    const location = useLocation();
    let pathname = location.pathname;
    
    if (pathname.length > 1 && pathname[pathname.length - 1] === "/") {
        pathname = pathname.substring(0, pathname.length - 2);
    }

    return <aside className={[style.side, style.short].join(" ")}>
        {MENU.map(v => <Link to={v[1]}>
            <Button icon={v[2]} className={[style.menu, (pathname === v[1] ? style.active : "")].join(" ")}>{v[0]}</Button>
        </Link>)}
    </aside>;
}