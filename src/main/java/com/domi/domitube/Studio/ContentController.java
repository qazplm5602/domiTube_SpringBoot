package com.domi.domitube.Studio;

import com.domi.domitube.Repository.Entity.User;
import com.domi.domitube.Repository.Entity.Video;
import com.domi.domitube.Service.CommentService;
import com.domi.domitube.Service.UserService;
import com.domi.domitube.Service.VideoService;
import com.domi.domitube.Utils.RandomStringGenerator;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

class StudioVideoDTO {
    public String id;
    public String title;
    public String description;
    public int secret;
    public long views;
    public long good;
    public long bad;
    public long create;
    public long comment;
}

class ResponseVO {
    public boolean result;
    public String data;
}

@RestController
@RequestMapping("/api/studio/content")
@RequiredArgsConstructor
public class ContentController {
    final UserService userService;
    final VideoService videoService;
    final CommentService commentService;

    @GetMapping("/list")
    ResponseEntity GetVideoForOwner(HttpServletRequest request, @RequestParam("page") int page) {
        User user = userService.GetUserForRequest(request);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        List<StudioVideoDTO> response = new ArrayList<>();
        List<Video> result = videoService.GetVideosByUser(user, VideoService.SortType.Lastest, page);
        Map<String, Long> comments = commentService.GetCommentSizesForVideos(result);

        for(var video : result) {
            StudioVideoDTO data = new StudioVideoDTO();
            data.id = video.getId();
            data.title = video.getTitle();
            data.description = video.getDescription();
            data.views = video.getViews();
            data.good = video.getGood();
            data.bad = video.getDislike();
            data.create = video.getCreated().toInstant(ZoneOffset.of("+09:00")).toEpochMilli();

            Long commentAmount = (Long)comments.get(video.getId());
            if (commentAmount == null) commentAmount = 0L;

            data.comment = commentAmount;

            int secret = 0;
            switch(video.getSecret()) {
                case HalfPublic -> {
                    secret = 1;
                    break;
                }
                case Private -> {
                    secret = 2;
                    break;
                }
            }

            data.secret = secret;

            response.add(data);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/list/size")
    Long GetVideoMaxSize(HttpServletRequest request, HttpServletResponse response) {
        User user = userService.GetUserForRequest(request);
        if (user == null) {
            response.setStatus(401);
            return -1L;
        }

        Long amount = videoService.GetVideoLengthByUser(user);
        if (amount == null)
            amount = 0L;

        return amount;
    }

        @PutMapping("/create")
    ResponseEntity<ResponseVO> CreateVideo(HttpServletRequest request, @RequestBody long size) {
        User user = userService.GetUserForRequest(request);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        String videoId = RandomStringGenerator.GenerateRandomString(5);

        Video video = new Video();
        video.setId(videoId);
        video.setOwner(user);
        video.setTitle("domiTube Gen");
        video.setTime(0);
        video.setSize(size);
        video.setUploads(0);
        video.setCreated(LocalDateTime.now());
        video.setSecret(Video.VideoSecretType.Private); // 일단 임시로 비공개

        videoService.CreateVideo(video);

        ResponseVO response = new ResponseVO();
        response.result = true;
        response.data = videoId;

        return ResponseEntity.ok(response);
    }
}
