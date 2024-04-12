import Button from './Button';
import style from './videoBox.module.css';

import otherSVG from '../Header/other.svg';
import { useNavigate } from 'react-router-dom';

export default function VideoBox({className = [], horizontal = false}: {className?: string[], horizontal?: boolean}) {
    const navigate = useNavigate();
    className.push(style.main); // default 값임

    if (horizontal)
        className.push(style.horizontal);

    return <div onClick={() => navigate("/watch")} className={className.join(" ")}>
        <div className={style.thumnail}>
            <img src="https://i.ytimg.com/vi/O5pHIoO-W-8/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLAgVDD6Uumd_A8mchTOYUtOrbAz-A" />
            <span className={style.time}>10:10</span>
        </div>

        <div className={style.details}>
            <img className={style.channel} src="https://nng-phinf.pstatic.net/MjAyMjA2MTdfNzcg/MDAxNjU1NDYwOTk4MzIx.2GtboKl1AANbxW8mwf7_-3rl1joA5z70GdLSuhVzWssg.ubvmA6JPVkX2fRl0DLLBKY9eBbL2Gh3cN03_MMAwnuAg.PNG/1.png?type=f120_120_na" />
            <div className={style.texts}>
                <div className={style.title}>제목인뎅_밍글링</div>
                <span className={style.channelT}>도미임</span>
                <span className={style.sub}>조회수 2.6만회 • 3시간 전</span>
            </div>
            <Button icon={otherSVG} className={style.otherBtn} />
        </div>
    </div>;
}