package com.domi.domitube.Controller;

import com.domi.domitube.Repository.Entity.Comment;
import com.domi.domitube.Repository.Entity.User;
import com.domi.domitube.Repository.Entity.Video;
import com.domi.domitube.Service.CommentService;
import com.domi.domitube.Service.UserService;
import com.domi.domitube.Service.VideoService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/video/comment")
public class CommentController {
    final CommentService commentService;
    final VideoService videoService;
    final UserService userService;

    @PutMapping("/write")
    void WriteComment(@RequestBody String content, @RequestParam("video") String videoId, HttpServletRequest request, HttpServletResponse response) {
        User user = userService.GetUserForRequest(request);
        if (user == null) {
            response.setStatus(401);
            return;
        }

        Video video = videoService.GetVideoById(videoId);
        if (video == null) {
            response.setStatus(404);
            return;
        }

        Comment comment = new Comment();

        comment.setVideo(video);
        comment.setWriter(user);
        comment.setContent(content);
        commentService.Save(comment);
    }
}
