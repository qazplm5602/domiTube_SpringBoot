package com.domi.domitube.Service;

import com.domi.domitube.DTO.VideoDataDTO;
import com.domi.domitube.Repository.Entity.User;
import com.domi.domitube.Repository.Entity.Video;
import com.domi.domitube.Repository.VideoRepository;
import com.domi.domitube.Studio.StudioVideoAnalyze;
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

    public List<Video> SearchVideo(String value, int page) {
        Pageable pageable = PageRequest.of(page, 5);
        return videoRepository.findByTitleContainsOrDescriptionContains(value, value, pageable);
    }

    public List<Video> RandomVideo(int max, String[] ignore) {
        Pageable pageable = PageRequest.of(0, max);
        return videoRepository.GetRandomVideo(ignore, pageable);
    }

    /////// STUDIO
    public long GetAllViewCountByUser(User user) {
        Long value = videoRepository.GetAllViewCount(user);
        if (value == null) value = 0L;

        return value;
    }

    public StudioVideoAnalyze GetStudioAnalyze(User user) {
        StudioVideoAnalyze result = new StudioVideoAnalyze();

        Pageable page = PageRequest.of(0, 1);
        var last = videoRepository.GetLastVideo(user, page);
        if (!last.isEmpty())
            result.setLast(VideoDataDTO.ConvertVideo(last.get(0)));

        var popular = videoRepository.GetPopularVideo(user, page);
        if (!popular.isEmpty())
            result.setPopular(VideoDataDTO.ConvertVideo(popular.get(0)));

        var good = videoRepository.GetGoodVideo(user, page);
        if (!good.isEmpty())
            result.setGood(VideoDataDTO.ConvertVideo(good.get(0)));

        return result;
    }

    public Long GetVideoLengthByUser(User user) {
        return videoRepository.GetVideoLengthByUser(user);
    }

    public List<Video> GetSearchMyVideo(User owner, String value) {
        return videoRepository.GetSearchVideoByUser(owner, value);
    }

    public List<Video> GetVideoByUsers(List<String> users, int page) {
        Pageable pageable = PageRequest.of(page, 5);
        return videoRepository.GetVideoByUsersLatest(users, Video.VideoSecretType.Public, pageable);
    }

    public enum SortType {
        Lastest,
        Popular,
        Date
    }
}
