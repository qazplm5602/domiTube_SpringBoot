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
    return <Section className={[style.box_container, style.recommand].join(" ")}>
        <h2>영상 분석</h2>
        
        <LineElement text="최근 업로드" />
        <LineElement text="인기 영상" />
        <LineElement text="좋아요가 많은 영상" />
        <div className={style.category}></div>
    </Section>;
}

function LineElement({text}: {text: string}) {
    return <div className={style.line}>
        <span>{text}</span>
        <div></div>
    </div>
}

function VideoBox() {
    return <div>

    </div>;
}