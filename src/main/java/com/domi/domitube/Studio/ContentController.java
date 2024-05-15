package com.domi.domitube.Studio;

import com.domi.domitube.Repository.Entity.User;
import com.domi.domitube.Repository.Entity.Video;
import com.domi.domitube.Service.CommentService;
import com.domi.domitube.Service.UserService;
import com.domi.domitube.Service.VideoService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public long dislike;
    public long created;
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
    ResponseEntity GetVideoForOwner(HttpServletRequest request) {
        User user = userService.GetUserForRequest(request);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        List<StudioVideoDTO> response = new ArrayList<>();
        List<Video> result = videoService.GetVideosByUser(user, VideoService.SortType.Lastest, 0);
        Map<String, Long> comments = commentService.GetCommentSizesForVideos(result);

        for(var video : result) {
            StudioVideoDTO data = new StudioVideoDTO();
            data.id = video.getId();
            data.title = video.getTitle();
            data.description = video.getDescription();
            data.views = video.getViews();
            data.good = video.getGood();
            data.dislike = video.getDislike();
            data.comment = comments.get(video.getId());
        }

        return ResponseEntity.ok(response);
    }

}
