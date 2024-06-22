import Channel, { SubscribeButton, channelMain as channelDataType, channelMin } from "../Channel/Channel";
import MainLayout from "../Layout/MainLayout";
import Section from "../Recycle/Section";
import VideoBox from "../Recycle/VideoBox";

import style from './search.module.css';

import noProfile from '../../assets/no-profile.png';
import { useEffect, useRef, useState } from "react";
import { videoDataType } from "../Watch/Watch";
import { request, response } from "../Utils/Fetch";
import { useNavigate, useSearchParams } from "react-router-dom";
import { numberWithKorean, randomNumber } from "../Utils/Misc";
import Spinner from "../Recycle/Spinner";

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

    const loadChannel = async function(channel: string) {
        progressChannel.current[channel] = true;

        const { code, data } = await request(`/api/channel/${channel}/info?mini=1`);
        if (code !== 200) return;

        setCacheChannel((prev: cacheType) => ({...prev, [channel]: data}));
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
    
        let videos: videoDataType[] = [];
        if (page.current.video !== -1) {
            videos = (videoResponse as response).data;
            videos.forEach(v => {
                if (progressChannel.current[v.channel] === undefined)
                    loadChannel(v.channel);
            });

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

    const subscribeChange = function(channel: string, active: boolean) {
        console.log(channel, active);
        let idx = -1;
        list.forEach((v, i) => {
            if (v.type !== dataType.channel) return;
            
            if ((v.data as channelDataType).id === channel) {
                idx = i;
                return false;
            }
        });

        if (idx === -1) return;

        (list[idx].data as channelDataType).subscribe = active;
        setList([...list]);
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

    return <MainLayout mainRef={mainRef}>
        <article className={style.main}>
            {list.map(value => {
                if (value.type === dataType.channel) {
                    return <ChannelBox key={(value.data as channelDataType).id} channel={value.data as channelDataType} onSubscribeChange={subscribeChange} />
                } else {
                    return <VideoBox key={(value.data as videoDataType).id} video={value.data as videoDataType} channel={cacheChannel[(value.data as videoDataType).channel]} horizontal={true} className={[style.videoBox]} />;
                }
            })}
            {loading && <Spinner className={style.loader} />}
            {(!loading && list.length === 0) && <div className={style.alert}>검색 결과가 없습니다. 다른 검색어를 사용하세요.</div>}
        </article>
    </MainLayout>
}

export function ChannelBox({ channel, onSubscribeChange }: { channel: channelDataType, onSubscribeChange?: (channel: string, active: boolean) => void }) {
    const navigate = useNavigate();
    const channelClick = function() {
        navigate(`/channel/${channel.id}`)
    }

    return <Section className={style.channelBox} onClick={channelClick}>
        <div className={style.icon_container}>
            <img src={channel.icon ? `/api/image/user/${channel.id}` : noProfile} />
        </div>

        <div className={style.info}>
            <h1 className={style.title}>{channel.name}</h1>
            <div>구독자 {numberWithKorean(channel.follower)}명</div>
            {/* <div>채널을 설명하는 글입니다.채널을 설명하는 글입니다.채널을 설명하는 글입니다.</div> */}
        </div>

        <SubscribeButton className={[style.subscribe]} active={channel.subscribe} channel={channel.id} onChanged={v => { if(onSubscribeChange) onSubscribeChange(channel.id, v)}} />
    </Section>
}