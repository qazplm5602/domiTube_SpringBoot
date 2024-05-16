import Section from '../../Recycle/Section';
import Button from '../../Recycle/Button';
import style from './comment.module.css';

import noProfile from '../../../assets/no-profile.png';
import goodSvg from '../../Watch/good.svg';
import { useEffect, useRef, useState } from 'react';
import { request } from '../../Utils/Fetch';
import { CommentDataType } from '../../Watch/Watch';
import { dateWithKorean, numberWithCommas } from '../../Utils/Misc';

interface CommentStudioType extends CommentDataType {
    video: string
}

export default function StudioComment() {
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [barBottom, setBarBottom] = useState(false);
    const [list, setList] = useState<CommentStudioType[]>([]);

    const listRef = useRef<any>();
    
    const onScroll = function(e: Event) {
        const { clientHeight, scrollHeight, scrollTop } = listRef.current;
        setBarBottom(scrollHeight - clientHeight <= scrollTop);
    }

    const loadComments = async function() {
        setLoading(true);
        
        const { code, data } = await request(`/api/studio/comment/list?sort=0&page=${page}`);
        if (code !== 200) return;
        
        setList([...list, ...data]);
        setLoading(false);
        setPage(data.length < 20 ? -1 : page + 1);
    }

    useEffect(() => {
        if (loading || page === -1) return;

        const { clientHeight, scrollHeight } = listRef.current;
        
        // 보이는 화면이 작슴니다. (댓글이 아직 꽉 안차있슴)
        if (scrollHeight <= clientHeight || barBottom) {
            loadComments();
        }
    }, [page, loading, barBottom]);

    useEffect(() => {
        listRef.current.addEventListener("scroll", onScroll);
        return () => listRef.current.removeEventListener("scroll", onScroll);
    }, []);
    
    return <main ref={listRef}>
        <h2 className={style.header_title}>댓글</h2>

        <Section className={style.sort}>
            <div className={[style.box, style.active].join(" ")}>최신순</div>
            <div className={style.box}>좋아요순</div>
            <div className={style.box}>날짜순</div>
        </Section>

        <Section className={style.comment_list}>
            {list.map(value => <Comment key={value.id} id={value.id} p_id={value.owner} p_name="--" p_image={false} video_id={value.video} video_title='--' created={value.created} content={value.content} reply={value.reply} isReply={false}  />)}
        </Section>
    </main>;
}

export function Comment({ id, p_name, p_id, p_image, video_id, video_title, created, content, reply, isReply }: { id: number, p_name: string, p_id: string, p_image: boolean, video_id: string, video_title: string, created: number, content: string, reply: number, isReply: boolean }) {
    return <Section className={style.comment}>
        <img className={style.icon} src={p_image ? `/api/image/user/${p_id}` : noProfile} />
        
        <Section className={style.detail}>
            <div className={style.name}>{p_name} • {dateWithKorean(new Date(created))} 전</div>
            <div className={style.content}>{content}</div>
            
            <Section className={style.interaction}>
                <Button>답글</Button>
                <Button disabled={true}>답글 {numberWithCommas(reply)}개</Button>
                <Button className={style.icon} icon={goodSvg} />
                <Button className={[style.icon, style.reverse].join(" ")} icon={goodSvg} />
                <Button className={style.icon} icon={"삭제"} />
            </Section>
        </Section>

        <div className={style.thumbnail}>
            <img src={`/api/image/thumbnail/${video_id}`} />
            <span>{video_title}</span>
        </div>
    </Section>;
}