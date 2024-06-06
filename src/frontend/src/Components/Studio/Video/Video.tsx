import { Link, useParams } from 'react-router-dom';
import style from './video.module.css';
import Section from '../../Recycle/Section';
import Button from '../../Recycle/Button';
import { ImageUploadBox, PageControl, PageEvent, StudioVideoType } from '../Contents/Contents';
import { Comment } from '../Comment/Comment';

import { useEffect, useRef, useState } from 'react';
import { ChatSubReplyInput, CommentDataType } from '../../Watch/Watch';
import { request } from '../../Utils/Fetch';
import React from 'react';
import Spinner from '../../Recycle/Spinner';
import { useSelector } from 'react-redux';
import Istore from '../../Redux/Type';

export default function StudioVideo() {
    const { videoId } = useParams();
    const [error, setError] = useState("");

    if (videoId === undefined) return;

    if (error) {
        return <h3>error: {error}</h3>;
    }

    return <main className={style.main}>
        <Section className={style.content}>
            
            <VideoSetting videoId={videoId} setError={setError} />
            <VideoComment videoId={videoId} />

        </Section>

        <Section className={style.video}>
            <div className={style.videoBox}>
                <img className={style.player} src="https://i.ytimg.com/vi/T9dJ_cE5Asw/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLB4VYvk8T391uvCZgEfFg62tuAVDQ" />
                
                <div className={style.subT}>동영상 링크</div>
                <Link to={`/watch/${videoId}`} className={style.text}>https://domi.kr/watch/{videoId}</Link>

                {/* <div className={style.subT}>파일 이름</div>
                <div className={style.text}>doming.mp4</div> */}
            </div>
        </Section>
    </main>;
}

function VideoSetting({ videoId, setError }: {videoId: string, setError: React.Dispatch<React.SetStateAction<string>>}) {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [secret, setSecret] = useState("0");
    const [change, setChange] = useState(false);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const setPreview = useRef<(url?: string) => void>();
    const origin = useRef<StudioVideoType>({
        bad: 0,
        comment: 0,
        create: 0,
        channel: "",
        description: "",
        good: 0,
        id: "",
        secret: 0,
        time: 0,
        title: "",
        views: 0
    });

    const loadVideoInfo = async function() {
        const { code, data } = await request(`/api/video/${videoId}`);
        if (code !== 200) {
            if (typeof data !== "object") return;
            const response = data as { result: boolean, reason: string };
            setError(response.reason);
            return;
        }
        
        Object.assign(origin.current, data.data);
        
        if (origin.current) {
            const { title, description } = origin.current;
            setTitle(title);
            setDesc(description);
        }
    }

    const loadVideoSecretInfo = async function() {
        const { code, data } = await request(`/api/studio/content/secret/${videoId}`);
        if (code !== 200) return;
        
        setSecret(data);
        origin.current.secret = data;
    }

    const revertBtn = function() {
        if (setPreview.current)
            setPreview.current();

        setThumbnail(null);
        setTitle(origin.current.title);
        setDesc(origin.current.description);
        setSecret(origin.current.secret.toString());
    }

    const saveBtn = function() {
        const changes = getChangeField();
        const form = new FormData();
        
        if (changes.title)
            form.append("title", title);

        if (changes.desc)
            form.append("desc", desc);

        if (changes.secret)
            form.append("secret", secret);
        
        if (changes.thumbnail && thumbnail !== null)
            form.append("thumbnail", thumbnail);

        request(`/api/studio/content/edit/${videoId}`, { method: "POST", body: form });
        setChange(false);
        
        if (changes.title)
            origin.current.title = title;
        if (changes.desc)
            origin.current.description = desc;
        if (changes.secret)
            origin.current.secret = Number(secret);
        if (changes.thumbnail)
            setThumbnail(null);
    }

    const getChangeField = function() {
        return {
            title: origin.current?.title !== title,
            desc: origin.current?.description !== desc,
            secret: origin.current?.secret !== Number(secret),
            thumbnail: thumbnail !== null
        };
    }

    useEffect(() => {
        setError("");
        loadVideoInfo();
        loadVideoSecretInfo();
    }, [videoId]);

    // 변경사항 확인
    useEffect(() => {
        const changes = getChangeField();
        const isChange = Object.values(changes).some(v => v);
        setChange(isChange);
    }, [title, desc, secret, thumbnail]);

    return <Section className={[style.box, style.videoSetting].join(" ")}>
        <Section className={style.header}>
            <h2>동영상 세부정보</h2>
            <p>
                {change && <Button className={style.revert} onClick={revertBtn}>되돌리기</Button>}
                <Button className={style.save} onClick={saveBtn} disabled={!change}>저장</Button>
            </p>
        </Section>

        <div className={style.title}>제목</div>
        <input className={style.input} value={title} onChange={e => setTitle(e.target.value)} type="text" />
        
        <div className={style.title}>설명</div>
        <textarea className={style.input} value={desc} onChange={e => setDesc(e.target.value)}></textarea>

        <div className={style.title}>공개 설정</div>
        <select className={style.secret} onChange={e => setSecret(e.target.value)} value={secret}>
            <option value="0">👁️ 공개</option>
            <option value="1">📎 일부공개</option>
            <option value="2">🔒 비공개</option>
        </select>

 
        <div className={style.title}>썸네일</div>
        <ImageUploadBox defaultImg={`/api/image/thumbnail/${videoId}`} onChangeFile={file => setThumbnail(file)} setPreview={setPreview} />
    </Section>
}

type UserType = { name: string, icon: boolean };

function VideoComment({ videoId }: { videoId: string }) {
    const [page, setPage] = useState(0);
    const [max, setMax] = useState(0);
    const [list, setList] = useState<CommentDataType[]>([]);
    const [users, setUsers] = useState<{[key: string]: UserType}>({});
    const process = useRef<{[key: string]: boolean}>({});
    const userId = useSelector<Istore, string | null>(value => value.login.id);

    const [statusReply, setStatusReply] = useState<{[key: number]: boolean}>({});
    const [replyInputId, setReplyInputId] = useState(-1);

    const replyAdd = function(originId: number, newId: number, content: string) {
        if (userId === null) return;

        setList((data: CommentDataType[]) => {
            let commentIdx: number = -1;
            data.forEach((v, i) => {
                if (v.id === originId) {
                    commentIdx = i;
                    return false;
                }
            });

            if (commentIdx !== -1) {
                if (data[commentIdx + 1] !== undefined && data[commentIdx + 1].isReply) { // 밑에 답글이 있으믄
                    data.splice(commentIdx + 1, 0, {
                        created: Number(new Date()),
                        content,
                        id: newId,
                        owner: userId,
                        isReply: true,
                        reply: 0
                    });
                    if (process.current[userId] === undefined) {
                        process.current[userId] = true;
                        loadUser(userId);
                    }
                } else {
                    data[commentIdx].reply ++;
                }
            }

            return [...data];
        });
    }
    const loadReply = async function(commentId: number) {
        if (statusReply[commentId] !== undefined) return;
        
        setStatusReply({...statusReply, [commentId]: true}); // 로딩중...

        const { code, data } = await request(`/api/video/comment/reply?id=${commentId}`);
        if (code !== 200) return;
        
        setStatusReply((state: {[key: number]: boolean}) => ({...state, [commentId]: false})); // 로딩중...
        setList((list: CommentDataType[]) => {
            let commentIdx = -1;
            list.forEach((v, i) => {
                if (v.id  === commentId) {
                    commentIdx = i;
                    return false;
                }
            });
            
            if (commentIdx !== -1) {
                const datas = (data as CommentDataType[]).map(v => {
                    v.isReply = true;
                    if (process.current[v.owner] === undefined) {
                        process.current[v.owner] = true;
                        loadUser(v.owner);
                    }
                    return v;
                });
                list.splice(commentIdx + 1, 0, ...datas);
            }
            return [...list];
        });
    }

    const loadUser = async function(user: string) {
        
        const { code, data }: { code: number, data: UserType } = await request(`/api/channel/${user}/info?mini=1`);
        if (code !== 200) return;

        setUsers((value) => ({...value, [user]: data}));
    }

    const loadComment = async function() {
        // setList([]);

        const { code, data } = await request(`/api/video/comment/list?video=${videoId}&page=${page}`);
        if (code !== 200) return;

        setList(data);
        setStatusReply({});
        setReplyInputId(-1);
        (data as CommentDataType[]).forEach(value => {
            if (process.current[value.owner] === undefined) {
                process.current[value.owner] = true;
                loadUser(value.owner);
            }
        });
    }
    
    const loadSize = async function() {
        const { code, data } = await request(`/api/video/comment/size?video=${videoId}`);
        if (code !== 200) return;
        
        setMax(Math.ceil(data / 10));
    }

    const pageClick = function(type: PageEvent) {
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
                setPage(max - 1);
                break;
            default:
                break;
        }
    }
    
    useEffect(() => {
        // loadComment();
        loadSize();
    }, [videoId]);

    useEffect(() => { loadComment() }, [page]);

    return <Section className={[style.box, style.videoComment].join(" ")}>
        <h2 className={style.title}>댓글</h2>

        {list.map(value => {
            return <React.Fragment key={value.id}>
                <Comment onReply={() => setReplyInputId(value.id)} onOpenReply={() => loadReply(value.id)} id={value.id} p_id={value.owner} p_name={users[value.owner]?.name} p_image={users[value.owner]?.icon} content={value.content} created={value.created} reply={value.reply} isReply={value.isReply} />
                {replyInputId === value.id && <ChatSubReplyInput onAdd={(id, content) => replyAdd(value.id, id, content)} onReset={() => setReplyInputId(-1)} targetId={value.id} />}
                {statusReply[value.id] === true && <Spinner className={style.replySpinner} />}
            </React.Fragment>
        })}

        <PageControl className={style.pageable} page={page + 1} max={max} event={pageClick} />
    </Section>;
}