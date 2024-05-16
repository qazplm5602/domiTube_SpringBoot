package com.domi.domitube.Studio;

import com.domi.domitube.Repository.Entity.User;
import com.domi.domitube.Repository.Entity.Video;
import com.domi.domitube.Service.CommentService;
import com.domi.domitube.Service.UserService;
import com.domi.domitube.Service.VideoService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
}
