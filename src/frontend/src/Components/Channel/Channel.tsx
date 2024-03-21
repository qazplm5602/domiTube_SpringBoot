import { useParams } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";

export default function Channel() {
    const { id } = useParams();

    return <MainLayout>
        channelID: {id}
    </MainLayout>;
}