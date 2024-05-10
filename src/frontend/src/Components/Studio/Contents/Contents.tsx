import Section from '../../Recycle/Section';
import style from './contents.module.css';

import filterSvg from './filter.svg';
import cancelSvg from './cancel.svg';
import clipSvg from './clip.svg';

export default function StudioContents() {
    return <main>
        <h2 className={style.title}>동영상 목록</h2>

        <Filter />

        <TableHeader />

        {/* Table Content */}
        <Section className={style.table_content}>
            <TableBox />
            <TableBox />
        </Section>
    </main>;
}

function Filter() {
    return <div className={style.filter}>
        <div className={style.title}><img src={filterSvg} />필터</div>

        <Section className={style.list}>
            <div className={style.box}>조회수가 1억명 이상<img src={cancelSvg} /></div>
        </Section>
    </div>
}

function TableHeader() {
    return <Section className={style.table_header}>
        <div>
            <input type="checkbox" />
        </div>
        <div>동영상</div>
        <div>공개 상태</div>
        <div>날짜</div>
        <div>조회수</div>
        <div>댓글</div>
        <div>좋아요</div>
    </Section>;
}

function TableBox() {
    return <Section className={style.box}>
        <div className={style.check}>
            <input type="checkbox" />
        </div>
        <div className={style.video}>
            <div className={style.thumbnail}>
                <img src="https://i.ytimg.com/vi/T9dJ_cE5Asw/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLB4VYvk8T391uvCZgEfFg62tuAVDQ" />
                <span>59:12</span>
            </div>
            
            <div className={style.detail}>
                <div className={style.title}>아무 제목임니다.</div>
                <div className={style.desc}>으악 밍밍밍밍</div>
            </div>
        </div>
        <div className={style.secret}>
            <img src={clipSvg} />
            비공개
        </div>
        <div className={style.date}>2024.05.11</div>
        <div className={style.view}>999,999,999</div>
        <div className={style.comment}>5</div>
        <div className={style.good}>
            <div className={style.text}>100%</div>
            <div className={style.sub}>좋아요 5개</div>
            <div className={style.bar}>
                <div className={style.barIn}></div>
            </div>
        </div>
    </Section>;
}