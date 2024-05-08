import { Link } from 'react-router-dom';
import Section from '../Recycle/Section';
import style from './studioAside.module.css';
import Button from '../Recycle/Button';

import noProfile from '../../assets/no-profile.png';
import newtabSvg from './newtab.svg';
import dashboardSvg from './dashboard.svg';
import contentSvg from './contents.svg';
import settingSvg from './setting.svg';

export default function StudioAside() {
    return <aside className={style.main}>
        <Section className={style.channel}>
            <Link to="/channel/domi" className={style.icon}>
                <img src={noProfile} />
                <div className={style.move}>
                    <img src={newtabSvg} />
                </div>
            </Link>
            
            <div className={style.title}>내 채널</div>
            <div className={style.channel_name}>도미임</div>
        </Section>

        <Section title="MENU" titleClass={style.menu_title} className={style.menu}>
            <Button icon={dashboardSvg} className={style.active}>대시보드</Button>
            <Button icon={contentSvg}>콘텐츠</Button>
            <Button icon={settingSvg}>설정</Button>
        </Section>
    </aside>;
}