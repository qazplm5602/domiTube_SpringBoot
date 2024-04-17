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
    const [disabled, setDisabled] = useState(false);
    

    const loginClick = async function() {
        setErrorT("");

        if (id.length == 0 || password.length == 0) {
            setErrorT("아이디 및 비밀번호를 입력하세요.");
            return;
        }

        setDisabled(true);
        
        const response = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify({
                id,
                password
            })
        });
        const message = await response.json().catch(() => {});

        setDisabled(false);

        if (response.status !== 200) {
            setErrorT(`서버 오류. (${response.status})`);
            return;
        }
        
        if (message === undefined) {
            setErrorT("데이터를 읽을 수 없습니다.");
            return;
        }

        if (!message.result) {
            setErrorT(message.reason);
            return;
        }

        localStorage.setItem("accessToken", message.data.accessToken);
        localStorage.setItem("refreshToken", message.data.refreshToken);
        location.href = "/";
    }

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

        <Button className={style.login} onClick={loginClick} disabled={disabled}>로그인</Button>
    </MainLayout>;
}