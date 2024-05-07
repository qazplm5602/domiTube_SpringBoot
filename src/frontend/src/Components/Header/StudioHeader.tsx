import Button from '../Recycle/Button';
import style from './studioHeader.module.css';

import logoSvg from './youtube.svg';
import listSvg from './list.svg';
import searchSvg from './search.svg';
import noProfile from '../../assets/no-profile.png';

import Input from '../Recycle/Input';
import { useState } from 'react';

export default function StudioHeader() {
    return <header className={style.header}>
        <section>
            <Button icon={listSvg} />
            <img className={style.logo} src={logoSvg} />
        </section>

        <SearchBox />
        
        <section>
            <img className={style.profile} src={noProfile} />
        </section>
    </header>;
}

// 검색
function SearchBox() {
    const [value, setValue] = useState("");

    return <div className={style.search_main}>
        <img src={searchSvg} />
        <Input className={style.box_container} type='text' placeholder="채널에서 검색하기" value={value} onChange={(e) => setValue(e.target.value)} />
    </div>;
}