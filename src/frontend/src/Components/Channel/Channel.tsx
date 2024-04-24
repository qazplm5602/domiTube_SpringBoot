import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Section from "../Recycle/Section";

import style from './channel.module.css';
import Button from "../Recycle/Button";

import loveSvg from './love.svg';
import noProfile from '../../assets/no-profile.png';

import VideoBox from "../Recycle/VideoBox";
import { useEffect, useState } from "react";
import { request } from "../Utils/Fetch";


const pages: {[key: string]: JSX.Element} = {
    home: <Home />,
    video: <VideoAll />
}

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

    const [error, setError] = useState<string | boolean>(false);
    const [channelData, setChannelData] = useState<channelMain | null>(null);

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

    useEffect(() => {
        getChannelData();
    }, [id]);

    if (typeof error !== "boolean") {
        return <MainLayout>
            error: {error}
        </MainLayout>;
    }

    return <MainLayout>
        <Section className={style.headWrapper}>
            <div className={style.head}>
                {channelData?.banner === true && <img className={style.banner} src={`/api/image/banner/${id}`} />}

                <div className={style.info}>
                    <img className={style.image} src={(channelData?.icon === true) ? `/api/image/user/${id}` : noProfile} />
                    
                    <div className={style.texts}>
                        <span className={style.title}>{channelData?.name}</span>
                        <span className={style.sub}>구독자 {(channelData !== null) ? channelData.follower : "--"}명</span>
                    </div>

                    <SubscribeButton active={channelData?.subscribe === true} />
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

function VideoAll() {
    return <Section className={style.content}>
        <div className={style.category}>
            <Button className={style.active}>최신순</Button>
            <Button>인기순</Button>
            <Button>날짜순</Button>
        </div>

        <Section className={style.videos}>
            <VideoBox className={[style.video]} />
            <VideoBox className={[style.video]} />
            <VideoBox className={[style.video]} />
            <VideoBox className={[style.video]} />
            <VideoBox className={[style.video]} />
            <VideoBox className={[style.video]} />
            <VideoBox className={[style.video]} />
        </Section>
    </Section>;
}

export function SubscribeButton({ className, active, onClick }: {className?: string[], active: boolean, onClick?: React.MouseEventHandler}) {
    const classList = className || [];
    classList.push(style.subscribe);
    
    if (active)
        classList.push(style.active);

    return <Button className={classList.join(" ")} onClick={onClick} icon={loveSvg}>구독{active ? "취소" : ""}</Button>;
                    {/* <Button className={[style.subscribe, style.active].join(" ")} icon={loveSvg}>구독취소</Button> */}
}