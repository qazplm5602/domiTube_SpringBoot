import { Route, Routes } from "react-router-dom";
import StudioHeader from "../Header/StudioHeader";
import StudioAside from "../Aside/StudioAside";
import StudioHome from "../Studio/Home/Home";

import style from './studioLayout.module.css';

export default function StudioLayout() {
    return <>
        <StudioHeader />

        <section className={style.content}>
            <StudioAside />
            
            <Routes>
                <Route path="/" element={<StudioHome />} />
                <Route path="/domi" element={<div>메인 아님니다. (도미)</div>} />
            </Routes>
        </section>
    </>;
}