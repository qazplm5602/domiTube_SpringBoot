import Button from '../../Recycle/Button';
import Section from '../../Recycle/Section';
import style from './home.module.css';

export default function StudioHome() {
    return <main>
        <h2 className={style.title}>안녕하세요, <span>도미</span>님</h2>

        <ChannelStatus />

        <Section className={style.box_container}>
    
        </Section>
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