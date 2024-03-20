import MainLayout from "../Layout/MainLayout";
import VideoBox from "../Recycle/VideoBox";
import style from './home.module.css';

export default function Home() {
    return <MainLayout className={style.content}>
        <h1 className={style.videoTitle}>모든 동영상</h1>

        <section className={style.list}>
            <VideoBox />
        </section>
    </MainLayout>;
}