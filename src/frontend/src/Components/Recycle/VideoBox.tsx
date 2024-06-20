import Button from './Button';
import style from './videoBox.module.css';

import otherSVG from '../Header/other.svg';
import { useNavigate } from 'react-router-dom';
import { videoDataType } from '../Watch/Watch';
import { dateWithKorean, numberWithKorean, secondsToHMS } from '../Utils/Misc';

export default function VideoBox({video, channelHide = false, className = [], horizontal = false}: {video: videoDataType, channelHide?: boolean, className?: string[], horizontal?: boolean}) {
    const navigate = useNavigate();
    className.push(style.main); // default 값임

    if (horizontal)
        className.push(style.horizontal);

    return <div onClick={() => navigate(`/watch/${video.id}`)} className={className.join(" ")}>
        <div className={style.thumnail}>
            <img src={`/api/image/thumbnail/${video.id}`} />
            <span className={style.time}>{secondsToHMS(video.time)}</span>
        </div>

        <div className={style.details}>
            {!channelHide && <img className={style.channel} src="https://nng-phinf.pstatic.net/MjAyMjA2MTdfNzcg/MDAxNjU1NDYwOTk4MzIx.2GtboKl1AANbxW8mwf7_-3rl1joA5z70GdLSuhVzWssg.ubvmA6JPVkX2fRl0DLLBKY9eBbL2Gh3cN03_MMAwnuAg.PNG/1.png?type=f120_120_na" />}
            <div className={style.texts}>
                <div className={style.title}>{video.title}</div>
                {(!channelHide && horizontal) && <div className={style.channel}>
                    <img className={style.icon} src="https://nng-phinf.pstatic.net/MjAyMjA2MTdfNzcg/MDAxNjU1NDYwOTk4MzIx.2GtboKl1AANbxW8mwf7_-3rl1joA5z70GdLSuhVzWssg.ubvmA6JPVkX2fRl0DLLBKY9eBbL2Gh3cN03_MMAwnuAg.PNG/1.png?type=f120_120_na" />
                    <span>도미임</span>
                </div>}
                {(!channelHide && !horizontal) && <span className={style.channelT}>도미임</span>}
                <span className={style.sub}>조회수 {numberWithKorean(video.views)}회 • {dateWithKorean(new Date(video.create))} 전</span>
            </div>
            <Button icon={otherSVG} className={style.otherBtn} />
        </div>
    </div>;
}