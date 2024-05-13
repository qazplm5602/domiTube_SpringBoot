import { Link, useParams } from 'react-router-dom';
import style from './video.module.css';
import Section from '../../Recycle/Section';
import Button from '../../Recycle/Button';
import { ImageUploadBox } from '../Contents/Contents';

export default function StudioVideo() {
    const { videoId } = useParams();

    return <main className={style.main}>
        <Section className={style.content}>
            
            <VideoSetting />

        </Section>

        <Section className={style.video}>
            <div className={style.videoBox}>
                <img className={style.player} src="https://i.ytimg.com/vi/T9dJ_cE5Asw/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLB4VYvk8T391uvCZgEfFg62tuAVDQ" />
                
                <div className={style.subT}>동영상 링크</div>
                <Link to="/watch/DOMI1" className={style.text}>https://domi.kr/watch/DOMI1</Link>

                <div className={style.subT}>파일 이름</div>
                <div className={style.text}>doming.mp4</div>
            </div>
        </Section>
    </main>;
}

function VideoSetting() {
    return <Section className={[style.box, style.videoSetting].join(" ")}>
        <Section className={style.header}>
            <h2>동영상 세부정보</h2>
            <p>
                <Button className={style.revert}>되돌리기</Button>
                <Button className={style.save}>저장</Button>
            </p>
        </Section>

        <div className={style.title}>제목</div>
        <input className={style.input} type="text" />
        
        <div className={style.title}>설명</div>
        <textarea className={style.input}></textarea>

        <div className={style.title}>썸네일</div>
        <ImageUploadBox />
    </Section>
}