package com.domi.domitube.Service;

import com.domi.domitube.Repository.Entity.User;
import com.domi.domitube.Repository.Entity.Video;
import com.domi.domitube.Repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VideoService {
    final int VIDEO_AMOUNT = 20; // 영상 보여줄 최대 갯수
    final VideoRepository videoRepository;

    public Video GetVideoById(String id) {
        return videoRepository.findById(id).orElse(null);
    }

    public List<Video> GetVideosByUser(User user) {
        return videoRepository.GetVideosByUser(user);
    }

    public List<Video> GetVideosByUser(User user, SortType sort, int page) {
        Pageable paging = PageRequest.of(page, VIDEO_AMOUNT);

        switch (sort) {
            case Lastest:
                return videoRepository.GetVideosByUserLastest(user, paging);
            case Popular:
                return videoRepository.GetVideosByUserPopular(user, paging);
            case Date:
                return videoRepository.GetVideosByUserDate(user, paging);
            default:
                return null;
        }
    }

    public void CreateVideo(Video video) {
        videoRepository.save(video);
    }

    public enum SortType {
        Lastest,
        Popular,
        Date
    }
}
