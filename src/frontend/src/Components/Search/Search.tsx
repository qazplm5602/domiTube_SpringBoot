import { SubscribeButton, channelMain as channelDataType } from "../Channel/Channel";
import MainLayout from "../Layout/MainLayout";
import Section from "../Recycle/Section";
import VideoBox from "../Recycle/VideoBox";

import style from './search.module.css';

import noProfile from '../../assets/no-profile.png';
import { useEffect, useRef, useState } from "react";
import { videoDataType } from "../Watch/Watch";
import { request } from "../Utils/Fetch";
import { useSearchParams } from "react-router-dom";

enum dataType { channel, video };
type listType = { type: dataType, data: channelDataType | videoDataType };

export default function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const searchValue = searchParams.get("v");

    const [list, setList] = useState<listType[]>();
    const [loading, setLoading] = useState(false);
    const [bottom, setBottom] = useState(false);

    const mainRef = useRef<HTMLElement>(null);
    const page = useRef<{channel: number, video: number}>({ channel: 0, video: 0 });

    const onScroll = function(e: Event) {
        if (mainRef.current === null) return;
        setBottom(mainRef.current.scrollHeight - mainRef.current.clientHeight <= mainRef.current.scrollTop + 10);
    }

    const requestLoad = async function() {
        if (searchValue === null || searchValue === "") return;
        setLoading(true);

        const waitChannel = request(`/api/channel/search?v=${encodeURIComponent(searchValue)}&page=${page.current.channel}`)
    }

    useEffect(() => {
        if (loading) return;

        if (bottom || (mainRef.current && mainRef.current.scrollHeight <= mainRef.current.clientHeight)) {
            requestLoad();
        }
    }, [loading, bottom]);

    useEffect(() => {
        mainRef.current?.addEventListener("scroll", onScroll);
        
        return () => mainRef.current?.removeEventListener("scroll", onScroll);
    }, [mainRef]);

    // 초기화
    useEffect(() => {
        setLoading(false);
        setList([]);
        setBottom(false);
    }, [searchValue]);

    return <MainLayout mainRef={mainRef} className={style.main}>
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