import { useParams } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Section from "../Recycle/Section";
import style from "./watch.module.css";
import ReactPlayer from "react-player";

export default function Watch() {
    const { id } = useParams();

    return <MainLayout className={style.main} sideDisable={true}>
        <Section className={style.video_container}>
            {/* <video> */}
            <VideoPlayer />

            <div className={style.title}>제목인뎅_밍글링</div>
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
            <div className={style.bottom}>
                
            </div>
        </div>
    </Section>;
}