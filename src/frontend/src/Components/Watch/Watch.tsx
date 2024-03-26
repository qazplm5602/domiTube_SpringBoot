import { useParams } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Section from "../Recycle/Section";
import style from "./watch.module.css";
import ReactPlayer from "react-player";
import Button from "../Recycle/Button";
import { SubscribeButton } from "../Channel/Channel";

import playSvg from './play.svg';
import fullOffSvg from './fullscreen_off.svg';
import settingSvg from './setting.svg';
import shareSvg from './share.svg';

export default function Watch() {
    const { id } = useParams();

    return <MainLayout className={style.main} sideDisable={true}>
        <Section className={style.video_container}>
            {/* <video> */}
            <VideoPlayer />

            {/* 제목 / 채널 */}
            <TitleChannel />
        </Section>
        
        <Section className={style.recommand_container}>
            밍
        </Section>
    </MainLayout>;
}

function VideoPlayer() {
    return <Section className={style.video_player}>
        <ReactPlayer className={style.player} url="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4" />
        <div className={style.control_main}>
            <div className={style.top}></div>

            {/* 아래쪽 */}
            <div className={style.bottom}>

                {/* 바밤바. */}
                <div className={style.bar_container}>
                    <div className={style.bar} onClick={e => console.log(e.clientX)}>
                        <div className={style.load}></div>
                        <div className={style.in}></div>
                        <div className={style.inCircle}></div>
                    </div>
                </div>

                {/* 버튼들... */}
                <Section className={style.control_buttons}>
                    <div className={style.left}>
                        <PlayerBtn icon={playSvg} text="재생" />
                    </div>
                    <div className={style.right}>
                        <PlayerBtn icon={settingSvg} text="재생" />
                        <PlayerBtn icon={fullOffSvg} text="재생" />
                    </div>
                </Section>

            </div>
        </div>
    </Section>;
}

function PlayerBtn({icon, text}: {icon: string, text?: string}) {
    return <Button icon={icon} className={style.control_btn}>{text && <span>{text}</span>}</Button>
}

function TitleChannel() {
    return <Section title="제목인뎅_밍글링" titleClass={style.title} className={style.metadata}>
        <div className={style.channel}>
            <img src="https://nng-phinf.pstatic.net/MjAyMjA2MTdfNzcg/MDAxNjU1NDYwOTk4MzIx.2GtboKl1AANbxW8mwf7_-3rl1joA5z70GdLSuhVzWssg.ubvmA6JPVkX2fRl0DLLBKY9eBbL2Gh3cN03_MMAwnuAg.PNG/1.png?type=f120_120_na" />
            <div className={style.texts}>
                <span>도미인뎅</span>
                <span>구독자: 5조5억명</span>
            </div>

            <SubscribeButton className={[style.subscribe]} active={false} />
        </div>

        <div className={style.interactions}>
            <Button icon={shareSvg}>공유</Button>
        </div>
    </Section>
}