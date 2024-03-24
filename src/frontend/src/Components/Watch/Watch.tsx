import { useParams } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Section from "../Recycle/Section";
import style from "./watch.module.css";

export default function Watch() {
    const { id } = useParams();

    return <MainLayout className={style.main} sideDisable={true}>
        <Section className={style.video_container}>
            {/* <video> */}

            <div className={style.title}>제목인뎅_밍글링</div>
        </Section>
        
        <Section className={style.recommand_container}>
            밍
        </Section>
    </MainLayout>;
}