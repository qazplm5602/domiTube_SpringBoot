import Button from '../Recycle/Button';
import style from './studioHeader.module.css';

import logoSvg from './youtube.svg';
import listSvg from './list.svg';
import searchSvg from './search.svg';
import noProfile from '../../assets/no-profile.png';
import editSvg from './edit.svg';
import videoSvg from './video.svg';

import Input from '../Recycle/Input';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { IloginStore } from '../Redux/LoginStore';
import IStore from '../Redux/Type';
import Section from '../Recycle/Section';
import { Link } from 'react-router-dom';
import { videoDataType } from '../Watch/Watch';
import { request } from '../Utils/Fetch';
import { secondsToHMS } from '../Utils/Misc';

export default function StudioHeader() {
    const login = useSelector<IStore, IloginStore>(value => value.login);
    
    return <header className={style.header}>
        <section>
            <Button icon={listSvg} />
            <img className={style.logo} src={logoSvg} />
        </section>

        <SearchBox />
        
        <section>
            <img className={style.profile} src={login.logined && login.image ? `/api/image/user/${login.id}` : noProfile} />
        </section>
    </header>;
}

// 검색
function SearchBox() {
    const [value, setValue] = useState("");
    const [show, setShow] = useState(false);
    const [focus, setFocus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState<videoDataType[]>([]);

    const waitHandler = useRef<NodeJS.Timeout>();
    const requestId = useRef(0);

    const loadSearch = async function() {
        const idx = ++ requestId.current;

        const { code, data } = await request(`/api/studio/content/search?v=${value}`);
        console.log(data, requestId.current, idx);
        if (requestId.current !== idx || code !== 200) return;

        setList(data);
        setLoading(false);
    }

    const changeInputValue = function(val: string) {
        setValue(val);
    }

    const hideSearchBox = function() {
        if (waitHandler.current) clearTimeout(waitHandler.current);
        waitHandler.current = setTimeout(() => {
            setFocus(false);
        }, 100);
    }

    useEffect(() => {
        if (waitHandler.current) clearTimeout(waitHandler.current);

        if (value === "") {
            setShow(false);
            return;
        }

        if (show !== focus)
            setShow(focus);

        setList([]);
        setLoading(true);

        waitHandler.current = setTimeout(() => {
            loadSearch();
            waitHandler.current = undefined;
        }, 1000);
    }, [value, focus]);

    return <div className={style.search_main}>
        <img src={searchSvg} />
        <Input className={style.box_container} type='text' placeholder="채널에서 검색하기" value={value} onChange={(e) => changeInputValue(e.target.value)} onFocus={() => setFocus(true)} onBlur={hideSearchBox} />
        
        {show && <Section className={style.find_list}>
            {loading && <div className={style.load}>불러오는 중...</div>}
            {list.map(v => <VideoBox key={v.id} video={v} />)}
        </Section>}
    </div>;
}

function VideoBox({ video }: {video: videoDataType}) {
    return <Section className={style.videoBox}>
        <div className={style.img_container}>
            <img src={`/api/image/thumbnail/${video.id}`} />
            <span>{secondsToHMS(video.time)}</span>
        </div>

        <div className={style.detail}>
            <h1 className={style.title}>{video.title}</h1>
            <div className={style.description}>{video.description}</div>
        
            <div className={style.interaction}>
                <Link to={`/studio/contents/${video.id}`}><Button icon={editSvg} /></Link>
                <Link to={`/watch/${video.id}`}><Button icon={videoSvg} /></Link>
            </div>
        </div>
    </Section>
}