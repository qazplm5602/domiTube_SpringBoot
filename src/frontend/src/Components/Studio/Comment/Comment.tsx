import Section from '../../Recycle/Section';
import Button from '../../Recycle/Button';
import style from './comment.module.css';

import noProfile from '../../../assets/no-profile.png';
import goodSvg from '../../Watch/good.svg';

export default function StudioComment() {
    return <main>
        <h2 className={style.header_title}>댓글</h2>

        <Section className={style.sort}>
            <div className={[style.box, style.active].join(" ")}>최신순</div>
            <div className={style.box}>좋아요순</div>
            <div className={style.box}>날짜순</div>
        </Section>

        <Section className={style.comment_list}>
            <Comment />
        </Section>
    </main>;
}

function Comment() {
    return <Section className={style.comment}>
        <img className={style.icon} src={noProfile} />
        
        <Section className={style.detail}>
            <div className={style.name}>도밍 • 1년전</div>
            <div className={style.content}>아무 댓글 임니다.</div>
            
            <Section className={style.interaction}>
                <Button>답글</Button>
                <Button disabled={true}>답글 0개</Button>
                <Button className={style.icon} icon={goodSvg} />
                <Button className={[style.icon, style.reverse].join(" ")} icon={goodSvg} />
                <Button className={style.icon} icon={"삭제"} />
            </Section>
        </Section>

        <div className={style.thumbnail}>
            <img src="https://i.ytimg.com/vi/T9dJ_cE5Asw/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLB4VYvk8T391uvCZgEfFg62tuAVDQ" />
            <span>아무 영상.</span>
        </div>
    </Section>;
}