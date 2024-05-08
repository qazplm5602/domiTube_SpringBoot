import { Route, Routes } from "react-router-dom";
import StudioHeader from "../Header/StudioHeader";
import StudioAside from "../Aside/StudioAside";
import StudioHome from "../Studio/Home/Home";

export default function StudioLayout() {
    return <>
        <StudioHeader />

        <section style={{ display: "flex", flexDirection: "row", width: "100%", height: 0, flexGrow: 1 }}>
            <StudioAside />
            
            <main style={{ flexGrow: 1, overflow: "auto", boxSizing: "border-box", padding: 20 }}>
                <Routes>
                    <Route path="/" element={<StudioHome />} />
                    <Route path="/domi" element={<div>메인 아님니다. (도미)</div>} />
                </Routes>
            </main>
        </section>
    </>;
}