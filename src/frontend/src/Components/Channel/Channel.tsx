import { useParams } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Section from "../Recycle/Section";

import style from './channel.module.css';
import Button from "../Recycle/Button";

const pages: {[key: string]: () => React.ReactNode} = {
    home: Home,
    video: VideoAll
}

export default function Channel() {
    const { id, menu } = useParams();

    return <MainLayout>
        <Section className={style.headWrapper}>
            <div className={style.head}>
                <div>
                    
                </div>

                <Section className={style.menus}>
                    <Button>홈</Button>
                    <Button>동영상</Button>
                    <Button>커뮤니티</Button>
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