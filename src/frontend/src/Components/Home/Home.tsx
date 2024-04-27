import MainLayout from "../Layout/MainLayout";
import Section from "../Recycle/Section";
import VideoBox from "../Recycle/VideoBox";
import style from './home.module.css';

export default function Home() {
    return <MainLayout className={style.content}>
        <Section title="모든 동영상" titleClass={style.videoTitle} className={style.list}>
            {/* <VideoBox className={[style.box]} /> */}
            ming
        </Section>
    </MainLayout>;
}