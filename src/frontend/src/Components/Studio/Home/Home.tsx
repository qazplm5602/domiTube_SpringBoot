import { Link } from 'react-router-dom';
import Button from '../../Recycle/Button';
import Section from '../../Recycle/Section';
import style from './home.module.css';

export default function StudioHome() {
    return <main>
        <h2 className={style.title}>안녕하세요, <span>도미</span>님</h2>

        <ChannelStatus />

        <RecommandVideo />
    </main>;
}

function ChannelStatus() {
    return <Section className={[style.box_container, style.channel].join(" ")}>
        <h2>채널 상태</h2>
        
        <Section title="구독자 집계" titleClass={style.box_title} className={style.subscribe}>
            <div>
                <span className={style.count}>5,859,638</span>
                <span className={style.count_sub}>명</span>
            </div>
            
            <Button className={style.show_btn}>모두 보기</Button>
        </Section>

        <Section title="시청자 집계" titleClass={style.box_title} className={style.subscribe}>
            <div>
                <span className={style.count}>8,999,999,999</span>
                <span className={style.count_sub}>명</span>
            </div>
        </Section>
    </Section>;
}

function RecommandVideo() {
    return <Section className={[style.box_container, style.recommand_video].join(" ")}>
        <h2>영상 분석</h2>
        
        <LineElement text="최근 업로드" style={{ marginTop: 0 }} />
        <VideoBox />

        <LineElement text="인기 영상" />
        <VideoBox />

        <LineElement text="좋아요가 많은 영상" />
        <VideoBox />

        <Link to="/studio/contents">
            <Button className={style.redirect}>콘텐츠로 이동</Button>
        </Link>
    </Section>;
}

function LineElement({text, style: _style}: {text: string, style?: React.CSSProperties}) {
    return <div style={_style} className={style.line}>
        <span>{text}</span>
        <div></div>
    </div>
}

function VideoBox() {
    return <div className={style.video_box}>
        <div className={style.thumbnail_container}>
            <img src="https://i.ytimg.com/vi/ptKDIAXYoE8/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCW4NGQ4w8xCuAujh_yEYnvn9TLxw" />
        </div>

        <div className={style.info}>
            <div className={style.title}>치비치비 자바자바 JS JS</div>
            <div className={style.sub}>조회수 1.5만회 • 2024.05.09</div>
        </div>
    </div>;
}