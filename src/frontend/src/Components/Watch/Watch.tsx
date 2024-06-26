import { Link, useParams } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Section from "../Recycle/Section";
import style from "./watch.module.css";
import ReactPlayer from "react-player";
import Button from "../Recycle/Button";
import { SubscribeButton, channelMain, channelMin } from "../Channel/Channel";

import playSvg from './play.svg';
import pauseSvg from './pause.svg';
import fullOffSvg from './fullscreen_off.svg';
import settingSvg from './setting.svg';
import shareSvg from './share.svg';
import goodSvg from './good.svg';
import otherSvg from './other.svg';
import noProfile from '../../assets/no-profile.png';

import VideoBox from "../Recycle/VideoBox";
import { useEffect, useRef, useState } from "react";
import { OnProgressProps } from "react-player/base";
import React from "react";
import { request } from "../Utils/Fetch";
import { dateWithKorean, numberWithCommas, numberWithKorean, secondsToHMS } from "../Utils/Misc";
import { useSelector } from "react-redux";
import IStore from "../Redux/Type";
import Spinner from "../Recycle/Spinner";

export interface videoDataType {
    id: string,
    title: string,
    description: string,
    create: number,
    views: number,
    good: number,
    bad: number,
    channel: string,
    time: number
}

export interface CommentDataType {
    id: number,
    owner: string,
    content: string,
    created: number,
    reply: number,
    isReply: boolean
}

export default function Watch() {
    const { id } = useParams();
    const mainRef = useRef<any>();
    const [errorReason, setErrorReason] = useState<string | null>(null);
    const [videoData, setVideoData] = useState<videoDataType | null>(null);
    
    const requestData = async function() {
        const { code, data }: {code: number, data: {reason: string, data: videoDataType} | undefined} = await request(`/api/video/${id}`);
        if (code !== 200 || data === undefined) {
            setErrorReason(data?.reason || `not data. (${code})`);
            return;
        }

        setVideoData(data.data);
    }

    useEffect(() => {
        requestData();
    }, [id]);

    // 카운팅 starrrr
    useEffect(() => {
        const waitHandler = setTimeout(() => {
            request(`/api/video/${id}/ping`, { method: "POST" });
        }, 1000 * 10);

        return () => clearTimeout(waitHandler);
    }, [id]);

    if (id === undefined) return null;

    if (errorReason !== null) {
        return <MainLayout className={style.main} sideDisable={true}>
            error: {errorReason}
        </MainLayout>;
    }

    return <MainLayout mainRef={mainRef} className={style.main} sideDisable={true}>
        <Section className={style.video_container}>
            {/* <video> */}
            <VideoPlayer id={id} />

            {/* 제목 / 채널 */}
            <TitleChannel title={videoData?.title || "--"} id={id} owner={videoData?.channel} good={videoData?.good || 0} bad={videoData?.bad || 0} />

            {/* 설명란 */}
            <Description view={videoData?.views || 0} created={videoData ? new Date(videoData.create) : undefined} desc={videoData?.description} />

            {/* 댓글 */}
            <Chat videoId={id} mainRef={mainRef} />
        </Section>
        
        <Section className={style.recommand_container}>
            <RecommandVideo id={id} />
        </Section>
    </MainLayout>;
}

function VideoPlayer({id}: {id: string}) {
    const controlClass = [style.control_main];
    
    const videoSectionRef = useRef<any>();
    const playerRef = useRef<any>();
    const bar_containerRef = useRef<any>();

    const [playing, setPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [loadTime, setLoadTime] = useState(0);
    const [controlShow, setControlShow] = useState(true);
    
    if (!controlShow) {
        controlClass.push(style.hide);
    }

    const [playerMouseIn, setPlayerMouseIn] = useState(false);
    const mouseEnter = function() {
        setPlayerMouseIn(true);
        setControlShow(true);
    }
    const mouseLeave = function(force: boolean) {
        setPlayerMouseIn(false);
        if (barMouseDown && !force) return; // 바 움직이는 동안은 안됨. ㄹㅇㅋㅋ

        setControlShow(false);
    }
    const screenFull = function() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            videoSectionRef.current.requestFullscreen();
        }
    }

    ///// bar 이벤트
    const [barMouseDown, setBarMouseDown] = useState(false);
    const [barXmin, setBarXmin] = useState(0);
    const [barXmax, setBarXmax] = useState(0);

    const onBarMouseDown = function(e: React.MouseEvent<HTMLDivElement>) {
        e.preventDefault();
        setBarMouseDown(true);
        // console.log("onBarMouseDown");

        const screenLeft = bar_containerRef.current.getBoundingClientRect().left;
        setBarXmin(screenLeft);
        setBarXmax(screenLeft + bar_containerRef.current.offsetWidth);

        onBarMouseMove(e as unknown as MouseEvent, true);
    }
    const onBarMouseUp = function(e: MouseEvent) {
        if (!barMouseDown) return;

        // console.log(barMouseDown, "onBarMouseUp");
        setBarMouseDown(false);

        if (!playerMouseIn)
            mouseLeave(true);
    }

    const onBarMouseMove = function(e: MouseEvent, force: boolean = false) {
        if (!barMouseDown && !force) return;
        
        const nowBarPos = Math.max(Math.min(e.clientX, barXmax), barXmin);
        
        const percent = getPercent2(barXmin, barXmax, nowBarPos);
        const time = (percent / 100) * duration;
        console.log(percent, time);
        setCurrentTime(time);
        playerRef.current.seekTo(Math.floor(time));
    }

    const onProgress = function(state: OnProgressProps) {
        console.log(state.loadedSeconds, state.playedSeconds, duration);
        setLoadTime(state.loadedSeconds);
        
        if (!barMouseDown)
            setCurrentTime(state.playedSeconds);
    }
    const onDuration = function(value: number) {
        setDuration(value);
    }

    useEffect(() => {
        // window.addEventListener("mousemove", mouseEnter);
        window.addEventListener("mouseup", onBarMouseUp);
        window.addEventListener("mousemove", onBarMouseMove);
        
        // 랜더링 끝날때 함
        return () => {
            window.removeEventListener("mouseup", onBarMouseUp);
            window.removeEventListener("mousemove", onBarMouseMove);
        }
    }, [barMouseDown, playerMouseIn, barXmin, barXmax])

    return <Section refValue={videoSectionRef} onMouseLeave={() => mouseLeave(false)} onMouseEnter={mouseEnter} className={style.video_player}>
        <ReactPlayer ref={playerRef} className={style.player} onDuration={onDuration} onProgress={onProgress} playing={playing} url={`/api/video/stream/${id}`} />
        <div className={controlClass.join(" ")}>
            <div className={style.top}></div>

            {/* 아래쪽 */}
            <div className={style.bottom}>

                {/* 바밤바. */}
                <div className={style.bar_container} ref={bar_containerRef} onMouseDown={onBarMouseDown}>
                    <div className={[style.bar, (barMouseDown ? style.zoom : '')].join(" ")}>
                        <div className={style.load} style={{width: `${getPercent(loadTime, duration)}%`}}></div>
                        <div className={style.in} style={{width: `${getPercent(currentTime, duration)}%`}}></div>
                        <div className={style.inCircle} style={{left: `${getPercent(currentTime, duration)}%`}}></div>
                    </div>
                </div>

                {/* 버튼들... */}
                <Section className={style.control_buttons}>
                    <div className={style.left}>
                        <PlayerBtn icon={playing ? pauseSvg : playSvg} text={playing ? "일시정지" : "재생"} onClick={() => setPlaying(!playing)} />
                        <span className={style.timer}>{secondsToHMS(currentTime)} / {secondsToHMS(duration)}</span>
                    </div>
                    <div className={style.right}>
                        <PlayerBtn icon={settingSvg} text="설정" />
                        <PlayerBtn onClick={screenFull} icon={fullOffSvg} text="전체화면" />
                    </div>
                </Section>

            </div>
        </div>
    </Section>;
}

function PlayerBtn({icon, text, onClick}: {icon: string, text?: string, onClick?: React.MouseEventHandler<HTMLButtonElement>}) {
    return <Button icon={icon} onClick={onClick} className={style.control_btn}>{text && <span>{text}</span>}</Button>
}

function TitleChannel({id, owner, title, good, bad}: {id: string, owner: string | undefined, title: string, good: number, bad: number}) {
    const [channelData, setChannelData] = useState<channelMain | null>(null);
    const [assess, setAssess] = useState<boolean | undefined>(); // null: 아무것도 안누름 / true: 조아용 / false: 싫음 ㄹㅇ
    const logined = useSelector<IStore>(value => value.login.logined) as boolean;
    
    const [goodCount, setGoodCount] = useState(good);
    const [badCount, setBadCount] = useState(bad);

    const requestChannel = async function() {
        const { code, data } = await request(`/api/channel/${owner}/info`);
        if (code !== 200) return;

        setChannelData(data);
    }
    const requestMyAssess = async function() {
        const { code, data } = await request(`/api/video/${id}/Assessment`);
        if (code !== 200) {
            return;
        }

        setAssess(data as boolean | undefined);
    }
    const assessClick = function(goodVal: boolean) {
        let assessBody;
        if (assess === true) {
            setGoodCount(goodCount - 1);
        } else if (assess === false) {
            setBadCount(badCount - 1);
        }

        if (assess !== undefined && goodVal === assess) { // 이건 해제하는거임
            assessBody = 0;
            setAssess(undefined);
        } else { // 걍 설정
            assessBody = goodVal ? 1 : 2;
            setAssess(goodVal);

            if (goodVal === true) {
                setGoodCount(goodCount + 1);
            } else if (goodVal === false) {
                setBadCount(badCount + 1);
            }
        }

        request(`/api/video/${id}/Assess`, { method: "POST", body: assessBody.toString(), headers: { "Content-Type": "application/json" } });
    }
    const subscribeChanged = function(active: boolean) {
        if (channelData !== null) {
            channelData.subscribe = active;
            setChannelData({...channelData});
        }
    }

    useEffect(() => {
        setGoodCount(good);
        setBadCount(bad);
    }, [id, good, bad]);

    useEffect(() => {
        if (owner)
            requestChannel();
    }, [owner]);

    useEffect(() => {
        if (logined)
            requestMyAssess();
    }, [logined]);

    return <Section title={title} titleClass={style.title} className={style.metadata}>
        <div className={style.channel}>
            <Link to={`/channel/${owner}`}>
                <img src={(channelData?.icon === true) ? `/api/image/user/${owner}` : noProfile} />
            </Link>
            <div className={style.texts}>
                <span>{channelData?.name || "--"}</span>
                <span>구독자: {channelData === null ? "--" : numberWithKorean(channelData.follower)}명</span>
            </div>

            <SubscribeButton className={[style.subscribe]} channel={owner || ""} onChanged={subscribeChanged} active={channelData?.subscribe === true} />
        </div>

        <div className={style.interactions}>
            <Button icon={shareSvg} onClick={() => window.navigator.share({ url: `/watch/${owner || ""}`, title: `domiTube - ${title}` })}>공유</Button>

            {/* 좋아용 싫어요 */}
            <div className={style.rating}>
                <Button icon={goodSvg} className={assess === true ? style.active : undefined} onClick={() => assessClick(true)}>{numberWithKorean(goodCount)}</Button>
                <Button icon={goodSvg} className={assess === false ? style.active : undefined} onClick={() => assessClick(false)}>{numberWithKorean(badCount)}</Button>
            </div>
        </div>
    </Section>
}

function Description({ view, desc, created }: { view: number, desc: string | undefined, created: Date | undefined }) {
    return <div className={style.desc}>
        {/* 조회수 / 날짜 / 태그 */}
        <Section className={style.info}>
            <span>조회수 {numberWithKorean(view)}회</span>
            <span>{created ? `${created.getFullYear()}.${(created.getMonth() + 1).toString().padStart(2,'0')}.${created.getDate().toString().padStart(2,'0')}` : "--"}</span>
        </Section>

        <div className={style.content}>{desc || ''}</div>
    </div>;
}

type cacheUserType = {[key: string]: {icon: boolean, name: string} | null};

function Chat({videoId, mainRef}: {videoId: string, mainRef: any}) {
    const loginIcon = useSelector<IStore>(value => ({
        icon: value.login.logined && value.login.image === true,
        id: value.login.logined ? value.login.id : ""
    })) as {id: string, icon: boolean};
    
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [bottom, setBottom] = useState(false); // 스크롤 바뀌었다는 트리거
    const [list, setList] = useState<CommentDataType[]>([]);
    const [cacheUser, setCacheUser] = useState<cacheUserType>({}); // channelMain 형태면 불러와짐 , null이면 불러오는중...

    const requestChat = async function() {
        setLoading(true);

        const { code, data } = await request(`/api/video/comment/list?video=${videoId}&page=${page}`);
        if (code !== 200) return;
        
        // setList([...list, ...data]);
        setList((prevState: CommentDataType[]) => {
            return [...prevState, ...data]
        });

        // 유저 정보가 없는건 불러오기
        data.forEach((value: CommentDataType) => {
            if (cacheUser[value.owner] === undefined) {
                setCacheUser({...cacheUser, [value.owner]: null});
                cacheUser[value.owner] = null;
                
                requestUser(value.owner);
            }
        });

        setLoading(false);
        setPage((data as CommentDataType[]).length >= 10 ? page + 1 : -1);
    }
    const requestUser = async function(user: string) {
        const { code, data } = await request(`/api/channel/${user}/info?mini=1`);
        if (code !== 200) return;

        setCacheUser((prevState: cacheUserType) => {
            const newUsers = {...prevState};
            newUsers[user] = {
                icon: data.icon,
                name: data.name
            }

            return newUsers;
        });
    }
    
    useEffect(() => {
        if (loading || page === -1) return; // 로딩중일때, 모든 댓글 이미 다 불러옴

        if (mainRef.current.scrollHeight <= mainRef.current.clientHeight || mainRef.current.scrollTop + window.innerHeight >= mainRef.current.scrollHeight) { // 화면이 꽉 안차있거나, 스크롤 맨 아래일경우
            requestChat();
        }

    }, [videoId, list, bottom, loading, cacheUser]);

    const onScroll = function() {
        setBottom(!bottom);
    }

    useEffect(() => {
        mainRef.current.addEventListener("scroll", onScroll);
        window.addEventListener("resize", onScroll);
        
        return () => {
            if (mainRef.current)
                mainRef.current.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        }
    }, [bottom]);

    const [inputDisable, setInputDisable] = useState(false);
    const [inputVal, setInputVal] = useState("");
    const [inputBtn, setInputBtn] = useState(false);
    const onFocus = () => setInputBtn(true);
    const onInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => setInputVal(e.target.value);
    const inputCancel = function() {
        setInputBtn(false);
        setInputVal("");
    }
    const inputPost = function() {
        if (inputVal.length <= 0) return;
        
        setInputDisable(true);

        if (cacheUser[loginIcon.id] === undefined) // 내 정보 캐싱 없음
            requestUser(loginIcon.id);
        
        request(`/api/video/comment/write?video=${videoId}`, { method: "PUT", body: inputVal }).then(({code, data: id}) => {
            setInputDisable(false);
            inputCancel();

            if (code !== 200) return;

            setList((prevState: CommentDataType[]) => {
                const myChat: CommentDataType = {
                    content: inputVal,
                    created: Number(new Date()),
                    id,
                    owner: loginIcon.id,
                    reply: 0,
                    isReply: false
                }

                return [myChat, ...prevState];
            });
        });
    }

    const [replyInputId, setReplyInputId] = useState(-1);
    const [replyLoad, setReplyLoad] = useState(new Set<number>());
    const replyReset = () => setReplyInputId(-1);
    const onShowReply = async function(commentId: number) {
        list.forEach(v => {
            if (v.id === commentId) {
                v.reply = 0;
                return false; // break
            }
        });
        setList([...list]);

        const newValue = new Set([...replyLoad]);
        newValue.add(commentId);

        setReplyLoad(newValue);

        //////////// 여기서부터 API 호출
        const {code, data}: {code: number, data: CommentDataType[]} = await request(`/api/video/comment/reply?id=${commentId}`);
        if (code !== 200) return;

        data.forEach(v => {
            v.isReply = true;
            
            if (cacheUser[v.owner] === undefined) {
                setCacheUser((prevState: cacheUserType) => ({...prevState, [v.owner]: null}));
                cacheUser[v.owner] = null;

                requestUser(v.owner);
            }
        });

        setList((prevState: CommentDataType[]) => {
            let idx = -1;
            prevState.forEach((v, k) => {
                if (v.id === commentId) {
                    idx = k;
                    return false;
                }
            });
            
            prevState.splice(idx + 1, 0, ...data);

            return [...prevState];
        });
        setReplyLoad((prevState: Set<number>) => {
            prevState.delete(commentId);
            return new Set([...prevState]);
        });
    }
    const replyAdd = function(commentId: number, replyId: number, content: string) {
        setList((prevState: CommentDataType[]) => {
            let idx = -1;
            prevState.forEach((v, k) => {
                if (v.id === commentId) {
                    idx = k;
                    return false;
                }
            });

            // 더이상 아래에 댓글이 없거나 밑에 답글이 아니믄
            if (prevState.length <= (idx + 1) || !prevState[idx + 1].isReply) {
                prevState[idx].reply ++;
            } else {
                if (cacheUser[loginIcon.id] === undefined) {
                    setCacheUser((prevState: cacheUserType) => ({...prevState, [loginIcon.id]: null}));
                    cacheUser[loginIcon.id] = null;
                    requestUser(loginIcon.id);
                }

                prevState.splice(idx + 1, 0, {
                    id: replyId,
                    content: content,
                    owner: loginIcon.id,
                    created: Number(new Date()),
                    reply: 0,
                    isReply: true,
                });
            }
            

            return [...prevState];
        });
    }

    return <>
        <Section className={style.chat_header}>
            <span>댓글 {numberWithCommas(list.length)}개</span>
            {/* 나중에 정렬 버튼 넣을꺼임 */}
        </Section>
        
        {/* 댓글 쓴는곳 */}
        <ChatReplyInput value={inputVal} onFocus={onFocus} onChange={onInputChanged} onPost={inputPost} onCancel={inputCancel} btnActive={inputBtn} disable={inputDisable} icon={loginIcon.icon ? `/api/image/user/${loginIcon.id}` : noProfile} />
        
        {/* 댓글들 */}
        {list.map(v => {
            return <React.Fragment key={v.id}>
                <ChatUserContent onShowReply={() => onShowReply(v.id)} onReply={() => setReplyInputId(v.id)} icon={cacheUser[v.owner]?.icon ? `/api/image/user/${v.owner}` : noProfile} name={cacheUser[v.owner]?.name || "--"} date={new Date(v.created)} content={v.content} reply={v.reply} noReply={!v.isReply} />
                {/* {(v.reply === 0 && v.id === replyInputId) && <ChatReplyInput value={replyVal} onChange={replyChangeValue} onPost={replyPost} onCancel={replyCancel} btnActive={true} disable={replyDisable} icon={loginIcon.icon ? `/api/image/user/${loginIcon.id}` : noProfile} reply={true} />} */}
                {(!v.isReply && v.id === replyInputId) && <ChatSubReplyInput onAdd={(id, content) => replyAdd(v.id, id, content)} targetId={v.id} onReset={replyReset} />}
                {replyLoad.has(v.id) && <Spinner className={style.loading} />}
            </React.Fragment>;
        })}
        
        {loading && <Spinner className={style.loading} />}
    </>;
}

function ChatUser({children, className, section, icon}: {className?: string[], children: React.ReactNode, section?: boolean, icon: string}) {
    const classList = className || [];
    classList.push(style.userBox);    
    
    return <Section className={classList.join(" ")}>
        <img className={style.userIcon} src={icon} />
        {section ? <Section>{children}</Section> : children}
    </Section>;
}

function ChatUserContent({icon, name, date, content, noReply, reply, onReply, onShowReply}: {icon: string, name: string, date: Date, content: string, noReply: boolean, reply: number, onReply?: () => void, onShowReply?: () => void}) {
    const classList = [style.userChat];
    if (!noReply)
        classList.push(style.reply);
    
    return <ChatUser className={classList} section={true} icon={icon}>
        <main>
            <div className={style.detail}><span>{name}</span><span>{dateWithKorean(date)} 전</span></div>
            <div className={style.content}>{content}</div>
            <div className={style.interacte}>
                <Button icon={goodSvg} />
                <span>500</span>
                <Button icon={goodSvg} />
                <span>500</span>
                
                {noReply && <Button className={style.reply} onClick={onReply}>답글</Button>}
            </div>
            {reply > 0 && <Button className={style.reply} onClick={onShowReply}>답글 {numberWithCommas(reply)}개</Button>}
        </main>
        <Button className={style.other} icon={otherSvg} />
    </ChatUser>;
}

function ChatReplyInput({disable, icon, btnActive, value, onChange, onPost, onCancel, onFocus, reply}: {disable: boolean, btnActive: boolean, icon: string, value: string, reply?: boolean, onChange?: React.ChangeEventHandler<HTMLInputElement>, onPost: () => void, onCancel: () => void, onFocus?: React.FocusEventHandler<HTMLInputElement>}) {
    const classList = [style.myInput];
    if (reply) {
        classList.push(style.replyInput);
    }

    return <ChatUser className={classList} icon={icon}>
        <div>
            <input type="text" disabled={disable} value={value} onChange={onChange} onFocus={onFocus} placeholder="댓글 추가..." />
            {btnActive && <Section>
                <Button className={style.send} disabled={disable} onClick={onPost}>등록</Button>
                <Button className={style.close} disabled={disable} onClick={onCancel}>취소</Button>
            </Section>}
        </div>
    </ChatUser>
}

export function ChatSubReplyInput({targetId, onAdd, onReset}: {targetId: number, onReset: () => void, onAdd: (id: number, content: string) => void}) {
    const [replyVal, setReplyVal] = useState("");
    const [replyDisable, setReplyDisable] = useState(false);
    const replyChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => setReplyVal(e.target.value);
    const replyCancel = function() {
        onReset();
    }
    const replyPost = function() {
        setReplyDisable(true);

        request(`/api/video/comment/reply?id=${targetId}`, { method: "PUT", body: replyVal }).then((data) => {
            if (data.code != 200) return;
            onAdd(data.data, replyVal);
            setReplyDisable(false);
            replyCancel();
        });
    }

    return <ChatReplyInput value={replyVal} onChange={replyChangeValue} onPost={replyPost} onCancel={replyCancel} btnActive={true} disable={replyDisable} icon={noProfile} reply={true} />;
}

type cacheType = {[key: string]: channelMin};
function RecommandVideo({id}: { id: string }) {
    const [list, setList] = useState<videoDataType[]>([]);

    const [cacheChannel, setCacheChannel] = useState<cacheType>({});
    const progressChannel = useRef<{[key: string]: boolean}>({});

    const loadChannel = async function(channel: string) {
        progressChannel.current[channel] = true;

        const { code, data } = await request(`/api/channel/${channel}/info?mini=1`);
        if (code !== 200) return;

        setCacheChannel((prev: cacheType) => ({...prev, [channel]: data}));
    }

    const getRandomVideo = async function() {
        const { code, data } = await request(`/api/video/random?max=10`, { method: "POST" });
        if (code !== 200) return;

        (data as videoDataType[]).forEach(v => {
            if (progressChannel.current[v.channel] === undefined)
                loadChannel(v.channel);
        });

        setList(data);
    }

    useEffect(() => {
        setList([]);
        getRandomVideo();
    }, [id]);

    return <>
        {list.map(v => <VideoBox key={v.id} video={v} channel={cacheChannel[v.channel]} horizontal={true} />)}
    </>;
}

function getPercent(value: number, max: number) {
    return (value / max) * 100;
}

function getPercent2(min: number, max: number, value: number) {
    return ((value - min) / (max - min)) * 100;
}