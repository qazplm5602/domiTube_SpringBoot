import { Route, Routes } from "react-router-dom";
import StudioHeader from "../Header/StudioHeader";

export default function StudioLayout() {
    return <>
        <StudioHeader />

        <Routes>
            <Route path="/" element={<div>메인임니다.</div>} />
            <Route path="/domi" element={<div>메인 아님니다. (도미)</div>} />
        </Routes>
    </>;
}