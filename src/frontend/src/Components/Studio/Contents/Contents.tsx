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

import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { videoDataType } from '../../Watch/Watch';
import { useSelector } from 'react-redux';
import IStore from '../../Redux/Type';
import { request, response } from '../../Utils/Fetch';
import { numberWithCommas, secondsToHMS } from '../../Utils/Misc';

export interface StudioVideoType extends videoDataType {
    secret: number,
    comment: number
}

const MAX_CONTENT = 20;
const FILE_SLICE = 1024 * 1024 * 5; // 파일 분할 한조각

export default function StudioContents() {
    const [page, setPage] = useState(0);
    const [maxpage, setMaxpage] = useState(0);
    const [list, setList] = useState<StudioVideoType[]>([]);
    const [checks, setChecks] = useState<Set<string>>(new Set());
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

    const isAllChecked = useMemo<boolean>(() => list.every(v => checks.has(v.id)), [list, checks]);

    const setCheck = function(video_id: string) {
        if (checks.has(video_id)) {
            checks.delete(video_id);
        } else {
            checks.add(video_id);
        }

        setChecks(new Set([...checks]));
    }
    const setAllCheck = function() {
        let videoIds: string[] = [];

        if (!isAllChecked)
           videoIds = list.map(v => v.id);

        setChecks(new Set(videoIds));
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

        <TableHeader check={isAllChecked} onCheck={setAllCheck} />

        {/* Table Content */}
        <Section className={style.table_content}>
            {list.map(value => <TableBox key={value.id} value={value} check={checks.has(value.id)} onCheck={() => setCheck(value.id)} />)}
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

function TableHeader({check, onCheck}: { check: boolean, onCheck: () => void }) {
    return <Section className={style.table_header}>
        <div>
            <input type="checkbox" checked={check} onChange={onCheck} />
        </div>
        <div>동영상</div>
        <div>공개 상태</div>
        <div>날짜</div>
        <div>조회수</div>
        <div>댓글</div>
        <div>좋아요</div>
    </Section>;
}

function TableBox({ value, check, onCheck }: {value: StudioVideoType, check: boolean, onCheck: (check: boolean) => void}) {
    const navigate = useNavigate();
    const createDate = new Date(value.create);
    const dateFormat = `${createDate.getFullYear()}.${(createDate.getMonth() + 1).toString().padStart(2, '0')}.${createDate.getDate().toString().padStart(2, '0')}`;
    const goodPercent = value.good === 0 ? 0 : Math.max(Math.floor(((value.good - value.bad) / value.good) * 100), 0);
    const redirection = () => navigate(`./${value.id}`);

    return <Section  className={style.box}>
        <div className={style.check}>
            <input type="checkbox" onChange={() => onCheck(!check)} checked={check} />
        </div>
        <div className={style.video} onClick={redirection}>
            <div className={style.thumbnail}>
                <img src={`/api/image/thumbnail/${value.id}`} />
                <span>{secondsToHMS(value.time)}</span>
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

export enum PageEvent {
    Min, Next, Prev, Max
}

export function PageControl({ className, page, max, event }: { className?: string, page: number, max: number, event: (type: PageEvent) => void }) {
    const classList = [style.page];
    if (className)
        classList.push(className);
    
    return <Section className={classList.join(' ')}> 
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
type resultType = { result: boolean, data: string };

function DialogBox({ onClose }: { onClose: () => void }) {
    const [progress, setProgress] = useState(-1);
    const [screen, setSceen] = useState<dialogScreen>(dialogScreen.upload);
    const [videoId, setVideoId] = useState("");
    const [fileName, setFileName] = useState("");
    const closeWait = useRef(false);

    const closeBtn = function() {
        if (Math.round(progress) < 100 && progress !== -1) return;
        onClose();
    }
    
    const applyClose = function() { // 닫기 예약
        if (Math.round(progress) >= 100) closeBtn();
        closeWait.current = true;
    }

    const uploadVideo = async function(file: File) {
        if (file.type !== "video/mp4" || progress >= 0) return; // 영상만 지원함니다.
        
        setProgress(0);

        const { code, data }: { code: number, data: resultType } = await request("/api/studio/content/create", { method: "PUT", body: file.size.toString(), headers: { "Content-Type": "application/json" } });
        if (code !== 200) return;

        setSceen(dialogScreen.detail);
        setVideoId(data.data);
        setFileName(file.name);
        
        const maxIndex = Math.ceil(file.size / FILE_SLICE);
        const buffer = await file.arrayBuffer();
        let waitPromise: Promise<response>[] = [];
        for (let i = 0; i < maxIndex; i++) {
            const startIdx = i * FILE_SLICE;
            const content = buffer.slice(startIdx, Math.min(startIdx + FILE_SLICE, file.size));
            const form = new FormData();
            
            form.append("num", i.toString());
            form.append("video", data.data);
            form.append("file", new Blob([content]));

            const requestSuccess = function({ code, data }: { code: number, data: resultType }) {
                if (code !== 200 || !data.result) return;
                setProgress((value) => value + (1 / maxIndex) * 100);
            }
            
            const waitHandler = request("/api/studio/content/create/upload", { method: "POST", body: form });
            waitHandler.then(requestSuccess);
            waitPromise.push(waitHandler);
            
            console.log(waitPromise.length);
            if (waitPromise.length >= 5) {
                await Promise.all(waitPromise);
                // 기다리고..
                // waitPromise.slice(0, waitPromise.length); // 클리어
                waitPromise = [];
            }
        }
    }

    // 자동으로 닫기
    useEffect(() => {
        if (Math.round(progress) >= 100 && closeWait.current)
            closeBtn();
    }, [progress]);

    return <div className={style.dialog}>
        <div className={style.box}>
            <Section className={style.header}>
                <h2>동영상 업로드</h2>
                <Button onClick={closeBtn} className={style.close} icon={closeSvg} />
            </Section>

            {progress >= 0 && <div style={{ width: `${progress}%` }} className={style.bar}>
                <span>{Math.round(progress)}%</span>
            </div>}

            {screen === dialogScreen.upload && <UploadContent onUpload={uploadVideo} />}
            {screen === dialogScreen.detail && <UploadDetail video={videoId} fileName={fileName} onClose={applyClose} progress={progress} />}
        </div>
    </div>;
}

function UploadContent({ onUpload }: { onUpload: (file: File) => void }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
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

    const inputOpen = function() {
        fileInputRef.current?.click();
    }

    const inputChange: React.ChangeEventHandler<HTMLInputElement>  = function(e) {
        const files = e.target.files;
        if (files === null || files.length === 0) return;
        
        onUpload(files[0]);
    }

    return <main style={dragged ? {backgroundColor: 'rgb(56, 71, 51)'} : {}} onDragEnter={dragEnter} onDragOver={dragOver} onDragLeave={dragLeave} onDrop={dragDrop} className={style.upload}>
        <img className={style.icon} src={videoSvg} />
        <div className={style.title}>여기로 끌어서 놓으세요! {dragged}</div>
        <input ref={fileInputRef} onChange={inputChange} style={{display: "none"}} type="file" />
        <Button className={style.fileSelect} onClick={inputOpen}>파일 선택하기</Button>
    </main>;
}

function UploadDetail({ video, fileName, progress, onClose }: {video: string, fileName: string, progress: number, onClose: () => void }) {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [secret, setSecret] = useState("0");
    const [disableSave, setDisableSave] = useState(false);
    const imageFileRef = useRef<File | null>(null);
    const imageInputReset = useRef<(url?: string) => void>();

    const saveVideoInfo = function() {
        if (title.length === 0) return;

        const form = new FormData();
        form.append("title", title);
        if (desc !== "")
            form.append("desc", desc);

        form.append("secret", secret);

        if (imageFileRef.current)
            form.append("thumbnail", imageFileRef.current);

        setDisableSave(true);

        request(`/api/studio/content/edit/${video}`, { method: "POST", body: form }).then(({code, data}) => {
            if (code !== 200) return;
            onClose();
        });
    }

    useEffect(() => {
        if (Math.round(progress) === 100 && imageInputReset.current)
            imageInputReset.current(`/api/image/thumbnail/${video}`);
    }, [progress]);

    return <main className={style.upload_detail}>
        <Section className={style.property}>
            <UploadInputBorder title="제목">
                <input value={title} onChange={e => setTitle(e.target.value)} type="text" />
            </UploadInputBorder>

            <UploadInputBorder title="설명" className={[style.description]}>
                <textarea value={desc} onChange={e => setDesc(e.target.value)}>밍</textarea>
            </UploadInputBorder>

            <div className={style.title}>썸네일</div>
            <ImageUploadBox onChangeFile={e => imageFileRef.current = e} setPreview={imageInputReset} />

            <div className={style.title}>공개 옵션</div>
            <select className={style.secret} onChange={e => setSecret(e.target.value)} value={secret}>
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
            <Link to={`/watch/${video}`} className={style.mainT}>domitube.com/watch/{video}</Link>
            
            <div className={style.subT}>파일 이름</div>
            <div className={style.mainT}>{fileName}</div>
        </Section>
        
        <Button className={style.save} onClick={saveVideoInfo} disabled={disableSave}>저장</Button>
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

export function ImageUploadBox({ defaultImg, onChangeFile, setPreview }: {defaultImg?: string, onChangeFile?: (file: File) => void, setPreview?: React.MutableRefObject<((url?: string) => void) | undefined>}) {
    const inputRef = useRef<HTMLInputElement>(null);

    const [image, setImage] = useState<string | null>(defaultImg || null);
    const [dragged, setDragged] = useState(false);

    const imageUpload = function(file: File) {
        const reader = new FileReader();
        reader.onload = function() {
            setImage(reader.result as string);
        }        
        reader.readAsDataURL(file);

        if (onChangeFile)
            onChangeFile(file);
    }
    
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
        imageUpload(file);
    }

    const inputChanged = function(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files === null) return;
        imageUpload(e.target.files[0]);
    }

    if (setPreview)
        setPreview.current = function(url?: string) {
            setImage(url || defaultImg || "");
        }

    return <Section className={style.thumbnail_section}>
        <div className={style.upload} onClick={() => inputRef.current?.click()} onDragEnter={dragEnter} onDragOver={dragOver} onDragLeave={dragLeave} onDrop={dragDrop}>
            <img src={pictureSvg} />
            <div>업로드하려면 끌어다놓거나 클릭하세요.</div>
            <input ref={inputRef} onChange={inputChanged} style={{display: "none"}} type="file" accept="image/png, image/jpeg" />
        </div>

        {image && <img className={style.preview} src={image} />}
    </Section>;
}