import style from './aside.module.css';

export default function Aside() {
    return <>
        <DetailSide />
    </>;
}

function DetailSide() {
    return <aside className={style.side}>
        <div>테스트</div>
    </aside>;
}
<div>테스트</div>