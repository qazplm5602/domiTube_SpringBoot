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

    useEffect(() => {
        if (waitHandler.current) clearTimeout(waitHandler.current);
        if (!show || value === "") return;

        setLoading(true);

        waitHandler.current = setTimeout(() => {
            loadSearch();
            waitHandler.current = undefined;
        }, 1000);
    }, [value, show]);

    return <div className={style.search_main}>
        <img src={searchSvg} />
        <Input className={style.box_container} type='text' placeholder="채널에서 검색하기" value={value} onChange={(e) => setValue(e.target.value)} onFocus={() => setShow(true)} onBlur={() => setShow(false)} />
        
        {show && <Section className={style.find_list}>
            {loading && <div className={style.load}>불러오는 중...</div>}
            {list.map(v => <VideoBox key={v.id} />)}
            {/* <VideoBox />
            <VideoBox />
            <VideoBox />
            <VideoBox /> */}
        </Section>}
    </div>;
}

function VideoBox() {
    return <Section className={style.videoBox}>
        <div className={style.img_container}>
            <img src={`/api/image/thumbnail/DOMI1`} />
            <span>10:10</span>
        </div>

        <div className={style.detail}>
            <h1 className={style.title}>테스트 임니다.</h1>
            <div className={style.description}>테스트 임니다.....................</div>
        
            <div className={style.interaction}>
                <Link to={`/studio/`}><Button icon={editSvg} /></Link>
                <Link to={`/studio/`}><Button icon={videoSvg} /></Link>
            </div>
        </div>
    </Section>
}