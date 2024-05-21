import Button from '../../Recycle/Button';
import Section from '../../Recycle/Section';
import style from './setting.module.css';

import noProfile from '../../../assets/no-profile.png';
import { useEffect, useRef, useState } from 'react';

interface settingType {
    name: string,
    icon: boolean,
    banner: boolean
}

export default function StudioSetting() {
    const [loading, setLoading] = useState(false);
    const origin = useRef<settingType>();

    const iconFile = useRef<File | null>();
    const bannerFile = useRef<File | null>();

    const [iconURL, setIconURL] = useState<string>(noProfile);
    const [bannerURL, setBannerURL] = useState<string>(noProfile);

    const changedFile = function(mode: number, e: React.ChangeEvent<HTMLInputElement>) {
        if (e.currentTarget.files === null) return;

        const file = e.currentTarget.files[0];
        
        // 체크...ㅇ

        const reader = new FileReader();
        reader.readAsDataURL(file);

        // reader.result;

        reader.onload = function() {
            if (mode === 0) {
                setIconURL(reader.result as string);
            } else if (mode === 1) {
                setBannerURL(reader.result as string);
            }
        }

        
        if (mode === 0) {
            iconFile.current = file;
        } else if (mode === 1) {
            bannerFile.current = file;
        }
    }

    useEffect(() => {
        origin.current = {
            name: "test",
            icon: false,
            banner: false,
        };
    }, []);

    return <main>
        <Section className={style.header}>
            <h2 className={style.title}>설정</h2>
            
            <div className={style.right}>
                <div>변경사항이 있습니다.</div>
                <Button>변경사항 저장</Button>
            </div>
        </Section>

        <Input />

        <ImageUpload image={iconURL} fileChanged={(e) => changedFile(0, e)} title="아이콘" width={100} height={100} />
        <ImageUpload image={bannerURL} fileChanged={(e) => changedFile(1, e)} title="배너" width={2560 / 4} height={423 / 4} radius={false} />
        
    </main>;
}

function Input() {
    return <Section title="이름" titleClass={style.input_title} className={style.inputBox}>
        <div className={style.sub}>한글, 영문 3 ~ 10자리까지 가능합니다.</div>
        <input type="text" />
        {/* <div className={style.errorT}>이름을 입력해야 합니다.</div> */}
    </Section>
}

function ImageUpload({title, width, height, radius = true, image, fileChanged}: {title: string, width: number, height: number, radius?: boolean, image: string, fileChanged: React.ChangeEventHandler<HTMLInputElement>}) {
    const fileRef = useRef<any>();
    const uploadBtn = function() {
        fileRef.current.click();
    }

    return <Section title={`${title} 변경`} titleClass={style.input_title} className={style.iconBox}>
        <div style={{ width, height, borderRadius: radius ? "50%" : 0 }} className={style.icon_container}>
            <img className={style.icon} src={image} />
            <div className={style.hover}></div>
        </div>

        <div className={style.interaction}>
            <Button onClick={uploadBtn}>업로드</Button>
            <Button>삭제</Button>
        </div>

        <input type="file" ref={fileRef} onChange={fileChanged} accept="image/jpeg, image/png" style={{display: "none"}} />
    </Section>
}