import { useNavigate } from "react-router-dom";
import { channelMin } from "../Channel/Channel";
import MainLayout from "../Layout/MainLayout";
import VideoBox from "../Recycle/VideoBox";
import style from "./subscribeChannel.module.css";

export default function SubscribeChannel() {
    return <MainLayout>
        <article className={style.content}>
            <ChannelBar channel={{}} />
            <VideoBox className={[style.video]} video={{
                channel: "domi",
            }} horizontal={true} channelHide={true} />
        
            <div className={style.line}></div>
        </article>
    </MainLayout>; 
}

function ChannelBar({ channel }: {channel: channelMin}) {
    const navigate = useNavigate();
    const onClick = () => navigate(`/channel/${channel.id}`);

    return <div onClick={onClick} className={style.channel}>
        <img src={`/api/image/user/${channel.id}`} />
        <span>{channel.name}</span>
    </div>;
}