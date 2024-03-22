import { useParams } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Section from "../Recycle/Section";

import style from './channel.module.css';
import Button from "../Recycle/Button";

import loveSvg from './love.svg';

const pages: {[key: string]: () => React.ReactNode} = {
    home: Home,
    video: VideoAll
}

export default function Channel() {
    const { id, menu } = useParams();

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

                    <Button className={style.subscribe} icon={loveSvg}>구독</Button>
                    {/* <Button className={[style.subscribe, style.active].join(" ")} icon={loveSvg}>구독취소</Button> */}
                </div>

                <Section className={style.menus}>
                    <Button className={style.active}>홈</Button>
                    <Button>동영상</Button>
                    <Button>정보</Button>
                </Section>
            </div>
        </Section>

        {pages[menu || "home"]()}
    </MainLayout>
}

function Home() {
    return <div>Hello Home!</div>;
}

function VideoAll() {
    return <div>Hello Domi!</div>;
}