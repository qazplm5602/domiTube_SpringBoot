import { useParams } from 'react-router-dom';
import style from './video.module.css';

export default function StudioVideo() {
    const { videoId } = useParams();

    return <main>
        videoId: {videoId}
    </main>;
}