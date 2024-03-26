import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Section from "../Recycle/Section";

import style from './channel.module.css';
import Button from "../Recycle/Button";

import loveSvg from './love.svg';
import VideoBox from "../Recycle/VideoBox";

const pages: {[key: string]: () => React.ReactNode} = {
    home: Home,
    video: VideoAll
}

export default function Channel() {
    const { id, menu } = useParams();
    const navigate = useNavigate();

    const redirection = function(path: string) {
        navigate(`/channel/${id}/${path}`);
    }

    return <MainLayout>
        <Section className={style.headWrapper}>
            <div className={style.head}>
                <img className={style.banner} src="https://yt3.googleusercontent.com/hBenzrqZBR7IB6c8JFhD1Vj4l3gPSjFYr05Ijm46-kZQjpbdI6l8HYhm5p15PLQX9IrTzjORIQ=w2560-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj" />

                <div className={style.info}>
                    <img className={style.image} src="https://nng-phinf.pstatic.net/MjAyMjA2MTdfNzcg/MDAxNjU1NDYwOTk4MzIx.2GtboKl1AANbxW8mwf7_-3rl1joA5z70GdLSuhVzWssg.ubvmA6JPVkX2fRl0DLLBKY9eBbL2Gh3cN03_MMAwnuAg.PNG/1.png?type=f120_120_na" />
                    
                    <div className={style.texts}>
                        <span className={style.title}>도미임</span>
                        <span className={style.sub}>구독자 50만명</span>
                    </div>

                    <SubscribeButton active={false} />
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
            {pages[menu || "home"]()}
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

export function SubscribeButton({ className, active }: {className?: string[], active: boolean}) {
    const classList = className || [];
    classList.push(style.subscribe);
    
    if (active)
        classList.push(style.active);

    return <Button className={classList.join(" ")} icon={loveSvg}>구독{active ? "취소" : ""}</Button>;
                    {/* <Button className={[style.subscribe, style.active].join(" ")} icon={loveSvg}>구독취소</Button> */}
}