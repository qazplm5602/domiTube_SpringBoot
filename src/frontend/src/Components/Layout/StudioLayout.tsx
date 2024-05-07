import { Route, Routes } from "react-router-dom";
import StudioHeader from "../Header/StudioHeader";
import StudioAside from "../Aside/StudioAside";

export default function StudioLayout() {
    return <>
        <StudioHeader />

        <section style={{ display: "flex", flexDirection: "row", width: "100%", flexGrow: 1 }}>
            <StudioAside />
            
            <Routes>
                <Route path="/" element={<div>메인임니다.</div>} />
                <Route path="/domi" element={<div>메인 아님니다. (도미)</div>} />
            </Routes>
        </section>
    </>;
}