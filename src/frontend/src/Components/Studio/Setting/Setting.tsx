import Button from '../../Recycle/Button';
import Section from '../../Recycle/Section';
import style from './setting.module.css';

import noProfile from '../../../assets/no-profile.png';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IStore from '../../Redux/Type';
import { IloginStore } from '../../Redux/LoginStore';
import { request } from '../../Utils/Fetch';

interface settingType {
    name: string,
    icon: boolean,
    banner: boolean
}

export default function StudioSetting() {
    const dispatch = useDispatch();
    const user = useSelector<IStore, IloginStore>(value => value.login);
    const banner = useRef(false);

    const [loading, setLoading] = useState(true);
    const [changes, setChanges] = useState(false);
    const [name, setName] = useState("");

    const iconFile = useRef<File | boolean /* File: 이걸로 바꿀꺼임 / false: 바뀐게 없음 / true: 기본값으로 바꿈.. */>(false);
    const bannerFile = useRef<File | boolean>(false);

    const getChanges = function(): { name: boolean, icon: boolean, banner: boolean } {
        return {
            name: name !== user.name,
            icon: iconFile.current instanceof File || (user.image !== false && iconFile.current === true),
            banner: bannerFile.current instanceof File || (banner.current !== false && bannerFile.current === true)
        }
    }

    const checkChanges = function() {
        const change = Object.values(getChanges()).some(v => v);
        setChanges(change);
    }
    
    const getInfo = async function() {
        const { code, data } = await request(`/api/studio/setting/banner`);
        if (code !== 200) return;
        
        banner.current = data;
        setLoading(false);
    }

    const saveChanges = async function() {
        const form = new FormData();
        const change = getChanges();
        
        if (change.name)
            form.append("name", name);
        
        if (change.icon)
            form.append("icon", (iconFile.current instanceof File) ? iconFile.current : new Blob());

        if (change.banner) {
            form.append("banner", (bannerFile.current instanceof File) ? bannerFile.current : new Blob());
        }

        const { code } = await request(`/api/studio/setting/upload`, { method: "POST", body: form });
        if (code !== 200) return;
        

        iconFile.current = false;
        banner.current = bannerFile.current instanceof File;
        bannerFile.current = false;
        setChanges(false);
        dispatch({ type: "login.set", loading: true });
    }

    useEffect(() => {
        if (!user.logined) return;

        getInfo();
        setName(user.name || "");
    }, [user]);

    useEffect(checkChanges, [name]);

    if (loading) return null; // 로딩중일때는 안그림

    return <main>
        <Section className={style.header}>
            <h2 className={style.title}>설정</h2>
            
            <div className={style.right}>
                {changes && <div>변경사항이 있습니다.</div>}
                <Button disabled={!changes} onClick={saveChanges}>변경사항 저장</Button>
            </div>
        </Section>

        <Input value={name} onChange={e => setName(e)} />

        <ImageUpload defaultImage={user.image === true ? `/api/image/user/${user.id}` : noProfile} emptyImage={noProfile} fileChanged={(e) => {iconFile.current = e; checkChanges()}} title="아이콘" width={100} height={100} />
        <ImageUpload defaultImage={banner.current ? `/api/image/banner/${user.id}` : noProfile} emptyImage={noProfile} fileChanged={(e) => {bannerFile.current = e; checkChanges()}} title="배너" width={2560 / 4} height={423 / 4} radius={false} />
    </main>;
}

function Input({value, onChange}: {value: string, onChange: (value: string) => void}) {
    return <Section title="이름" titleClass={style.input_title} className={style.inputBox}>
        <div className={style.sub}>한글, 영문 3 ~ 10자리까지 가능합니다.</div>
        <input value={value} onChange={e => onChange(e.currentTarget.value)} type="text" />
        {/* <div className={style.errorT}>이름을 입력해야 합니다.</div> */}
    </Section>
}

function ImageUpload({title, width, height, radius = true, defaultImage, emptyImage, fileChanged}: {title: string, width: number, height: number, radius?: boolean, defaultImage: string, emptyImage: string, fileChanged: (file: File | boolean) => void}) {
    const fileRef = useRef<any>();
    const [imgURL, setImgURL] = useState(defaultImage);

    const uploadBtn = function() {
        fileRef.current.click();
    }

    const fileSelected = function(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.currentTarget.files === null) return;

        const file = e.currentTarget.files[0];
        
        const reader = new FileReader();
        reader.onload = function() {
            setImgURL(reader.result as string);
        }

        reader.readAsDataURL(file);
        fileChanged(file);
    }

    const setDefault = function() {
        setImgURL(emptyImage);
        fileChanged(true);
    }

    return <Section title={`${title} 변경`} titleClass={style.input_title} className={style.iconBox}>
        <div style={{ width, height, borderRadius: radius ? "50%" : 0 }} className={style.icon_container}>
            <img className={style.icon} src={imgURL} />
            <div className={style.hover}></div>
        </div>

        <div className={style.interaction}>
            <Button onClick={uploadBtn}>업로드</Button>
            <Button onClick={setDefault}>삭제</Button>
        </div>

        <input type="file" ref={fileRef} onChange={fileSelected} accept="image/jpeg, image/png" style={{display: "none"}} />
    </Section>
}