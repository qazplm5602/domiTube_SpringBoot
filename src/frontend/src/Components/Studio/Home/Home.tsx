import { Link, useNavigate } from 'react-router-dom';
import Button from '../../Recycle/Button';
import Section from '../../Recycle/Section';
import style from './home.module.css';

import noProfile from '../../../assets/no-profile.png';
import { useSelector } from 'react-redux';
import IStore from '../../Redux/Type';
import { videoDataType } from '../../Watch/Watch';
import { useEffect, useState } from 'react';
import { request } from '../../Utils/Fetch';
import { dateWithKorean, numberWithCommas, numberWithKorean } from '../../Utils/Misc';

type commentMinType = {
    id: number,
    video: {
        id: string,
        title: string
    },
    user: {
        id: string,
        name: string,
        image: boolean
    },
    content: string,
    reply: number
}

interface IdashboardData {
    myFollow: number,
    myViews: number,
    videoAnalyze: {
        last: videoDataType,
        popular: videoDataType,
        good: videoDataType,
    },
    commentAnalyze: commentMinType[]
}

export default function StudioHome() {
    const userName = useSelector<IStore, string | null>(value => value.login.name);
    const [data, setData] = useState<IdashboardData | undefined>();

    const loadDashboard = async function() {
        const { code, data } = await request("/api/studio/dashboard");
        if (code !== 200) return;
        
        setData(data);
    }

    useEffect(() => {
        loadDashboard();        
    }, []);

    return <main>
        <h2 className={style.title}>안녕하세요, <span>{userName || "--"}</span>님</h2>

        <RecommandVideo last={data?.videoAnalyze.last} popular={data?.videoAnalyze.popular} good={data?.videoAnalyze.good} />
        <CommentStatus comments={data?.commentAnalyze || []} />
        <ChannelStatus follow={data?.myFollow || 0} views={data?.myViews || 0} />
    </main>;
}

function ChannelStatus({ follow, views }: { follow: number, views: number }) {
    return <Section className={[style.box_container, style.channel].join(" ")}>
        <h2>채널 상태</h2>
        
        <Section title="구독자 집계" titleClass={style.box_title} className={style.subscribe}>
            <div>
                <span className={style.count}>{numberWithCommas(follow)}</span>
                <span className={style.count_sub}>명</span>
            </div>
            
            <Button className={style.show_btn}>모두 보기</Button>
        </Section>

        <Section title="시청자 집계" titleClass={style.box_title} className={style.subscribe}>
            <div>
                <span className={style.count}>{numberWithCommas(views)}</span>
                <span className={style.count_sub}>명</span>
            </div>
        </Section>
    </Section>;
}

function RecommandVideo({ last, popular, good }: { [key: string]: videoDataType | undefined }) {
    return <Section className={[style.box_container, style.recommand_video].join(" ")}>
        <h2>영상 분석</h2>
        
        <LineElement text="최근 업로드" style={{ marginTop: 0 }} />
        {/* <VideoBox /> */}
        {last ? <VideoBox video={last} /> : <div className={style.emptyT}>조회된 영상이 없습니다.</div>}

        <LineElement text="인기 영상" />
        {popular ? <VideoBox video={popular} /> : <div className={style.emptyT}>조회된 영상이 없습니다.</div>}

        <LineElement text="좋아요가 많은 영상" />
        {good ? <VideoBox video={good} /> : <div className={style.emptyT}>조회된 영상이 없습니다.</div>}

        <Link to="/studio/contents">
            <Button className={style.redirect}>콘텐츠로 이동</Button>
        </Link>
    </Section>;
}

function CommentStatus({ comments }: {comments: commentMinType[]}) {
    return <Section className={[style.box_container, style.comment_status].join(" ")}>
        <h2>인기 댓글</h2>

        {comments.map(v => <CommentBox key={v.id} comment={v} />)}
    </Section>
}

//////// 재활용 element

function LineElement({text, style: _style}: {text: string, style?: React.CSSProperties}) {
    return <div style={_style} className={style.line}>
        <span>{text}</span>
        <div></div>
    </div>
}

function VideoBox({video}: {video: videoDataType}) {
    const navigate = useNavigate();
    const redirect = function() {
        navigate(`/watch/${video.id}`);
    }

    return <div onClick={redirect} className={style.video_box}>
        <div className={style.thumbnail_container}>
            <img src={`/api/image/thumbnail/${video.id}`} />
        </div>

        <div className={style.info}>
            <div className={style.title}>{video.title}</div>
            <div className={style.sub}>조회수 {numberWithKorean(video.views)}회 • {dateWithKorean(new Date(video.create))} 전</div>
        </div>
    </div>;
}

function CommentBox({ comment }: {comment: commentMinType}) {
    return <Section className={style.comment}>
        <img className={style.icon} src={comment.user.image ? `/api/image/user/${comment.user.id}` : noProfile} />
        <Section className={style.detail}>
            <div className={style.name}>{comment.user.name}<span className={style.date}>1일 전</span></div>
            <div className={style.content}>{comment.content}</div>

            <div className={style.reply}>답글 {numberWithCommas(comment.reply)}개</div>
        </Section>
        
        <div className={style.thumbnail_container}>
            <img src={`/api/image/thumbnail/${comment.video.id}`} />
            <span>{comment.video.title}</span>
        </div>
    </Section>
}