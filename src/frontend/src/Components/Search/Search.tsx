import { SubscribeButton, channelMain as channelDataType } from "../Channel/Channel";
import MainLayout from "../Layout/MainLayout";
import Section from "../Recycle/Section";
import VideoBox from "../Recycle/VideoBox";

import style from './search.module.css';

import noProfile from '../../assets/no-profile.png';

export default function Search() {


    return <MainLayout className={style.main}>
        <ChannelBox channel={{
            banner: true,
            follower: 100,
            icon: true,
            id: "domi",
            name: "도미-test",
            subscribe: true
        }} />
        {/* <VideoBox video={{}} horizontal={true} /> */}
    </MainLayout>
}

export function ChannelBox({ channel }: { channel: channelDataType }) {
    return <Section className={style.channelBox}>
        <div className={style.icon_container}>
            <img src={noProfile} />
        </div>

        <div className={style.info}>
            <h1 className={style.title}>도밍</h1>
            <div>구독자 4.7만명</div>
            <div>채널을 설명하는 글입니다.채널을 설명하는 글입니다.채널을 설명하는 글입니다.</div>
        </div>

        <SubscribeButton className={[style.subscribe]} active={false} channel={channel.id} onChanged={() => {}} />
    </Section>
}