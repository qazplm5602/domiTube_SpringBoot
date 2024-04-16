import style from './login.module.css';

import MainLayout from "../Layout/MainLayout";
import Input from '../Recycle/Input';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../Recycle/Button';
import { useSelector } from 'react-redux';
import IStore from '../Redux/Type';
import { useEffect, useState } from 'react';

export default function Login() {
    const logined = useSelector<IStore>(value => value.login.logined) as boolean;
    const navigate = useNavigate();

    const [errorT, setErrorT] = useState("");
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (logined) // 이미 로그인 중인디???
            navigate("/"); // 다시 홈으로 가셈
    }, [logined]);

    return <MainLayout className={style.main} sideDisable={true}>
        <div className={style.title}>domiTube에 로그인</div>

        <Input type="text" title='아이디' className={style.input} value={id} onChange={(e) => setId(e.target.value)} />
        <Input type="password" title='비밀번호' className={style.input} value={password} onChange={e => setPassword(e.target.value)} />

        <div className={style.help}><Link to="/">비밀번호를 잊으셨나요?</Link></div>
        <div className={style.error}>{errorT}</div>

        <Button className={style.login}>로그인</Button>
    </MainLayout>;
}