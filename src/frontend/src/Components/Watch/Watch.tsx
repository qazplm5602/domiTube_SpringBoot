import { useParams } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";

export default function Watch() {
    const { id } = useParams();

    return <MainLayout sideDisable={true}>
        watchID: {id}
    </MainLayout>;
}