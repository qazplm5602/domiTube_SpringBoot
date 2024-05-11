import Button from '../../Recycle/Button';
import Section from '../../Recycle/Section';
import style from './setting.module.css';

import noProfile from '../../../assets/no-profile.png';

export default function StudioSetting() {
    return <main>
        <Section className={style.header}>
            <h2 className={style.title}>설정</h2>
            
            <div className={style.right}>
                <div>변경사항이 있습니다.</div>
                <Button>변경사항 저장</Button>
            </div>
        </Section>

        <Input />

        <ImageUpload title="아이콘" width={100} height={100} />
        <ImageUpload title="배너" width={2560 / 4} height={423 / 4} radius={false} />
        
    </main>;
}

function Input() {
    return <Section title="이름" titleClass={style.input_title} className={style.inputBox}>
        <div className={style.sub}>한글, 영문 3 ~ 10자리까지 가능합니다.</div>
        <input type="text" />
        {/* <div className={style.errorT}>이름을 입력해야 합니다.</div> */}
    </Section>
}

function ImageUpload({title, width, height, radius = true}: {title: string, width: number, height: number, radius?: boolean}) {
    return <Section title={`${title} 변경`} titleClass={style.input_title} className={style.iconBox}>
        <div style={{ width, height, borderRadius: radius ? "50%" : 0 }} className={style.icon_container}>
            <img className={style.icon} src={noProfile} />
            <div className={style.hover}></div>
        </div>

        <div className={style.interaction}>
            <Button>업로드</Button>
            <Button>삭제</Button>
        </div>
    </Section>
}