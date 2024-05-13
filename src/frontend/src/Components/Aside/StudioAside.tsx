import { Link, useLocation, useNavigate } from 'react-router-dom';
import Section from '../Recycle/Section';
import style from './studioAside.module.css';
import Button from '../Recycle/Button';

import noProfile from '../../assets/no-profile.png';
import newtabSvg from './newtab.svg';
import dashboardSvg from './dashboard.svg';
import contentSvg from './contents.svg';
import commentSvg from './comment.svg';
import settingSvg from './setting.svg';
import { useSelector } from 'react-redux';
import IStore from '../Redux/Type';
import { IloginStore } from '../Redux/LoginStore';
import { useEffect } from 'react';

const MENUS = [
    ["", "대시보드", dashboardSvg],
    ["contents", "콘텐츠", contentSvg],
    ["comment", "댓글", commentSvg],
    ["setting", "설정", settingSvg],
]

export default function StudioAside() {
    const login = useSelector<IStore, IloginStore>(value => value.login);
    const location = useLocation();
    const navigate = useNavigate();
    const setLocation = (page :string) => {
        navigate(`/studio/${page}`);
    }

    useEffect(() => {
        // 로그인 정보 불러오는중은 아닌데.. 로그인중ㅇ이 아닌경우
        if (!login.loading && !login.logined) {
            navigate("/login");
        }
    }, [login.loading, login.logined]);

    return <aside className={style.main}>
        <Section className={style.channel}>
            <Link to={`/channel/${login.id}`} className={style.icon}>
                <img src={login.logined && login.image ? `/api/image/user/${login.id}` : noProfile} />
                <div className={style.move}>
                    <img src={newtabSvg} />
                </div>
            </Link>
            
            <div className={style.title}>내 채널</div>
            <div className={style.channel_name}>{login.name || "--"}</div>
        </Section>

        <Section title="MENU" titleClass={style.menu_title} className={style.menu}>
            {/* <Button icon={dashboardSvg} className={style.active}>대시보드</Button>
            <Button icon={contentSvg}>콘텐츠</Button>
            <Button icon={commentSvg}>댓글</Button>
            <Button icon={settingSvg}>설정</Button> */}
            {MENUS.map(v => {
                let active = false;
                if (v[0] === "") {
                    active = new RegExp("^/studio/?$").test(location.pathname);
                } else {
                    active = new RegExp(`^/studio/${v[0]}/?`).test(location.pathname);
                }

                return <Button onClick={() => setLocation(v[0])} key={v[0]} icon={v[2]} className={(active ? style.active : '')}>{v[1]}</Button>
            })}
        </Section>
    </aside>;
}