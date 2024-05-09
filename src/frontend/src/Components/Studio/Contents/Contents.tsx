import Section from '../../Recycle/Section';
import style from './contents.module.css';

import filterSvg from './filter.svg';
import cancelSvg from './cancel.svg';

export default function StudioContents() {
    return <main>
        <h2 className={style.title}>동영상 목록</h2>

        <Filter />
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