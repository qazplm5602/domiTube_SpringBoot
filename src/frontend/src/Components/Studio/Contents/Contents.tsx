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
import publicSvg from './public.svg';
import privateSvg from './private.svg';

import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { videoDataType } from '../../Watch/Watch';
import { useSelector } from 'react-redux';
import IStore from '../../Redux/Type';
import { request } from '../../Utils/Fetch';
import { numberWithCommas } from '../../Utils/Misc';

interface StudioVideoType extends videoDataType {
    secret: number,
    comment: number
}

const MAX_CONTENT = 20;

export default function StudioContents() {
    const [page, setPage] = useState(0);
    const [maxpage, setMaxpage] = useState(0);
    const [list, setList] = useState<StudioVideoType[]>([]);
    const logined = useSelector<IStore, boolean>(value => value.login.logined);

    const [uploadDialog, setUploadDialog] = useState(false);
    
    const loadContents = async function() {
        setList([]);

        const { code, data } = await request(`/api/studio/content/list?page=${page}`);
        if (code !== 200) return;

        setList(data);
    }
    const pageChanged = function(type: PageEvent) {
        switch (type) {
            case PageEvent.Min:
                setPage(0);
                break;
            case PageEvent.Next:
                setPage(page + 1);
                break;
            case PageEvent.Prev:
                setPage(page - 1);
                break;
            case PageEvent.Max:
                setPage(maxpage - 1);
                break;
            default:
                break;
        }
    }

    const onCloseDialog = function() {
        setUploadDialog(false);
    }

    useEffect(() => {
        if (logined === true) {
            loadContents();
        }
    }, [logined, page]);

    useEffect(() => {
        if (logined === true) {
            request(`/api/studio/content/list/size`).then(({ code, data }) => {
                if (code !== 200) return;
                setMaxpage(Math.ceil(data / MAX_CONTENT));
            });
        }
    }, [logined]);

    return <main>
        <div className={style.header}>
            <h2 className={style.title}>동영상 목록</h2>
            <Button icon={videoSvg} className={style.createBtn} onClick={() => setUploadDialog(true)}>만들기</Button>
        </div>

        <Filter />

        <TableHeader />

        {/* Table Content */}
        <Section className={style.table_content}>
            {list.map(value => <TableBox key={value.id} value={value} />)}
        </Section>

        <PageControl page={page + 1} max={maxpage} event={pageChanged} />

        {uploadDialog && <DialogBox onClose={onCloseDialog} />}
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

function TableBox({ value }: {value: StudioVideoType}) {
    const createDate = new Date(value.create);
    const dateFormat = `${createDate.getFullYear()}.${(createDate.getMonth() + 1).toString().padStart(2, '0')}.${createDate.getDate().toString().padStart(2, '0')}`;
    const goodPercent = value.good === 0 ? 0 : Math.max(Math.floor(((value.good - value.bad) / value.good) * 100), 0);

    return <Section className={style.box}>
        <div className={style.check}>
            <input type="checkbox" />
        </div>
        <div className={style.video}>
            <div className={style.thumbnail}>
                <img src={`/api/image/thumbnail/${value.id}`} />
                <span>59:12</span>
            </div>
            
            <div className={style.detail}>
                <div className={style.title}>{value.title}</div>
                <div className={style.desc}>{value.description}</div>
            </div>
        </div>
        <div className={style.secret}>
            {SecretBox(value.secret)}
        </div>
        <div className={style.date}>{dateFormat}</div>
        <div className={style.view}>{numberWithCommas(value.views)}</div>
        <div className={style.comment}>{numberWithCommas(value.comment)}</div>
        <div className={style.good}>
            <div className={style.text}>{goodPercent}%</div>
            <div className={style.sub}>좋아요 {numberWithCommas(value.good)}개</div>
            <div className={style.bar}>
                <div className={style.barIn} style={{width: `${goodPercent}%`}}></div>
            </div>
        </div>
    </Section>;
}

enum PageEvent {
    Min, Next, Prev, Max
}

function PageControl({ page, max, event }: { page: number, max: number, event: (type: PageEvent) => void }) {
    return <Section className={style.page}> 
        <Button onClick={() => event(PageEvent.Min)} disabled={page <= 1} icon={arrowMaxSvg} />
        <Button onClick={() => event(PageEvent.Prev)} disabled={page <= 1} icon={arrowSvg} />

        <div className={style.text}><span>{page}</span>/{max}</div>

        <Button onClick={() => event(PageEvent.Next)} disabled={page >= max} className={style.flip} icon={arrowSvg} />
        <Button onClick={() => event(PageEvent.Max)} disabled={page >= max} className={style.flip} icon={arrowMaxSvg} />
    </Section>
}

function SecretBox(secret: number) {
    let icon = "";
    let text = "";
    
    switch (secret) {
        case 0:
            icon = publicSvg;
            text = "";
            break;

        case 1:
            icon = clipSvg;
            text = "일부"
            break;

        case 2:
            icon = privateSvg;
            text = "비"
            break;
        default:
            text = "unknown "
            break;
    }

    return <><img src={icon} />{text}공개</>;
}


/////// dialog
enum dialogScreen { upload, detail }

function DialogBox({ onClose }: { onClose: () => void }) {
    const [progress, setProgress] = useState(-1);
    const [screen, setSceen] = useState<dialogScreen>(dialogScreen.upload);

    const closeBtn = function() {
        onClose();
    }

    const uploadVideo = async function(file: File) {
        const buffer = await file.arrayBuffer();
        
    }

    return <div className={style.dialog}>
        <div className={style.box}>
            <Section className={style.header}>
                <h2>동영상 업로드</h2>
                <Button onClick={closeBtn} className={style.close} icon={closeSvg} />
            </Section>

            {progress >= 0 && <div className={style.bar}>
                <span>{progress}%</span>
            </div>}

            {screen === dialogScreen.upload && <UploadContent onUpload={uploadVideo} />}
            {screen === dialogScreen.detail && <UploadDetail />}
        </div>
    </div>;
}

function UploadContent({ onUpload }: { onUpload: (file: File) => void }) {
    const [dragged, setDragged] = useState(false);
    
    const dragEnter = function(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();

        setDragged(true);
    }

    const dragOver = function(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        
        if (e.dataTransfer.files) setDragged(true);
    }

    const dragLeave = function(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();

        setDragged(false);
    }

    const dragDrop = function(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        
        setDragged(false);
        
        const file = e.dataTransfer.files[0];
        onUpload(file);
    }

    const inputChange: React.ChangeEventHandler<HTMLInputElement>  = function(e) {
        const files = e.target.files;
        if (files === null || files.length === 0) return;
        
        onUpload(files[0]);
    }

    return <main style={dragged ? {backgroundColor: 'rgb(56, 71, 51)'} : {}} onDragEnter={dragEnter} onDragOver={dragOver} onDragLeave={dragLeave} onDrop={dragDrop} className={style.upload}>
        <img className={style.icon} src={videoSvg} />
        <div className={style.title}>여기로 끌어서 놓으세요! {dragged}</div>
        <input onChange={inputChange} style={{display: "none"}} type="file" />
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
            <ImageUploadBox />

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

export function ImageUploadBox() {
    return <Section className={style.thumbnail_section}>
        <div className={style.upload}>
            <img src={pictureSvg} />
            <div>업로드하려면 끌어다놓거나 클릭하세요.</div>
        </div>

        <img className={style.preview} src="https://i.ytimg.com/vi/T9dJ_cE5Asw/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLB4VYvk8T391uvCZgEfFg62tuAVDQ" />
    </Section>;
}