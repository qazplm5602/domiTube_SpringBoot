package com.domi.domitube.Service;

import com.domi.domitube.Repository.Entity.Video;
import com.domi.domitube.Repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VideoService {
    final VideoRepository videoRepository;

    public Video GetVideoById(String id) {
        return videoRepository.findById(id).orElse(null);
    }

    public void CreateVideo(Video video) {
        videoRepository.save(video);
    }
}
