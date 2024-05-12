import { Route, Routes } from "react-router-dom";
import StudioHeader from "../Header/StudioHeader";
import StudioAside from "../Aside/StudioAside";
import StudioHome from "../Studio/Home/Home";

import style from './studioLayout.module.css';
import StudioContents from "../Studio/Contents/Contents";
import StudioComment from "../Studio/Comment/Comment";
import StudioSetting from "../Studio/Setting/Setting";
import StudioVideo from "../Studio/Video/Video";

export default function StudioLayout() {
    return <>
        <StudioHeader />

        <section className={style.content}>
            <StudioAside />
            
            <Routes>
                <Route path="/" element={<StudioHome />} />
                <Route path="/contents" element={<StudioContents />} />
                <Route path="/contents/:videoId" element={<StudioVideo />} />
                <Route path="/comment" element={<StudioComment />} />
                <Route path="/setting" element={<StudioSetting />} />
                <Route path="/domi" element={<div>메인 아님니다. (도미)</div>} />
            </Routes>
        </section>
    </>;
}