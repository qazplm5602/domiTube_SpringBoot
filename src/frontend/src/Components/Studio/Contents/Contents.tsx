import style from './contents.module.css';

import Section from '../../Recycle/Section';
import Button from '../../Recycle/Button';

import filterSvg from './filter.svg';
import cancelSvg from './cancel.svg';
import clipSvg from './clip.svg';
import arrowSvg from './arrow.svg';
import arrowMaxSvg from './arrowMax.svg';
import videoSvg from './video.svg';
import closeSvg from './close.svg';
import pictureSvg from './picture.svg';
import { Link } from 'react-router-dom';

export default function StudioContents() {
    return <main>
        <div className={style.header}>
            <h2 className={style.title}>동영상 목록</h2>
            <Button icon={videoSvg} className={style.createBtn}>만들기</Button>
        </div>

        <Filter />

        <TableHeader />

        {/* Table Content */}
        <Section className={style.table_content}>
            <TableBox />
            <TableBox />
        </Section>

        <PageControl />

        {/* <DialogBox /> */}
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

function PageControl() {
    return <Section className={style.page}>
        <Button icon={arrowMaxSvg} />
        <Button icon={arrowSvg} />

        <div className={style.text}><span>1</span>/30</div>

        <Button className={style.flip} icon={arrowSvg} />
        <Button className={style.flip} icon={arrowMaxSvg} />
    </Section>
}


/////// dialog
function DialogBox() {
    return <div className={style.dialog}>
        <div className={style.box}>
            <Section className={style.header}>
                <h2>동영상 업로드</h2>
                <Button className={style.close} icon={closeSvg} />
            </Section>

            <div className={style.bar}>
                <span>50%</span>
            </div>

            {/* <UploadContent /> */}
            <UploadDetail />
        </div>
    </div>;
}

function UploadContent() {
    return <main className={style.upload}>
        <img className={style.icon} src={videoSvg} />
        <div className={style.title}>여기로 끌어서 놓으세요!</div>
        <Button className={style.fileSelect}>파일 선택하기</Button>
    </main>;
}

function UploadDetail() {
    return <main className={style.upload_detail}>
        <Section className={style.property}>
            <UploadInputBorder title="제목">
                <input type="text" />
            </UploadInputBorder>

            <UploadInputBorder title="설명" className={[style.description]}>
                <textarea>밍</textarea>
            </UploadInputBorder>

            <div className={style.title}>썸네일</div>
            <Section className={style.thumbnail_section}>
                <div className={style.upload}>
                    <img src={pictureSvg} />
                    <div>업로드하려면 끌어다놓거나 클릭하세요.</div>
                </div>

                <img className={style.preview} src="https://i.ytimg.com/vi/T9dJ_cE5Asw/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLB4VYvk8T391uvCZgEfFg62tuAVDQ" />
            </Section>

            <div className={style.title}>공개 옵션</div>
            <select className={style.secret}>
                <option value="0" selected>👁️ 공개</option>
                <option value="1">📎 일부공개</option>
                <option value="2">🔒 비공개</option>
            </select>
        </Section>
        
        <Section className={style.video}>
            <div className={style.thumbnail_container}>
                <div className={style.text}>동영상 업로드...</div>
            </div>
            
            <div className={style.subT}>제목</div>
            <Link to="/watch/domi" className={style.mainT}>domitube.com/watch/ming</Link>
            
            <div className={style.subT}>파일 이름</div>
            <div className={style.mainT}>doming.mp4</div>
        </Section>
        
        <Button className={style.save}>저장</Button>
    </main>;
}

function UploadInputBorder({title, children, className = []}: {title: string, children: React.ReactElement, className?: string[]}) {
    className.push(style.inputContainer);

    return <div className={className.join(" ")}>
        <span className={style.title}>{title}</span>
        {/* <input type="text" /> */}
        {children}
    </div>;
}