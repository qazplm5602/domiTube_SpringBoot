import { useNavigate } from "react-router-dom";
import { channelMin } from "../Channel/Channel";
import MainLayout from "../Layout/MainLayout";
import VideoBox from "../Recycle/VideoBox";
import style from "./subscribeChannel.module.css";
import { useEffect, useRef, useState } from "react";
import { videoDataType } from "../Watch/Watch";
import Spinner from "../Recycle/Spinner";
import { request } from "../Utils/Fetch";
import React from "react";

import noProfile from '../../assets/no-profile.png';

type channelCache = {[key: string]: channelMin};
export default function SubscribeChannel() {
    const mainRef = useRef<HTMLElement>(null);
    const [list, setList] = useState<videoDataType[]>([]);
    const [loading, setLoading] = useState(false);
    const [bottom, setBottom] = useState(false);
    const [page, setPage] = useState(0);
    
    const cacheProcess = useRef<{[key: string]: boolean}>({});
    const [channels, setChannels] = useState<channelCache>({});

    const requestData = async function() {
        console.log("requestData");
        setLoading(true);

        const { code, data }: { code: number, data: videoDataType[] } = await request(`/api/subscribes?page=${page}`);
        if (code !== 200) return;

        data.forEach(v => {
            if (cacheProcess.current[v.id] === undefined) {
                cacheProcess.current[v.id] = true;
                channelLoad(v.channel);
            }
        });
        setPage(data.length >= 5 ? (page + 1) : -1);
        setList([...list, ...data]);
        setLoading(false);
        setBottom(false);   
    }
    
    const channelLoad = async function(id: string) {
        const { code, data }: { code: number, data: channelMin } = await request(`/api/channel/${id}/info?min=1`);
        if (code !== 200) return;
        
        setChannels((prev: channelCache) => ({...prev, [id]: data}));
    }
    
    const onScroll = function() {
        if (mainRef.current === null) return;
        setBottom((mainRef.current.scrollTop + 1) >= mainRef.current.scrollHeight - mainRef.current.clientHeight);
    }

    useEffect(() => {
        if (loading || page === -1) return;
        
        if (bottom || (mainRef.current && mainRef.current?.clientHeight >= mainRef.current?.scrollHeight)) {
            requestData();
        }
    }, [loading, page, bottom]);
    
    useEffect(() => {
        mainRef.current?.addEventListener("scroll", onScroll);
        return () => mainRef.current?.removeEventListener("scroll", onScroll);
    }, []);
    
    console.log(loading)
    return <MainLayout mainRef={mainRef}>
        <article className={style.content}>
            {list.map(v => <React.Fragment key={v.id}>
                <ChannelBar channel={channels[v.channel] || {}} />
                
                <VideoBox className={[style.video]} video={v} horizontal={true} channelHide={true} />

                <div className={style.line}></div>
            </React.Fragment>)}

            {loading && <Spinner className={style.spinner} />}
        </article>
    </MainLayout>; 
}

function ChannelBar({ channel }: {channel: channelMin}) {
    const navigate = useNavigate();
    const onClick = () => navigate(`/channel/${channel.id}`);

    return <div onClick={onClick} className={style.channel}>
        <img src={channel.icon ? `/api/image/user/${channel.id}` : noProfile} />
        <span>{channel.name}</span>
    </div>;
}