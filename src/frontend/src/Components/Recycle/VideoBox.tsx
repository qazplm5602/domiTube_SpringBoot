import Button from './Button';
import style from './videoBox.module.css';
import noProfile from '../../assets/no-profile.png';

import otherSVG from '../Header/other.svg';
import { useNavigate } from 'react-router-dom';
import { videoDataType } from '../Watch/Watch';
import { dateWithKorean, numberWithKorean, secondsToHMS } from '../Utils/Misc';
import { channelMin } from '../Channel/Channel';

export default function VideoBox({video, channel, channelHide = false, className = [], horizontalIcon = false, horizontal = false}: {video: videoDataType, channel?: channelMin, channelHide?: boolean, className?: string[], horizontalIcon?: boolean, horizontal?: boolean}) {
    const navigate = useNavigate();
    className.push(style.main); // default 값임

    if (horizontal)
        className.push(style.horizontal);

    let channelImage = noProfile;
    if (channel && channel.icon)
        channelImage = `/api/image/user/${channel.id}`;

    return <div onClick={() => navigate(`/watch/${video.id}`)} className={className.join(" ")}>
        <div className={style.thumnail}>
            <img src={`/api/image/thumbnail/${video.id}`} />
            <span className={style.time}>{secondsToHMS(video.time)}</span>
        </div>

        <div className={style.details}>
            {(!channelHide && channel) && <img className={style.channel} src={channelImage} />}
            <div className={style.texts}>
                <div className={style.title}>{video.title}</div>
                {(!channelHide && horizontal) && <div className={style.channel}>
                    {horizontalIcon && <img className={style.icon} src={channelImage} />}
                    <span>{channel?.name || "--"}</span>
                </div>}
                {(!channelHide && !horizontal) && <span className={style.channelT}>{channel?.name || "--"}</span>}
                <span className={style.sub}>조회수 {numberWithKorean(video.views)}회 • {dateWithKorean(new Date(video.create))} 전</span>
            </div>
            <Button icon={otherSVG} className={style.otherBtn} />
        </div>
    </div>;
}