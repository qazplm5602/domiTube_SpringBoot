import Section from '../../Recycle/Section';
import Button from '../../Recycle/Button';
import style from './comment.module.css';

import noProfile from '../../../assets/no-profile.png';
import goodSvg from '../../Watch/good.svg';
import { useEffect, useRef, useState } from 'react';
import { request } from '../../Utils/Fetch';
import { ChatSubReplyInput, CommentDataType } from '../../Watch/Watch';
import { dateWithKorean, numberWithCommas } from '../../Utils/Misc';
import React from 'react';

interface CommentStudioType extends CommentDataType {
    video: string
}

type processObj = { [key: string]: boolean };
type cacheUserType = {[key: string]: {name: string, image: boolean}};
type cacheVideoType = {[key: string]: string};

export default function StudioComment() {
    const [page, setPage] = useState(0);
    const [sort, setSort] = useState(0);
    const [loading, setLoading] = useState(false);
    const [barBottom, setBarBottom] = useState(false);
    const [list, setList] = useState<CommentStudioType[]>([]);
    
    const [cacheUser, setCacheUser] = useState<cacheUserType>({});
    const [cacheVideo, setCacheVideo] = useState<cacheVideoType>({});
    const process = useRef<{ user: processObj, video: processObj }>({ user: {}, video: {} });

    const listRef = useRef<any>();

    const [replyInput, setReplyInput] = useState(-1);
    
    const changeSort = function(value: number) {
        setSort(value);
        setPage(0);
        setList([]);
    }

    const onScroll = function(e: Event) {
        const { clientHeight, scrollHeight, scrollTop } = listRef.current;
        setBarBottom(scrollHeight - clientHeight <= scrollTop + 1);
    }

    const loadCacheUser = async function(id: string) {
        process.current.user[id] = true;

        const { code, data } = await request(`/api/channel/${id}/info`);
        if (code !== 200) return;

        setCacheUser((prev: cacheUserType) => {
            return {...prev, [id]: { name: data.name, image: data.icon } };
        });
    }

    const loadCacheVideo = async function(id: string) {
        process.current.video[id] = true;

        const { code, data } = await request(`/api/video/${id}`);
        if (code !== 200) return;

        setCacheVideo((prev: cacheVideoType) => {
            return {...prev, [id]: data.data.title };
        });
    }

    const loadComments = async function() {
        setLoading(true);
        
        const { code, data } = await request(`/api/studio/comment/list?sort=${sort}&page=${page}`);
        if (code !== 200) return;
        
        (data as CommentStudioType[]).forEach(value => {
            if (process.current.user[value.owner] === undefined)
                loadCacheUser(value.owner)
            if (process.current.video[value.video] === undefined)
                loadCacheVideo(value.video);
        });
        setList([...list, ...data]);
        setLoading(false);
        setBarBottom(false);
        setPage(data.length < 20 ? -1 : page + 1);
    }

    const replyInputOpen = function(id: number) {
        setReplyInput(id);
    }

    const replyInputClose = () => setReplyInput(-1);

    const replyAdd = function(commentId: number, replyId: number, content: string) {
    }

    useEffect(() => {
        if (loading || page === -1) return;

        const { clientHeight, scrollHeight } = listRef.current;
        
        // 보이는 화면이 작슴니다. (댓글이 아직 꽉 안차있슴)
        if (scrollHeight <= clientHeight || barBottom) {
            loadComments();
        }
    }, [sort, page, loading, barBottom]);

    useEffect(() => {
        listRef.current.addEventListener("scroll", onScroll);
        return () => listRef?.current?.removeEventListener("scroll", onScroll);
    }, []);
    
    return <main ref={listRef}>
        <h2 className={style.header_title}>댓글</h2>

        <Section className={style.sort}>
            <div onClick={() => changeSort(0)} className={[style.box, sort === 0 ? style.active : ''].join(" ")}>최신순</div>
            <div onClick={() => changeSort(1)} className={[style.box, sort === 1 ? style.active : ''].join(" ")}>좋아요순</div>
            <div onClick={() => changeSort(2)} className={[style.box, sort === 2 ? style.active : ''].join(" ")}>날짜순</div>
        </Section>

        <Section className={style.comment_list}>
            {list.map(value => {
                return <React.Fragment key={value.id}>
                    <Comment id={value.id} p_id={value.owner} p_name={cacheUser[value.owner]?.name || "--"} p_image={cacheUser[value.owner]?.image === true} video_id={value.video} video_title={cacheVideo[value.video] || "--"} created={value.created} content={value.content} reply={value.reply} isReply={false} onOpenReply={() => {}} onReply={() => replyInputOpen(value.id)} />
                    {replyInput === value.id && <ChatSubReplyInput targetId={value.id} onReset={replyInputClose} onAdd={(replyId, content) => replyAdd(value.id, replyId, content)} />}
                </React.Fragment>
            })}
        </Section>
    </main>;
}

export function Comment({ id, p_name, p_id, p_image, video_id, video_title, created, content, onReply, onOpenReply, reply, isReply }: { id: number, p_name: string, p_id: string, p_image: boolean, video_id?: string, video_title?: string, created: number, content: string, reply: number, isReply: boolean, onReply?: () => void, onOpenReply?: () => void }) {
    const classList = [style.comment];
    if (isReply)
        classList.push(style.reply);
    
    return <Section className={classList.join(' ')}>
        <img className={style.icon} src={p_image ? `/api/image/user/${p_id}` : noProfile} />
        
        <Section className={style.detail}>
            <div className={style.name}>{p_name} • {dateWithKorean(new Date(created))} 전</div>
            <div className={style.content}>{content}</div>
            
            <Section className={style.interaction}>
                {!isReply && <Button onClick={onReply}>답글</Button>}
                {!isReply && <Button disabled={reply === 0} onClick={onOpenReply}>답글 {numberWithCommas(reply)}개</Button>}
                <Button className={style.icon} icon={goodSvg} />
                <Button className={[style.icon, style.reverse].join(" ")} icon={goodSvg} />
                <Button className={style.icon} icon={"삭제"} />
            </Section>
        </Section>

        {video_id !== undefined && <div className={style.thumbnail}>
            <img src={`/api/image/thumbnail/${video_id}`} />
            <span>{video_title}</span>
        </div>}
    </Section>;
}