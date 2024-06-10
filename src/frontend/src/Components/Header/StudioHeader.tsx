import Button from '../Recycle/Button';
import style from './studioHeader.module.css';

import logoSvg from './youtube.svg';
import listSvg from './list.svg';
import searchSvg from './search.svg';
import noProfile from '../../assets/no-profile.png';
import editSvg from './edit.svg';
import videoSvg from './video.svg';

import Input from '../Recycle/Input';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { IloginStore } from '../Redux/LoginStore';
import IStore from '../Redux/Type';
import Section from '../Recycle/Section';
import { Link } from 'react-router-dom';

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

    return <div className={style.search_main}>
        <img src={searchSvg} />
        <Input className={style.box_container} type='text' placeholder="채널에서 검색하기" value={value} onChange={(e) => setValue(e.target.value)} />
        
        <Section className={style.find_list}>
            <div className={style.load}>불러오는 중...</div>
            {/* <VideoBox />
            <VideoBox />
            <VideoBox />
            <VideoBox /> */}
        </Section>
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