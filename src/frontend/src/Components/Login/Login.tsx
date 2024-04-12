import style from './login.module.css';

import MainLayout from "../Layout/MainLayout";
import Input from '../Recycle/Input';
import { Link } from 'react-router-dom';
import Button from '../Recycle/Button';

export default function Login() {
    return <MainLayout className={style.main} sideDisable={true}>
        <div className={style.title}>domiTube에 로그인</div>

        <Input type="text" title='아이디' className={style.input} />
        <Input type="password" title='비밀번호' className={style.input} />
        
        <div className={style.help}><Link to="/">비밀번호를 잊으셨나요?</Link></div>

        <Button className={style.login}>로그인</Button>
    </MainLayout>;
}