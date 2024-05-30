import { Link, useParams } from 'react-router-dom';
import style from './video.module.css';
import Section from '../../Recycle/Section';
import Button from '../../Recycle/Button';
import { ImageUploadBox, PageControl, PageEvent } from '../Contents/Contents';
import { Comment } from '../Comment/Comment';

import arrow from '../Contents/arrow.svg';
import arrowMax from '../Contents/arrowMax.svg';
import { useEffect, useRef, useState } from 'react';
import { CommentDataType } from '../../Watch/Watch';
import { request } from '../../Utils/Fetch';

export default function StudioVideo() {
    const { videoId } = useParams();

    if (videoId === undefined) return;

    return <main className={style.main}>
        <Section className={style.content}>
            
            <VideoSetting />
            <VideoComment videoId={videoId} />

        </Section>

        <Section className={style.video}>
            <div className={style.videoBox}>
                <img className={style.player} src="https://i.ytimg.com/vi/T9dJ_cE5Asw/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLB4VYvk8T391uvCZgEfFg62tuAVDQ" />
                
                <div className={style.subT}>동영상 링크</div>
                <Link to="/watch/DOMI1" className={style.text}>https://domi.kr/watch/DOMI1</Link>

                <div className={style.subT}>파일 이름</div>
                <div className={style.text}>doming.mp4</div>
            </div>
        </Section>
    </main>;
}

function VideoSetting() {
    return <Section className={[style.box, style.videoSetting].join(" ")}>
        <Section className={style.header}>
            <h2>동영상 세부정보</h2>
            <p>
                <Button className={style.revert}>되돌리기</Button>
                <Button className={style.save}>저장</Button>
            </p>
        </Section>

        <div className={style.title}>제목</div>
        <input className={style.input} type="text" />
        
        <div className={style.title}>설명</div>
        <textarea className={style.input}></textarea>

        <div className={style.title}>썸네일</div>
        <ImageUploadBox />
    </Section>
}

type UserType = { name: string, icon: boolean };

function VideoComment({ videoId }: { videoId: string }) {
    const [page, setPage] = useState(0);
    const [list, setList] = useState<CommentDataType[]>([]);
    const [users, setUsers] = useState<{[key: string]: UserType}>({});
    const process = useRef<{[key: string]: boolean}>({});

    const loadUser = async function(user: string) {
        const { code, data }: { code: number, data: UserType } = await request(`/api/channel/${user}/info?mini=1`);
        if (code !== 200) return;

        setUsers((value) => ({...value, [user]: data}));
    }

    const loadComment = async function() {
        setList([]);

        const { code, data } = await request(`/api/video/comment/list?video=${videoId}&page=${page}`);
        if (code !== 200) return;

        setList(data);
        (data as CommentDataType[]).forEach(value => {
            if (process.current[value.owner] === undefined)
                loadUser(value.owner);
        });
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
                // setPage(maxpage - 1);
                break;
            default:
                break;
        }
    }
    
    useEffect(() => {
        loadComment();
    }, [videoId]);

    return <Section className={[style.box, style.videoComment].join(" ")}>
        <h2 className={style.title}>댓글</h2>

        {list.map(value => <Comment key={value.id} id={value.id} p_id={value.owner} p_name={users[value.owner]?.name} p_image={users[value.owner]?.icon} content={value.content} created={value.created} reply={value.reply} isReply={false} />)}

        <PageControl className={style.pageable} page={page} max={0} event={pageClick} />
    </Section>;
}