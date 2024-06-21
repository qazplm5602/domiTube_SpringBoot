import Channel, { SubscribeButton, channelMain as channelDataType, channelMin } from "../Channel/Channel";
import MainLayout from "../Layout/MainLayout";
import Section from "../Recycle/Section";
import VideoBox from "../Recycle/VideoBox";

import style from './search.module.css';

import noProfile from '../../assets/no-profile.png';
import { useEffect, useRef, useState } from "react";
import { videoDataType } from "../Watch/Watch";
import { request, response } from "../Utils/Fetch";
import { useSearchParams } from "react-router-dom";
import { numberWithKorean, randomNumber } from "../Utils/Misc";

enum dataType { channel, video };
type listType = { type: dataType, data: channelDataType | videoDataType };
type cacheType = {[key: string]: channelMin};

export default function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const searchValue = searchParams.get("v");

    const [list, setList] = useState<listType[]>([]);
    const [loading, setLoading] = useState(false);
    const [bottom, setBottom] = useState(false);

    const mainRef = useRef<HTMLElement>(null);
    const page = useRef<{channel: number, video: number, id: number, name: string}>({ channel: 0, video: 0, id: 0, name: searchValue || "" });
    const [cacheChannel, setCacheChannel] = useState<cacheType>({});
    const progressChannel = useRef<{[key: string]: boolean}>({});

    const onScroll = function(e: Event) {
        if (mainRef.current === null) return;
        setBottom(mainRef.current.scrollHeight - mainRef.current.clientHeight <= mainRef.current.scrollTop + 10);
    }

    const requestLoad = async function() {
        if (searchValue === null || searchValue === "" || (page.current.channel === -1 && page.current.video === -1)) return;
        const ID = page.current.id;

        setLoading(true);

        let waitChannel: Promise<response | number> = new Promise(reslove => reslove(0));
        let waitVideo: Promise<response | number> = new Promise(reslove => reslove(0));

        if (page.current.channel !== -1) {
            waitChannel = request(`/api/channel/search?v=${encodeURIComponent(searchValue)}&page=${page.current.channel}`);
        }
        if (page.current.video !== -1) {
            waitVideo = request(`/api/video/search?v=${encodeURIComponent(searchValue)}&page=${page.current.video}`);
        }

        const [ channelResponse, videoResponse ] = await Promise.all([waitChannel, waitVideo]);

        console.log("page.current.id !== ID", page.current.id !== ID);
        if (page.current.id !== ID) return; // 전 데이터

        let channels: channelDataType[] = [];
        if (page.current.channel !== -1) {
            channels = (channelResponse as response).data;
            
            // 캐싱
            const pushes: cacheType = {};
            channels.forEach(v => {
                if (progressChannel.current[v.id] === undefined) {
                    progressChannel.current[v.id] = true;
                    pushes[v.id] = v;
                }
            });

            if (Object.keys(pushes).length > 0)
                setCacheChannel((prev: cacheType) => ({...prev, ...pushes}));

            if (channels.length < 5)
                page.current.channel = -1;
            else
            page.current.channel += 1;
        }
    
        let videos: channelDataType[] = [];
        if (page.current.video !== -1) {
            videos = (videoResponse as response).data;
            if (videos.length < 5)
                page.current.video = -1;
            else
                page.current.video += 1;
        }

        let channelIdx = 0;
        let videoIdx = 0;
        const result: listType[] = [];

        while (channels.length > channelIdx || videos.length > videoIdx) {
            if (channels.length > channelIdx) {
                const endIdx = channelIdx + randomNumber(0, channels.length - channelIdx);
                for (let i = channelIdx; i < endIdx; i++) {
                    result.push({
                        type: dataType.channel,
                        data: channels[i]
                    });
                    channelIdx++;
                }
            }
            if (videos.length > videoIdx) {
                const endIdx = videoIdx + randomNumber(0, videos.length - videoIdx);
                for (let i = videoIdx; i < endIdx; i++) {
                    result.push({
                        type: dataType.video,
                        data: videos[i]
                    });
                    videoIdx++;
                }
            }
        }

        setList((prevList: listType[]) => [...prevList, ...result]);
        setLoading(false);
    }

    useEffect(() => {
        if (loading || searchValue === null) return;

        let otherSearchVal = searchValue !== page.current.name;
        if (otherSearchVal) {
            page.current.id = randomNumber(100, 999);
            page.current.channel = page.current.video = 0;

            setLoading(false);
            setList([]);
            setBottom(false);
        }

        if (bottom || (mainRef.current && mainRef.current.scrollHeight <= mainRef.current.clientHeight) || otherSearchVal) {
            page.current.name = searchValue;
            requestLoad();
        }
    }, [loading, bottom, searchParams]);

    useEffect(() => {
        mainRef.current?.addEventListener("scroll", onScroll);
        
        return () => mainRef.current?.removeEventListener("scroll", onScroll);
    }, [mainRef]);

    // test
    useEffect(() => console.log(cacheChannel), [cacheChannel]);

    return <MainLayout mainRef={mainRef} className={style.main}>
        {list.map(value => {
            if (value.type === dataType.channel) {
                return <ChannelBox key={(value.data as channelDataType).id} channel={value.data as channelDataType} />
            } else {
                return <VideoBox key={(value.data as videoDataType).id} video={value.data as videoDataType} channel={cacheChannel[(value.data as videoDataType).channel]} horizontal={true} className={[style.videoBox]} />;
            }
        })}
    </MainLayout>
}

export function ChannelBox({ channel }: { channel: channelDataType }) {
    return <Section className={style.channelBox}>
        <div className={style.icon_container}>
            <img src={channel.icon ? `/api/image/user/${channel.id}` : noProfile} />
        </div>

        <div className={style.info}>
            <h1 className={style.title}>{channel.name}</h1>
            <div>구독자 {numberWithKorean(channel.follower)}명</div>
            {/* <div>채널을 설명하는 글입니다.채널을 설명하는 글입니다.채널을 설명하는 글입니다.</div> */}
        </div>

        <SubscribeButton className={[style.subscribe]} active={false} channel={channel.id} onChanged={() => {}} />
    </Section>
}