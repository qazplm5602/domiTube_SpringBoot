import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Section from "../Recycle/Section";

import style from './channel.module.css';
import Button from "../Recycle/Button";

import loveSvg from './love.svg';
import noProfile from '../../assets/no-profile.png';

import VideoBox from "../Recycle/VideoBox";
import { useCallback, useEffect, useRef, useState } from "react";
import { request } from "../Utils/Fetch";
import { videoDataType } from "../Watch/Watch";
import Spinner from "../Recycle/Spinner";

export interface channelMain {
    name: string,
    icon: boolean,
    banner: boolean,
    follower: number,
    subscribe: boolean,
}

export default function Channel() {
    const { id, menu } = useParams();
    const navigate = useNavigate();

    const mainRef = useRef<any>();

    const [error, setError] = useState<string | boolean>(false);
    const [channelData, setChannelData] = useState<channelMain | null>(null);

    const pages: {[key: string]: JSX.Element} = {
        home: <Home />,
        video: <VideoAll channel={id} mainRef={mainRef} />
    }

    const redirection = function(path: string) {
        navigate(`/channel/${id}/${path}`);
    }

    const getChannelData = async function() {
        const { code, data } = await request(`/api/channel/${id}/info`);
        if (code !== 200) {
            if (code === 404) {
                setError("존재하지 않는 채널 입니다.");
            }


            return;
        }

        setChannelData(data);
    }

    const subscribeChanged = function(active: boolean) {
        if (channelData !== null) {
            channelData.subscribe = active;
            setChannelData({...channelData});
        }
    }

    useEffect(() => {
        getChannelData();
    }, [id]);

    if (typeof error !== "boolean") {
        return <MainLayout mainRef={mainRef}>
            error: {error}
        </MainLayout>;
    }

    return <MainLayout mainRef={mainRef}>
        <Section className={style.headWrapper}>
            <div className={style.head}>
                {channelData?.banner === true && <img className={style.banner} src={`/api/image/banner/${id}`} />}

                <div className={style.info}>
                    <img className={style.image} src={(channelData?.icon === true) ? `/api/image/user/${id}` : noProfile} />
                    
                    <div className={style.texts}>
                        <span className={style.title}>{channelData?.name}</span>
                        <span className={style.sub}>구독자 {(channelData !== null) ? channelData.follower : "--"}명</span>
                    </div>

                    <SubscribeButton channel={id || ""} onChanged={subscribeChanged} active={channelData?.subscribe === true} />
                    {/* <Button className={style.subscribe} icon={loveSvg}>구독</Button> */}
                    {/* <Button className={[style.subscribe, style.active].join(" ")} icon={loveSvg}>구독취소</Button> */}
                </div>

                <Section className={style.menus}>
                    <Button className={menu ? '' : style.active} onClick={() => redirection('')}>홈</Button>
                    <Button className={menu === "video" ? style.active : ''} onClick={() => redirection('video')}>동영상</Button>
                    <Button className={menu === "info" ? style.active : ''} onClick={() => redirection('info')}>정보</Button>
                </Section>
            </div>
        </Section>

        <main className={style.contentWrapper}>
            {pages[menu || "home"]}
        </main>
    </MainLayout>
}

function Home() {
    return <div>Hello Home!</div>;
}

const VIDEO_AMOUNT_MAX = 20;
function VideoAll({ channel, mainRef }: { channel: string | undefined, mainRef: any }) {
    const [videos, setVideos] = useState<videoDataType[]>([]);
    const [isScroll, setIsScroll] = useState(false);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [sort, setSort] = useState(0);

    const onResize = function() {
        setIsScroll(mainRef.current.scrollHeight > window.innerHeight);
    }

    const onScroll = function(e: Event) {
        if (!isScroll || loading || page === -1) return; // 스크롤이 없거나, 로딩중이거나, 이미 다 불러온 상태

        const scrollBottom = mainRef.current.scrollTop + window.innerHeight >= mainRef.current.scrollHeight;
        if (scrollBottom) // 스크롤 맨 마지막
            loadVideos();
    }

    const loadVideos = async function() {
        console.log("call loadVideos");
        setLoading(true);
        const { code, data } = await request(`/api/video/user/${channel}?page=${page}&sort=${sort}`);
        
        if (code !== 200) return;

        const list = data as videoDataType[];
        
        setPage(list.length >= VIDEO_AMOUNT_MAX ? page + 1 : -1);
        setVideos([...videos, ...list]);
        setLoading(false);
    }

    const changeSort = function(mode: number) {
        setVideos([]);
        setLoading(false);
        setPage(0);
        setSort(mode);
    }

    useEffect(() => {
        window.addEventListener("resize", onResize);
        mainRef.current.addEventListener("scroll", onScroll);

        // init
        onResize();


        // 스크롤은 없지만 화면이 다 꽉 채워져 있지 않음 (로딩 X, 페이지 끝 X)
        if (!isScroll && !loading && page !== -1 && mainRef.current.scrollHeight < window.innerHeight) {
            loadVideos();
        }

        return () => {
            window.removeEventListener("resize", onResize);
            
            if (mainRef.current)
                mainRef.current.removeEventListener("scroll", onScroll);
        }
    }, [isScroll, loading, videos, page]);

    return <Section className={style.content}>
        <div className={style.category}>
            <Button className={sort === 0 ? style.active : ''} onClick={() => changeSort(0)}>최신순</Button>
            <Button className={sort === 1 ? style.active : ''} onClick={() => changeSort(1)}>인기순</Button>
            <Button className={sort === 2 ? style.active : ''} onClick={() => changeSort(2)}>날짜순</Button>
        </div>

        <Section className={style.videos}>
            {videos.map(v => <VideoBox video={v} channelHide={true} className={[style.video]} key={v.id} />)}
        </Section>

        {loading && <Spinner className={style.loading} />}
    </Section>;
}

export function SubscribeButton({ className, active, channel, onChanged }: {className?: string[], active: boolean, channel: string, onChanged: (active: boolean) => void}) {
    const classList = className || [];
    classList.push(style.subscribe);
    
    if (active)
        classList.push(style.active);

    const clickBtn = function() {
        request("/api/user/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ targetId: channel, active: !active }) });
        onChanged(!active);
    }

    return <Button className={classList.join(" ")} onClick={clickBtn} icon={loveSvg}>구독{active ? "취소" : ""}</Button>;
                    {/* <Button className={[style.subscribe, style.active].join(" ")} icon={loveSvg}>구독취소</Button> */}
}