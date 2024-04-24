package com.domi.domitube.Controller;

import com.domi.domitube.Repository.Entity.User;
import com.domi.domitube.Repository.Entity.Video;
import com.domi.domitube.Service.UserService;
import com.domi.domitube.Service.VideoService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.Map;

@RestController
@RequestMapping("/api/video")
@RequiredArgsConstructor
public class VideoController {
    final VideoService videoService;
    final UserService userService;

    @GetMapping("/{id}")
    Map<String, Object> GetVideoData(@PathVariable("id") String id, HttpServletRequest request, HttpServletResponse response) {
        Video video = videoService.GetVideoById(id);

        if (video == null) {
            response.setStatus(404);
            return Map.of("result", false, "reason", "영상을 찾을 수 없습니다.");
        }

        return Map.of(
                "result", true,
                "title", video.getTitle(),
                "description", video.getDescription(),
                "views", video.getViews(),
                "good", video.getGood(),
                "bad", video.getDislike(),
                "create", video.getCreated().getTime(),
                "channel", video.getOwner().getId()
        );
    }

    @PostMapping("/test/create")
    void CreateVideoTest() {
        User user = userService.GetUserForId("domi");
        Video video = new Video();

        video.setId("DOMI1");
        video.setOwner(user);
        video.setSecret(Video.VideoSecretType.Public);
        video.setCreated(new Date(new java.util.Date().getTime()));
        video.setTitle("아무 영상 임니다.");
        video.setDescription("ㄹㅇㄹㅇㄹㅇ 아무 영상 임니다.");
//        video.setSecret(VideoSecretType.Public);

        videoService.CreateVideo(video);
    }
}
