import { Link } from 'react-router-dom';
import Button from '../Recycle/Button';
import style from './aside.module.css';

import homeSvg from './home.svg';

export default function Aside() {
    return <>
        <DetailSide />
    </>;
}

function DetailSide() {
    return <aside className={style.side}>
        <Link to="/">
            <Button icon={homeSvg} className={[style.menu, style.active].join(" ")}>홈</Button>
        </Link>
        
        <Link to="/">
            <Button icon={homeSvg} className={style.menu}>구독</Button>
        </Link>

        <div className={style.line}></div>
    </aside>;
}